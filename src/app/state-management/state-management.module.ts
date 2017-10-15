import {NgModule, Optional, SkipSelf} from '@angular/core';

@NgModule({
  imports: [
  ],
  exports: [
  ],
  providers: [
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
