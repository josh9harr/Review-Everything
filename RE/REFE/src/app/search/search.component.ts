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
  movies;
  movieSearch = new FormControl('');
  searchBy = new FormControl('title');
  list;
  selectedMovie;
  filter;
  imageBase = 'https://image.tmdb.org/t/p/';
  size = 'original';
  reviews;
  genres = GENRES;
  genreId;
  actorId;
  actorData;

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


  //gets api data from the service
  getMovies(searchBy) {
    // returns movies searched by title
    if(searchBy == 'title'){
        
      this.moviesService.getMovie(this.movieSearch.value).subscribe(data => {
        //puts api data set to movies then grabs just the movies array to put into this.list
        this.movies = data
        this.list = this.movies.results
      },
      err => console.error(err),
      );
      // returns movies searched by actor
    }else if(searchBy == 'actor'){
      // Calls API to search for the person ID
      this.moviesService.searchActor(this.movieSearch.value).subscribe(data => {
        // Sets the searched id to this.actorId
        this.actorData = data
        this.actorId = this.actorData.results[0].id

        // Discovers movies from the actor
        this.moviesService.getActor(this.actorId).subscribe(data => {
          //puts api data set to movies then grabs just the movies array to put into this.list
          console.log(this.actorId)
          console.log(data)
          this.movies = data
          this.list = this.movies.results
          console.log(this.list)
        },
        err => console.error(err),
        );
      })

      // returns movies searched by genre
    }else if(searchBy == 'genre'){

      // Loops through list of all genres to find the ID of the searched value
      this.genres.forEach(element => {

        if(element.name == this.movieSearch.value){
          this.genreId = element.id;
        }
      });

      this.moviesService.getGenres(this.genreId).subscribe(data => {
        //puts api data set to movies then grabs just the movies array to put into this.list
        this.movies = data
        this.list = this.movies.results
        console.log(this.list)
      },
      err => console.error(err),
      );
    }
  }

  //needed for selecting the movie and displaying the data
  select(movie): void {
    this.firebaseService.getReviews(movie.id).subscribe(data => {
      this.reviews = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        }
      })
      console.log(this.reviews);
    });
    this.selectedMovie = movie;
    this.loadReview(movie.id)
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
