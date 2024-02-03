import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from 'src/app/Services/department.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import { ToastService } from 'src/app/Services/toast.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeformComponent implements OnInit {
  serverErrors: string[] = [];
  submitted = false;

  AddEmployee = new FormGroup({
    id: new FormControl(0),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    city: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    gender: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    nationalId: new FormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{13}')]),
    selectedGender: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', Validators.required),
    salary: new FormControl('', [Validators.required, Validators.min(0)]),
    hireDate: new FormControl('', [Validators.required]),
    arrivalTime: new FormControl('', [Validators.required]),
    leaveTime: new FormControl('', [Validators.required]),
    departmentId: new FormControl(''),
  });

  get controls() {
    return this.AddEmployee.controls;
  }

  constructor(
    private departmentService: DepartmentService,
    private eployeeService: EmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService
  ) {}

  departments: any;
  employeeId: any;
  employee: any;
  propertiesToPush: string[] = ['FirstName', 'LastName', 'BirthDate', 'HireDate', 'LeaveTime', 'ArrivalTime'];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (param) => {
        this.employeeId = param['id'];
        if (this.employeeId != undefined) {
          this.eployeeService.GetEmployeeById(this.employeeId).subscribe({
            next: (Response) => {
              console.log(Response);
              this.employee = Response;
              this.AddEmployee.controls['id'].setValue(this.employee.id);
              this.AddEmployee.controls['firstName'].setValue(this.employee.firstName);
              this.AddEmployee.controls['lastName'].setValue(this.employee.lastName);
              this.AddEmployee.controls['country'].setValue(this.employee.country);
              this.AddEmployee.controls['city'].setValue(this.employee.city);

              if (this.employee.gender === "Male") {
                this.AddEmployee.controls['gender'].setValue("Male"); // Set value for Male
              } else {
                this.AddEmployee.controls['gender'].setValue("Female"); // Set value for Female
              }

              this.AddEmployee.controls['nationalId'].setValue(this.employee.nationalId);
              this.AddEmployee.controls['selectedGender'].setValue(this.employee.selectedGender);
              this.AddEmployee.controls['nationality'].setValue(this.employee.nationality);
              this.AddEmployee.controls['birthDate'].setValue(this.employee.birthDate);
              this.AddEmployee.controls['salary'].setValue(this.employee.salary);
              this.AddEmployee.controls['hireDate'].setValue(this.employee.hireDate);
              this.AddEmployee.controls['arrivalTime'].setValue(this.employee.arrivalTime);
              this.AddEmployee.controls['leaveTime'].setValue(this.employee.leaveTime);
              this.AddEmployee.controls['departmentId'].setValue(this.employee.departmentId);
            },
            error: (error: any) => {
              this.clearServerErrors();
              for (const key of this.propertiesToPush) {
                if (error.error[key] && Array.isArray(error.error[key])) {
                  this.serverErrors.push(...error.error[key]);
                }
              }
            }
          });
        }
      },
    });

    this.departmentService.GetAllDepartment().subscribe({
      next: (Response) => {
        this.departments = Response;
      },
      error: (error: any) => {
        this.clearServerErrors();
        for (const key of this.propertiesToPush) {
          console.log(key);

          if (error.error[key] && Array.isArray(error.error[key])) {
            this.serverErrors.push(...error.error[key]);
          }
        }
        console.log(this.serverErrors);
      }
    });
  }

  OnSubmit(e: Event) {
    e.preventDefault();
    this.submitted = true;
    if (this.employeeId != undefined) {
      console.log(this.employeeId);
      console.log(this.AddEmployee.valid);
      this.eployeeService.EditEmployee(this.AddEmployee.value, this.employeeId).subscribe({
        next: (response: any) => {
          this.toastService.showToast('success', 'Done', 'Edit Employee Successfully');
          this.router.navigate(['/Dashboard/Employee']);
        },
        error: (error: any) => {
          this.clearServerErrors();
          for (const key of this.propertiesToPush) {
            if (error.error[key] && Array.isArray(error.error[key])) {
              this.serverErrors.push(...error.error[key]);
            }
          }
          console.log(this.serverErrors);
          this.toastService.showToast('error', 'Error', 'Edit Employee Failed');
        }
      });
    } else {
      this.eployeeService.AddEmployee(this.AddEmployee.value).subscribe({
        next: (response: any) => {
          this.toastService.showToast('success', 'Done', 'Add Employee Successfully');
          console.log(response);
          console.log(response.message);
          this.router.navigate(['/Dashboard/Employee']);
        },
        error: (error: any) => {
          this.clearServerErrors();
          for (const key of this.propertiesToPush) {
            if (error.error[key] && Array.isArray(error.error[key])) {
              this.serverErrors.push(...error.error[key]);
              console.log(this.serverErrors);
            }
          }
          console.log(this.serverErrors);
          this.toastService.showToast('error', 'Error', 'Add Employee Failed');
        }
      });
    }
  }

  clearServerErrors() {
    this.serverErrors = [];
  }
}