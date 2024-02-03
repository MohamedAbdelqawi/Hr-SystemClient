import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RolesManagementService } from 'src/app/Services/roles-management.service';
import { DialogComponent } from '../dialog/dialog.component';
import { ToastService } from 'src/app/Services/toast.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {
  modules = [
    "Employee",
    "Department",
    "Attendance",
    "Salary",
    "GeneralSetting",
    "Permission",
  ];
  serverErrors: string[] = [];
  flag:boolean=true;
  roleClaims: any[] = [];
  roles: any[] = [];
  roleId: string = '';
  updatedRoleClaims: { displayValue: string; isSelected: boolean }[] = [];
  FormRole = new FormGroup({
    roleName: new FormControl('', [Validators.required]),
    roleClaims: new FormControl([{}], [Validators.required]),
  })

  constructor(private rolesService: RolesManagementService, private elementRef: ElementRef,
    public dialog: MatDialog,
    private toastService :ToastService
    ) { }
  ngOnInit(): void {

    this.rolesService.GetDataToCreate().subscribe((response: any) => {
      this.roleClaims = response.roleClaims;
      this.updatedRoleClaims = JSON.parse(JSON.stringify(this.roleClaims));
      this.populateTable();
    });
    this.rolesService.GetAllRoles().subscribe((response: any) => {

      this.roles = response;

    })
    this.flag=false;
  }
  propertiesToPush: string[] = ['RoleClaims', 'RoleName'];

  OnSubmit(e: Event) {
    e.preventDefault();
  
    if (this.roleId !== '') {
      console.log(this.roleId);
      console.log(this.FormRole.value);
  
      this.rolesService.EditRole(this.FormRole.value, this.roleId).subscribe({
        next: () => {

          this.toastService.showToast('success', 'Done', 'Edit Role successfully');
          this.rolesService.GetDataToCreate().subscribe((response: any) => {
            this.roleClaims = response.roleClaims;
            this.rolesService.GetAllRoles().subscribe((response: any) => {
              this.roles = response;
              this.clearServerErrors();
            });
          });
        },
        error: (error: any) => {
          console.log(error);
          console.log(error.error);
  
          this.clearServerErrors();
  
          for (const key of this.propertiesToPush) {
            if (error.error[key] && Array.isArray(error.error[key])) {
              this.serverErrors.push(...error.error[key]);
              console.log(this.serverErrors);
            }
          }
  
          console.log(this.serverErrors);
          this.toastService.showToast('error', 'Error', 'Edit Role Failed');
        }
      });
    } else {
      console.log(this.FormRole.value);
  
      this.rolesService.AddRole(this.FormRole.value).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Done', 'Add Role successfully');
          this.rolesService.GetDataToCreate().subscribe((response: any) => {
            this.roleClaims = response.roleClaims;
            this.rolesService.GetAllRoles().subscribe((response: any) => {
              this.roles = response;
              this.clearServerErrors();
            });
  
            this.FormRole.reset();
            this.Reset();
            this.flag = false;
          });
        },
        error: (error: any) => {
          console.log(error);
  
          // this.clearServerErrors();
          for (const key of this.propertiesToPush) {
            if (error.error[key] && Array.isArray(error.error[key])) {
              this.serverErrors.push(...error.error[key]);
            }
          }
  
          console.log(this.serverErrors);
          this.toastService.showToast('error', 'Error', 'Add Role Failed');
        }
      });
      this.clearServerErrors();

    }
  }
  
  OnEdit(id: any) {
    this.rolesService.GetRoleById(id).subscribe((response: any) => {
      this.roleId = id;
      this.FormRole.controls['roleName'].setValue(response.roleName);
      this.FormRole.controls['roleClaims'].setValue(response.roleClaims);
      this.roleClaims =response.roleClaims
      this.updatedRoleClaims = JSON.parse(JSON.stringify(this.roleClaims));
      this.populateTable();
      this.Reset();
      this.flag=true;
    });
  }

  OnDelete(id: any) {


    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.rolesService.DeleteRole(id).subscribe({
          next:()=>{
            this.toastService.showToast('warn', 'Done', 'Delete Role successfully');
            this.rolesService.GetDataToCreate().subscribe((response: any) => {
              this.roleClaims = response.roleClaims;
              this.rolesService.GetAllRoles().subscribe((response: any) => {
                this.roles = response;
              })
              this.Reset();
              this.OnCancel();
              this.flag=false;
            });
          },
        error:(error)=>{
          console.log(error);
          this.toastService.showToast('error', 'Error', 'Delete Role Failed');
        }  
        })
      }
    });
  }

  populateTable() {

    const table = this.elementRef.nativeElement.querySelector('#dt-filter-select');

    this.modules.forEach(module => {
      const row = table.insertRow();

      const cell1 = row.insertCell();
      cell1.textContent = module;

      this.roleClaims.forEach(claim => {
        if (
          claim.displayValue === `Permission.${module}.Create` ||
          claim.displayValue === `Permission.${module}.View` ||
          claim.displayValue === `Permission.${module}.Edit` ||
          claim.displayValue === `Permission.${module}.Delete`
        ) {
          const cell = row.insertCell();
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'custom-control-input';
          checkbox.checked = claim.isSeleced;
          cell.appendChild(checkbox);

          // Add event listener to track changes in the checkboxes
          checkbox.addEventListener('change', () => {
            // Update the updatedRoleClaims array to reflect the change
            this.updatedRoleClaims = this.updatedRoleClaims.map(updatedClaim => {
              if (updatedClaim.displayValue === claim.displayValue) {
                return {
                  ...updatedClaim,
                  isSeleced: checkbox.checked,
                };
              }
              return updatedClaim;

            });
            this.FormRole.controls['roleClaims'].setValue(this.updatedRoleClaims);
          });
        
        }
        
          
      });
    });
    console.log(this.updatedRoleClaims);
  }
  get ControlName() {
    return this.FormRole.controls
  }

  Reset() {
    const table = this.elementRef.nativeElement.querySelector('#dt-filter-select');
  
    // Start the loop from index 1 to skip the first row
    for (let i = table.rows.length - 1; i > 0; i--) {
      table.deleteRow(i);
    }
    console.log('............');
    // Populate the table after deleting rows
    this.populateTable();
  }
  
  OnCancel(){
    this.roleId = '';
    this.FormRole.reset();
    this.rolesService.GetDataToCreate().subscribe((response: any) => {
      this.roleClaims = response.roleClaims;
      this.updatedRoleClaims = JSON.parse(JSON.stringify(this.roleClaims));
      this.Reset();
      this.flag=false;
      this.clearServerErrors();

    })
  }
  clearServerErrors() {
    this.serverErrors = [];
  }
}
