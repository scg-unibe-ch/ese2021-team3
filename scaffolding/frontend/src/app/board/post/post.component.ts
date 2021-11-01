import { Component, Input, OnInit } from '@angular/core';
import { USERS } from 'src/app/mocks/mock-users';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  username = "username";
  users = USERS;

  constructor() { }

  @Input()
  post?: Post;

  ngOnInit(): void {
    if (this.post){
      this.username = this.getUsername(this.post.userId);
    }
  }

  getUsername(userId: number){
    return "username"+userId;
  }

}
