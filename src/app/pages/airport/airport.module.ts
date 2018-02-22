import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {EffectsModule} from '@ngrx/effects';

import {StoreModule} from '@ngrx/store';
import {AirportRoutingModule} from './airport-routing.module';
import {SearchComponent} from './components/search/search.component';
import {AirportEffects} from './state-management/airport.effects';
import {airportReducer} from './state-management/airport.reducer';

const components = [
  SearchComponent
]

@NgModule({
  imports: [
    CommonModule,
    AirportRoutingModule,
    StoreModule.forFeature('airportBranch', airportReducer),
    EffectsModule.forFeature([AirportEffects])
  ],
  providers: [],
  declarations: [components],
  exports: [components]
})
export class AirportModule {}
