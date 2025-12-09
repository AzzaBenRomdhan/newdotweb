import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Document, DocumentService } from 'app/services/documents/documents.service';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  pagedDocuments: Document[] = [];

  isLoading = true;
  errorMessage = '';

  globalSearch = '';
  filters = {
    dateAjout: '',
    typeDocument: '',
    numDocument: '',
    issuingCountry: '',
    nationality: '',
    username: '',
    poste: '',
    natureDoc: ''
  };

  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  pageSize = 10;
  currentPage = 0;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // 1) Déclenche le fetch si nécessaire (sinon récupère le cache)
    this.isLoading = true;
    this.documentService.fetchAll().pipe(take(1)).subscribe({
      next: () => (this.isLoading = false),
      error: () => (this.isLoading = false)
    });

    // 2) S’abonner au flux de documents cache
    this.documentService.docs$
      .pipe(
        filter((docs): docs is Document[] => Array.isArray(docs)),
        takeUntil(this.destroy$)
      )
      .subscribe(docs => {
        this.documents = docs;
        this.applyFilter();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Naviguer vers détails
  voirDetails(doc: Document) {
    this.router.navigate(['/document-Details', doc.numDocument]);
  }
  // Appliquer filtres + recherche globale (inchangé)
  applyFilter() {
    const search = this.globalSearch.toLowerCase();

    this.filteredDocuments = this.documents.filter(doc => {
      const matchSearch = (
        (doc.typeDoc ?? '') +
        (doc.numDocument ?? '') +
        (doc.issuingCountry ?? '') +
        (doc.username ?? '') +
        (doc.nationality ?? '') +
        (doc.poste ?? '') +
        (doc.natureDoc ?? '')
      ).toLowerCase().includes(search);

      let matchType = true;
      if (this.filters.typeDocument) {
        matchType = this.filters.typeDocument === 'P-GROUP'
          ? ['P', 'PD', 'PS'].includes(doc.typeDoc)
          : doc.typeDoc === this.filters.typeDocument;
      }

      let matchDate = true;
      if (this.filters.dateAjout) {
        matchDate = new Date(doc.dateAjout).toDateString() === new Date(this.filters.dateAjout).toDateString();
      }

      return (
        matchSearch &&
        matchType &&
        matchDate &&
        (!this.filters.numDocument || (doc.numDocument ?? '').toLowerCase().includes(this.filters.numDocument.toLowerCase())) &&
        (!this.filters.natureDoc || (doc.natureDoc ?? '').toLowerCase().includes(this.filters.natureDoc.toLowerCase())) &&
        (!this.filters.poste || (doc.poste ?? '').toLowerCase().includes(this.filters.poste.toLowerCase())) &&
        (!this.filters.issuingCountry || (doc.issuingCountry ?? '').toLowerCase().includes(this.filters.issuingCountry.toLowerCase())) &&
        (!this.filters.username || (doc.username ?? '').toLowerCase().includes(this.filters.username.toLowerCase())) &&
        (!this.filters.nationality || (doc.nationality ?? '').toLowerCase().includes(this.filters.nationality.toLowerCase()))
      );
    });

    this.sortResults();
    this.updatePagedDocuments();
  }

  resetFilters() {
    this.filters = {
      dateAjout: '',
      typeDocument: '',
      numDocument: '',
      issuingCountry: '',
      nationality: '',
      username: '',
      poste: '',
      natureDoc: ''
    };
    this.globalSearch = '';
    this.currentPage = 0;
    this.applyFilter();
  }

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortResults();
    this.updatePagedDocuments();
  }

  sortResults() {
    if (!this.sortField) return;
    this.filteredDocuments.sort((a, b) => {
      const A = (a[this.sortField] ?? '').toString().toLowerCase();
      const B = (b[this.sortField] ?? '').toString().toLowerCase();
      return this.sortDirection === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
    });
  }

  updatePagedDocuments() {
    const start = this.currentPage * this.pageSize;
    this.pagedDocuments = this.filteredDocuments.slice(start, start + this.pageSize);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedDocuments();
  }

  deleteDoc(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Êtes-vous sûr de vouloir supprimer ce document ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documentService.deleteDocument(id).subscribe({
          next: () => {
            // Plus besoin de manipuler manuellement les tableaux ici :
            // docs$ réémettra automatiquement la liste mise à jour,
            // ce qui relancera applyFilter() via l’abonnement.
          },
          error: err => {
            console.error(err);
            this.errorMessage = 'Erreur lors de la suppression';
          }
        });
      }
    });
  }

  downloadPdf(doc: any) {
    if (!doc.pdf) {
      alert("Aucun PDF disponible pour ce document.");
      return;
    }
    const byteCharacters = atob(doc.pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    window.open(URL.createObjectURL(blob), '_blank');
  }
}