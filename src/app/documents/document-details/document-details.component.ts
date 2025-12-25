import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Document, DocumentService } from 'app/services/documents/documents.service';
import { PassportService, PassportImagesResponse } from 'app/services/passport/passport.service';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss']
})
export class DocumentDetailsComponent implements OnInit, OnDestroy {

 numDocument!: string;
  document!: Document & any;

  isLoading = true;
  errorMessage = '';

  passportImages: PassportImagesResponse = {};

  // UI state
  isPassportOpen = true;
  isIdCardOpen = true;
  isFaceOpen = true;
  isPersonalInfoOpen = true;
  isRfidOpen = true;

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private passportService: PassportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const numDoc = this.route.snapshot.paramMap.get('numDocument');
    if (!numDoc) {
      this.errorMessage = 'Numéro de document manquant';
      this.isLoading = false;
      return;
    }

    this.numDocument = numDoc;

    this.documentService.getDocumentByNum(this.numDocument).subscribe({
      next: (data) => {
        this.document = data;

        if (this.document?.issuingCountry && this.document?.typeDoc) {
          this.loadPassportImages(
            this.document.issuingCountry,
            this.document.typeDoc
          );
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors du chargement du document';
        this.isLoading = false;
      }
    });
  }

  private loadPassportImages(countryCode: string, passportType: string): void {
    this.passportService.getPassportImages(countryCode, passportType).subscribe({
      next: (res) => {
        this.passportImages = res; // 🔥 DIRECT
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les images du passeport';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/documents']);
  }

  ngOnDestroy(): void {}  
}


/* import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Document, DocumentService } from 'app/services/documents/documents.service';
import { PassportService, PassportImagesResponse } from 'app/services/passport/passport.service';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss']
})
export class DocumentDetailsComponent implements OnInit, OnDestroy {

  numDocument!: string;
  document!: Document & any;
  loading: boolean = true;
  errorMessage: string = '';

  panelOpenState = false;
  passportImages?: PassportImagesResponse & {
    passportImageUrl?: string,
    uvImageUrl?: string
  };

  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private passportService: PassportService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    const numDoc = this.route.snapshot.paramMap.get('numDocument');
    if (!numDoc) {
      this.errorMessage = 'Numéro de document manquant dans l’URL';
      this.loading = false;
      return;
    }
    this.numDocument = numDoc;

    this.documentService.getDocumentByNum(this.numDocument).subscribe({
      next: (data) => {
        this.document = data;
        this.convertBlobsToUrls();
        this.isLoading = false;

        if (this.document.issuingCountry && this.document.typeDoc) {
          this.loadPassportImages(this.document.issuingCountry, this.document.typeDoc);
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement du document';
        this.loading = false;
        this.isLoading = false;
      }
    });
  }

  private loadPassportImages(countryCode: string, passportType: string) {
    this.passportService.getPassportImages(countryCode, passportType).subscribe({
      next: (res) => {
        this.passportImages = {
          ...res,
          passportImageUrl: res.passportImage ? res.passportImage : null,
          uvImageUrl: res.uvImage ? res.uvImage : null
        };https://chatgpt.com/c/693fc015-1880-8327-b2fb-5151c30e65da

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les images du passeport via l’API';
        this.loading = false;
      }
    });
  }


  private convertBlobsToUrls() {
    const doc = this.document;
    const fields = ['visiblePasseport', 'frontImage', 'backImage', 'face', 'liveFace', 'rfidFace'];

    fields.forEach(field => {
      if (doc[field]) {
        if (this.isBase64(doc[field])) {
          doc[field + 'Url'] = 'data:image/jpeg;base64,' + doc[field];
        }
      }
    });
  }

  private isBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  }

  ngOnDestroy(): void {
    const doc = this.document;
    if (doc) {
      ['visiblePasseport', 'frontImage', 'backImage', 'face', 'liveFace', 'rfidFace'].forEach(field => {
        if (doc[field + 'Url']) URL.revokeObjectURL(doc[field + 'Url']);
      });
    }
  }

  goBack() {
    this.router.navigate(['/documents']);
  }

}
 */

