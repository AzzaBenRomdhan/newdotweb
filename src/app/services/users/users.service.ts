import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface User {
  id?: string;
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

private API_URL = 'http://51.178.87.12:8085/users';


  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    console.log('mon token user', token)
    if (!token) {
      console.error('Token non trouvé dans le localStorage');
      // Vous pourriez rediriger vers la page de login
      // this.router.navigate(['/login']);
    }
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
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

    updateUser(user: User, usernameOrId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    // Envoyer seulement les champs nécessaires
    const cleanUser: any = {};
    
    // Copier seulement les champs définis dans UserDTO
    if (user.username !== undefined) cleanUser.username = user.username;
    if (user.password !== undefined) cleanUser.password = user.password;
    if (user.nom !== undefined) cleanUser.nom = user.nom;
    if (user.prenom !== undefined) cleanUser.prenom = user.prenom;
    if (user.appUserRole !== undefined) cleanUser.appUserRole = user.appUserRole;
    if (user.poste !== undefined) cleanUser.poste = user.poste;
    if (user.status !== undefined) cleanUser.status = user.status;
    
    return this.http.put(
      `${this.API_URL}/${usernameOrId}`, 
      cleanUser, 
      { headers }
    );
  }

  deleteUser(usernameOrId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${usernameOrId}`, this.getHeaders());
  }
}
