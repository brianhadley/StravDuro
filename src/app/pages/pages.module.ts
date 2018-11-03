import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { RedirectComponent } from "./redirect/redirect.component";
import { MatCardModule, MatIconModule } from "@angular/material";
import { SearchComponent } from "./search/search.component";
import { ResultsComponent } from "./results/results.component";
import { AboutComponent } from "./about/about.component";
import { MyDurosComponent } from "./myduros/myduros.component";

@NgModule({
  declarations: [
    HomeComponent,
    RedirectComponent,
    SearchComponent,
    ResultsComponent,
    AboutComponent,
    MyDurosComponent
  ],
  imports: [CommonModule, MatCardModule, MatIconModule],
  exports: [MyDurosComponent],
  providers: []
})
export class PagesModule {}
