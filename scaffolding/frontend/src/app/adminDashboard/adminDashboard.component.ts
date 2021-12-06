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
  newProduct = new Product(0,"", "", "", 0, "", 0);
  newUser = new User(0, '', '', '', '', '', '', '', '');
  newProductMsg = "";
  registrationError = "";
  registrationMsg = "";
  products: Product[] = [];
  // users: { [id: number]: string; } = {};
  selectedCategory: string = "";
  category: string[] = [];
  selectedFile?: File;
  target?: HTMLInputElement;

  @Input()
  user?: User;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {

    userService.user$.subscribe(res => {
      this.user = res;
      this.getProducts()
    });
  }

  ngOnInit(): void {
    this.getProducts()
  }

  getProducts() {
    console.log("TEST")
    console.log(this.user)
    this.httpClient.get(environment.endpointURL + "product/get",
    ).subscribe(
      (res: any) => {
        try {
          this.products = [] //Reset products to avoid duplication if recalled
          for (let i = 0; i < res.length; i++) {
            this.products.push(
              new Product(res[i].productId, res[i].title, res[i].description, res[i].image, res[i].price, res[i].category, res[i].userId)
            )
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  }

  createProduct() {
    this.httpClient.post(environment.endpointURL + "product/create", {
      title: this.newProduct.title,
      description: this.newProduct.description,
      image: "",
      price: this.newProduct.price,
      category: this.newProduct.category,
      userId: this.user?.userId ?? 0

    }).subscribe((res: any) => {
        this.newProduct.userId = Number(res.userId);
        this.newProduct.productId = Number(res.productId);
        this.newProduct.category = res.category;
        if (this.selectedFile) {
          this.uploadImage(this.newProduct.productId);
        } else {
          this.products.push(this.newProduct);
          this.newProduct = new Product(0,"", "", "", 0, "", 0);
        }
      },
      (err) => {
        this.newProductMsg = err.error.message;
      }
    );
  }

  onFileSelected(event: any) {
    this.target = event.target;
    this.selectedFile = event.target.files[0];
  }

  uploadImage(postId: number) {
    const formData = new FormData();
    formData.append('image', this.selectedFile ?? "");
    this.httpClient.post(environment.endpointURL + "product/" + postId + "/image",
      formData
    ).subscribe((res: any) => {
        this.newProduct.image = res.image;
        this.products.push(this.newProduct);
        this.newProduct = new Product(0,"", "", "", 0, "", 0);
      },
      (err) => {
        this.newProductMsg = err.error.message;
      }
    );
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
        },
        (err) => {
          this.registrationMsg = ''
          this.registrationError = err.error.message.message;
        }
      );
  }
}
