  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { AuthenticationRequest, LoginService } from 'app/services/login/login.service';

  @Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
  })
  export class LoginComponent implements OnInit {

    ngOnInit(): void {
    }
    username = '';
    password = '';

    constructor(private loginService: LoginService,
    private router: Router) {}

  login() {
    const request: AuthenticationRequest = {
      username: this.username,
      password: this.password,
      ip: 'WEB'
    };

    this.loginService.authenticate(request, "WEB").subscribe({
      next: (res) => {
        console.log("TOKEN :", res.token);
        localStorage.setItem("token", res.token);
        alert("Login success");

        this.router.navigate(['/dashboard']);
        // Ou si tu utilises le hash "#":
        // this.router.navigate(['/#/dashboard']);
      },
      error: (err) => {
        console.log(err);
        alert("Authentication failed");
      }
    });
  }

  }
