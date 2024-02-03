import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionsGurdService } from './permissions-gurd.service';
import { Observable, of } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class UsersManagmentService {

  constructor(private http: HttpClient, private router: Router, 
    private permissionsGuardService: PermissionsGurdService,
    private toastService: ToastService
    ) { }
   secondUrl: string = 'https://localhost:44343/api/User/GetToCreate';
  baseUrl: string = 'https://localhost:44343/api/User';

  checkPermission(requiredServicePermission: string): boolean {
    const token = localStorage.getItem("jwt") ?? "";
    if (this.permissionsGuardService.hasRole(token, ['SuperAdmin'])) {
      return true;
    }
    if (this.permissionsGuardService.hasPermission(token, [requiredServicePermission])) {
      return true;
    }
    this.toastService.showToast('error', 'Access Denied', "You don't have permission");
    return false;
  }

  GetDataFormToCreate(): Observable<any> {
    if (this.checkPermission('Permission.Permission.View')) {
      return this.http.get(this.secondUrl);
    } else {
      return of();
    }
  }
  GetAllUsers(): Observable<any> {
    if (this.checkPermission('Permission.Permission.View')) {
      return this.http.get(this.baseUrl);
    } else {
      return of();
    }
  }

  AddNewUser(user: any): Observable<any> {
    if (this.checkPermission('Permission.Permission.Create')) {
      return this.http.post(this.baseUrl, user);
    } else {
      return of();
    }
  }

  GetUserById(id: any): Observable<any> {
    if (this.checkPermission('Permission.Permission.Edit')) {
      return this.http.get(`${this.baseUrl}/GetUserById?userId=${id}`);
    } else {
      return of();
    }
  }

  EditUser(user: any, id: string): Observable<any> {
    if (this.checkPermission('Permission.Permission.Edit')) {
      return this.http.put(`${this.baseUrl}/${id}`, user);
    } else {
      return of();
    }
  }

  DeleteUser(id: any): Observable<any> {
    if (this.checkPermission('Permission.Permission.Delete')) {
      return this.http.delete(`${this.baseUrl}/RemoveUser?userId=${id}`);
    } else {
      return of();
    }
  }
}
