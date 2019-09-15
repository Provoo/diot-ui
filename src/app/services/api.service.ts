import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public api = 'http://0.0.0.0:8000/'

  constructor(private http: HttpClient) { }

  signIn(username, password): Observable<any> {
    let body = {
      'username': username,
      'email': username,
      'password': password
    };

    return this.http.post(this.api + 'rest-auth/login/', body)
  }
  getUserToken(): Observable<any> {
    return this.http.get(this.api + 'rest-auth/user/')
  }
  getDiotsUser(user): Observable<any> {
    return this.http.get(this.api + `diot_api/user_diots/${user}`)
  }

}
