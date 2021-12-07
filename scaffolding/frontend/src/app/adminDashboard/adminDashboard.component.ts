import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../models/product.model";
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../services/user.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-adminDashboard',
  templateUrl: './adminDashboard.component.html',
  styleUrls: ['./adminDashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  newUser = new User(0, '', '', '', '', '', '', '', '');
  registrationError = "";
  registrationMsg = "";
  products: Product[] = [];
  users: User[] = [];
  category: string[] = [];
  target?: HTMLInputElement;

  @Input()
  user?: User;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {

    userService.user$.subscribe(res => {
      this.user = res;
      this.getUser()
    });
  }

  ngOnInit(): void {
    this.getUser()
  }

  createUser() {
      this.httpClient.post(environment.endpointURL + "user/register", {
        userName: this.newUser.username.toLowerCase(),
        firstName: this.newUser.firstName,
        lastName: this.newUser.lastName,
        email: this.newUser.email,
        address: this.newUser.address,
        phone: String(this.newUser.phoneNumber),
        birthday: this.newUser.birthdate.length == 0 ? 0 : Number(new Date(this.newUser.birthdate)),
        password: this.newUser.password,
      }).subscribe((res: any) => {
          this.registrationError = ''
          this.registrationMsg = this.newUser.username + " is now registered."
          this.users.push(new User(0,this.newUser.username.toLowerCase(),this.newUser.password,this.newUser.firstName,this.newUser.lastName,this.newUser.email,this.newUser.address,this.newUser.birthdate,this.newUser.phoneNumber));
        },
        (err) => {
          this.registrationMsg = ''
          this.registrationError = err.error.message.message;
        }
      );
  }

  getUser() {
    this.httpClient.get(environment.endpointURL + "user/all"
    ).subscribe(
      (res: any) => {
        this.users = [];
        for (let i = 0; i < res.length; i++) {
          this.users.push(new User(res[i].userId,res[i].userName,res[i].password,res[i].firstName,res[i].lastName,res[i].email,res[i].address,res[i].birthday,res[i].phone));
        }
      }
    )
  }
}
