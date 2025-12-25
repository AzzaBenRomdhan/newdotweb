import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/* export interface PassportImagesResponse {
  passportImage: string; // image principale (base64 ou URL)
  uvImage: string;       // image UV
  imageS: string;        // autre image si nécessaire
} */

export interface PassportImagesResponse {
  passportImage?: string;
  uvImage?: string;
  irImage?: string;
  image_of_bearer?: string;
  passport_cover_img?: string;
  passport_binding?: string;
  passport_front_endPaper?: string;
  passport_laminate?: string;
  passport_waterMark?: string;
  passport_model?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PassportService {

  //private apiUrl =  'http://192.168.1.13:8096/api/passport';
  private apiUrl =  'http://51.178.87.12:8093/api/passport';

  constructor(private http: HttpClient) { }
  
  getPassportImages(countryCode: string, passportType: string): Observable<PassportImagesResponse> {
    const url = `${this.apiUrl}/${countryCode}/${passportType}`;
    return this.http.get<PassportImagesResponse>(url);
  }
}