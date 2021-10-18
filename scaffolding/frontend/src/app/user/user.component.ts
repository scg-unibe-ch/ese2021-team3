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
    this.checkPassword(this.userToRegister.password);
    this.httpClient.post(environment.endpointURL + "user/register", {
      userName: this.userToRegister.username,
      firstName: this.userToRegister.firstName,
      lastName: this.userToRegister.lastName,
      email: this.userToRegister.email,
      address: this.userToRegister.address,
      phone: String(this.userToRegister.phoneNumber),
      birthday: Number(new Date(this.userToRegister.birthdate)),
      password: this.userToRegister.password,
    }).subscribe((res: any) => {
        ;
      },

      (err) => {
        this.registrationMsg = err.error.message.message;
      }
      // (res: any) => {
      //   this.endpointMsgUser = "Succesfully registered!";
      // },

      // () => {
      //this.userToRegister.username = this.userToRegister.password = '';
      //}
    );
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
    //to check if the string
    // contains uppercase, lowercase
    // special character & numeric value
    var pattern = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
    );


    // If the string is empty
    // then print No
    if (!password || password.length === 0) {
      this.registrationMsg = "Please enter a password"
    }
    if (!pattern.test(password)) {
      this.registrationMsg = "The Password must contain at least one upper-/ lowercase Letter a number and special character"

    }

  }


}
