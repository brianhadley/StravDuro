import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../../services/results/results.service';
import { Subject } from 'rxjs';
import { MyDuros } from './myduro';

@Component({
    selector: 'app-myduros',
    templateUrl: './myduros.component.html',
    styleUrls: ['./myduros.component.scss']
})
export class MyDurosComponent implements OnInit {
    duroResults : Subject<MyDuros> = new Subject<MyDuros>();

    constructor(private resultsService: ResultsService) { }

    ngOnInit(): void { 
        this.resultsService.getUserSummary().subscribe(x=> {this.duroResults.next(new MyDuros(x));});
    }
}
