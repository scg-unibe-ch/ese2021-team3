import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit , EventEmitter, Output} from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  newProduct = new Product(0,"", "", "", 0, "", 0);
  newProductMsg = "";
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
    })
  }

  ngOnInit(): void {
    this.getProducts()
  }

  getProducts() {

    this.httpClient.post(environment.endpointURL + "product/get", []
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

  editProduct(product: Product) {
    console.log(product);
  }

  deleteProduct(product: Product): void {
    this.httpClient.delete(environment.endpointURL + "product/" + product.productId).subscribe(() => {
      this.products.splice(this.products.indexOf(product), 1);
    });
  }

}
