import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DocumentCounts {
  passportCount: number;
  idCount: number;
}

export interface DocumentStats {
  date: string;   // correspond à la dateAjout en string
  count: number;  // nombre d’envois pour cette date
}
export interface DocumentStatsMonth {
  year: number;
  month: number;
  typeDoc: string;
  count: number;
}
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://51.178.87.12:8085/dashboard'; // URL de ton backend
  private apiUrl2 = 'http://localhost:8080/dashboard'; // URL de ton backend

  constructor(private http: HttpClient) { }

  // Récupérer les nombres de documents
  getDocumentCounts(): Observable<DocumentCounts> {
    return this.http.get<DocumentCounts>(`${this.apiUrl}/counts`);
  }

  // Récupérer les statistiques par date
  getDocumentStats(): Observable<DocumentStats[]> {
    return this.http.get<DocumentStats[]>(`${this.apiUrl}/stats`);
  }
   getDocumentStatsPrMonth(): Observable<DocumentStatsMonth[]> {
    return this.http.get<DocumentStatsMonth[]>(`${this.apiUrl}/stats/month`);
  }
}
