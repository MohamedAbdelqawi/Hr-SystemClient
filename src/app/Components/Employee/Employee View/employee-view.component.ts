import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { EmployeeService } from 'src/app/Services/employee.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { ToastService } from 'src/app/Services/toast.service';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css']
})
export class EmployeeviewComponent {
  employees: any;
  dtoption: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private employeeService: EmployeeService,
    public dialog: MatDialog,
    private toastService: ToastService
    ) {}
  ngOnInit(): void {
    this.dtoption = {
      pagingType: 'full_numbers',
    };
    this.employeeService.GetAllEmployee().subscribe({
      next: (Response:any) => {
        
        this.employees = Response;
        this.dtTrigger.next(null);
      },
    });
  }

  deletemp(employeeId: number) {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.employeeService.DeleteEmployee(employeeId).subscribe({
          next: (res:any) => {
            console.log(res);
              this.toastService.showToast('warn', 'Delete', 'Delete Employee Successfully')
              this.employees = this.employees.filter(
                (emp: any) => emp.id != employeeId
              );
           
          },
          error: (error) => {
            console.error('Error:', error);
            this.toastService.showToast(
              'error', 'Error', 'Delete Employee failed'
            )
          }
        });
      }
    });
  }
  
}
