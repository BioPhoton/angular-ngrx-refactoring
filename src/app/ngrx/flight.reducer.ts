import {Flight} from '../core/api/models/flight';
import * as flight from './flight.actions';

// the interface for FlightState
export interface IFlightState {
  flights?: Flight[]
}

// initial state
export const initialFlightBranch: IFlightState = {
  flights: []
}

// reducers are our DB tables
export function flightReducer(state = initialFlightBranch, action: flight.Actions): any {
  switch (action.type) {
    case flight.FIND_FLIGHTS_SUCCESS:
      return {
        ...state,
        flights: action.payload
      }
    default:
      return state
  }
}
