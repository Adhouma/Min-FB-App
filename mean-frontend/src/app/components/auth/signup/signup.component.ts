import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading = true;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = false;
  }

  onSignup(signupForm: NgForm) {
    if (signupForm.invalid) {
      return;
    }

    this.authService.signup(signupForm.value.email, signupForm.value.password);
  }
}
