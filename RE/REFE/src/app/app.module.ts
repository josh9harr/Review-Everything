
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

// Components
import { ReviewComponent } from './review/review.component';

//firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

//Search
import { SearchComponent } from './search/search.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { UpdateReviewComponent } from './update-review/update-review.component';
import { SignUpComponent } from './sign-up/sign-up.component';



@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ReviewComponent,
    LoginComponent,
    ProfileComponent,
    UpdateReviewComponent,
    SignUpComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // Only required for database features
    AngularFireAuthModule, // Only required for auth features,
    AngularFireStorageModule, // Only required for storage features
    FormsModule,
    RouterModule.forRoot([
      { path: "reviews/:id", component: ReviewComponent },
      { path: "home", component: SearchComponent },
      { path: "login", component: LoginComponent },
      { path: "signUp", component: SignUpComponent },
      { path: "profile", component: ProfileComponent },
      { path: "update/:reviewId", component: UpdateReviewComponent },
      { path: "", redirectTo: "/home", pathMatch: 'full' }
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

