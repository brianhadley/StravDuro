import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpInterceptService } from "./http-interceptor.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptService,
      multi: true
    }
  ]
})
export class CoreModule {}
