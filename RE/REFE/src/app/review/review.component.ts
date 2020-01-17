import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MoviesService } from '../movies.service';
import { combineLatest, Observable } from 'rxjs';
import {AngularFireDatabase} from '@angular/fire/database'

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})

export class ReviewComponent implements OnInit {
  rating = new FormControl('');
  review = new FormControl('');
  itemValue = '';
  items: Observable<any[]>;



  constructor( public db: AngularFireDatabase) {
    this.items = db.list('reviews').valueChanges();
   }


 
  //  onSubmit() {
  //    this.db.list('reviews').push({ content: this.itemValue});
  //    this.itemValue = '';
  //  }

  ngOnInit() {
  }

}
