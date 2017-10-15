import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CreateComponent as FlightCreateComponent} from './components/create/create.component';
import {DetailComponent as FlightDetailComponent} from './components/detail/detail.component';

import {EditComponent as FlightEditComponent} from './components/edit/edit.component';
import {SearchComponent as FlightSearchComponent} from './components/search/search.component';

import {FlightRoutingModule} from './flight-routing.module';
import {FlightResolver} from './resolver/flight.resolver';
import {FlightService} from './services/flight.service';
import {StoreModule} from '@ngrx/store';
import {flightReducer} from './state-management/flight.reducer';
import {EffectsModule} from '@ngrx/effects';
import {FlightEffects} from './state-management/flight.effects';

const components = [
  FlightSearchComponent, FlightDetailComponent, FlightEditComponent, FlightCreateComponent
]

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlightRoutingModule,
    StoreModule.forFeature('flightBranch', flightReducer),
    EffectsModule.forFeature([FlightEffects])
  ],
  providers: [FlightResolver, FlightService],
  declarations: [components],
  exports: [components]
})
export class FlightModule {}
