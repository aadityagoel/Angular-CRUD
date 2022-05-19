import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  genderList = ["Male", "Female", "Others"];
  statusList = ["Active", "Inactive"];

  userForm !: FormGroup;
  actionBtn : string = "Save";

  constructor(private formbuilder: FormBuilder, 
    private api: ApiService, 
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private toast: NgToastService,
    private dialogref: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.userForm = this.formbuilder.group({
      fullName : ['', Validators.required],
      roles : ['', Validators.required],
      dob : ['', Validators.required],
      gender : ['', Validators.required],
      age : ['', Validators.required],
      status : ['', Validators.required]
    });

    if(this.editData){
      this.actionBtn = "Update";
      this.userForm.controls['fullName'].setValue(this.editData.fullName);
      this.userForm.controls['roles'].setValue(this.editData.roles);
      this.userForm.controls['dob'].setValue(this.editData.dob);
      this.userForm.controls['gender'].setValue(this.editData.gender);
      this.userForm.controls['age'].setValue(this.editData.age);
      this.userForm.controls['status'].setValue(this.editData.status);
    }
  }

  submitForm(){
    if(this.userForm.valid){
      if(!this.editData){
        this.addUser();
      }
      else{
        this.updateUser();
      }
    }
  }
  addUser(){
    this.api.postUser(this.userForm.value)
    .subscribe({
      next:(res)=>{
        // alert("User added successfully");
        this.toast.success({
          detail:"Success Message",
          summary: "User added successfully",
          duration: 5000
        });
        this.userForm.reset();
        this.dialogref.close("save");
      },
      error:()=>{
        // alert("Error while adding the user");
        this.toast.error({
          detail:"Error Message",
          summary: "Error while adding the user!!!",
          duration: 5000
        });
      }
    })
  }
  updateUser(){
    this.api.putUser(this.userForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        // alert("User updated successfully");
        this.toast.success({
          detail:"Success Message",
          summary: "User updated successfully",
          duration: 5000
        });
        this.userForm.reset();
        this.dialogref.close("update");
      },
      error:()=>{
        // alert("Error while updating the user");
        this.toast.error({
          detail:"Error Message",
          summary: "Error while updating the user!!!",
          duration: 5000
        });
      }
    })
  }

}
