import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { AuthService } from '../shared/auth/auth.service';

@Injectable()
export class HttpInterceptService implements HttpInterceptor {

    constructor(private authService: AuthService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        var authToken = localStorage.getItem('access_token');
        var idToken = localStorage.getItem('id_token');
        
        req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${authToken}`
            }
          });
        
          console.log('interceptin like a boss', authToken);

        return next.handle(req);
    }
}