import {CommonModule} from '@angular/common'
import {ModuleWithProviders, NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'

import {EditComponent as FlightEditComponent} from './components/edit/edit.component'
import {CreateComponent as FlightCreateComponent} from './components/create/create.component'
import {DetailComponent as FlightDetailComponent} from './components/detail/detail.component'
import {SearchComponent as FlightSearchComponent} from './components/search/search.component'

import {FlightRoutingModule} from './flight-routing.module'
import {FlightResolver} from './resolver/flight.resolver'
import {FlightService} from './services/flight.service';

const components = [
  FlightSearchComponent, FlightDetailComponent, FlightEditComponent, FlightCreateComponent,
]
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlightRoutingModule
  ],
  declarations: [components],
  exports: [components]
})
export class FlightModule {
  static forRoot(): ModuleWithProviders {
    return {
      providers: [FlightResolver, FlightService],
      ngModule: FlightModule
    }
  }
}
