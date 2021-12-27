import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = true;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = false;
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }

    this.authService.login(loginForm.value.email, loginForm.value.password);
  }

}
