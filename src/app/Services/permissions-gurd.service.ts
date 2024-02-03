import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { ToastService } from './toast.service';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class PermissionsGurdService implements CanActivate {

  constructor(private jwtHelper: JwtHelperService, private router: Router,
    private toastService:ToastService,
    private http: HttpClient,private authService: AuthenticationService
    ) { }

  Permissions: string[] = [];

  isAuthenticated(token: string): boolean {
    if (token && token !== "null" && token.length != 0 && !this.jwtHelper.isTokenExpired(token)) {

      return true;
    }

    return false;
  }

  // checkTokenVersion(token: string){
  //   const decodedToken = this.jwtHelper.decodeToken(token);
  //   console.log(decodedToken);
  
    
  //   const tokenVersion = localStorage.getItem("tokenVersion") ?? "";
  //   console.log(tokenVersion);
    
  //   const currentTokenVersion = decodedToken['token_version'];

  //   console.log(currentTokenVersion);
  //    const versionFromServer = tokenVersion
  //       console.log(versionFromServer);
  //       if (currentTokenVersion === versionFromServer) {
  //        return true
  //       } else {
  //         return false
  //       }
  //   }
        

  
  hasRole(token: string, allowedRoles: string[]) {
    const decodedToken = this.jwtHelper.decodeToken(token);

    if (allowedRoles === undefined)
      return true;
      console.log(allowedRoles);
    for (let key in decodedToken) {
      if (key.includes("role")) {
        console.log(allowedRoles.some(role => decodedToken[key].includes(role)));
        return allowedRoles.some(role => decodedToken[key].includes(role));
      }
    }
    return false;
  }

  // hasPermission(token: string, allowedPermissions: string[]) {
  //   const decodedToken = this.jwtHelper.decodeToken(token);
  //   console.log(decodedToken);
  //   console.log(allowedPermissions);
  //   if (allowedPermissions === undefined)
  //     return true;

  //   for (let key in decodedToken) {
  //     if (key.includes("Permission")) {
  //       const hasPermission = allowedPermissions.some(permission => decodedToken[key].includes(permission));
  //       console.log('Permission Check Result:', hasPermission);
  //       return hasPermission;
  //     }
  //   }
  //   return false;
  // }

  // hasAllPermissions(requiredPermissions: string[]): boolean {
  //   console.log(requiredPermissions);
  //   console.log(this.Permissions);
  //   return requiredPermissions.every(permission => this.Permissions.includes(permission));
  // }

  hasPermission(token: string, allowedPermissions: string[]) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    console.log(decodedToken);
    console.log(allowedPermissions);
    if (allowedPermissions === undefined)
      return true;

    for (let key in decodedToken) {
      if (key.includes("Permission")) {
        const hasPermission = allowedPermissions.some(permission => decodedToken[key].includes(permission));
        console.log('Permission Check Result:', hasPermission);
        return hasPermission;
      }
    }
    return false;
  }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
  //   const requiredPermissions = route.data['requiredPermissions'];
 
  //   const token = localStorage.getItem("jwt") ?? "";
  //   if (!this.isAuthenticated(token)) {
  //      this.router.navigate(['SignIn']);
  //   }

  //   if (requiredPermissions && this.hasPermission( token,requiredPermissions)){
  //     console.log('Access Granted');
  //     console.log(this.hasPermission( token,requiredPermissions))
  //     return true;
  //   }

  //   this.router.navigate(['/Dashboard/AccessDenied']);
  //   return false;
    
  // }
 

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
    
      const roles = route.data['allowedRoles'];
       console.log(route.data['allowedRoles']);
       console.log(route.data['allowedPermissions']);
      const token = localStorage.getItem("jwt") ?? "";

      // if(!checkTokenVersion(token)){
      //     return this.router.navigate(['SignIn']);
      // }
      if(!this.isAuthenticated(token)){
          return this.router.navigate(['SignIn']);
      }
      if(this.hasRole(token, roles) || this.hasPermission(token, route.data['allowedPermissions'])){
          console.log('Access Granted');
          return true;
      }
       // Access Denied
       this.toastService.showToast('error', 'Access Denied', "You don't have permission");
       return false
  }

  // checkPermission(permission: string[], observable: Observable<any>): Observable<any> {
  //   console.log(`Checking permission: ${permission}`);
  //   const token = localStorage.getItem("jwt") || "";

  //   console.log('Token:', token);
  //   console.log('Permission:', permission);

  //   if (this.hasPermission(token, permission)) {
  //     console.log('Access Granted');
  //     return observable;
  //   } else {
  //     this.router.navigate(['/Dashboard/AccessDenied']);
  //     return new Observable((observer) => {
  //       observer.error('Access Denied');
  //       observer.complete();
  //     });
  //   }
  // }
 

}
export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> => {

  return inject(PermissionsGurdService).canActivate(route, state);

}

// ------------------------- Another Solution ------------------------------------

// import { Injectable, inject } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })

// export class PermissionsGurdService implements CanActivate{

//   constructor(private jwtHelper: JwtHelperService, private router: Router) { }

//   Permissions: string[] = [];

//   isAuthenticated(token: string):boolean{
//       if(token && token !== "null" && token.length != 0 && !this.jwtHelper.isTokenExpired(token)){
         
//           return true;
//       }

//       return false;
//   }

//   hasRole(token: string, allowedRoles: string[]){
//       const decodedToken = this.jwtHelper.decodeToken(token);
     
//       if(allowedRoles === undefined)
//         return true;

//       for(let key in decodedToken){
//           if(key.includes("role")){
//               return allowedRoles.some(role => decodedToken[key].includes(role));
//           }
//       }
//       return false;
//   }

//   hasPermission(token: string, allowedPermissions: string[]){
//     const decodedToken = this.jwtHelper.decodeToken(token);
//     console.log(decodedToken);
//     console.log(allowedPermissions);
//     if(allowedPermissions === undefined)
//       return true;

//     for(let key in decodedToken){
//       if(key.includes("Permission")){
//         const hasPermission = allowedPermissions.some(permission => decodedToken[key].includes(permission));
//         console.log('Permission Check Result:', hasPermission);
//         return hasPermission;
//       }
//     }
//     return false;
//   }
//   RequiredPermission(requiredServicePermission: string){
//     this.Permissions = requiredServicePermission.split(",");
//     console.log(this.Permissions);
//     this.canActivate();
//   }
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
//       const roles = route.data['allowedRoles'];
       
//    // Permissions = route.data['allowedPermissions'];
//        console.log(this.Permissions);
       
//       const token = localStorage.getItem("jwt") ?? "";
//       if(!this.isAuthenticated(token)){
//           return this.router.navigate(['SignIn']);
//       }
//       if(this.hasRole(token, roles) || this.hasPermission(token, this.Permissions)){
//           return true;
//       }

//     // Access Denied
//       return this.router.navigate(['/Dashboard/AccessDenied']);
//   }

//   checkPermission(permission: string[], observable: Observable<any>): Observable<any> {
//     console.log(`Checking permission: ${permission}`);
//     const token = localStorage.getItem("jwt") || "";
  
//     console.log('Token:', token);
//     console.log('Permission:', permission);

//     if (this.hasPermission(token, permission)) {
//       console.log('Access Granted');
//       return observable;
//     } else {
//         this.router.navigate(['/Dashboard/AccessDenied']);
//       return new Observable((observer) => {
//         observer.error('Access Denied');
//         observer.complete();
//       });
//     }
//   }
  

// }
// export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> => {
  
//   return inject(PermissionsGurdService).canActivate(route, state);

// }