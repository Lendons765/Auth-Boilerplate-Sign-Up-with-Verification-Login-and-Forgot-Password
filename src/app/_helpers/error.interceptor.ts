import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            
            
            const isResetPage = this.router.url.includes('/account/reset-password');
            
            if ([401, 403].includes(err.status) && !isResetPage) {
                
                window.location.reload(); 
            }

            const error = err.error?.message || err.statusText;
            return throwError(() => error);
        }));
    }
}