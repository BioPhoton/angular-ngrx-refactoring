import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRouterModule} from './app.routing.module';
import {CoreModule} from './core/core.module';
import {HomeModule} from './pages/home/home.module';
import {StoreModule} from '@ngrx/store';
import {IFlightState} from './pages/flight/state-management/flight.reducer';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import * as fromRouter from '@ngrx/router-store';
import {
  CustomSerializer,
  IRouterStateUrl
} from './ngrx/router-state.serializer';

export interface IDB {
  flightBranch: IFlightState,
  routerBranch: fromRouter.RouterReducerState<IRouterStateUrl>
}

const reducer = {
  routerBranch: fromRouter.routerReducer
}

const effects = []

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    CoreModule.forRoot(),
    HomeModule,
    StoreModule.forRoot(reducer),
    StoreDevtoolsModule.instrument({
      maxAge: 10 //  Buffers the last 10 states
    }),
    EffectsModule.forRoot(effects),
    fromRouter.StoreRouterConnectingModule
  ],
  providers: [
    {provide: fromRouter.RouterStateSerializer, useClass: CustomSerializer}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
