import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanActivateGuardService } from './auth/can-activate-guard.service';
import { AuthService } from './auth/auth.service';


@NgModule({
    declarations: [ ],
    imports: [ CommonModule ],
    exports: [ ],
    providers: [ CanActivateGuardService, AuthService  ],
})

export class SharedModule {}