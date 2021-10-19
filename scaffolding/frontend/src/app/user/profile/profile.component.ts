import { HttpClient } from '@angular/common/http';
import {Component, EventEmitter, Output} from '@angular/core';
import {User} from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  loggedIn: boolean | undefined;

  user: User | undefined;

  userToShow: User = new User(0, '', '', '', '', '', '', '', '');
  
  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.user = res);

    // Current value
    this.loggedIn = userService.getLoggedIn();
    this.user = userService.getUser();
  }

  @Output()
  update = new EventEmitter<User>();

  @Output()
  delete = new EventEmitter<User>();

  updateItem(): void {
    // Emits event to parent component that TodoItem got updated
    this.update.emit(this.user);
  }

  deleteItem(): void {
    // Emits event to parent component that TodoItem got deleted
    this.delete.emit(this.user);
  }
}
