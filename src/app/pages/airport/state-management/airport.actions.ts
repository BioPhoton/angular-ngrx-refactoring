import {Action} from '@ngrx/store';

export const FIND_AIRPORTS_SUCCESS = '[Airport] Find Success'


export class FindSuccessAction implements Action {
  type = FIND_AIRPORTS_SUCCESS;

  constructor(public payload: string[]) {
  }
}

export type Actions = FindSuccessAction;
