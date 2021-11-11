import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit , EventEmitter, Output} from '@angular/core';
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

  newPost = new Post(0, 0, "", "", "", [], "");
  postingMsg = "";
  posts: Post[] = [];
  users: { [id: number]: string; } = {};
  selectedFile?: File;
  target?: HTMLInputElement;


  @Input()
  user?: User;


  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    userService.user$.subscribe(res => this.user = res);
  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.httpClient.get(environment.endpointURL + "post/get", {}
    ).subscribe(
      (res: any) => {
        try {
          for (let i = 0; i < res.length; i++) {
            this.posts.push(
              new Post(res[i].postId, res[i].userId, res[i].title, res[i].text, res[i].image, res[i].category, res[i].userName)
            )
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  }

  createPost() {
    this.httpClient.post(environment.endpointURL + "post/create", {
      title: this.newPost.title,
      text: this.newPost.text,
      image: ""

    }).subscribe((res: any) => {
      this.newPost.userId = this.user?.userId ?? 0;
      this.newPost.username = this.user?.username;
      this.newPost.postId = Number(res.postId);
      if (this.selectedFile) {
        this.uploadImage(this.newPost.postId);
      } else {
        this.posts.push(this.newPost);
        this.newPost = new Post(0, 0, "", "", "", [], "");
      }
    },
      (err) => {
        this.postingMsg = err.error.message;
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
    this.httpClient.post(environment.endpointURL + "post/" + postId + "/image",
      formData
    ).subscribe((res: any) => {
      this.newPost.image = res.fileName;
      this.posts.push(this.newPost);
      this.newPost = new Post(0, 0, "", "", "", [], "");
    },
      (err) => {
        this.postingMsg = err.error.message;
      }
    );
  }

  upvote(post: Post) {
    console.log(post);
  }
  downvote(post: Post) {
    console.log(post);
  }
  edit(post: Post) {
    console.log(post);
  }

  delete(post: Post): void {
    this.httpClient.delete(environment.endpointURL + "post/" + post.postId).subscribe(() => {
      this.posts.splice(this.posts.indexOf(post), 1);
    });
  }
}

