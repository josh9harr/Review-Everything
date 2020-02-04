import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { MoviesService } from '../movies.service';
import { Router } from "@angular/router";
import { FirebaseService } from 'src/app/firebase.service';
import { GENRES } from '../../assets/genre';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  filter;
  searchBy = 'title';

  constructor(private moviesService: MoviesService,
    private router: Router,
    private firebaseService: FirebaseService,
    private fb: FormBuilder,
  ) {
    this.filter = new FormGroup({
      searchBy: new FormControl('title')
    });
  }

  ngOnInit() {

  }

  searched(searchBy, title) {
    this.router.navigate([`display/${searchBy}/${title}`])
  }


}
