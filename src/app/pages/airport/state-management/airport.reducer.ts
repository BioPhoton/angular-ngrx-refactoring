import {Flight} from '../../../core/api/models/flight';
import * as airport from './airport.actions';
import {createSelector} from '@ngrx/store';
import {IDB} from '../../../state-management/IDB.interface';


// the interface for FlightState
export interface IAirportState {
  airports?: string[],
}

// initial state
export const initialAirportBranch: IAirportState = {
  airports: ['Airport 1', 'Airport 2'],
}

// reducers are our DB tables
export function airportReducer(state = initialAirportBranch, action: airport.Actions): any {
  switch (action.type) {
    case airport.FIND_AIRPORTS_SUCCESS:
      return {
        ...state,
        airports: action.payload,
      }
    default:
      return state
  }
}

// Selectors are our queries

function getAirportsState(db: IDB): IAirportState {
  return db.airportBranch
}

export const getAirports = createSelector(
  getAirportsState,
  (state: IAirportState) => state.airports
)

