import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Flight} from '../../../core/api/models/flight';
import {FlightResource} from '../../../core/api/resources/flight.resource';
@Injectable()
export class FlightService {

  private _flights$: BehaviorSubject<Flight[]> = new BehaviorSubject([])
  readonly flights$: Observable<Flight[]>

  private _isFindPending$: BehaviorSubject<boolean> = new BehaviorSubject(false)
  readonly isFindPending$: Observable<boolean>

  constructor(
    private fr: FlightResource,
  ) {
    this.flights$ = this._flights$.asObservable()

    this.isFindPending$ = this._isFindPending$.asObservable()
  }

  private setFlights(flights: Flight[]) {
    this._flights$.next(flights);
  }

  find(from?: string, to?: string) {
    this._isFindPending$.next(true)
    this.fr.find(from, to)
      .subscribe(
        n => {
          this.setFlights(n)
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
