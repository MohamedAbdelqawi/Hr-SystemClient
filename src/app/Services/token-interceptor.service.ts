import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the token from local storage
    const token = localStorage.getItem('jwt');

    // Clone the request and add the token as an Authorization header
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
