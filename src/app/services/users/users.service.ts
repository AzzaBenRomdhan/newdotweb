import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface User {
  id?: number;
  username: string;
  password?: string;
  nom?: string;
  prenom?: string;
  appUserRole?: string;
  poste?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

private API_URL = 'http://localhost:9090/users';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.API_URL, user, this.getHeaders());
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL, this.getHeaders());
  }

  getUserByUsernameOrId(usernameOrId: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${usernameOrId}`, this.getHeaders());
  }

  updateUser(user: User, usernameOrId: string): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${usernameOrId}`, user, this.getHeaders());
  }

  deleteUser(usernameOrId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${usernameOrId}`, this.getHeaders());
  }
}
