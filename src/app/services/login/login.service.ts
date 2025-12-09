import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../users/users.service';

export interface AuthenticationRequest {
  username: string;
  password: string;
  ip: string;
}
export interface PublicUserInfo {
  username: string;
  role: string; // "WEB" ou "MOBILE"
}

export interface AuthenticationResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  
   private API_URL = 'http://51.178.87.12:8097/auth';
   private API_URL_Local = 'http://localhost:8080/auth';

  constructor(private http: HttpClient, private router: Router) { }

  authenticate(request: AuthenticationRequest, platform: string): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      `${this.API_URL}/authenticate/${platform}`,
      request
    );
  }

  validateToken(token: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/validateToken`,
      token,
      { responseType: 'text' }
    );
  }

  getUserPublic(usernameOrId: string): Observable<PublicUserInfo> {
    return this.http.get<PublicUserInfo>(`${this.API_URL_Local}/public/${usernameOrId}`);
  }
}
