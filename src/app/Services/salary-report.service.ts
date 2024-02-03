import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionsGurdService } from './permissions-gurd.service';
import { Observable, of } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class SalaryReportService {
 
  constructor(private http: HttpClient,
    private router: Router,
    private permissionsGuardService: PermissionsGurdService,
    private toastService: ToastService

    ) { }

    BaseUrl:string="https://localhost:44343/api/SalaryReport/CalculateSalaryReports"
    FilterUrl:string="https://localhost:44343/api/SalaryReport"
  
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
   
 
  GetAllSalaryReport(): Observable<any>{
    if (this.checkPermission('Permission.Salary.View')) {
    return this.http.get(this.BaseUrl)}
    else {
      return of([])
    }
  }

  FilterSalaryReport(data:any): Observable<any>{
    if (this.checkPermission('Permission.Salary.View')) {
    return this.http.post(this.FilterUrl,data)}
    else {
      return of([])
    }
  }
}