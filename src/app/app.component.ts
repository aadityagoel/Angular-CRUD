import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CRUD Operation using Material UI';

  //table 
  displayedColumns: string[] = ['id','fullName', 'gender', 'age', 'dob', 'roles', 'status', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api : ApiService, private toast: NgToastService){

  }
  ngOnInit(): void {
    this.getAllUsers();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width: "30%"
    }).afterClosed().subscribe(val=>{
      if(val ==='save'){
        this.getAllUsers();
      }
    })
  }

  getAllUsers(){
    this.api.getUser()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        this.toast.error({
          detail:"Error Message",
          summary: "Error while fetching tha Records!!!",
          duration: 5000
        });
      }
    })
  }
  editUser(row: any){
    this.dialog.open(DialogComponent,{
      width: "30%",
      data: row
    }).afterClosed().subscribe(val=>{
      if(val ==='update'){
        this.getAllUsers();
      }
    })
  }
  deleteUser(id: number){
    this.api.deleteUser(id)
    .subscribe({
      next:(res)=>{
        // alert("User Deleted successfully");
        this.toast.success({
          detail:"Success Message",
          summary: "User Deleted successfully",
          duration: 5000
        });
        this.getAllUsers();
      },
      error:()=>{
        // alert("Error while deleting the user!!!");
        this.toast.error({
          detail:"Error Message",
          summary: "Error while deleting the user!!!",
          duration: 5000
        });
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
