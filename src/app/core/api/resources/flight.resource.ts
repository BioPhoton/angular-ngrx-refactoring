import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs/Rx'

import 'rxjs/Rx'

import {environment} from '../../../../environments/environment'
import {Flight} from '../models/Flight'

@Injectable()
export class FlightResource {

  private baseUrl: string
  private resourceName = 'flight'

  constructor(private http: HttpClient) {
    this.baseUrl = [environment.baseUrl, this.resourceName].join('/')
  }

  findById(id: string): Observable<Flight> {
    const reqObj = { params: null}
    const params = new HttpParams().set('id', id)
    // Wont work!! => params.set('id', id)
    reqObj.params = params

    return this.http
      .get<Flight>(this.baseUrl, reqObj)
      .catch(error => Observable.throw(error.json()))

  }


  find(from: string, to: string):  Observable<Flight[]> {
    const reqObj = {
      params: new HttpParams()
        .set('from', from || '')
        .set('to', to || '')
    }

    return this
      .http
      .get<Flight[]>(this.baseUrl, reqObj)
      .catch(error => Observable.throw(error.json()))
  }

  post(flight: Flight): Observable<Flight> {
    return this
      .http
      .post<Flight>(this.baseUrl, flight)
      .share()
      .catch((e: HttpErrorResponse) => {
        let errMsg = 'Client Error or Network Error'

        if (e instanceof HttpErrorResponse) {
          switch (e.status) {
            case 400:
              errMsg = e.message
              break
            case 500:
              errMsg = 'You got a 500! :-('
              break
            default:
              errMsg = 'Server Error'
          }

        }
        return Observable.throw({message: errMsg})
      })
  }

}
