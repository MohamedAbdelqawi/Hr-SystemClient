import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SalaryReportService } from 'src/app/Services/salary-report.service';

@Component({
  selector: 'app-salary-reports',
  templateUrl: './salary-reports.component.html',
  styleUrls: ['./salary-reports.component.css'],
})
export class SalaryReportsComponent implements OnInit {
  Reports: any;
  dtoption: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  CurrentDate: Date = new Date();
  currentMonth=this.CurrentDate.getMonth()+1
  
  constructor(private SalaryService: SalaryReportService) {}
  ngOnInit(): void {
    this.dtoption = {
      pagingType: 'full_numbers',
    };
    this.SalaryService.GetAllSalaryReport().subscribe({
      next: (Response) => {
        console.log(Response);
        this.Reports = Response;
        this.dtTrigger.next(null);
      },
    });
  }

  filtrationForm = new FormGroup({
    month: new FormControl(this.currentMonth),
    year: new FormControl(this.CurrentDate.getFullYear(), [
      Validators.pattern('[1-9]{1}[0-9]{3}'),
    ]),
  });

  
  get ControlsName() {
    return this.filtrationForm.controls;
  }

  OnSubmit() {
    if (this.filtrationForm && this.filtrationForm.valid) {
      const formData = {
        month: this.filtrationForm.value.month?.toString(),
        year: this.filtrationForm.value.year?.toString(), // Convert to string
      };
  console.log(formData)
      this.SalaryService.FilterSalaryReport(formData).subscribe({
        next: (response) => {
          this.Reports = response; 
          console.log(response);
        },
        error: (error) => {
          console.error('Error:', error);
          // Handle the error (e.g., show a message to the user)
        },
      });
    }
  }
  
  


  
}