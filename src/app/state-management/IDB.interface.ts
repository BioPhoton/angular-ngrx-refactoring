import {IFlightState} from '../pages/flight/state-management/flight.reducer';
import * as fromRouter from '@ngrx/router-store';
import {IRouterStateUrl} from './router-state.serializer';
import {IAirportState} from '../pages/airport/state-management/airport.reducer';

export interface IDB {
  flightBranch: IFlightState,
  routerBranch: fromRouter.RouterReducerState<IRouterStateUrl>,
  airportBranch: IAirportState
}
