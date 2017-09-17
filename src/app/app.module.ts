import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRouterModule} from './app.routing.module';
import {CoreModule} from './core/core.module';
import {FlightModule} from './pages/flight/flight.module';
import {HomeModule} from './pages/home/home.module';
import {StoreModule} from '@ngrx/store';
import {flightReducer, IFlightState} from './ngrx/flight.reducer';
import {EffectsModule} from '@ngrx/effects';
import {FlightEffects} from './ngrx/flight.effects';

export interface IDB {
  flightBranch: IFlightState
}

const reducer = {
  flightBranch: flightReducer
}

const effects = [FlightEffects]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    CoreModule.forRoot(),
    HomeModule,
    FlightModule.forRoot(),
    StoreModule.forRoot(reducer),
    EffectsModule.forRoot(effects)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
