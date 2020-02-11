import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { FirebaseService } from 'src/app/firebase.service'
import { AngularFireAuth } from "@angular/fire/auth";
import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userList;
  isLoading: boolean = false;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
  }

  getUsers() {
    this.firebaseService.getAllUsers()
      .then(
        data => this.userList = data
      )
    console.log(this.userList)
  }

  Delete() {
    this.isLoading = true;
  }

}


