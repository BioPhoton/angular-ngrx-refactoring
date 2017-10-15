import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule, Optional, SkipSelf} from '@angular/core';
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
  providers: [
    FlightResource,
    FlakeyHttpConfigService,
    FLAKEY_HTTP_INTERCEPTER_PROVIDER
  ],
  declarations: [FlakeyHttpConfigComponent],
  exports: [FlakeyHttpConfigComponent]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
