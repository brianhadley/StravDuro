import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface Logininfo {
  FirstName: string,
  LastName: string
}

@Component({
  selector: 'app-logininfo',
  templateUrl: './logininfo.component.html',
  styleUrls: ['./logininfo.component.css']
})


export class LogininfoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LogininfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Logininfo) {}
  

  ngOnInit() {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close(this.data);
  }

}
