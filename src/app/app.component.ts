import { Component} from '@angular/core';
import { LoginService } from './services/login/login.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
/*   constructor(private loginService:LoginService ){}
ngOnInit() {
  const token = localStorage.getItem("token");

  if (token) {
    this.loginService.validateToken(token).subscribe({
      next: () => {
        console.log("Token ok 👍");
      },
      error: () => {
        console.log("Token invalide ❌");
        localStorage.removeItem("token");
        window.location.href = '/login';
      }
    });
  }
} */

}
