import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  newPost= new Post(0,0,"","","", [], "");
  postingMsg = "";
  posts: Post[] = [] ;
  users: { [id: number]: string; } = {};

  @Input()
  user?: User;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.getUsers();
    this.getPosts();
  }

  getUsers() {
    this.httpClient.get(environment.endpointURL + "user", {}
    ).subscribe(
      (res:any) => {
        console.log(res);
        try {
          for (let i = 0; i < res.length; i++) {
            this.users[res[i].userId] = res[i].userName;
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  }

  getPosts() {
    this.httpClient.get(environment.endpointURL + "post/get", { }
    ).subscribe(
      (res:any) => {
        console.log(res);
        try {
          for (let i = 0; i < res.length; i++) {
            console.log(this.users[res[i].userId]);

            this.posts.push( 
            new Post(res[i].postId, res[i].userId, res[i].title, res[i].text, res[i].image, res[i].category, this.users[res[i].userId])
            )

          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  }

  createPost(){
    this.httpClient.post(environment.endpointURL + "post/create", {
      title: this.newPost.title,
      text: this.newPost.text,
      image: this.newPost.image,
      
    }).subscribe((res: any) => {
      this.newPost.username = this.users[res.userId];
      this.posts.push(this.newPost);
      this.newPost= new Post(0,0,"","","", [], "");
    },
      (err) => {
        this.postingMsg = err.error.message;
      }
    );

  }

}
