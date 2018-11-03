import { Component } from "@angular/core";
import { AuthService } from "./shared/auth/auth.service";
import { Observable, EMPTY } from "rxjs";
import { DuroService } from "./services/duro/duro.service";
import { UserService } from "./services/user/user.service";
import { switchMap } from "rxjs/operators";
import { User } from "./services/user/user";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  loggedIn$: Observable<boolean>;
  loggedIn: boolean;
  testDuro: any;
  currentUser: User;

  constructor(
    private authService: AuthService,
    private duroService: DuroService,
    private userService: UserService
  ) {
    if (!authService.isAuthenticated()) {
      authService.handleAuthentication();
    }
  }

  ngOnInit(): void {
    this.loggedIn$ = this.authService.isAuthenticated$();

    //this.fetchUser$ = this.userService
    this.loggedIn$
      .pipe(
        switchMap(result => {
          this.loggedIn = result;          
          return result ? this.userService.getSignedInUser() : EMPTY;
        })
      )
      .subscribe(result => this.currentUser = result);
  }
  
}
