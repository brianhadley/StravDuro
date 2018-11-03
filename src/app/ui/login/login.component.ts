import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { Observable, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../../services/user/user';
import { Logininfo, LogininfoComponent } from './logininfo/logininfo.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loggedIn$: Observable<boolean>;
  loggedIn: boolean;
  testDuro: any;
  currentUser: User;

  constructor(private authService:AuthService, private userService:UserService, public dialog: MatDialog) { }

  ngOnInit() {
    this.loggedIn$ = this.authService.isAuthenticated$();

    //this.fetchUser$ = this.userService
    this.loggedIn$
      .pipe(
        switchMap(result => {
          this.loggedIn = result;          
          return result ? this.userService.getSignedInUser() : EMPTY;
        }),
        switchMap((result) => {
          this.currentUser = result;          
          if (!this.currentUser._id) {
            return this.openDialog();
          }
          return EMPTY;
        }),
        switchMap((result) => {
          this.currentUser.firstName = result.FirstName;
          this.currentUser.lastName = result.LastName;
          console.log('sending this to saveroo', this.currentUser); 
          return this.userService.saveUserRecord(this.currentUser);
        })
      )
      .subscribe(result => 
        {
          window.location.href = 'https://www.strava.com/oauth/authorize?client_id=17465&redirect_uri=http://localhost:4200/redirect&response_type=code&scope=public';
        }
      );
  }


  openDialog() : Observable<Logininfo> {
    const dialogRef = this.dialog.open(LogininfoComponent, {
      width: '400px',
      data: {FirstName: '', LastName: ''}      
    });

    return dialogRef.afterClosed();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  submitUserInfo() {
    this.userService.saveUserRecord(this.currentUser).subscribe(()=>{window.location.href = 'https://www.strava.com/oauth/authorize?client_id=17465&redirect_uri=http://localhost:4200/redirect&response_type=code&scope=public'});
  }
}
