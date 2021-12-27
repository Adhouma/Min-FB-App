import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from '../models/post.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postList: Post[] = [];
  private postUpdated = new Subject<{posts: Post[], postsCount: number}>();

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  // Get updated posts
  getPostUpdatedListener() {
    return this.postUpdated.asObservable();
  }

  // Get all posts
  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postPerPage}&currentPage=${currentPage}`;

    this.httpClient.get<{ message: string, posts: any, postsCount: number }>
    (environment.apiURL + "/posts" + queryParams)
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                description: post.description,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              }
            }),
            postsCount: postData.postsCount
          }
        })
      )
      .subscribe((transformedPost) => {
        this.postList = transformedPost.posts;
        this.postUpdated.next({posts: this.postList, postsCount: transformedPost.postsCount});
      });
  }

  // Get post
  getPost(postId: string) {
    return this.httpClient.get(environment.apiURL + "/post/" + postId);
  }

  // Add post
  addPost(title: string, description: string, image: File) {
    const postData = new FormData();

    postData.append("title", title);
    postData.append("description", description);
    postData.append("image", image, title);

    this.httpClient.post<{ message: string, post: Post }>
    (environment.apiURL + "/add-post", postData)
      .subscribe(createdPost => {
        this.router.navigate(["/"]);
      });
  }

  // Update post
  updatePost(postId: string, title: string, description: string, image: File | string) {
    let updatedPost: Post | FormData;

    if (typeof image === "object") {
      updatedPost = new FormData();

      updatedPost.append("id", postId);
      updatedPost.append("title", title);
      updatedPost.append("description", description);
      updatedPost.append("image", image, title);
    } else {
      updatedPost = {
        id: postId,
        title: title,
        description: description,
        imagePath: image
      }
    }

    this.httpClient.put(environment.apiURL + "/update-post/" + postId, updatedPost)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  // Delete post
  deletePost(postId: string) {
    return this.httpClient.delete(environment.apiURL + "/delete-post/" + postId);
  }
}
