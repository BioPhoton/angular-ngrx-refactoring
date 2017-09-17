import {Action} from '@ngrx/store';
import {Flight} from '../core/api/models/flight';

export const FIND_FLIGHTS_SUCCESS = '[Flight] Find Success'
export const FIND_FLIGHTS = '[Flight] Find'
export const FIND_FLIGHTS_FAIL = '[Flight] Find Fail'


export class FindAction implements Action {
  type = FIND_FLIGHTS;

  constructor(public payload: { from: string, to: string }) {
  }
}

export class FindSuccessAction implements Action {
  type = FIND_FLIGHTS_SUCCESS;

  constructor(public payload: Flight[]) {
  }
}

export class FindFailAction implements Action {
  type = FIND_FLIGHTS_FAIL;

  constructor(public payload?: any) {
  }
}

export type Actions = FindSuccessAction | FindAction | FindFailAction
