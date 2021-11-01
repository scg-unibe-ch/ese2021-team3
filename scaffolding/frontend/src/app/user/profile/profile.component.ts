import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  @Input()
  user?: User;
  
  constructor(
    // public httpClient: HttpClient,
    // public userService: UserService
  ) {
    // Listen for changes
    // userService.loggedIn$.subscribe(res => this.loggedIn = res);
    // userService.user$.subscribe(res => this.user = res);

  }
  ngOnInit(): void {
    
  }
}
