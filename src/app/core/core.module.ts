import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FlakeyHttpConfigComponent} from './flakey-http/components/flakey-http-config/flakey-http-config.component';
import {FLAKEY_HTTP_INTERCEPTER_PROVIDER} from './flakey-http/flakey-http.intercepter';
import {FlightResource} from './api/resources/flight.resource';
import {FlakeyHttpConfigService} from './flakey-http/services/flakey-http-config.service';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [FlakeyHttpConfigComponent],
  exports: [FlakeyHttpConfigComponent]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        FlightResource,
        FlakeyHttpConfigService,
        FLAKEY_HTTP_INTERCEPTER_PROVIDER
      ]
    }
  }
}
