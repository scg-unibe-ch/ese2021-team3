import { Component, OnInit, Output, EventEmitter} from '@angular/core';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent implements OnInit {

  chosenFilter: string = '';

@Output() messageEvent = new EventEmitter<string>();

  constructor() { }

  sendFilterMessage(){
    this.messageEvent.emit(this.chosenFilter)
  }



  ngOnInit(): void {
  }

}
