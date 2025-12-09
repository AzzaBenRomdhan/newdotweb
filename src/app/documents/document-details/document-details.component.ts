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
  document!: Document & any; // étendu pour stocker les URLs
  loading: boolean = true;
  errorMessage: string = '';

  panelOpenState = false;
  passportImages?: PassportImagesResponse & { passportImageUrl?: string, uvImageUrl?: string };
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

    // Charger les détails du document
    this.documentService.getDocumentByNum(this.numDocument).subscribe({
      next: (data) => {
        this.document = data;
        this.convertBlobsToUrls();
        this.isLoading = false;

        // Après avoir récupéré le document, charger les images UV via Passport API
        if (this.document.issuingCountry && this.document.typeDoc) {
          this.loadPassportImages(this.document.issuingCountry, this.document.typeDoc);
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du document';
        this.loading = false;
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Charger les images du passeport et UV
   * ⚠️ Convertir les blobs en data URLs pour que le composant Magnifier affiche le zoom correctement
   */
  private loadPassportImages(countryCode: string, passportType: string) {
    this.passportService.getPassportImages(countryCode, passportType).subscribe({
      next: async (res) => {
        this.passportImages = res;

        if (res.passportImage) {
          const blob = this.base64ToBlob(res.passportImage);
          this.passportImages.passportImageUrl = await this.blobToDataURL(blob);
        }

        if (res.uvImage) {
          const blob = this.base64ToBlob(res.uvImage);
          this.passportImages.uvImageUrl = await this.blobToDataURL(blob);
        }

        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Impossible de charger les images du passeport via l’API';
        this.loading = false;
      }
    });
  }

  // Convertir les images BLOB/base64 du document en data URL pour <app-magnifier>
  private convertBlobsToUrls() {
    const doc = this.document;
    const fields = ['visiblePasseport', 'frontImage', 'backImage', 'face', 'liveFace', 'rfidFace'];

    fields.forEach(field => {
      if (doc[field]) {
        if (this.isBase64(doc[field])) {
          doc[field + 'Url'] = 'data:image/jpeg;base64,' + doc[field];
        } else {
          // Si c’est un blob, convertir en data URL
          this.blobToDataURL(doc[field]).then(url => {
            doc[field + 'Url'] = url;
          });
        }
      }
    });
  }

  /** Vérifier si la chaîne est du Base64 */
  private isBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  }

  /** Convertir une base64 en Blob */
  private base64ToBlob(base64: string, contentType = 'image/jpeg'): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  /** Convertir un Blob en data URL pour le magnifier */
  private blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /** Nettoyer les URLs si besoin */
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
