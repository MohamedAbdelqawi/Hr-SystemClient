import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PermissionsGurdService } from './permissions-gurd.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class PublicholidaysService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private permissionsGuardService: PermissionsGurdService,
    private toastService: ToastService

  ) {}

  baseUrl: string = 'https://localhost:44343/api/PublicHolidays';
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
  GetAllPublicholidys(): Observable<any> {
    if (this.checkPermission('Permission.GeneralSetting.View')) {
      return this.http.get(this.baseUrl);
    } else {
      return of();
    }
  }

  GetPublicholidyId(id: any): Observable<any> {
    if (this.checkPermission('Permission.GeneralSetting.Edit')) {
      return this.http.get(`${this.baseUrl}/${id}`);
    } else {
      return of();
    }
  }

  AddPublicholidy(data: any): Observable<any> {
    if (this.checkPermission('Permission.GeneralSetting.Create')) {
      return this.http.post(this.baseUrl, data);
    } else {
      return of();
    }
  }

  EditPublicholidy(data: any, id: any): Observable<any> {
    if (this.checkPermission('Permission.GeneralSetting.Edit')) {
      return this.http.put(`${this.baseUrl}/${id}`, data);
    } else {
      return of();
    }
  }

  DeletePublicholidy(id: any): Observable<any> {
    if (this.checkPermission('Permission.GeneralSetting.Delete')) {
      return this.http.delete(`${this.baseUrl}/${id}`);
    } else {
      return of();
    }
  }
}
