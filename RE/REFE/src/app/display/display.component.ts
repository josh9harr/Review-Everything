import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { MoviesService } from '../movies.service';
import { Router } from "@angular/router";
import { FirebaseService } from 'src/app/firebase.service';
import { GENRES } from '../../assets/genre';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/auth";


@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {
  movies;
  list = [];
  selectedMovie;
  filter;
  reviews;
  genreId;
  actorId;
  actorData;
  searchResult = this.route.snapshot.params.searched;
  searchBy = new FormControl('title');
  imageBase = 'https://image.tmdb.org/t/p/';
  size = 'original';
  genres = GENRES;
  pageNum = 1;
  searchID;
  canLoadMore: boolean = true;
  loggedin: boolean = false;
  constructor(private moviesService: MoviesService,
    private router: Router,
    private firebaseService: FirebaseService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private fireAuth: AngularFireAuth
  ) {
    this.filter = new FormGroup({
      searchBy: new FormControl('title')
    });
  }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedin = true;
      }
    });
    this.getMovies(this.route.snapshot.params.filter, this.route.snapshot.params.searched)
    this.searchBy = new FormControl(this.route.snapshot.params.filter)
  }
  //gets api data from the service
  getMovies(searchBy: string, title: string) {
    // returns movies searched by title
    if (searchBy == 'title') {

      this.moviesService.getMovie(title).subscribe(data => {
        //puts api data set to movies then grabs just the movies array to put into this.list
        this.movies = data
        this.list = this.movies.results;
        if (this.movies.total_pages == this.pageNum) {
          this.canLoadMore = false;
        }
        this.pageNum++;
      },
        err => console.error(err),
      );
      this.searchID = title;
      // returns movies searched by actor
    } else if (searchBy == 'actor') {
      this.searchID = title;
      // Calls API to search for the person ID
      this.moviesService.searchActor(title).subscribe(data => {
        // Sets the searched id to this.actorId
        this.actorData = data
        this.actorId = this.actorData.results[0].id
        // Discovers movies from the actor
        this.moviesService.getActor(this.actorId).subscribe(data => {
          //puts api data set to movies then grabs just the movies array to put into this.list
          console.log(this.actorId)
          console.log(data)
          this.movies = data
          if (this.movies.total_pages == this.pageNum) {
            this.canLoadMore = false;
          }
          this.pageNum++;
          this.list = this.movies.results
          console.log(this.list)
        },
          err => console.error(err),
        );
      })

      // returns movies searched by genre
    } else if (searchBy == 'genre') {
      // Loops through list of all genres to find the ID of the searched value
      this.genres.forEach(element => {
        const genreName = title.charAt(0).toUpperCase() + title.substring(1);
        if (element.name == genreName) {
          this.genreId = element.id;
          this.searchID = this.genreId;
        }
      });

      this.moviesService.getGenres(this.genreId).subscribe(data => {
        //puts api data set to movies then grabs just the movies array to put into this.list
        this.movies = data
        if (this.movies.total_pages == this.pageNum) {
          this.canLoadMore = false;
        }
        this.pageNum++;
        console.log(data)
        this.list = this.movies.results
        console.log(this.list)
      },
        err => console.error(err),
      );
    }

  }

  checkError() {
    if (this.list = []) {
      console.log('not coming ')

    } else {
      console.log('it should be there')
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
      // console.log(this.reviews);
    });
    this.selectedMovie = movie;
    this.loadReview(movie.id)
  }

  loadMore() {
    switch (this.searchBy.value) {
      case "title":
        this.moviesService.getMoreMovies(this.searchID, this.pageNum).subscribe(data => {
          this.movies = data;
          this.movies.results.forEach(movie => {
            this.list.push(movie);
          });
          if (this.movies.total_pages == this.pageNum) {
            this.canLoadMore = false;
          }
          this.pageNum++;
        });
        break;
      case "genre":
        this.moviesService.getMoreGenres(this.searchID, this.pageNum).subscribe(data => {
          this.movies = data;
          this.movies.results.forEach(movie => {
            this.list.push(movie)
          });
          if (this.movies.total_pages == this.pageNum) {
            this.canLoadMore = false;
          }
          this.pageNum++;
        });
        break;
      case "actor":
        this.moviesService.searchActor(this.searchID).subscribe(data => {
          this.actorData = data
          this.actorId = this.actorData.results[0].id

          this.moviesService.getMoreActorMovies(this.actorId, this.pageNum).subscribe(data => {
            this.movies = data
            this.movies.results.forEach(movie => {
              this.list.push(movie)
            });
            if (this.movies.total_pages == this.pageNum) {
              this.canLoadMore = false;
            }
            this.pageNum++;
          },
            err => console.error(err),
          );
        })
        break;
    }
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
