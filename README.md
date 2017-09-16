# Manage state with @ngrx/store

1. Setup StoreModule and IDB (interface for the app state) in app module

@NOTE: The store is a DataBase
```typescript
//app.module.ts
import {StoreModule} from '@ngrx/store';

export interface IDB {}
...
const reducer = {}

@NgModule({
  ...
  imports: [
    ...
    StoreModule.forRoot(reducer),
  ]
})
export class AppModule {

}
```

2. setup actions that can change the stores state. Create file flight.actions.ts

@NOTE: Actions are triggered over UI or programmatically
```typescript
import {Action} from '@ngrx/store';
import {Flight} from '../core/api/models/flight';

// flight.actions.ts
export const FIND_FLIGHTS_SUCCESS = '[Flight] Find Success'
export class FindSuccessAction implements Action {
  type = FIND_FLIGHTS_SUCCESS;

  constructor(public payload: Flight[]) {
  }
}
export type Actions = FindSuccessAction
```

3. setup reducer that react to the actions and change the state

@NOTE: Reducers are our tables in the DB
```typescript
// flight.reducer.ts
import {Flight} from '../core/api/models/flight';
import * as flight from './flight.action';

// the interface for FlightState
export interface IFlightState {
  flights?: Flight[]
}

// initial state
export const initialFlightPage: IFlightState = {
  flights: []
}

// reducers are our DB tables
export function flightReducer(state = initialFlightPage, action: flight.Actions): any {
  switch (action.type) {
    case flight.FIND_FLIGHTS_SUCCESS:
      return {
        ...state,
        flights: action.payload
      }
    default:
      return state
  }
}
```

4. register the reducer

```typescript
// app.module.ts
import {flightReducer, IFlightState} from './ngrx/flight.reducer';

// add state
export interface IDB {
  flightPage: IFlightState
}

// apply the flightReducer to the state slice flightPage 
const reducer = {
  flightPage: flightReducer
}

@NgModule({
  ...
  imports: [
    // implement reducer
    StoreModule.forRoot(reducer),
  ],
  ...
})
export class AppModule {
}
```

5. Subscribe dispatch action if flights are searched and subscribe to state changes

```typescript
// flight.service.ts
import {Store} from '@ngrx/store';
import {IDB} from '../../../app.module';
import {IFlightState} from '../../../ngrx/flight.reducer';
import * as flight from '../../../ngrx/flight.action';

// inject sore and connect state to view
...
constructor(
    private fr: FlightResource,
    // inject store
    private store: Store<IDB>
  ) {
    // this.flights$ = this._flights$.asObservable()
    // connect store to view
    this.flights$ = this.store.select<IFlightState>(state => state.flightPage).select<Flight[]>(state => state.flights)
  }
...
find(from?: string, to?: string) {
    this._isFindPending$.next(true)
    this.fr.find(from, to)
      .subscribe(
        n => {
          // this.setFlights(n)
          // dispatch action
          this.store.dispatch(new flight.FindSuccessAction(n))
          ...
        },
        ... 
      }))
}
```

6. Refactor store select operations into "db query"

@NOTE retrieving a slice of state from our store is like querying the data base

  6.1 Create Selectors

```typescript
// flight.reducer.ts

... 

// Selectors are our queries

function getFlightState(db: IDB): IFlightState {
    return db.flightPage
}

export const getFlights = createSelector(
  getFlightState,
  (state: IFlightState) => state.flights
)

```

  6.2 Use replace selector operations with selector function

```typescript
// flight.service.ts

// import {IFlightState} from '../../../ngrx/flight.reducer';
import * as fromFlight from '../../../ngrx/flight.reducer'
import {FindSuccessAction} from '../../../ngrx/flight.action';

@Injectable()
export class FlightService {
  ...
  constructor(...) {
    // implement selector function
    // this.flights$ = this.store.select<IFlightState>(state => state.flightPage).select<Flight[]>(state => state.flights)
    this.flights$ = this.store.select(fromFlight.getFlights)
  }
  ... 
 }
```


## Bonus Exercise: Implement findPending state to store

1. Create a action for find flights and find flights failed

```typescript
// flight.action.ts
...
// add constants for action types
export const FIND_FLIGHTS = '[Flight] Find'
export const FIND_FLIGHTS_FAIL = '[Flight] Find Fail'

... 

// add classes for actions
export class FindAction implements Action {
  type = FIND_FLIGHTS;

  constructor(public payload?: any) {
  }
}

export class FindFailAction implements Action {
  type = FIND_FLIGHTS_FAIL;

  constructor(public payload?: any) {
  }
}

export type Actions =
  FindSuccessAction |
  // extend 'Actions' type with new actions
  FindAction |
  FindFailAction

```


2. Add the flight reducers and selectors

2.1. Add extend IFlightState and initial state with findPending property

```typescript
// flight.reducer.ts
export interface IFlightState {
  flights?: Flight[]
  // add property
  findPending?: boolean
}

export const initialFlightPage: IFlightState = {
  flights: [],
  // assign value
  findPending: false
}

... 

}


```

2.2. Add add cases in your reducer to react on the new actions.
Change the state of findPending accordingly to the related action 

```typescript
// flight.reducer.ts

export function flightReducer(state = initialFlightPage, action: flight.Actions): any {
  switch (action.type) {
    // implement case for FindAction
    case flight.FIND_FLIGHTS:
      return {
        ...state,
        findPending: true
      }
    case flight.FIND_FLIGHTS_SUCCESS:
      return {
        ...state,
        flights: action.payload,
        // adopt state
        findPending: false
      }
    // implement case for FindFailAction
    case flight.FIND_FLIGHTS_FAIL:
      return {
        ...state,
        findPending: false
      }
    default:
      return state
  }

}


```

2.3. Create a selector for the new state

```typescript
// flight.reducer.ts
...

export const getFindPending = createSelector(
  getFlightState,
  (state: IFlightState) => state.findPending
)

```

3. Add replace isFindPending and dispatch new actions

3.1. Replace isFindPending observable with new state selection

```typescript
...

 constructor(...) {
    ...

    // this.isFindPending$ = this._isFindPending$.asObservable()
    this.isFindPending$ = this.store.select(fromFlight.getFindPending)
  }

...

```

3.1. Dispatch new actions and remove next of replaces Observable

```typescript
// flight.service.ts
...
  find(from?: string, to?: string) {
    // this._isFindPending$.next(true)
    this.store.dispatch(new flight.FindAction())
    this.fr.find(from, to)
      .subscribe(
        n => {
          this.store.dispatch(new flight.FindSuccessAction(n))
          // remove next on is
          // this._isFindPending$.next(false)
        },
        e => {
          // this._isFindPending$.next(false)
          this.store.dispatch(new flight.FindFailAction(e))
        })
  }
... 

}

```

# Enable @ngrx/store-devtools

**Preconditions:**
Download the [Redux DevTools Extension](http://extension.remotedev.io/) for your browser and install it.



1. Setup StoreModule and IDB (interface for the app state) in app module

@NOTE: The store is a DataBase
```typescript
//app.module.ts
import {StoreModule} from '@ngrx/store';

export interface IDB {}
...
const reducer = {}

@NgModule({
  ...
  imports: [
    ...
    StoreDevtoolsModule.instrument({
          maxAge: 10 //  Retains last 10 states
    })
    ...
  ]
})
export class AppModule {

}
```


# Encapsulate side effects with @ngrx/effects

1. Setup EffectsModule in app module

@NOTE: The store is a DataBase
```typescript
//app.module.ts
import {EffectsModule} from '@ngrx/effects';

...
const effects = []

@NgModule({
  ...
  imports: [
    ...
    EffectsModule.forRoot(effects),
  ]
})
export class AppModule {

}
```

2. Extend FlightFind Action to receive search params

```typescript
// flight.action.ts
...
export class FindAction implements Action {
  ... 
  constructor(public payload: { from: string, to: string }) {
  }
}
```

3. Create a class to hold the flights side effects

3.1 Setup class FlightEffects
```typescript
// flight.effect.ts

import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action} from '@ngrx/store';

@Injectable()
export class FlightEffects {
  
  constructor(private actions$: Actions) {
  }
  
}
```

3.2 Implement side effects

```typescript
// flight.effect.ts

... 
export class FlightEffects {

  // implement effect
  @Effect()
  // effects listen for actions
  find$: Observable<Action> = this.actions$.ofType<flight.FindAction>(flight.FIND_FLIGHTS)
    .switchMap((action) => {
      // handle side effects
      return this.fr.find(action.payload.from, action.payload.to)
        // and trigger another action by return a observable of action
        .map(flights => new flight.FindSuccessAction(flights))
        .catch((error) => {
          return Observable.of(new flight.FindFailAction(error))
        })
    });
  
  constructor(private actions$: Actions, 
              // inject FlightResource into constructor
              private fr: FlightResource) {
  }
  
}
```

4. Register side effects to EffectsModule by adding it to the effects constant

```typescript
// app.module.ts

...
import {FlightEffects} from './ngrx/flight.effect';
... 

const effects = [FlightEffects]
...

```

# Handling router state with @ngrx/router-store

In the exercise we want to store the search params in the url and find our flights based on the url params.
We also will sync the urt with our search form.

Before we will use the ngrx/router-store we try to implement the a custom way of making the url the source of truth.

1. Custom implementation of url state

1.1 Subscribe to url changes

```typescript
// search.component.ts
constructor(
    ...  
    // inject activated route
    private route: ActivatedRoute
  ) {

    ...

    this.route.params.subscribe(
      (data: { from: string, to: string }) => {
        // find flights triggered by on ulr param change
        this.fs.find(data.from, data.to)
      }
    )

```

1.2 Trigger url change instead of flight search
```typescript
// search.component.ts
constructor(
    ...  
    // inject router
    private router: Router
  ) {

    ...

}
  searchFlights(form: FormGroup) {
    const data = form.value
    // this.fs.find(data.from, data.to)
    
    // trigger navigation
    this.router.navigate(['./', {from: data.from, to: data.to}])
  }
```

1.3 Sync the form search params with the url state

```typescript 
 constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private fs: FlightService
  ) {
  ...
    this.route.params.subscribe(
      (data: { from: string, to: string }) => {
        const searchFormData = Object.assign({from: '', to: ''}, data)
        this.searchForm.patchValue(searchFormData)
        ...
      }
    )
  ...
  }

```

2. ngrx/router-store implementation of url params


2.1. connect router-store to routing actions
```typescript
import * as fromRouter from '@ngrx/router-store';

export interface IDB {
  ...
  // extend state
  routerReducer: fromRouter.RouterReducerState<any>
}

const reducer = {
  ..., 
  // implement reducer
  routerReducer: fromRouter.routerReducer
}

@NgModule({
  ...
  imports: [
    ..., 
    // connect router-store
    fromRouter.StoreRouterConnectingModule
  ],
  ...
})
export class AppModule {
}
```

2.2. listen to router actions and trigger find flights action

The router-store module, more accurate the router, 
will dispatch a `ROUTER_NAVIGATION` action. 
We can listen to it in any ´@Effect´.

```typescript
flight.effect.ts
... 

@Injectable()
export class FlightEffects {

  find$: ...
  
  ...
  
  @Effect()
  // handle location update
  locationUpdate$: Observable<Action> = this.actions$.ofType('ROUTER_NAVIGATION')
    .filter((n: any) => {
      return n.payload.event.url.indexOf('flight')
    })
    .switchMap((action: any) => {
      // extract params from url
      const rS = action.payload.routerState
      const searchParams = rS.root.firstChild.params
      // trigger FindAction with search params
      return Observable.of(new flight.FindAction(searchParams))
    });
  ...
}
```

2.3. Remove manual call of find flights

```typescript
// search.compoent.ts 
...
  constructor(...) {
    ...
    this.route.params.subscribe(
      (data: { from: string, to: string }) => {
        const searchFormData = Object.assign({from: '', to: ''}, data)
        this.searchForm.patchValue(searchFormData)
        // remove find flights call
        // this.fs.find(data.from, data.to)
      }
    )
  ...
  }
...
``` 

## Bonus Exercise: Implement a custom router state serializer

1. create the file `router-state.serializer.ts` and copy this code into it:

```typescript
//router-state.serializer.ts
import {RouterStateSerializer} from '@ngrx/router-store';
import {Params, RouterStateSnapshot} from '@angular/router';

export interface IRouterStateUrl {
  url: string;
  params: any;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {

  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const params = routerState.root.firstChild.params;

    console.log('routerState', routerState)

    // Only return an object including the URL and query params
    // instead of the entire snapshot
    return { url, params };
  }
}
```

2. Adopt `IDB` interface with new `IRouterStateUrl`

```typescript
// app.module.ts

...
import {CustomSerializer, IRouterStateUrl} from './ngrx/router-state.serializer';

export interface IDB {
  flightPage: IFlightState
  //routerReducer: fromRouter.RouterReducerState<any>
  routerReducer: fromRouter.RouterReducerState<IRouterStateUrl>
}
...

```

3. Override provider for `RouterStateSerializer` with the `CustomSerializer`

```typescript
// app.module.ts

...

@NgModule({
  ...
  providers: [
    {provide: RouterStateSerializer, useClass: CustomSerializer}
  ],
  ...
})
export class AppModule {
}
 
```

4. Adopt `locationUpdate$` for new RouterState

```typescript
@Effect()
  // handle location update
  locationUpdate$: Observable<Action> = this.actions$.ofType('ROUTER_NAVIGATION')
    ...
    .switchMap((action: any) => {
      // const rS = action.payload.routerState
      // const searchParams = rS.root.firstChild.params
      const searchParams = action.payload.routerState.params
      return Observable.of(new flight.FindAction(searchParams))
    });
```

