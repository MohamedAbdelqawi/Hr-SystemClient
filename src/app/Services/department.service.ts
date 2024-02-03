import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PermissionsGurdService } from './permissions-gurd.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient, private router: Router, 
    private permissionsGuardService: PermissionsGurdService,
    private toastService: ToastService
    ) { }

  baseUrl: string = 'https://localhost:44343/api/Department';

  checkPermission(requiredServicePermission: string): boolean {
    const token = localStorage.getItem("jwt") ?? "";
    if (this.permissionsGuardService.hasRole(token, ['SuperAdmin'])) {
      return true;
    }
    if (this.permissionsGuardService.hasPermission(token, [requiredServicePermission])) {
      return true
    }
    this.toastService.showToast('error', 'Access Denied', "You don't have permission");
    return false;
  }

  GetAllDepartment(): Observable<any> {
    if (this.checkPermission('Permission.Department.View')) {
      return this.http.get(this.baseUrl);
    } else {
      return of();
    }
  }
  GetDepartmentById(departmentId: any): Observable<any> {
    if (this.checkPermission('Permission.Department.Edit')) {
      return this.http.get(`${this.baseUrl}/${departmentId}`);
    } else {
      return of();
    }
  }
  AddDepartment(department: any): Observable<any> {
    if (this.checkPermission('Permission.Department.Create')) {
      
      return this.http.post(this.baseUrl, department);
    } else {

      return of();
    }
  }
  EditDepartment(department: any, departmentId: any): Observable<any> {
    if (this.checkPermission('Permission.Department.Edit')) {
      return this.http.put(`${this.baseUrl}/${departmentId}`, department);
    } else {
      return of();
    }
  }

  DeleteDepartment(departmentId: any): Observable<any> {
    if (this.checkPermission('Permission.Department.Delete')) {
      
      return this.http.delete(`${this.baseUrl}/${departmentId}`);
      
    } else {
      return of();
    }
  }

}


// --------------------------Another Way--------------
// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { PermissionsGurdService } from './permissions-gurd.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class DepartmentService {

//   constructor(private http: HttpClient ,private permissionsGuardService: PermissionsGurdService) {}
  

//   baseUrl: string = 'https://localhost:44343/api/Department';

//   GetAllDepartment() {
//     return this.permissionsGuardService.checkPermission(["Permission.Department.View"], 
//     this.http.get(this.baseUrl));
//   }

//   GetDepartmentById(departmentId: any) {
//     return this.permissionsGuardService.checkPermission(["Permission.Department.View"], 
//     this.http.get(`${this.baseUrl}/${departmentId}`));
//   }
//   AddDepartment(department:any) {
//     return this.permissionsGuardService.checkPermission(["Permission.Department.Add"], 
//     this.http.post(this.baseUrl, department));
//   }
//   EditDepartment(department: any, departmentId: any){
//     return this.permissionsGuardService.checkPermission(["Permission.Department.Edit"],
//      this.http.put(`${this.baseUrl}/${departmentId}`, department));
//   }
//   DeleteDepartment(departmentId: any):Observable<any> {
//     return this.permissionsGuardService.checkPermission(["Permission.Department.Delete"], 
//     this.http.delete(`${this.baseUrl}/${departmentId}`));
//   }
//   // private checkPermission(permission: string)  {
//   //   console.log(`Checking permission: ${permission}`);
//   //    this.permissionsGuardService.RequiredPermission(permission);
//   // }

// }
