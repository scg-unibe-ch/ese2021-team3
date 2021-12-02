import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  imgsrc = environment.endpointURL;

  constructor() { }

  @Input()
  product?: Product;

  ngOnInit(): void {
  }

}
