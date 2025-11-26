import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface AuthenticationRequest {
  username: string;
  password: string;
  ip: string;
}

export interface AuthenticationResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  
   private API_URL = 'http://localhost:9090/auth';

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
 
}
