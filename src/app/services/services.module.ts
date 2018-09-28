import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './user/user.service';
import { DuroService } from './duro/duro.service';


@NgModule({
    declarations: [],
    imports: [ CommonModule ],
    exports: [],
    providers: [ UserService, DuroService ],
})
export class ServicesModule {
    constructor() {

    }
    
    
}