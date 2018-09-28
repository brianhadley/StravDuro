import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../shared/auth/auth.service";
import { Router, RouterStateSnapshot } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  
  constructor() {
    
  }

  ngOnInit(): void {
    /*
    this.router.routerState.root.queryParamMap.subscribe(params=> {
      //unclear why this fires twice, code below keeps from updating with null        
      if (params.get('code'))
        this.authService.updateStravaToken(params.get('code'));

      this.router.navigateByUrl('/home');
    });
    */
  }
}
