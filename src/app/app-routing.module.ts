import { AccessDeniedComponent } from './Components/Access denied/access-denied.component';
import { PublicholidaysComponent } from './Components/PublicHolidays/publicholidays.component';
import { DepartmentFormComponent } from './Components/Department/Department Form/department-form.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Components/Dashboard/dashboard.component';
import { DepartmentViewComponent } from './Components/Department/Department View/department-view.component';
import { EmployeeformComponent } from './Components/Employee/Employee Form/employee-form.component';
import { EmployeeviewComponent } from './Components/Employee/Employee View/employee-view.component';
import { SalaryReportsComponent } from './Components/Salary/salary-reports.component';
import { AttendanceviewComponent } from './Components/Attendance/Attendance View/attendanceview.component';
import { AttendanceformComponent } from './Components/Attendance/Attendance Form/attendanceform.component';
import { GeneralSettingComponent } from './Components/GeneralSetting/general-setting.component';
import { UserManagementComponent } from './Components/Users Mangement/user-management.component';
import { RoleManagementComponent } from './Components/Roles Managment/role-management.component';
import { SignInComponent } from './Components/Authentication/Sign In/sign-in.component';
import { PermissionsGurdService } from './Services/permissions-gurd.service';
import { WelcomeComponent } from './Components/Dashboard/Welcome/welcome.component';

const routes: Routes = [


  { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
  {
    path: 'Dashboard', component: DashboardComponent,
    canActivate: [PermissionsGurdService],
    children: [
      { path: 'Welcome', component: WelcomeComponent },
      {
        path: 'Depatment', component: DepartmentViewComponent,
        data: {
          allowedRoles:["SuperAdmin"],
          allowedPermissions: ["Permission.Department.View"],
        },
        canActivate: [PermissionsGurdService]
      },
     
      { path: 'Employee', component: EmployeeviewComponent ,
      data: {
        allowedRoles:["SuperAdmin"],
        allowedPermissions: ["Permission.Employee.View"],
      },
      canActivate: [PermissionsGurdService]},


      { path: 'Employee/Add', component: EmployeeformComponent ,
      data: {
        allowedRoles:["SuperAdmin"],
        allowedPermissions: ["Permission.Employee.Create"],
      },
      canActivate: [PermissionsGurdService]},


      { path: 'Employee/Edit/:id', component: EmployeeformComponent ,
      data: {
        allowedRoles:["SuperAdmin"],
        allowedPermissions: ["Permission.Employee.Edit"],
      },
      canActivate: [PermissionsGurdService]},


      { path: 'Salary', component: SalaryReportsComponent ,
      data: {
        allowedRoles:["SuperAdmin"],
        allowedPermissions: ["Permission.Salary.View"],
      },
      canActivate: [PermissionsGurdService]},


      { path: 'Attendance', component: AttendanceviewComponent ,
      data: {
        allowedRoles:["SuperAdmin"],
        allowedPermissions: ["Permission.Attendance.View"],
      },
      canActivate: [PermissionsGurdService]},
     

      { path: 'PublicHolidays', component: PublicholidaysComponent  ,
      data: {
        allowedRoles:["SuperAdmin"],
        allowedPermissions: ["Permission.GeneralSetting.View"],
      },
      canActivate: [PermissionsGurdService]},


      {
        path: 'GeneralSettings',
        component: GeneralSettingComponent,
        data: {
          allowedRoles: ["SuperAdmin"],
          allowedPermissions: [
            "Permission.GeneralSetting.View"
          ]
        },
        canActivate: [PermissionsGurdService]
      },


      { path: 'UsersManagement', component: UserManagementComponent  ,
      data: {
        allowedRoles:["SuperAdmin"],
        allowedPermissions: ["Permission.Permission.View"],
      },
      canActivate: [PermissionsGurdService]},


      { path: 'RolesManagement', component: RoleManagementComponent  ,
      data: {
        allowedRoles:["SuperAdmin"],
        allowedPermissions: ["Permission.Permission.View"],
      },
      canActivate: [PermissionsGurdService]},


      { path: 'AccessDenied', component: AccessDeniedComponent },

    ],

  },
  { path: 'SignIn', component: SignInComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
