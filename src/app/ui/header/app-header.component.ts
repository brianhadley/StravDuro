import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../shared/auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { User } from '../../services/user/user';

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
    loggedIn$: Observable<boolean>;    
    loggedIn: boolean;
    currentUser: User;


    constructor(private userService: UserService, private cdRef:ChangeDetectorRef, authService: AuthService) { 
        this.loggedIn = false;
        this.loggedIn$ = authService.isAuthenticated$();
    }

    ngOnInit(): void {
      this.loggedIn$
      .pipe(
        switchMap(result => {                    
          return result ? this.userService.getSignedInUser() : EMPTY;
        })
      )
      .subscribe(result => {{this.currentUser = result; this.loggedIn = true; this.cdRef.detectChanges(); console.log('received current user', this.currentUser);}});
     }
}
