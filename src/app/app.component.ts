import { Component, OnInit } from '@angular/core';
import { ToastService } from './Services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hr System';

  
  constructor(private toastService: ToastService) {
    
  }
   
  showToastr(action: string, state: string): void {
    const message = `${action} Department ${state}`;
    const severity = state === 'done' ? 'success' : 'error';

    this.toastService.showToast(severity, 'Done', message);
  }
  
}
