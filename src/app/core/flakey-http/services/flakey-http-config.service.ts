import {HttpEvent, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class FlakeyHttpConfigService {

  private _delayRequestMs$: BehaviorSubject<number> = new BehaviorSubject(0)
  delayRequestMs$: Observable<number> = this._delayRequestMs$.asObservable()

  private _delayResponseMs$: BehaviorSubject<number> = new BehaviorSubject(0)
  delayResponseMs$: Observable<number> = this._delayResponseMs$.asObservable()

  setDelayRequestMs$(delay: number): void {
    this._delayRequestMs$.next(delay || 0)
  }

  setDelayResponseMs$(delay: number): void {
    this._delayResponseMs$.next(delay || 0)
  }

  delayRequest(req$: Observable<HttpEvent<any>>): Observable<HttpEvent<any>> {
    return req$.delay(this._delayRequestMs$.getValue())
  }

  delayResponse(res$: Observable<HttpResponse<any>>): Observable<HttpResponse<any>> {
    return res$.delay(this._delayResponseMs$.getValue())
  }

}
