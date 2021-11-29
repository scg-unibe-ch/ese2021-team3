import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  imgsrc = environment.endpointURL;

  constructor() { }

  @Input()
  post?: Post;

  ngOnInit(): void {
  }

  upvote(post: Post) {

  }
}
