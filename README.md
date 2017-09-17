


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
