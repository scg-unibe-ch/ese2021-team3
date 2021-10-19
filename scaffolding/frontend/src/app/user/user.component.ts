import {Component} from '@angular/core';
import {User} from '../models/user.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  loggedIn: boolean | undefined;

  user: User | undefined;

  userToRegister: User = new User(0, '', '', '', '', '', '', '', '');

  userToLogin: User = new User(0, '', '', '', '', '', '', '', '');

  endpointMsgUser: string = '';
  endpointMsgAdmin: string = '';
  registrationMsg: string = '';
  loginMsg: string = '';

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.user = res);

    // Current value
    this.loggedIn = userService.getLoggedIn();
    this.user = userService.getUser();
  }

  registerUser(): void {
    this.resetErrorMsg();
    
    this.checkRegistration(this.userToRegister);
    if (!this.registrationMsg || this.registrationMsg.length === 0) {

      this.httpClient.post(environment.endpointURL + "user/register", {
        userName: this.userToRegister.username.toLowerCase(),
        firstName: this.userToRegister.firstName,
        lastName: this.userToRegister.lastName,
        email: this.userToRegister.email,
        address: this.userToRegister.address,
        phone: String(this.userToRegister.phoneNumber),
        birthday: this.userToRegister.birthdate.length == 0 ? 0 : Number(new Date(this.userToRegister.birthdate)),
        password: this.userToRegister.password,
      }).subscribe((res: any) => {
          this.registrationMsg = this.userToRegister.username + " is now registered."
        },
        (err) => {
          this.registrationMsg = err.error.message.message;
        }
      );
    }

  }
  checkRegistration(user: User) {
    // if (!user.birthdate || user.birthdate.length == 0){
    //   this.registrationMsg += "Please "
    // }
    this.checkPassword(user.password);
  }

  loginUser(): void {
    this.resetErrorMsg();
    this.httpClient.post(environment.endpointURL + "user/login", {
      userName: this.userToLogin.username,
      password: this.userToLogin.password
    }).subscribe((res: any) => {
        this.userToLogin.username = this.userToLogin.password = '';

        localStorage.setItem('userName', res.user.userName);
        localStorage.setItem('userToken', res.token);

        this.userService.setLoggedIn(true);
        this.userService.setUser(new User(res.user.userId, res.user.userName,
          res.user.password, res.user.firstName, res.user.lastName, res.user.address,
          res.user.email, res.user.birthdate, res.user.phoneNumber));
      },
      (err) => {
        this.loginMsg = err.error.message.message;
      }
    );
  }

  logoutUser(): void {
    localStorage.removeItem('userName');
    localStorage.removeItem('userToken');

    this.userService.setLoggedIn(false);
    this.userService.setUser(undefined);
  }

  accessUserEndpoint(): void {
    this.httpClient.get(environment.endpointURL + "secured").subscribe(() => {
      this.endpointMsgUser = "Access granted";
    }, () => {
      this.endpointMsgUser = "Unauthorized";
    });
  }

  accessAdminEndpoint(): void {
    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
      this.endpointMsgAdmin = "Access granted";
    }, () => {
      this.endpointMsgAdmin = "Unauthorized";
    });
  }

  resetErrorMsg(): void {
    this.registrationMsg = "";
    this.loginMsg = "";
  }

  checkPassword(password: string): void {

    // contains lowercase, uppercase, numeric and special characters
    // var pattern = new RegExp(
    //   "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
    // );

    var lowerRegex = new RegExp(
      "(?=.*[a-z]).+$"
    );

    var upperRegex = new RegExp(
      "(?=.*[A-Z])"
    );

    var numericRegex = new RegExp(
      "(?=.*\\d).+$"
    );

    var specialRegex = new RegExp(
      "(?=.*[-+_!@#$%^&*.,?]).+$"
    );

    var validPassword = true;

    if (!password || password.length < 8) {
      this.registrationMsg = "Please enter a password with at least 8 charachters.";
      validPassword = false;
    }
      else {
      this.registrationMsg = "The password must contain at least one character for each of the following:";
      if (!lowerRegex.test(password)){
        this.registrationMsg += " lowercase letter,";
        validPassword = false;
      }
      if (!upperRegex.test(password)){
        this.registrationMsg += " uppercase letter,";
        validPassword = false;
      }
      if (!numericRegex.test(password)){
        this.registrationMsg += " number,";
        validPassword = false;
      }
      if (!specialRegex.test(password)){
        this.registrationMsg += " special character,";
        validPassword = false;
      }
      this.registrationMsg = this.registrationMsg.substring(0,this.registrationMsg.length - 1)+".";
    }
    if (validPassword){
      this.registrationMsg = "";
    }
  }
}
