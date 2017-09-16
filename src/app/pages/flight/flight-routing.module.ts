import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CreateComponent as FlightCreateComponent} from './components/create/create.component';
import {DetailComponent as FlightDetailComponent} from './components/detail/detail.component';
import {EditComponent as FlightEditComponent} from './components/edit/edit.component';
import {SearchComponent as FlightSearchComponent} from './components/search/search.component';

import {FlightResolver} from './resolver/flight.resolver';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'search'},
  {
    path: '',
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'search'},
      {path: 'search', component: FlightSearchComponent},
      {path: 'create', component: FlightCreateComponent},
      {
        path: ':id',
        resolve: {flight: FlightResolver},
        children: [
          {path: '', pathMatch: 'full', redirectTo: 'detail'},
          {path: 'detail', component: FlightDetailComponent},
          {path: 'edit', component: FlightEditComponent}
        ]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightRoutingModule {
}
