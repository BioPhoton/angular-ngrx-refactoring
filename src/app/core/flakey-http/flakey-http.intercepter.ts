import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FlakeyHttpConfigService} from './services/flakey-http-config.service';

@Injectable()
export class FlakeyHttpInterceptor implements HttpInterceptor {

  constructor(private fHCS: FlakeyHttpConfigService) {
  }

  intercept(req: HttpRequest<any>, delegate: HttpHandler): Observable<HttpEvent<any>> {

    return delegate.handle(req)
    .let(req$ => this.fHCS.delayRequest(req$))
    .let(res$ => this.fHCS.delayResponse(res$));
  }

}

export const
  FLAKEY_HTTP_INTERCEPTER_PROVIDER = {
    provide: HTTP_INTERCEPTORS,
    useClass: FlakeyHttpInterceptor,
    multi: true,
  }
