import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegexService {

  error = false;
  error_msg = {
    nameError:'',
    addressError:'',
    cityError: '',
    zipError:'',
    phoneError:'',
    passwordError:'',
    emailError:'',
    stateError:'',

  };
  

  constructor() { }

  name_patt = /^(\w{2,})$/i;
  phone_patt = /^(1?\([0-9]{3}\)( |)|(1-|1)?[0-9]{3}-?)[0-9]{3}-?[0-9]{4}$/;
  address_patt = /[a-zA-Z0-9]+\s[a-zA-Z0-9]+/;
  state_patt = /^[a-z]{2}$/i;
  zip_patt = /^([0-9]{5}|[0-9]{5}-[0-9]{4})$/;
  password_patt = /(?=.*\d)(?=.*[A-Z]).{8,}/;
  email_patt = /(\w|\d)+[@](\w|\d){2,}[.](\w|\d){2,}/;
  
  testForm(user){
  this.error = false;

     if(!this.name_patt.test(user.fname)){
          this.error=true;
          this.error_msg.nameError = "Not a valid name";
      }
      if(!this.name_patt.test(user.lname)){
          this.error=true;
          this.error_msg.nameError = "Not a valid name"
        }else{
          this.error_msg.addressError = "";
        }
      if(!this.address_patt.test(user.street)){
          this.error=true;
          this.error_msg.addressError = " Not a valid address.";
          //  Address must have at least one character, followed by a space and at least one or more other characters."

      }else{
        this.error_msg.addressError = "";
      }
      // if(!this.name_patt.test(user.city)){
      //     this.error=true;
      //     this.error_msg.cityError = " Not a valid city.";
      //     //  The city needs at least two letters of the alphabet."
      //
      // }
      if(!this.zip_patt.test(user.zip_code)){
          this.error=true;
          this.error_msg.zipError =  ' Not a valid zip code.';
          //  Must either be 5 digits or 5 digits followed by "-" then 4 more digits. ';

      }else{
        this.error_msg.zipError = "";
      }
      if(!this.phone_patt.test(user.phone)){
          this.error=true;
          this.error_msg.phoneError =  " Not a valid Phone Number.";

      }else{
        this.error_msg.phoneError = "";
      }
      if(!this.email_patt.test(user.email)){
          this.error=true;
          this.error_msg.emailError =  " Not a valid email.";
          //  Email address must have at least one character, followed by '@', followed by at least two characters, followed by a '.', followed by at least two characters."

      }else{
        this.error_msg.emailError = "";
      }
      if(!this.password_patt.test(user.password)){
          this.error=true;
          this.error_msg.passwordError =  'Not a valid Password.';
          //  Passsword must be at least 8 characters and include one capitalized letter, one digit, and one special character !@#$%^&*()[]{};:"<>,./?"';

      }else{
        this.error_msg.passwordError = "";
      }
      if(!this.state_patt.test(user.state)){
        this.error=true;
        this.error_msg.stateError =' Not a State'
      }else{
        this.error_msg.stateError = "";
      }
      // if(!this.password_patt.test(user.verPassword)){
      //     this.error=true;
      //     this.error_msg += '<br />Passwords do not match'
      // }

      if(this.error){
        console.log(this.error_msg)
        console.log(user)
        return this.error_msg;   
      }else{
        return true;
      } 
  } 

  updateTestForm(user){
    this.error = false;
  
       if(!this.name_patt.test(user.fname)){
            this.error=true;
            this.error_msg.nameError = "Not a valid name";
        }
        if(!this.name_patt.test(user.lname)){
            this.error=true;
            this.error_msg.nameError = "Not a valid name"
          }else{
            this.error_msg.addressError = "";
          }
        if(!this.address_patt.test(user.street)){
            this.error=true;
            this.error_msg.addressError = " Not a valid address.";
            //  Address must have at least one character, followed by a space and at least one or more other characters."
  
        }else{
          this.error_msg.addressError = "";
        }
        // if(!this.name_patt.test(user.city)){
        //     this.error=true;
        //     this.error_msg.cityError = " Not a valid city.";
        //     //  The city needs at least two letters of the alphabet."
        //
        // }
        if(!this.zip_patt.test(user.zip_code)){
            this.error=true;
            this.error_msg.zipError =  ' Not a valid zip code.';
            //  Must either be 5 digits or 5 digits followed by "-" then 4 more digits. ';
  
        }else{
          this.error_msg.zipError = "";
        }
        if(!this.phone_patt.test(user.phone)){
            this.error=true;
            this.error_msg.phoneError =  " Not a valid Phone Number.";
  
        }else{
          this.error_msg.phoneError = "";
        }
        if(!this.state_patt.test(user.state)){
          this.error=true;
          this.error_msg.stateError =' Not a State'
        }else{
          this.error_msg.stateError = "";
        }

        if(this.error){
          console.log(this.error_msg)
          console.log(user)
          return this.error_msg;   
        }else{
          return true;
        } 
    } 

  
}
