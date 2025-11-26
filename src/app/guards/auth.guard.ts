import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Vérifier l'existence du token
  const token = localStorage.getItem('token');

  if (token) {
    return true; // accès autorisé
  } else {
    Swal.fire({
      title: "Authentification requise",
      text: "Veuillez vous connecter",
      icon: "warning"
    });

    router.navigate(['/login']);
    return false;
  }
};
