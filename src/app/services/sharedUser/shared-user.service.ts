import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedUserService {

  private usernameSource = new BehaviorSubject<string | null>(localStorage.getItem("username"));
  username$ = this.usernameSource.asObservable();

  setUsername(username: string) {
    localStorage.setItem("username", username);
    this.usernameSource.next(username);
  }

  clear() {
    localStorage.removeItem("username");
    this.usernameSource.next(null);
  }
}
