import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import {Product} from "../../models/product.model";
import {User} from "../../models/user.model";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  imgsrc = environment.endpointURL;

  constructor() { }

  @Input()
  order?: Order;
  @Input()
  product?: Product;
  @Input()
  user?: User;

  getProduct(): Product {
    if (this.product != undefined) {
      return this.product
    }
    return new Product(0,"ERROR","ERROR","ERROR",-1,"ERROR",0)
  }

  getUser(): User {
    if (this.user != undefined) {
      return this.user
    }
    return new User(-1,"ERROR","ERROR","ERROR","ERROR","ERROR","ERROR","ERROR","ERROR", false);
  }

  ngOnInit(): void {
  }
}
