import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserHistory {
  id: number;
  userId: number;
  action: string;
  timestamp: string;
  ip: string;
  username: string;
  platform: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private API_URL = 'http://51.178.87.12:8097/history';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
  }

  // Historique d'un utilisateur
  getUserHistory(usernameOrId: string): Observable<UserHistory[]> {
    return this.http.get<UserHistory[]>(`${this.API_URL}/${usernameOrId}`);
  }

  // Historique global
  getAllHistory(): Observable<UserHistory[]> {
    return this.http.get<UserHistory[]>(this.API_URL);
  }

}
