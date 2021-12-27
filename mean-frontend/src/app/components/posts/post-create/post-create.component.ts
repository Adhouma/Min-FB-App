import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { PostService } from '../../../services/post.service';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  postId: string;
  mode = "create";
  post: Post;
  isLoading = false;
  postForm: FormGroup;
  imagePreview: string;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Init postForm
    this.postForm = new FormGroup({
      "title": new FormControl(null, { validators: [Validators.required] }),
      "description": new FormControl(null, { validators: [Validators.required] }),
      "image": new FormControl(null, { validators: [Validators.required] })
    });

    // Get param from activatedRoute
    this.activatedRoute.paramMap
      .subscribe((paramMap) => {
        if (paramMap.has("postId")) {
          this.mode = "edit";
          this.postId = paramMap.get("postId");

          this.isLoading = true;

          this.postService.getPost(this.postId).subscribe((postData: any) => {
            this.isLoading = false;

            this.post = {
              id: postData._id,
              title: postData.title,
              description: postData.description,
              imagePath: postData.imagePath
            }

            this.postForm.setValue({
              "title": this.post.title,
              "description": this.post.description,
              "image": this.post.imagePath
            });

          });
        } else {
          this.mode = "create";
          this.postId = null;
        }
      });
  }

  onImagePicked(event: Event) {
    const imageFile = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({
      "image": imageFile
    });

    this.postForm.get("image").updateValueAndValidity();

    // Make image loadable on the DOM
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreview = (fileReader.result as string);
    }
    fileReader.readAsDataURL(imageFile);
  }

  onAddPost() {
    if (this.postForm.invalid) {
      return;
    }

    if (this.mode === "create") {
      this.postService.addPost(
        this.postForm.value.title,
        this.postForm.value.description,
        this.postForm.value.image
      );
    } else {
      this.postService.updatePost(
        this.postId,
        this.postForm.value.title,
        this.postForm.value.description,
        this.postForm.value.image
      );
    }

    this.postForm.reset();
  }

}
