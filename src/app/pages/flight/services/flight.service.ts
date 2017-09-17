import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {IDB} from '../../../app.module';
import {Flight} from '../../../core/api/models/flight';
import {FlightResource} from '../../../core/api/resources/flight.resource';
import * as flight from '../../../ngrx/flight.actions';
import * as fromFlight from '../../../ngrx/flight.reducer';

@Injectable()
export class FlightService {

  readonly flights$: Observable<Flight[]>

  private _isFindPending$: BehaviorSubject<boolean> = new BehaviorSubject(false)
  readonly isFindPending$: Observable<boolean>

  constructor(
    private fr: FlightResource,
    private store: Store<IDB>
  ) {
    this.flights$ = this.store.select<fromFlight.IFlightState>(fromFlight.getFlights)

    this.isFindPending$ = this._isFindPending$.asObservable()
  }

  find(from?: string, to?: string) {
    this._isFindPending$.next(true)
    this.fr.find(from, to)
      .subscribe(
        n => {
          this.store.dispatch(new flight.FindSuccessAction(n))
          this._isFindPending$.next(false)
        },
        e => {
          this._isFindPending$.next(false)
        })
  }

  edit(flight: Flight) {
    return this.fr.post(flight)
  }

}
