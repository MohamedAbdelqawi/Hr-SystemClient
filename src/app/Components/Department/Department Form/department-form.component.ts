import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from 'src/app/Services/department.service';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css']
})
export class DepartmentFormComponent {
  serverErrors: string[] = [];
  submitted: boolean = false;
  deptid: any;
  department: any;
  ModelState:any ;
  formadd = new FormGroup({
    id:new FormControl(0),
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(2),
    ]),
  });
  constructor(
    public deptservice: DepartmentService,
    public Route: Router,
    public getid: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.getid.params.subscribe({
      next: (param) => {
        this.deptid = param['id'];
        if (this.deptid != undefined) {
          this.deptservice.GetDepartmentById(this.deptid).subscribe({
            next: (Response) => {
              this.department = Response;
              this.formadd.controls['name'].setValue(this.department.name);
              this.formadd.controls['id'].setValue(this.department.id);
            },
          });
        }
      },
    });
  }

  get controlsname() {
    return this.formadd.controls;
  }

  OnSubmit(e: Event) {
    e.preventDefault();
    this.submitted = true;
    if (this.formadd.valid) {
      if (this.deptid != undefined) {
        this.deptservice.EditDepartment(this.formadd.value, this.deptid).subscribe({
          next: (res) => {
            console.log(res);
            this.Route.navigate(['/Dashboard/Depatment']);
          },
          error:(error:any)=>{          
            this.clearServerErrors();
                this.serverErrors.push(error.error.DeptName[0]);
                console.log(this.serverErrors);
               }
        });
      }
      else {
        this.deptservice.AddDepartment(this.formadd.value).subscribe({
          next: () => {
            this.Route.navigate(['/Dashboard/Depatment']);
          },
          error: (error: any) => {
            //console.log(error.error.DeptName[0]);
            console.log(error.error.DeptName[0]);
    
            this.clearServerErrors();
            this.serverErrors.push(error.error.DeptName[0]);
            //this.serverErrors.push(error.message);
            console.log(this.serverErrors);
        }
        });
      }
    } 
  }

  clearServerErrors() {
    this.serverErrors = [];
  }

}
