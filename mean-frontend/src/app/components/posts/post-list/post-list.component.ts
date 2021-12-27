import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../../../models/post.model';
import { AuthService } from '../../../services/auth.service';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  postList: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  postSubscription: Subscription;
  userIsAuthenticated = false;
  userId: string;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.userId = this.authService.getUserId();
    this.postService.getPosts(this.postsPerPage, this.currentPage);

    this.postSubscription = this.postService.getPostUpdatedListener()
      .subscribe((postData: { posts: Post[], postsCount: number }) => {
        this.isLoading = false;
        this.postList = postData.posts;
        this.totalPosts = postData.postsCount;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authService.getAuthStatusListener()
      .subscribe((isAuthenticated: boolean) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

  }

  onChangedPage(pageData: PageEvent) {
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;

    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDeletePost(postId: string) {
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }

}
