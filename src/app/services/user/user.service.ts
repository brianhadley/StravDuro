import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "./user";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class UserService {
  private cachedUser: User;

  constructor(private httpClient: HttpClient) {}


  signOut() {
    this.cachedUser = undefined;
  }

  getSignedInUser(): Observable<User> {
    if (this.cachedUser) 
      return of(this.cachedUser);

    return this.httpClient.get("/api/user").pipe(
      map(result => {        
        if (result) {
          this.cachedUser = result as User;
          return result as User;
        }
        else  
          return new User();        
      })
    );
  }

  saveUserRecord(user: User): Observable<User> {
    this.cachedUser = user;
    return this.httpClient.post("/api/user", user).pipe(
      map(result => {
        console.log('posted user',result);
        return result as User;
      })
    );
  }

  updateUserRecordWithStravaCode(code: string): Observable<boolean> {    
    console.log('received request to update strava code: ', code);
    return this.httpClient.put("/api/user", {code: code}).pipe(
        map(result => {
          return result as boolean;
        })
      );
  }
}
