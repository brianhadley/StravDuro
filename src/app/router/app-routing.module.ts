import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { CanActivateGuardService } from '../shared/auth/can-activate-guard.service';

import { RedirectComponent } from '../pages/redirect/redirect.component';
import { ResultsComponent } from '../pages/results/results.component';
import { AboutComponent } from '../pages/about/about.component';
import { SearchComponent } from '../pages/search/search.component';
import { MyDurosComponent } from '../pages/myduros/myduros.component';

const routes: Routes = [    
    { path: 'home', 
      component: HomeComponent      
    },
    { path: 'redirect', 
      component: RedirectComponent
    },
    { path: 'results', component: ResultsComponent},
    { path: 'about', component: AboutComponent},
    { path: 'search', component: SearchComponent},
    { path: 'myduros', component: MyDurosComponent},
    { path: '', 
      component: HomeComponent,  pathMatch: 'full'      
    }
    //{ path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
