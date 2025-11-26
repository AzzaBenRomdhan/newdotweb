import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from 'app/services/documents/documents.service';
interface Document {
  numDocument: string;
  issuingCountry: string;
  lastName: string;
  firstName: string;
  nationality: string;
  gender: string;
}
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  documents: any[] = [];        // Données originales
  filteredDocuments: any[] = []; // Données filtrées affichées

  globalSearch = '';

  filters = {
    numDocument: '',
    issuingCountry: '',
    lastName: '',
    firstName: '',
    nationality: '',
    gender: ''
  };

  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.loadDocuments();
  }
  constructor(private documentService: DocumentService, private router: Router) {}

 loadDocuments() {
  this.documentService.getAllDocuments().subscribe({
    next: (res) => {
      this.documents = res;  // ← Les données récupérées depuis ton backend
      this.applyFilter();     // ← On applique les filtres automatiquement
    },
    error: (err) => {
      console.error("Erreur lors de la récupération des documents :", err);
    }
  });
}

  // 👁️ Voir détails
  voirDetails(doc: Document) {
    this.router.navigate(['/document-Details', doc.numDocument]);
    console.log('redirigé');
  }
  applyFilter() {
    const search = this.globalSearch.toLowerCase();

    this.filteredDocuments = this.documents.filter(doc => {

      const matchesSearch =
        (doc.numDocument + doc.issuingCountry + doc.lastName + doc.firstName + doc.nationality + doc.gender)
          .toLowerCase()
          .includes(search);

      return (
        matchesSearch &&
        (!this.filters.numDocument || doc.numDocument.includes(this.filters.numDocument)) &&
        (!this.filters.issuingCountry || doc.issuingCountry.includes(this.filters.issuingCountry)) &&
        (!this.filters.lastName || doc.lastName.toLowerCase().includes(this.filters.lastName.toLowerCase())) &&
        (!this.filters.firstName || doc.firstName.toLowerCase().includes(this.filters.firstName.toLowerCase())) &&
        (!this.filters.nationality || doc.nationality.toLowerCase().includes(this.filters.nationality.toLowerCase())) &&
        (!this.filters.gender || doc.gender === this.filters.gender)
      );
    });

    this.sortResults();
  }

  resetFilters() {
    this.filters = {
      numDocument: '',
      issuingCountry: '',
      lastName: '',
      firstName: '',
      nationality: '',
      gender: ''
    };
    this.globalSearch = '';
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
  }

  sortResults() {
    if (!this.sortField) return;

    this.filteredDocuments.sort((a, b) => {
      const valA = a[this.sortField];
      const valB = b[this.sortField];

      return this.sortDirection === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }
}
