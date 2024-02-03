// toast.service.ts
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  showToast(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
    
  }
}
