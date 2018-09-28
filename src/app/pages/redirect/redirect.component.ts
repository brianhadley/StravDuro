import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'app-redirect',
    templateUrl: './redirect.component.html',
    styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {
    constructor(private router:Router, private userService: UserService) { }

    ngOnInit(): void {
        this.router.routerState.root.queryParamMap.subscribe(params=> {
            //unclear why this fires twice, code below keeps from updating with null        
            if (params.get('code'))
              this.userService.updateUserRecordWithStravaCode(params.get('code')).subscribe(()=>this.router.navigateByUrl('/home'));
      
            
          });
     }
}
