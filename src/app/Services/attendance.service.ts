import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PermissionsGurdService } from './permissions-gurd.service';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient ,
    private router: Router,
    private permissionsGuardService: PermissionsGurdService,
    private toastService: ToastService
    ) {}

  baseUrl: string = 'https://localhost:44343/api/Attendance';
  EmpsUrl:string= 'https://localhost:44343/api/Attendance/GetEmployeeList';
  EmpsWithoutAttendanceUrl:string= 'https://localhost:44343/api/Attendance/GetAllEmployeeWithoutAttendance';
 
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
  GetAllAttendance(): Observable<any> {
    if (this.checkPermission('Permission.Attendance.View')) {
      return this.http.get(this.baseUrl);
    } else {
      return of();
    }
  }

  GetAttendanceById(attendanceid: number): Observable<any> {
    if (this.checkPermission('Permission.Attendance.Edit')) {
      return this.http.get(`${this.baseUrl}/${attendanceid}`);
    } else {
      return of();
    }
  }

  AddAttendance(attendance: any): Observable<any> {
    if (this.checkPermission('Permission.Attendance.Create')) {
      return this.http.post(this.baseUrl, attendance);
    } else {
      return of();
    }
  }

  EditAttendance(attendance: any, attendanceid: number): Observable<any> {
    if (this.checkPermission('Permission.Attendance.Edit')) {
      return this.http.put(`${this.baseUrl}/${attendanceid}`, attendance);
    } else {
      return of();
    }
  }

  DeleteAttendance(attendanceid: number): Observable<any> {
    if (this.checkPermission('Permission.Attendance.Delete')) {
      return this.http.delete(`${this.baseUrl}/${attendanceid}`);
    } else {
      return of();
    }
  }

  GetEmployeeList(): Observable<any> {
    if (this.checkPermission('Permission.Attendance.View')) {
      return this.http.get(this.EmpsUrl);
    } else {
      return of();
    }
  }

  GetEmployeeListWithoutAttendance(): Observable<any> {
    if (this.checkPermission('Permission.Attendance.View')) {
      return this.http.get(this.EmpsWithoutAttendanceUrl);
    } else {
      return of();
    }
  }

  Filter(data: any): Observable<any> {
    if (this.checkPermission('Permission.Attendance.View')) {
      return this.http.post(`${this.baseUrl}/FilterAttendances`, data);
    } else {
      return of();
    }
  }

  }

