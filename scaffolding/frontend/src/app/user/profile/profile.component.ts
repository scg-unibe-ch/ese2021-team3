import { HttpClient } from '@angular/common/http';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  loggedIn: boolean | undefined;

  @Input()
  user: User | undefined;

  userToShow: User = new User(0, '', '', '', '', '', '', '', '');
  
  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    // Listen for changes
    // userService.loggedIn$.subscribe(res => this.loggedIn = res);
    // userService.user$.subscribe(res => this.user = res);

  }
  ngOnInit(): void {
    this.loggedIn = this.userService.getLoggedIn();
    this.user = this.userService.getUser();
    this.userToShow = this.user ?? this.userToShow;
    
  }
}
