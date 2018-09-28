import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../shared/auth/auth.service";
import { UserService } from "../../services/user/user.service";
import { Observable } from "rxjs";
import { User } from "../../services/user/user";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  stravaCode: string = "";
  user: Observable<User>

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    //this.stravaCode = this.authService.getStravaToken();
    //this.user = this.userService.getUserInfo();
  }
}
