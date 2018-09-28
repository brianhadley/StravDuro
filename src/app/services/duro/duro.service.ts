import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class DuroService {
  constructor(private httpClient: HttpClient) {}

  getDuros(): Observable<any> {
    return this.httpClient.get("/api/duro");
  }
}
