import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// Interface du Document (optionnelle mais recommandée)
export interface Document {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  numDocument: string;
  dateOfExp?: string;
  issuingCountry: string;
  nationality: string;
  gender: string;

  rfidFirstName?: string;
  rfidLastName?: string;
  rfidDateOfBirth?: string;
  rfidNumDocument?: string;
  rfidDateOfExp?: string;
  rfidIssuingCountry?: string;
  rfidNationality?: string;
  rfidGender?: string;

  face?: string;
  rfidFace?: string;
  liveFace?: string;
  frontImage?: string;
  backImage?: string;
  visiblePasseport?: string;
}
@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private baseUrl = 'http://localhost:9090/documents'; // URL backend

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  // ➕ CREATE DOCUMENT
  createDocument(document: Document): Observable<any> {
    return this.http.post(this.baseUrl, document, { headers: this.getHeaders() });
  }

  // 📄 GET ALL DOCUMENTS
  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  // 🔍 GET DOCUMENT BY numDocument
  getDocumentByNum(numDocument: string): Observable<Document> {
    return this.http.get<Document>(`${this.baseUrl}/${numDocument}`, { headers: this.getHeaders() });
  }

  // ✏️ UPDATE DOCUMENT (par ID)
  updateDocument(id: number, document: Document): Observable<Document> {
    return this.http.put<Document>(`${this.baseUrl}/${id}`, document, { headers: this.getHeaders() });
  }

  // 🗑️ DELETE DOCUMENT (par numDocument)
  deleteDocument(numDocument: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${numDocument}`, { headers: this.getHeaders() });
  }
}