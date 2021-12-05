import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit , EventEmitter, Output} from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import {emitDistinctChangesOnlyDefaultValue} from "@angular/compiler/src/core";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  newProduct = new Product(0,"", "", "", 0, "", 0);
  productToEdit = new Product(0,"", "", "", 0, "", 0);
  productToBuy = new Product(0,"", "", "", 0, "", 0);
  edit = false;
  buy = false;
  origialProductIndex = 0;
  adress = "";
  newProductMsg = "";
  errorMessage = "";
  test = "TEST";
  products: Product[] = [];
  // users: { [id: number]: string; } = {};
  selectedCategory: string = "";
  category: string[] = [];
  imgsrc = environment.endpointURL;
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
    })
  }

  ngOnInit(): void {
    this.getProducts()
  }

  getProducts() {
    this.httpClient.get(environment.endpointURL + "product/get").subscribe(
      (res: any) => {
        try {
          this.products = [] //Reset products to avoid duplication if recalled
          for (let i = 0; i < res.length; i++) {
            console.log(res[i].title);
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

  uploadImageEdited(postId: number) {
    const formData = new FormData();
    formData.append('image', this.selectedFile ?? "");
    this.httpClient.post(environment.endpointURL + "product/" + postId + "/image",
      formData
    ).subscribe((res: any) => {
        this.productToEdit.image = res.image;
        this.products.splice(this.origialProductIndex,1);
        this.products.push(this.productToEdit);
        this.edit = false;
      },
      (err) => {
        this.newProductMsg = err.error.message;
      }
    );
  }

  editProduct(product: Product) {
    this.edit = true;
    this.buy = false;
    this.origialProductIndex = this.products.indexOf(product);
    this.productToEdit = product;
  }

  updateProduct() {
    this.httpClient.post(environment.endpointURL + "product/edit", {
      title: this.productToEdit.title,
      description: this.productToEdit.description,
      productId: this.productToEdit.productId,
      image: "",
      price: this.productToEdit.price,
      category: this.productToEdit.category,
      userId: this.user?.userId ?? 0
    }).subscribe((res: any) => {
      if (this.selectedFile) {
        this.uploadImageEdited(this.productToEdit.productId);
      } else {
        this.products.splice(this.origialProductIndex,1);
        this.products.push(this.productToEdit);
        this.edit = false;
      }
      },
      (err) => {
        this.newProductMsg = err.error.message;
      }
    );
  }

  buyProduct(product: Product) {
    this.errorMessage = "";
    this.newProductMsg = "";
    this.productToBuy = product;
    this.buy = true;
    this.adress = this.user?.address ?? "";
  }

  finallyBuyProduct() {
    this.errorMessage = "";
    if (this.adress=="") {
      this.errorMessage = "Please enter an address!"
      return
    }
    this.httpClient.post(environment.endpointURL + "order/create", {
      address: this.adress,
      productId: this.productToBuy.productId,
      paymentMethod: "invoice",
    }).subscribe((res: any) => {
        this.newProductMsg = "Order Created!";
      },
      (err) => {
        this.errorMessage = err.error.message;
      }
    );
  }

  notBuyProduct() {
    this.newProductMsg = "";
    this.errorMessage = "";
    this.buy = false;
  }


  deleteProduct(product: Product): void {
    this.httpClient.post(environment.endpointURL + "product/" + product.productId, []).subscribe(() => {
      this.products.splice(this.products.indexOf(product), 1);
    },
      (err) => {
        console.log("Couldn't delete Product")
      });
  }

}
