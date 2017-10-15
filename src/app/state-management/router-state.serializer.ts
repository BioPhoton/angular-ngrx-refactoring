import {RouterStateSnapshot} from '@angular/router';
import {RouterStateSerializer} from '@ngrx/router-store';

export interface IRouterStateUrl {
  url: string;
  params: any;
}

export class CustomSerializer implements RouterStateSerializer<IRouterStateUrl> {

  serialize(routerState: RouterStateSnapshot): IRouterStateUrl {
    const {url} = routerState;
    const params = routerState.root.firstChild.params;

    // Only return an object including the URL and query params
    // instead of the entire snapshot
    return {url, params};
  }
}
