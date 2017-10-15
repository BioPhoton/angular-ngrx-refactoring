import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {IDB} from '../../../app.module';
import {Flight} from '../../../core/api/models/flight';
import {FlightResource} from '../../../core/api/resources/flight.resource';
import * as flight from '../state-management/flight.actions';
import * as fromFlight from '../state-management/flight.reducer';

@Injectable()
export class FlightService {

  readonly flights$: Observable<Flight[]>
  readonly isFindPending$: Observable<boolean>

  constructor(
    private fr: FlightResource,
    private store: Store<IDB>
  ) {
    this.flights$ = this.store.select(fromFlight.getFlights)
    this.isFindPending$ = this.store.select(fromFlight.getFindPending)
  }

  find(from?: string, to?: string) {
    this.store.dispatch(new flight.FindAction({from, to}))
  }

  edit(flight: Flight) {
    return this.fr.post(flight)
  }

}
