import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) { }
  start = 'https://api.themoviedb.org/3/';
  key = '?api_key=917bf8547464514e193b8bc4841df69c';



  //Gets all the data from the api
  getMovie(search) {
    let data = this.http.get(
      `${this.start}search/movie${this.key}&query=${search}`
    );
    return data
  }

  getMoreMovies(search, page) {
    let data = this.http.get(
      `${this.start}search/movie${this.key}&query=${search}&page=${page}`
    );
    return data
  }

  getMovieData(id) {
    let data = this.http.get(
      `${this.start}movie/${id}${this.key}`
    );
    return data
  }

  getGenres(genreId) {
    // genreId[0].toUpperCase();
    console.log(genreId);
    let data = this.http.get(
      `https://api.themoviedb.org/3/discover/movie${this.key}&sort_by=popularity.desc&with_genres=${genreId}`
    );
    return data
  }

  getMoreGenres(genreId, page) {
    let data = this.http.get(
      `https://api.themoviedb.org/3/discover/movie${this.key}&sort_by=popularity.desc&with_genres=${genreId}&page=${page}`
    );
    return data
  }

  searchActor(name) {
    let data = this.http.get(
      `https://api.themoviedb.org/3/search/person?api_key=917bf8547464514e193b8bc4841df69c&query=${name}`
    );
    return data
  }

  getActor(actorId) {
    let data = this.http.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=917bf8547464514e193b8bc4841df69c&language=en-US&sort_by=popularity.desc&with_people=${actorId}`
    );
    return data
  }

  getMoreActorMovies(actorId, page) {
    let data = this.http.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=917bf8547464514e193b8bc4841df69c&language=en-US&sort_by=popularity.desc&with_people=${actorId}&page=${page}`
    );
    return data
  }

  getPopular(){
    let data = this.http.get(
      `${this.start}discover/movie${this.key}&sort_by=popularity.desc`
    );
    return data;
  }


}
