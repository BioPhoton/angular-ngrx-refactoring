import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {IDB} from '../../../../state-management/IDB.interface';
import {getAirports} from '../../state-management/airport.reducer';
import {getFlights} from '../../../flight/state-management/flight.reducer';
import {Flight} from '../../../../core/api/models/flight';

@Component({
  selector: 'airport-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  airports$: Observable<string[]>;
  flights$: Observable<Flight[]>

  constructor(private store: Store<IDB>) {
    this.airports$ = this.store.select(getAirports);
    this.flights$ = this.store.select(getFlights);
  }

  ngOnInit() {

  }

}
