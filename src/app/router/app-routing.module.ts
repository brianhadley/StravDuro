import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { CanActivateGuardService } from '../shared/auth/can-activate-guard.service';
import { LoginComponent } from '../pages/login/login.component';
import { RedirectComponent } from '../pages/redirect/redirect.component';

const routes: Routes = [
    { path: '', 
      component: HomeComponent      
    },
    { path: 'home', 
      component: HomeComponent      
    },
    { path: 'redirect', 
      component: RedirectComponent
    },
    { path: 'login', component: LoginComponent },
    //{ path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
