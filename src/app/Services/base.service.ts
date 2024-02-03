import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap } from 'rxjs';
import { PermissionsGurdService } from './permissions-gurd.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(
    protected http: HttpClient,
    protected router: Router,
    protected permissionsGuardService: PermissionsGurdService,
    protected authService: AuthenticationService
  ) {}

  protected baseUrl: string = 'https://localhost:44343/api'; // Adjust the base URL

  protected checkPermission(requiredServicePermission: string): boolean {
    const token = localStorage.getItem('jwt') ?? '';
    if (this.permissionsGuardService.hasRole(token, ['SuperAdmin'])) {
      return true;
    }
    if (this.permissionsGuardService.hasPermission(token, [requiredServicePermission])) {
      return true;
    }
    this.router.navigate(['/Dashboard/AccessDenied']);
    return false;
  }

  // Wrapper function to handle HTTP requests with token refresh
  protected handleRequest<T>(observable: Observable<T>): Observable<T> {
    return observable.pipe(
      tap(() => this.refreshTokenIfRequired()),
      catchError((error) => {
        console.error('Request failed:', error);
        throw error; // Re-throw the error to propagate it to the caller
      })
    );
  }

  // Refresh token logic
  private refreshTokenIfRequired() {
    this.authService.refreshToken().subscribe(
      (response: any) => {
        console.log('Token refreshed successfully.');
        const newToken = response.token;
        localStorage.setItem('jwt', newToken);
      },
      (error) => {
        console.error('Token refresh failed:', error);
      }
    );
  }}