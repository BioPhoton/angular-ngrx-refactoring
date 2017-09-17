import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import * as flight from './flight.actions';
import {FlightResource} from '../core/api/resources/flight.resource';

@Injectable()
export class FlightEffects {

  @Effect()
  find$: Observable<Action> = this.actions$.ofType<flight.FindAction>(flight.FIND_FLIGHTS)
    // handle race conditions with switchMap
    .switchMap((action) => {
      const from = action.payload.from
      const to = action.payload.to
      // handle side effects here

    })

  constructor(private actions$: Actions,
              private fr: FlightResource) {
  }

}
