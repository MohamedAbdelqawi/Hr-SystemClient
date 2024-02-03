import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { PermissionsGurdService } from 'src/app/Services/permissions-gurd.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnDestroy {
  Submitted: boolean = false;
  FormLogin = new FormGroup({
    emailOrUserName: new FormControl('Admin@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('Admin@123', Validators.required),
  });
  private loginUserSubscription: Subscription | undefined;
  constructor(
    private AuthenticationService: AuthenticationService,
    private _router: Router,
    private permissionsService: PermissionsGurdService
  ) {}

  get FormControls() {
    return this.FormLogin.controls;
  }

  apiError: string = '';
  message: string = '';
  OnSubmit(e: Event) {
    e.preventDefault();
    this.Submitted = true;

    if (this.FormLogin.valid) {
      this.loginUserSubscription = this.AuthenticationService.login(this.FormLogin.value).subscribe({
        next: (response:any) => {
          console.log(response.isAuthenticated);
          // Check for authentication status in your response structure
          if (response) {

            const token = response.token;
            console.log(token);
            localStorage.setItem('jwt', token);
            
            if(this.permissionsService.isAuthenticated(token)){
              this._router.navigate(['/Dashboard']);
             }
             else {
              
              // Redirect to an error page or display a message indicating insufficient permissions.

            }
            // Check if the user has the necessary permissions to access the dashboard
             
          }

          // Handle the message or error from the response
          this.message = response.message;
        },
        error: (err:any) => {
          console.log(err.error.message);
          this.apiError = err.error.message;
        },
      });
    }
  }
  
  ngOnDestroy(): void {
    this.loginUserSubscription?.unsubscribe();
  }
}