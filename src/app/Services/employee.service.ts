import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PermissionsGurdService } from './permissions-gurd.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private permissionsGuardService: PermissionsGurdService,
    private toastService: ToastService

  ) {}

  baseUrl: string = 'https://localhost:44343/api/Employee';
  checkPermission(requiredServicePermission: string): boolean {
    const token = localStorage.getItem('jwt') ?? '';
    if (this.permissionsGuardService.hasRole(token, ['SuperAdmin'])) {
      return true;
    }
    if (this.permissionsGuardService.hasPermission(token, [requiredServicePermission])) {
      return true;
    }
    this.toastService.showToast('error', 'Access Denied', "You don't have permission");
    return false;
  }
  GetAllEmployee(): Observable<any> {
    if (this.checkPermission('Permission.Employee.View')) {
      return this.http.get(this.baseUrl);
    } else {
      return of();
    }
  }

  GetEmployeeById(employeeId: number): Observable<any> {
    if (this.checkPermission('Permission.Employee.Edit')) {
      return this.http.get(`${this.baseUrl}/${employeeId}`);
    } else {
      return of();
    }
  }

  AddEmployee(employee: any): Observable<any> {
    if (this.checkPermission('Permission.Employee.Create')) {
      return this.http.post(this.baseUrl, employee);
    } else {
      return of();
    }
  }

  EditEmployee(employee: any, employeeid: number): Observable<any> {
    if (this.checkPermission('Permission.Employee.Edit')) {
      return this.http.put(`${this.baseUrl}/${employeeid}`,employee);
        } else {
      return of();
    }
  }

  DeleteEmployee(employeeid: number): Observable<any> {
    if (this.checkPermission('Permission.Employee.Delete')) {
      return this.http.delete(`${this.baseUrl}/${employeeid}`);
    } else {
      return of();
    }
  }
}
