import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppHeaderComponent } from './header/app-header.component';
import { MatToolbarModule, MatIconModule, MatButtonModule, MatDialogModule, MatInputModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogininfoComponent } from './login/logininfo/logininfo.component';


@NgModule({
    declarations: [ AppHeaderComponent, LoginComponent, LogininfoComponent ],
    imports: [ CommonModule, MatToolbarModule, MatIconModule, RouterModule, MatButtonModule, MatDialogModule, MatInputModule, FormsModule ],
    exports: [ AppHeaderComponent ],
    providers: [],
    entryComponents: [LogininfoComponent]
})
export class UiModule {}