import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { UserDuroResults } from "./user-duro-results";
import { Observable, EMPTY, from, forkJoin, of, BehaviorSubject } from "rxjs";
import { UserService } from "../user/user.service";
import { mergeMap, map, concatMap } from "rxjs/operators";
import { Duro } from "../duro/duro";

@Injectable()
export class ResultsService {
  private summaryEndpoint =
    environment.audience + environment.endpoints.userDuroSummary;

  private result$:BehaviorSubject<UserDuroResults[]>;
  private results: UserDuroResults[] = [];

  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {
    
    this.result$ = new BehaviorSubject<UserDuroResults[]>(this.results);

    //should be able to make an update here so we are subscribed to the user.duros and if one is added we automatically call for its results
    //would need to reset results array
    this.userService
      .getSignedInUser()
      .pipe(
        concatMap(user => from(user.duros)),
        concatMap(duro => {                    
          return this.httpClient.get(this.summaryEndpoint + duro);
        })
      ).subscribe(result=>{this.results.push(result as UserDuroResults); this.result$.next(this.results);});
  }

  getUserSummary(): Observable<any> {
    return this.result$.asObservable();    
  }
}
