import {Flight} from '../core/api/models/flight';
import * as flight from './flight.actions';
import {createSelector} from '@ngrx/store';
import {IDB} from '../app.module';


// the interface for FlightState
export interface IFlightState {
  flights?: Flight[],
  findPending?: boolean
}

// initial state
export const initialFlightBranch: IFlightState = {
  flights: [],
  findPending: false
}

// reducers are our DB tables
export function flightReducer(state = initialFlightBranch, action: flight.Actions): any {
  switch (action.type) {
    case flight.FIND_FLIGHTS:
      return {
        ...state,
        findPending: true
      }
    case flight.FIND_FLIGHTS_SUCCESS:
      return {
        ...state,
        flights: action.payload,
        findPending: false
      }
    case flight.FIND_FLIGHTS_FAIL:
      return {
        ...state,
        findPending: false
      }
    default:
      return state
  }
}

// Selectors are our queries

function getFlightState(db: IDB): IFlightState {
  return db.flightBranch
}

export const getFlights = createSelector(
  getFlightState,
  (state: IFlightState) => state.flights
)

export const getFindPending = createSelector(
  getFlightState,
  (state: IFlightState) => state.findPending
)
