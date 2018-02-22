import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchComponent} from './components/search/search.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'search'},
  {
    path: '',
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'search'},
      {path: 'search', component: SearchComponent},
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirportRoutingModule {
}
