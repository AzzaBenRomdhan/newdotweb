import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // Ajouter l’en-tête Authorization si token existe
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Si le backend répond 401 => token expiré/invalide
    return next.handle(request).pipe(
  catchError((error: HttpErrorResponse) => {

    if (error.status === 401) {

      const message = (error.error ?? "").toString().toLowerCase();

      // Cas 1 : Token expiré
      if (message.includes("expired")) {
        console.log("⛔ Token expiré !");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return throwError(() => error);
      }

      // Cas 2 : Token invalide
      if (message.includes("invalid")) {
        console.log("⛔ Token invalide !");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return throwError(() => error);
      }

      // Cas 3 : Autre erreur 401 → NE PAS déconnecter
      console.warn("⚠ 401 reçu mais PAS lié au token");
      return throwError(() => error);
    }

    return throwError(() => error);
  })
);

  }
}
