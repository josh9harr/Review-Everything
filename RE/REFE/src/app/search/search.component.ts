import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  movies;
  movieSearch= new FormControl('');
  list;


  constructor(private moviesService: MoviesService) { }

  ngOnInit() {
  }

  getMovies() {
    this.movies = this.moviesService.getMovie(this.movieSearch.value).subscribe(data => {
       
     this.movies = data
     this.list = this.movies.results
     },
         err => console.error(err), 
         () => console.log(this.list) 
       );
   }

}
