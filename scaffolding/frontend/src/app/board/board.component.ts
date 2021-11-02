import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { POSTS } from '../mocks/mock-posts';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  newPost= new Post(0,0,"","","");
  postingMsg = "";
  posts = POSTS;

  @Input()
  user?: User;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) { }

  ngOnInit(): void {


  }

  createPost(){
    this.httpClient.post(environment.endpointURL + "post/create", {
      title: this.newPost.title,
      text: this.newPost.text,
      image: this.newPost.image,
      
    }).subscribe((res: any) => {
      this.postingMsg =  this.newPost.title;
    },
      (err) => {
        this.postingMsg = err.error.message.message;
      }
    );

  }

}
