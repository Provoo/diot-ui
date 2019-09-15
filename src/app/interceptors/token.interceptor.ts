import { Injectable } from '@angular/core';

import {
    HttpRequest,
        HttpHandler,
        HttpEvent,
        HttpInterceptor,
        HttpResponse,
        HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {
    Router
} from '@angular/router';
import { ToastController } from '@ionic/angular';

// import 'rxjs/add/operator/catchError'
// import { catchError, mergeMap } from 'rxjs/add/operator';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        public toastController: ToastController
        // public navCtrl: NavController 
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = localStorage.getItem('token');
        if (token) {
            
            request = request.clone({
                setHeaders: {
                    Accept: `application/json`,
                    'Content-Type': `application/json`,
                    Authorization: `Token ${token}`
                }
            });
           
        }
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    if (error.error.success === false) {
                        this.presentToast('Login failed');
                    } else {
                        this.router.navigate(['login']);
                    }
                }
                return throwError(error);
            }));
    }
    

    // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //     let tokenPromise = this.storage.get('token');

    //     return from(tokenPromise).pipe(res => {
    //             let clonedReq = this.addToken(request, res);
    //             return next.handle(clonedReq).subscribe(
    //                 err
    //             )
                
    //             .catch(err => {
    //                 // this.navCtrl.setRoot(LoginComponent)
    //                 return _throw(err)
    //             })
    //         })
    // }

    // Adds the token to your headers if it exists
    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            position: 'top'
        });
        toast.present();
    }
    private addToken(request: HttpRequest<any>, token: any) {
        if (token) {
            let clone: HttpRequest<any>;
            clone = request.clone({
                setHeaders: {
                    Accept: `application/json`,
                    'Content-Type': `application/json`,
                    Authorization: `Token ${token}`
                }
            });
            return clone;
        }

        return request;
    }
}