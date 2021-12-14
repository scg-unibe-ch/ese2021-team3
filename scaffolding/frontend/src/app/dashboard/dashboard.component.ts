import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import {Product} from "../models/product.model";
import {Post} from "../models/post.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  orders: Order[] = [];
  users: User[] = [];
  products: Product[] = [];
  user?: User;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    userService.user$.subscribe(res => {
      this.user = res
      this.getOrders();
    })
  }

  ngOnInit(): void {
    this.getOrders();
  }


  getOrders() {
    if(!this.user){
      throw new Error('Should not be able to access this when not logged in');
    }
    else if (this.user.isAdmin){
      this.httpClient.get(environment.endpointURL + "order/getAll").subscribe(
        (res: any) => {
          try {
            this.orders = []
            for (let i = 0; i < res.length; i++) {
              this.orders.push(
                new Order(res[i].orderId, res[i].address, res[i].userId, res[i].productId, res[i].status, res[i].paymentMethod)
              )
              this.getUserForOrders()
              this.getProductsForOrders()
            }
          } catch (error) {
            console.log(error);
          }
        }
      )
    } else {
      this.httpClient.get(environment.endpointURL + "order/get").subscribe(
        (res: any) => {
          try {
            this.orders = []
            for (let i = 0; i < res.length; i++) {
              this.orders.push(
                new Order(res[i].orderId, res[i].address, res[i].userId, res[i].productId, res[i].status, res[i].paymentMethod)
              )
              this.getProductsForOrders()
              this.addMyselfAsUser();
            }
          } catch (error) {
            console.log(error);
          }
        }
      )
    }
  }

  getUserForSpezificOrder(order: Order): User {
    return this.users[this.orders.indexOf(order)];
  }

  getProductForSpezificOrder(order: Order): Product {
    return this.products[this.orders.indexOf(order)];
  }

  addMyselfAsUser() {
    for (let i = 0; i < this.orders.length; i++) {
      if (this.user) {
        this.users.push(this.user);
      }
    }
  }

  getUserForOrders() {
    for (let i = 0; i < this.orders.length; i++) {
      this.users = [];
      this.httpClient.get(environment.endpointURL + "user/single/" + this.orders.reverse()[i].userId).subscribe(
        (res: any) => {
          try {

            this.users.push(
              new User(res.user,res.userName,res.password, res.firstName, res.lastName, res.email,res.address,res.birthday,res.phone,res.admin)
            )
            } catch (error) {
            console.log(error);
          }
        }
      )
    }
  }

  getProductsForOrders() {
    for (let i = 0; i < this.orders.length; i++) {
      this.products = [];
      this.httpClient.get(environment.endpointURL + "product/" + this.orders.reverse()[i].productId + "/single").subscribe(
        (res: any) => {
          try {
            this.products.push(
              new Product(res.productId,res.title,res.description,res.image,res.price,res.category,res.userId)
            )
          } catch (error) {
            console.log(error);
          }
        }
      )
    }
  }


  accept(order:Order){
    this.httpClient.post(environment.endpointURL + "order/" + order.orderId + "/changestatus", {
      status: "Shipped/Done",
    }).subscribe((res: any) => {
        order.status = "Shipped/Done";
      },
      (err) => {

      }
    );
  }
  cancel(order:Order){
    this.httpClient.post(environment.endpointURL + "order/" + order.orderId + "/cancel", []).subscribe((res: any) => {
        order.status = "canceled";
      },
      (err) => {

      }
    );
  }
}
