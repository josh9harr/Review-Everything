import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { MoviesService } from '../movies.service';
import { GENRES } from '../../assets/genre';
import { FirebaseService } from 'src/app/firebase.service';
import { Router } from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedin: boolean = false;
  popular;
  imageBase = 'https://image.tmdb.org/t/p/';
  size = 'original';
  genre;
  genres = GENRES;
  genreName;
  reviews;
  selectedMovie


  constructor(
    private fireAuth: AngularFireAuth,
    private movieService: MoviesService,
    private router: Router,
    private firebaseService: FirebaseService,

  ) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedin = true;
      }
    });
    this.showPopular();
    this.showGenre();
  }

  showPopular() {
    this.movieService.getPopular().subscribe(data => {
      this.popular = data;
      this.popular = this.popular.results;
      console.log(this.popular)
    })
  }

  showGenre() {

    let rand = Math.floor(Math.random() * this.genres.length)

    this.genreName = this.genres[rand].name;

    this.movieService.getGenres(this.genres[rand].id).subscribe(data => {
      this.genre = data;
      this.genre = this.genre.results;
      console.log(this.genre)
    })

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
