import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DepartmentService } from 'src/app/Services/department.service';
import { MessageService } from 'primeng/api';
import { ToastService } from 'src/app/Services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-department-view',
  templateUrl: './department-view.component.html',
  styleUrls: ['./department-view.component.css'],
  providers: [MessageService], // <-- Add this line
})
export class DepartmentViewComponent implements OnInit {
 
  serverErrors: string[] = [];
  departments: any;
  dtoption: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    public deptservice: DepartmentService,
    public Route: Router,
    public getid: ActivatedRoute,
    public dialog: MatDialog,
    private toastService: ToastService
  ) { }

  public ngOnInit(): void {
    this.deptservice.GetAllDepartment().subscribe({
      next: (response) => {
        this.departments = response;
        this.dtTrigger.next(null);
      },
    });
    this.dtoption = {
      pagingType: 'full_numbers',
    };
  }

  deletedept(departmentId: any) {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deptservice.DeleteDepartment(departmentId).subscribe({
          next: (response: any) => {

            this.toastService.showToast('warn', 'Delete', 'Delete Department Successfully');
            this.departments = this.departments.filter(
              (dept: any) => dept.id !== departmentId
            );


          },
          error: (error: any) => {

            this.clearServerErrors();

            this.serverErrors.push(error.error.message);
           
             
            this.toastService.showToast('error', 'Error', 'Delete Department failed');
          }
         
        });
      }
    });


  }

  submitted: boolean = false;
  deptid: any;
  Show: boolean = false;
  ModelState: any;
  formadd = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(2),
    ]),
  });

  Toggle() {
    this.Show = true
    this.clearServerErrors();
  }

  get controlsname() {
    return this.formadd.controls;
  }
  Edit(deparmentId: any) {
    this.formadd.markAsUntouched();
    this.clearServerErrors()
    this.Show = true
    this.deptid = deparmentId;
    this.deptservice.GetDepartmentById(deparmentId).subscribe({
      next: (response: any) => {
        this.formadd.controls['id'].setValue(response.id);
        this.formadd.controls['name'].setValue(response.name);
      },

    });
  }


  OnReset(source = '') {
    console.log(this.serverErrors);
    
    if (source == 'cancel') {
      // Do something specific when called from the "Cancel" button
      this.formadd.controls['id'].setValue(0);
      this.formadd.controls['name'].setValue('');
     
      this.deptid = 0;
      this.clearServerErrors();

    } 
    if(this.serverErrors.length>0){
      this.clearServerErrors();
     
      this.Show = !this.Show
     

      console.log('Reset called from another source');
    }
    else {
      this.formadd.controls['id'].setValue(0);
      this.formadd.controls['name'].setValue('');
      this.Show = !this.Show
      this.deptid = 0;
      this.clearServerErrors();
      this.submitted=false
    }
    this.formadd.markAsUntouched();

  }

  OnSubmit(e: Event) {
    e.preventDefault();
    this.submitted = true;
    if (this.formadd.valid) {

      if (this.deptid > 0) {
        this.deptservice
          .EditDepartment(this.formadd.value, this.deptid)
          .subscribe({
            next: (res) => {
              this.OnReset();
              this.deptservice.GetAllDepartment().subscribe({
                next: (response: any) => {
                  this.departments = response;
                  this.toastService.showToast('success', 'Done', 'Edit Department done');
                },
              });
            },
            error: (error: any) => {
              console.log(error.error.DeptName[0])
              this.clearServerErrors();
              this.serverErrors.push(error.error.DeptName[0]);
              this.Show = true;
              console.log(this.serverErrors);
              this.toastService.showToast('error', 'Error', 'Edit Department failed');

            },

          });

       
      } else {
        this.deptservice.AddDepartment(this.formadd.value).subscribe({

          next: () => {
            this.OnReset();
            this.toastService.showToast('success', 'Done', 'Add Department done');
            this.deptservice.GetAllDepartment().subscribe({
              next: (response) => {
                this.departments = response;

              },

            });
          },
          error: (error: any) => {

            this.clearServerErrors();

            this.serverErrors.push(error.error.DeptName[0]);
            console.log(this.serverErrors);
            this.Show=true;
            this.toastService.showToast('error', 'Error', 'Add Department failed');
          }
        });
     
      }
    }
  }
  clearServerErrors() {
    this.serverErrors = [];
    
  }

}