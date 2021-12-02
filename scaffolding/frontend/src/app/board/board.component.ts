import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit , EventEmitter, Output} from '@angular/core';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import {newArray} from "@angular/compiler/src/util";


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  newPost = new Post(0, 0, "", "", "", "", "");
  // newPost = new Post(0, 0, "", "", "", []);
  editPost = new Post(0, 0, "", "", "", "");
  postingMsg = "";
  posts: Post[] = [];
  users: { [id: number]: string; } = {};
  selectedFile?: File;
  target?: HTMLInputElement;
  editArray: Post[] = []


  @Input()
  user?: User;


  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {

    userService.user$.subscribe(res => {
      this.user = res
      this.getPosts(); //Reload posts after user is logged in to get "myVote"
    })
  }

  ngOnInit(): void {
    this.getPosts()
  }

  getPosts() {
    var body = {}
    if (this.user !== undefined) {
      body = {
        userId: this.user?.userId! //Add userid to body if user is already logged in.
      }
    }

    this.httpClient.post(environment.endpointURL + "post/get", body
    ).subscribe(
      (res: any) => {
        try {
          this.posts = [] //Reset posts (to ensure not to duplicate post if recalled)
          for (let i = 0; i < res.length; i++) {
            this.posts.push(
              new Post(res[i].postId, res[i].userId, res[i].title, res[i].text, res[i].image, res[i].category, res[i].userName, res[i].vote, res[i].myVote)
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
      image: "",
      category: this.newPost.category,



    }).subscribe((res: any) => {
      this.newPost.userId = this.user?.userId ?? 0;
      this.newPost.username = this.user?.username;
      this.newPost.postId = Number(res.postId);
      this.newPost.category = this.newPost.category;
      this.newPost.vote = 0; //Vote Post for newly created Post
      if (this.selectedFile) {
        this.uploadImage(this.newPost.postId);
      } else {
        this.posts.push(this.newPost);
        this.newPost = new Post(0, 0, "", "", "","", "");
       // this.newPost = new Post(0, 0, "", "", "", []);
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
      this.newPost.image = res.image;
      this.posts.push(this.newPost);
      this.newPost = new Post(0, 0, "", "", "", "", "");
    },
      (err) => {
        this.postingMsg = err.error.message;
      }
    );
  }

  upvote(post: Post) {

    this.httpClient.post(environment.endpointURL + "vote/create", {
      postId: post.postId,
      vote: 1
    }).subscribe((res: any) => {
        if (post.vote !== undefined) {
          if (post.myVote === -1) {
            post.vote += 2; //If already Voted negativ, remove two from votecount
          } else {
            post.vote += 1; //if not voted already add one to vote
          }
          post.myVote = 1; //Update myVote Attribut
        }
      },
      (err) => {
        this.postingMsg = err.error.message;
      }
    );
  }

  neutralvote(post: Post) {
    this.httpClient.post(environment.endpointURL + "vote/create", {
      postId: post.postId,
      vote: 0
    }).subscribe((res: any) => {
        if (post.vote !== undefined) {
          switch (post.myVote) {
            case (1):
              post.vote -= 1;
              break;
            case (-1):
              post.vote += 1;
              break;
            default:
              break;
          }
          post.myVote = 0;
        }
      },
      (err) => {
        this.postingMsg = err.error.message;
      }
    );
  }

  downvote(post: Post) {
    this.httpClient.post(environment.endpointURL + "vote/create", {
      postId: post.postId,
      vote: -1
    }).subscribe((res: any) => {
        if (post.vote !== undefined) {
          if (post.myVote === 1) {
            post.vote -= 2; //If already Voted positiv, remove two from vote
          } else {
            post.vote -= 1; //if not voted already remove one from vote
          }
          post.myVote = -1; //Update myVote Attribut
        }
      },
      (err) => {
        this.postingMsg = err.error.message;
      }
    );
  }

  edit(post: Post) {
    this.httpClient.post(environment.endpointURL + "post/" + post.postId + "/edit", {
      title: post.title,
      text: post.text,
      category: post.category,
      image: ""
    }).subscribe((res: any) => {
       this.editPost.title = post.title;
       this.editPost.text = post.text;
       this.editPost.category = post.category;
        if (this.selectedFile) {
          this.uploadImage(this.editPost.postId);
        } else {
        }
        post.title = this.editPost.title;
        post.text = this.editPost.text;
        post.category = this.editPost.category;

        this.editArray = [];
        this.editPost = new Post(0,0, "", "", "", "");
      },
      (err) => {
        this.postingMsg = err.error.message;
      }
    );
  }

  deletePost(post: Post): void {
    this.httpClient.delete(environment.endpointURL + "post/" + post.postId).subscribe(() => {
      this.posts.splice(this.posts.indexOf(post), 1);
    });
  }

  prepareEdit(post: Post) {
    this.editArray[0] = post;
  }
}

