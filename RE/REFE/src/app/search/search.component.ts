import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MoviesService } from '../movies.service';
import { Router } from "@angular/router"
import { FirebaseService } from 'src/app/firebase.service'


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  movies;
  movieSearch = new FormControl('');
  list;
  selectedMovie;
  imageBase = 'https://image.tmdb.org/t/p/';
  size = 'original';

  constructor(private moviesService: MoviesService, private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit() {
  }

  //gets api data from the service
  getMovies() {
    this.movies = this.moviesService.getMovie(this.movieSearch.value).subscribe(data => {
      //puts api data set to movies then grabs just the movies array to put into this.list
      this.movies = data
      this.list = this.movies.results
    },
      err => console.error(err),
      () => console.log(this.list)
    );
  }

  //needed for selecting the movie and displaying the data
  select(movie): void {
    this.selectedMovie = movie;
  }

  loadReview(id: string) {
    const mediaExists = this.firebaseService.checkMedia(id);
    if (mediaExists) {
      this.router.navigate(['/reviews/', id])
    } else {
      let media = {
        name: this.selectedMovie.title
      };
      this.firebaseService.createMedia(media, this.selectedMovie.id).then(_ => {
        this.router.navigate(['/reviews/', id])
      });
      
    }
  }

}
