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

  loading = true;
  isLoading = true;
  errorMessage = '';

  // 👉 TOUJOURS initialisé
  passportImages: {
    passportImageUrl?: string;
    uvImageUrl?: string;
  } = {};

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
      this.loading = false;
      return;
    }

    this.numDocument = numDoc;

    this.documentService.getDocumentByNum(this.numDocument).subscribe({
      next: (data) => {
        this.document = data;
        this.convertBlobsToUrls();

        if (this.document.issuingCountry && this.document.typeDoc) {
          this.loadPassportImages(
            this.document.issuingCountry,
            this.document.typeDoc
          );
        }

        this.loading = false;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du document';
        console.error(err);
        this.loading = false;
        this.isLoading = false;
      }
    });
  }

  /** Charger images passeport (fonctionne même sans UV) */
  private loadPassportImages(countryCode: string, passportType: string): void {
    this.passportService.getPassportImages(countryCode, passportType).subscribe({
      next: async (res: PassportImagesResponse) => {

        if (res.passportImage) {
          const blob = this.base64ToBlob(res.passportImage);
          this.passportImages.passportImageUrl =
            await this.blobToDataURL(blob);
        }

        if (res.uvImage) {
          const blob = this.base64ToBlob(res.uvImage);
          this.passportImages.uvImageUrl =
            await this.blobToDataURL(blob);
        }
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les images du passeport';
      }
    });
  }

  /** Convertir les images du document */
  private convertBlobsToUrls(): void {
    const fields = [
      'visiblePasseport',
      'frontImage',
      'backImage',
      'face',
      'liveFace',
      'rfidFace'
    ];

    fields.forEach(field => {
      if (this.document?.[field]) {
        if (this.isBase64(this.document[field])) {
          this.document[field + 'Url'] =
            'data:image/jpeg;base64,' + this.document[field];
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

  private base64ToBlob(base64: string, contentType = 'image/jpeg'): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    return new Blob([new Uint8Array(byteNumbers)], { type: contentType });
  }

  private blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  ngOnDestroy(): void {}

  goBack(): void {
    this.router.navigate(['/documents']);
  }
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

