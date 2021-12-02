import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  private loggedIn: boolean | undefined;

  private user: User | undefined;

  private users: User[] = [];


  /*******************************************************************************************************************
   * OBSERVABLE SOURCES & STREAMS
   ******************************************************************************************************************/

  // Observable Sources
  private loggedInSource = new Subject<boolean>();
  private userSource = new Subject<User>();

  // Observable Streams
  loggedIn$ = this.loggedInSource.asObservable();
  user$ = this.userSource.asObservable();


  /*******************************************************************************************************************
   * GETTERS
   ******************************************************************************************************************/

  getLoggedIn(): boolean | undefined {
    return this.loggedIn;
  }

  getUser(): User | undefined {
    return this.user;
  }

  getUsers(): User[] {
    return this.users;
  }

  /*******************************************************************************************************************
   * SETTERS
   ******************************************************************************************************************/

  setLoggedIn(loggedIn: boolean | undefined): void {
    this.loggedInSource.next(loggedIn);
  }

  setUser(user: User | undefined): void {
    this.userSource.next(user);
  }

  setUserByToken() {
    this.httpClient.get(environment.endpointURL + "user", {}
    ).subscribe(
      (res: any) => {
        console.log(res);
        this.userSource.next(new User(res.userId, res.userName,
          res.password, res.firstName, res.lastName,
          res.email, res.address, new Date(res.birthday).toDateString(), res.phoneNumber, res.admin)
        )
      }
    )
  }

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    public httpClient: HttpClient
  ) {
    // Observer
    this.loggedIn$.subscribe(res => this.loggedIn = res);
    this.user$.subscribe(res => this.user = res);

    // Default values
    this.setLoggedIn(false);

    // this.getAllUsers();
  }

  getAllUsers() {
    this.httpClient.get(environment.endpointURL + "user/all", {}
    ).subscribe(
      (res: any) => {
        for (let i = 0; i < res.length; i++) {
          this.users.push(new User(res.userId, res.userName,
            res.password, res.firstName, res.lastName,
            res.email, res.address, new Date(res.birthday).toDateString(), res.phoneNumber));
        }
      }
    )
  }

  // mapUserInfo() {
  // }
}
