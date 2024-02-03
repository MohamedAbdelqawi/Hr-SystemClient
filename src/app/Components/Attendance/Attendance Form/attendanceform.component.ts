import { AttendanceService } from 'src/app/Services/attendance.service';
// import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';

@Component({
  selector: 'app-attendanceform',
  templateUrl: './attendanceform.component.html',
  styleUrls: ['./attendanceform.component.css']
})
export class AttendanceformComponent  implements OnInit {
  constructor(
    // private datePipe: DatePipe,
    private attendanceService: AttendanceService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    
    ) {
      const currentHours = this.currentDate.getHours().toString().padStart(2, '0');
      const currentMinutes = this.currentDate.getMinutes().toString().padStart(2, '0')
      this.currentTime = `${currentHours}:${currentMinutes}`;
    } 
    serverErrors: string[] = [];
  employeeAttendance :any;
  employeeAttendanceId:any;
  employeeList: any;
  currentDate: Date = new Date();
  currentTime: string = '';
  submitted = false;
  EmployeeAttendanceForm = new FormGroup({
    id: new FormControl(0),
    date: new FormControl( [Validators.required]),
    arrivalTime: new FormControl(this.currentTime, [Validators.required]),
    leaveTime: new FormControl(),
    selectedEmployee: new FormControl('', [Validators.required])
  });
  propertiesToPush: string[] = ['Exists', 'Date', 'ArrivalTime'];

 
ngOnInit(): void {
   this.activatedRoute.params.subscribe({
    next:()=>{
      this.employeeAttendanceId = this.activatedRoute.snapshot.params['id'];
      if(this.employeeAttendanceId != undefined){
        
        this.attendanceService.GetAttendanceById(this.employeeAttendanceId).subscribe({
          next:(Response:any)=>{
            console.log(Response);
            
            this.employeeAttendance = Response;
            this.EmployeeAttendanceForm.controls['id'].setValue(this.employeeAttendance.id);
            this.EmployeeAttendanceForm.controls['date'].setValue(this.employeeAttendance.date);
            this.EmployeeAttendanceForm.controls['arrivalTime'].setValue(this.employeeAttendance.arrivalTime);
            this.EmployeeAttendanceForm.controls['leaveTime'].setValue(this.employeeAttendance.leaveTime);
            this.EmployeeAttendanceForm.controls['selectedEmployee'].setValue(this.employeeAttendance.selectedEmployee);
          //  this.EmployeeAttendanceForm.get('selectedEmployee')?.disable().;
            console.log(this.EmployeeAttendanceForm.value);
          }
        });

        this.attendanceService.GetEmployeeList().subscribe({
          next:(Response)=>{
            this.employeeList = Response;
          }
         })
      }
      else{
        this.attendanceService.GetEmployeeListWithoutAttendance().subscribe({
          next:(Response)=>{
            this.employeeList = Response;
          }
         })
       
      }
    }
   });
   
  
  }

  get controls() { return this.EmployeeAttendanceForm.controls; }

  OnSubmit() {
    this.submitted = true;
    console.log(this.EmployeeAttendanceForm.value);
    if (this.employeeAttendanceId != undefined) {
      this.attendanceService.EditAttendance(this.EmployeeAttendanceForm.value, this.employeeAttendanceId).subscribe({
        next: () => {
          this.router.navigate(['/Dashboard/Attendance']);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
    } else {
      this.attendanceService.AddAttendance(this.EmployeeAttendanceForm.value).subscribe({
        next: () => {
          this.router.navigate(['/Dashboard/Attendance']);
        },
        error:(error:any)=>{  
          console.log(error);
          console.log(error.error);
          
         // this.clearServerErrors();
          // for (const key of this.propertiesToPush) {
         
            
          //   if (error.error[key]) {
          //     this.serverErrors.push(...error.error[key]);
          //     console.log(this.serverErrors);
              
          //   }

          // }
          console.log(this.serverErrors);

          }
      });
    }
  }

  minDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    let month = (today.getMonth() + 1).toString();
    let day = today.getDate().toString();
  
    if (month.length === 1) {
      month = '0' + month; // Add leading zero if needed
    }
    if (day.length === 1) {
      day = '0' + day; // Add leading zero if needed
    }
    return `${year}-${month}-${day}`;
   
  }
  clearServerErrors() {
    this.serverErrors = [];
  }
}