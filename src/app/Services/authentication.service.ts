import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
  
})
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router) {
    if (localStorage.getItem('userToken') !== null) {
      this.decodeUserData();
    }
  }

  baseUrl: string = 'https://localhost:44343/api/Authentication/Login';
  //refershtoken: string='https://localhost:44343/api/Authentication/RefreshToken'
  //tokenVersionUrl: string='https://localhost:44343/api/Authentication/GetTokenVersion'
  userData = new BehaviorSubject(null);

  decodeUserData() {
    let encodedToken = localStorage.getItem('jwt');
    if (encodedToken !== null) {
      let decodedToken: any = jwtDecode(encodedToken);
      this.userData.next(decodedToken);
     
    }
  }

  // refreshToken(): Observable<any> {
  //   console.log('Refreshing token...');
  //   return this.http.post<any>(this.refershtoken, null).pipe(
  //     tap({
  //       next: (response: any) => {
  //         console.log('Token refreshed successfully.');
  //         const newToken = response.token;
  //         localStorage.setItem('jwt', newToken);
  //       },
  //       error: (error) => {
  //         console.error('Token refresh failed:', error);
  //       }
  //     })
  //   );
  // }
  
  // getTokenVersion(): Observable<any> {
  //   return this.http.get(this.tokenVersionUrl).pipe(
  //     tap({
  //       next: (response: any) => {
  //         console.log('Token version retrieved successfully.');
  //         const tokenVersion = response;
  //         localStorage.setItem('tokenVersion', tokenVersion);
  //       },
  //       error: (error) => {
  //         console.error('Token version retrieval failed:', error);
  //       }
  //     })
  //   );
  // }


  logout() {
    localStorage.removeItem('jwt');
    this.userData.next(null);
    this.router.navigate(['/SignIn']);
  }

  login(userData: any): Observable<any> { // Updated userData type to any
    console.log(userData);
    
    return this.http.post(`${this.baseUrl}`, userData);
  }

  // Removed unused jwtDecode function
}
