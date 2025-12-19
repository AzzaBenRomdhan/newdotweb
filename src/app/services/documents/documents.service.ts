import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, map, shareReplay, tap } from 'rxjs/operators';

export interface Document {
  id?: string;

  // Infos OCR
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  numDocument: string;
  dateOfExp?: string;
  issuingCountry: string;
  nationality: string;
  gender: string;

  // Infos RFID
  rfidFirstName?: string;
  rfidLastName?: string;
  rfidDateOfBirth?: string;
  rfidNumDocument?: string;
  rfidDateOfExp?: string;
  rfidIssuingCountry?: string;
  rfidNationality?: string;
  rfidGender?: string;

  // Images
  face?: string;
  rfidFace?: string;
  liveFace?: string;
  frontImage?: string;
  backImage?: string;
  visiblePasseport?: string;

  // Champs additionnels venant du backend
  heureAjout?: string;
  typeDoc?: string;
  dateAjout?: string;
  username?: string;
  poste?: string;
  platform?: string;
  natureDoc?: string;
  rfid?: boolean;
  archive?: boolean;
  pdf?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseUrl = 'http://51.178.87.12:8085/documents';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  // -----------------------
  // Cache + flux observable
  // -----------------------
  private docsSubject = new BehaviorSubject<Document[] | null>(null);
  docs$ = this.docsSubject.asObservable();

  // Pour éviter des requêtes concurrentes multiples
  private inflight$?: Observable<Document[]>;

  // Chargement avec cache. Utiliser force=true pour recharger depuis l’API.
fetchAll(force = false): Observable<Document[]> {
  const cached = this.docsSubject.value;

  if (!force && cached) return of(cached);
  if (this.inflight$ && !force) return this.inflight$;

  this.inflight$ = this.http
    .get<Document[]>(`${this.baseUrl}/allWithoutImages`, this.getHeaders())
    .pipe(
      map(res => [...res].reverse()),
      tap(docs => this.docsSubject.next(docs)),
      finalize(() => (this.inflight$ = undefined)),
      shareReplay(1)
    );

  return this.inflight$;
}

  // -----------------------
  // CRUD + MAJ du cache
  // -----------------------

  createDocument(document: Document): Observable<Document> {
    return this.http.post<Document>(this.baseUrl, document, this.getHeaders()).pipe(
      tap(created => {
        const current = this.docsSubject.value ?? [];
        // On insère en tête pour garder l’ordre récent -> ancien
        this.docsSubject.next([created, ...current]);
      })
    );
  }

  // GET ONE BY NUMBER (inchangé)
  getDocumentByNum(numDocument: string): Observable<Document> {
    return this.http.get<Document>(`${this.baseUrl}/${numDocument}`, this.getHeaders());
  }

  updateDocument(id: number, document: Document): Observable<Document> {
    return this.http.put<Document>(`${this.baseUrl}/${id}`, document, this.getHeaders()).pipe(
      tap(updated => {
        const current = this.docsSubject.value ?? [];
        const next = current.map(d => (d.id === String(id) ? { ...d, ...updated } : d));
        this.docsSubject.next(next);
      })
    );
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/byId/${id}`, this.getHeaders()).pipe(
      tap(() => {
        const current = this.docsSubject.value ?? [];
        this.docsSubject.next(current.filter(d => d.id !== id));
      })
    );
  }
}