import {Action} from '@ngrx/store';
import {Flight} from '../core/api/models/flight';

export const FIND_FLIGHTS_SUCCESS = '[Flight] Find Success'

export class FindSuccessAction implements Action {
  type = FIND_FLIGHTS_SUCCESS;

  constructor(public payload: Flight[]) {
  }
}

export type Actions = FindSuccessAction
