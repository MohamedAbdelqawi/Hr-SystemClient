import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { jwtDecode } from 'jwt-decode';
import { filter } from 'rxjs/operators';
import { Subscription, interval } from 'rxjs';
import { format } from 'date-fns';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  flag: boolean = false;
  flag2: boolean = true;
  public routeName = '';
  userName: any;
  currentDateTime: string='';
  private subscription!: Subscription;
  ToggleSidebar() {
    this.flag = !this.flag;
  }

  constructor(
    private router: Router,
    private authenitivation: AuthenticationService,
    public activatedRoute: ActivatedRoute
  ) {}

  name: string | undefined;

  ngOnInit(): void {
    this.updateDateTime();
    this.subscription = interval(1000).subscribe(() => {
      this.updateDateTime();
    });
    (document.body.style as any).zoom = '90%';
    const completeUrl = window.location.href;
    console.log(completeUrl);

    // Check the initial URL and update flag2
    this.handleUrlChange(completeUrl);

    let token: string = localStorage.getItem('jwt') ?? '';
    let decodedToken: any = jwtDecode(token);
    console.log(decodedToken);
    for (let key in decodedToken) {
      if (
        key.includes(
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        )
      ) {
        this.name =
          decodedToken[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
          ];
        break;
      }
    }

    console.log(this.name);

    // Subscribe to the router events to detect changes in the URL
    this.router.events
    .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.handleUrlChange(event.url);
    });
  
  }

  handleUrlChange(url: string) {
    // Update flag2 based on the URL
    this.flag2 = url.includes('/Dashboard') && !url.includes('/', url.indexOf('/Dashboard') + 1);
  }
  private updateDateTime(): void {
    const now = new Date();
    this.currentDateTime = format(now, 'MMM dd, yyyy  HH:mm:ss');
  }

  Logout() {
    this.authenitivation.logout();
  }
}