import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit {

  chosenFilter: string = '';

@Output() messageEvent = new EventEmitter<string>();

  constructor() { }

  sendProductFilterMessage(){
    this.messageEvent.emit(this.chosenFilter)
  }



  ngOnInit(): void {
  }

}
