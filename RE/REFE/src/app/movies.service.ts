import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) { }
  start = 'https://api.themoviedb.org/3/';
  key = '917bf8547464514e193b8bc4841df69c';

  getPeople(){
    let data = this.http
    .get("https://api.themoviedb.org/3/search/movie?api_key=917bf8547464514e193b8bc4841df69c&query=jaws")
      // `${this.start}search/movie?api_key=${this.key}&query=jaws`);
    return data
  }

}
