import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface PassportImagesResponse {
  passportImage: string; // image principale (base64 ou URL)
  uvImage: string;       // image UV
  imageS: string;        // autre image si nécessaire
}
@Injectable({
  providedIn: 'root'
})
export class PassportService {

  private apiUrl =  'http://51.178.87.12:8096/api/passport';

  constructor(private http: HttpClient) { }
  
  getPassportImages(countryCode: string, passportType: string): Observable<PassportImagesResponse> {
    const url = `${this.apiUrl}/${countryCode}/${passportType}`;
    return this.http.get<PassportImagesResponse>(url);
  }
}