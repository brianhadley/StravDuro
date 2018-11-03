import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as auth0 from "auth0-js";
import { environment } from "../../../environments/environment";
import { Observable, BehaviorSubject } from "rxjs";
import { UserService } from "../../services/user/user.service";

(window as any).global = window;

@Injectable()
export class AuthService {
  private stravaToken: string = "NONE";
  private _isAuthed$: BehaviorSubject<boolean>;

  //clientID: '3Nl1AM5wrYJBYNqk6rxKWS6OhOP4wXB8',

  auth0 = new auth0.WebAuth({
    clientID: "y7Ki2bqcQ7vmgmqqkqntmRlvQSLZksKZ",
    domain: environment.connectionStrings.authDomain,
    audience: environment.audience,
    responseType: "token id_token",
    redirectUri: environment.connectionStrings.redirectUrl,
    scope: "openid profile email"
  });

  constructor(public router: Router, private userService:UserService) {
    console.log(this.isAuthenticated());
    this._isAuthed$ = new BehaviorSubject<boolean>(this.isAuthenticated());
  }

  public login(): void {
    console.log("making request to authorize");
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = "";
        this.setSession(authResult);
        this._isAuthed$.next(true);
        this.router.navigate(["/home"]);
      } else {
        this._isAuthed$.next(false);
        this.router.navigate(["/home"]);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    console.log("retrieved auth result", authResult);
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this._isAuthed$.next(false);
    this.userService.signOut();
    this.auth0.logout({ returnTo: "http://localhost:4200/home" });
    // Go back to the home route
    this.router.navigate(["/"]);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem("expires_at") || "{}");
    var expired = new Date().getTime() < expiresAt;
    console.log("checking expiry", expired);

    return new Date().getTime() < expiresAt;
  }

  public isAuthenticated$(): Observable<boolean> {
    return this._isAuthed$.asObservable();
  }

  updateStravaToken(newToken: string) {
    this.stravaToken = newToken;
  }

  getStravaToken() {
    return this.stravaToken;
  }
}
