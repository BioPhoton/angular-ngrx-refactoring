import {NgModule, Optional, SkipSelf} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import * as fromRouter from '@ngrx/router-store';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {CustomSerializer} from './router-state.serializer';

const reducer = {
  routerBranch: fromRouter.routerReducer
}

const effects = []

@NgModule({
  imports: [
    StoreModule.forRoot(reducer),
    StoreDevtoolsModule.instrument({
      maxAge: 10 //  Buffers the last 10 states
    }),
    EffectsModule.forRoot(effects),
    fromRouter.StoreRouterConnectingModule
  ],
  exports: [
    StoreModule,
    StoreDevtoolsModule,
    EffectsModule
  ],
  providers: [
    {provide: fromRouter.RouterStateSerializer, useClass: CustomSerializer}
  ],
})
export class StateManagementModule {

  constructor(@Optional() @SkipSelf() parentModule: StateManagementModule) {
    console.log('CoreModlue: ', parentModule);
    if (parentModule) {
      throw new Error(
        'Global StateManagementModule is already loaded. Import it in the AppModule only');
    }
  }

}
