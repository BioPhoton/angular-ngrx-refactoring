import {Injectable} from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router'
import {Observable} from 'rxjs/Observable'
import {Flight} from '../../../core/api/models/Flight'
import {FlightResource} from '../../../core/api/resources/flight.resource'
import 'rxjs/add/observable/of'

@Injectable()
export class FlightResolver implements Resolve<Flight> {

  constructor(private fr: FlightResource) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Flight> | Promise<Flight> | Flight {
    const id = ('id' in route.params) ? route.params.id : 0
    if (id) {
      return this.fr.findById(id)
    } else {
      return Observable.of({} as Flight)
    }
  }

}
