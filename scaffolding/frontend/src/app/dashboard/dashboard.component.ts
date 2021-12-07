import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  orders: Order[] = [];
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
            }
          } catch (error) {
            console.log(error);
          }
        }
      )
    }
  }
  accept(order:Order){
    console.log("nope")
  }
  cancel(order:Order){
    console.log("nope2")
  }
}
