import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { RedirectComponent } from "./redirect/redirect.component";

@NgModule({
  declarations: [HomeComponent, LoginComponent, RedirectComponent],
  imports: [CommonModule],
  exports: [],
  providers: []
})
export class PagesModule {}
