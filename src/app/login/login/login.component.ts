import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest, LoginService } from 'app/services/login/login.service';
import { SharedUserService } from 'app/services/sharedUser/shared-user.service';
import { UsersService } from 'app/services/users/users.service';
import Swal from 'sweetalert2';

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
    hidePassword: boolean = true;
    constructor(private loginService: LoginService,
    private router: Router, private userService: UsersService, private sharedUserService : SharedUserService) {}

login() {
  if (!this.username || !this.password) {
    Swal.fire({
      title: "Erreur",
      text: "Veuillez saisir le nom d'utilisateur et le mot de passe",
      icon: "warning"
    });
    return;
  }

  this.loginService.getUserPublic(this.username).subscribe({
    next: (user: any) => {
      console.log(user); // { role: 'WEB', username: 'azza' }
      const role = user.role;

      if (role !== 'WEB') {
        Swal.fire({
          title: "Authentification interdite",
          text: "Seuls les utilisateurs WEB peuvent se connecter ici",
          icon: "warning"
        });
        return;
      }

      const request: AuthenticationRequest = {
        username: this.username,
        password: this.password,
        ip: 'ip adress'
      };

      this.loginService.authenticate(request, 'WEB').subscribe({
        next: (res) => {
          localStorage.setItem("token", res.token);
          this.sharedUserService.setUsername(user.username);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          Swal.fire({
            title: "Authentification échouée",
            text: "Nom d'utilisateur ou mot de passe incorrect",
            icon: "error"
          });
        }
      });
    },
    error: (err) => {
      Swal.fire({
        title: "Utilisateur introuvable",
        text: "Vérifiez votre nom d'utilisateur",
        icon: "error"
      });
    }
  });
}

}
