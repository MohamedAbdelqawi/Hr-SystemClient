import { ToastModule } from 'primeng/toast';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './Components/Dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentViewComponent } from './Components/Department/Department View/department-view.component';
import { DepartmentFormComponent } from './Components/Department/Department Form/department-form.component';
import { DataTablesModule } from "angular-datatables";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EmployeeformComponent } from './Components/Employee/Employee Form/employee-form.component';
import { EmployeeviewComponent } from './Components/Employee/Employee View/employee-view.component';
import { SalaryReportsComponent } from './Components/Salary/salary-reports.component';
import { AttendanceformComponent } from './Components/Attendance/Attendance Form/attendanceform.component';
import { AttendanceviewComponent } from './Components/Attendance/Attendance View/attendanceview.component';
import { PublicholidaysComponent } from './Components/PublicHolidays/publicholidays.component';
import { GeneralSettingComponent } from './Components/GeneralSetting/general-setting.component';
import { UserManagementComponent } from './Components/Users Mangement/user-management.component';
import { RoleManagementComponent } from './Components/Roles Managment/role-management.component';
import { SignInComponent } from './Components/Authentication/Sign In/sign-in.component';
import { JwtModule } from '@auth0/angular-jwt'; // Import JwtModule
import { TokenInterceptorService } from './Services/token-interceptor.service';
import { WelcomeComponent } from './Components/Dashboard/Welcome/welcome.component';
import { AccessDeniedComponent } from './Components/Access denied/access-denied.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from './Components/dialog/dialog.component';
import { ForbiddenInterceptor } from './Services/forbidden-interceptor.service';
 



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DepartmentViewComponent,
    DepartmentFormComponent,
    EmployeeformComponent,
    EmployeeviewComponent,
    SalaryReportsComponent,
    AttendanceformComponent,
    AttendanceviewComponent,
    PublicholidaysComponent,
    GeneralSettingComponent,
    UserManagementComponent,
    RoleManagementComponent,
    SignInComponent,
    WelcomeComponent,
    AccessDeniedComponent,
    DialogComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('jwt'); // Adjust this based on where your token is stored.
        },
      },
    }),
    MatDialogModule,
    MatButtonModule,

    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule, // Add HttpClientModule to your imports
    ToastModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      
      multi: true,
      
    },
    {
      provide: HTTP_INTERCEPTORS, // Add this to register the ForbiddenInterceptor
      useClass: ForbiddenInterceptor,
      multi: true,
    },
    MessageService, // Add this line to provide MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
