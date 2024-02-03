import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PublicholidaysService } from 'src/app/Services/publicholidays.service';

import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ToastService } from 'src/app/Services/toast.service';

@Component({
  selector: 'app-publicholidays',
  templateUrl: './publicholidays.component.html',
  styleUrls: ['./publicholidays.component.css']
})
export class PublicholidaysComponent implements OnInit {
  dtoption: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    public publicholidaysService: PublicholidaysService,
    public dialog: MatDialog,
    private toastService: ToastService
    
  ){}
  serverErrors: string[] = [];
  submitted: boolean = false;
  publicHolidays:any;
  publicHolidayId:any;
  ModelState:any ;
  PublicHolidyFrom = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]),
    date: new FormControl('', Validators.required)
  });
  propertiesToPush: string[] = ['Name', 'Date'];
  
  get controls() {
    return this.PublicHolidyFrom.controls;
  }
  ngOnInit(): void {
    this.publicholidaysService.GetAllPublicholidys().subscribe({
      next: (response) => {
        this.publicHolidays = response;
        this.dtTrigger.next(null);
      },
    })
    this.dtoption = {
      pagingType: 'full_numbers',
    };
    
  }

  OnSubmit(e: Event) {
    e.preventDefault();
    this.submitted = true;
    if (this.PublicHolidyFrom.valid) {
      if (this.publicHolidayId > 0) {
        this.publicholidaysService.EditPublicholidy(this.PublicHolidyFrom.value, this.publicHolidayId).subscribe({
          next: (res) => {
            this.OnReset()
            this.toastService.showToast('success', 'Done', 'Edit Public Holiday Successfully');
            this.publicholidaysService.GetAllPublicholidys().subscribe({
              next: (response) => {
                this.publicHolidays = response;
             
              },
            })
          },
          error:(error:any)=>{  
            //console.log(error);
            console.log(error.error);
            this.clearServerErrors();
            for (const key of this.propertiesToPush) {
           
              
              if (error.error[key] && Array.isArray(error.error[key])) {
                this.serverErrors.push(...error.error[key]);
                console.log(this.serverErrors);
                
              }

            }
            console.log(this.serverErrors);
            this.toastService.showToast('error', 'Error', 'Edit Public Holiday Failed');
            }

        });
       

      }
      else {
        console.log(this.PublicHolidyFrom.value)
        this.publicholidaysService.AddPublicholidy(this.PublicHolidyFrom.value).subscribe({
          next: () => {
            this.OnReset();
            this.toastService.showToast('success', 'Done', 'Add Public Holiday Successfully');
            this.publicholidaysService.GetAllPublicholidys().subscribe({
              next: (response) => {
                this.publicHolidays = response;
                
              },
            })
          },
          error:(error:any)=>{  
            //console.log(error);
            console.log(error.error);
            this.clearServerErrors();
            for (const key of this.propertiesToPush) {
           
              
              if (error.error[key] && Array.isArray(error.error[key])) {
                this.serverErrors.push(...error.error[key]);
                console.log(this.serverErrors);
                
              }

            }
            console.log(this.serverErrors);
            this.toastService.showToast('error', 'Error', 'Add Public Holiday Failed');
            }

        });
      
      }
    } 
  }

  OnEdit(id:any){
    console.log(id);
    this.clearServerErrors();
    this.publicHolidayId = id;
    this.publicholidaysService.GetPublicholidyId(id).subscribe({
      next: (response:any) => {
        console.log(response);
        this.PublicHolidyFrom.controls['id'].setValue(response.id);
        this.PublicHolidyFrom.controls['name'].setValue(response.name);
        this.PublicHolidyFrom.controls['date'].setValue(response.date);

      },
     
      
    })
     
  }

  OnDelete(id:any){


    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.publicholidaysService.DeletePublicholidy(id).subscribe({
          next: () => {
            this.toastService.showToast('success', 'Done', 'Delete Public Holiday Successfully');
            this.publicholidaysService.GetAllPublicholidys().subscribe({
              next: (response) => {
                this.publicHolidays = response;

              },
              error: (err) => {
                console.log(err);
                this.toastService.showToast('error', 'Error', 'Delete Public Holiday Failed');
              },
            })
          },
        })
      }
    });
  }
  OnReset(source = '') {
       
      if (source === 'cancel' || source === '') {
        this.PublicHolidyFrom.controls['id'].setValue(0);
        this.PublicHolidyFrom.controls['name'].setValue('');
        this.PublicHolidyFrom.controls['date'].setValue('');
        this.publicHolidayId = 0;
      } else {
         
          this.clearServerErrors();
    
          console.log('Reset called from another source');
      }
     
  }

  minDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    let month = (today.getMonth() + 1).toString();
    let day = (today.getDate()+1).toString();
  
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