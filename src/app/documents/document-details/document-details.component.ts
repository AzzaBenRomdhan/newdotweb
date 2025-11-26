import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Document, DocumentService } from 'app/services/documents/documents.service';


@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss']
})
export class DocumentDetailsComponent implements OnInit {

  numDocument!: string;
  document!: Document;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService
  ) { }

  ngOnInit(): void {
    // 1️⃣ Récupérer le numDocument depuis l'URL
    this.numDocument = this.route.snapshot.paramMap.get('numDocument')!;
    console.log("Numéro de document :", this.numDocument);

    // 2️⃣ Charger les détails du document
    this.documentService.getDocumentByNum(this.numDocument).subscribe({
      next: (data) => {
        this.document = data;
        this.loading = false;
        console.log('Détails du document :', this.document);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du document';
        this.loading = false;
        console.error(err);
      }
    });
  }

}
