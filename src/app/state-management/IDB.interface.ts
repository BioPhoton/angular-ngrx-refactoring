import {IFlightState} from '../pages/flight/state-management/flight.reducer';
import * as fromRouter from '@ngrx/router-store';
import {IRouterStateUrl} from './router-state.serializer';

export interface IDB {
  flightBranch: IFlightState,
  routerBranch: fromRouter.RouterReducerState<IRouterStateUrl>
}
