import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-magnifier',
  templateUrl: './magnifier.component.html',
  styleUrls: ['./magnifier.component.scss'],
})
export class MagnifierComponent implements AfterViewInit {
  @Input() src!: string;          // URL de l’image
  @Input() zoom = 2;              // Facteur de zoom (ex: 2 = 200%)
  @Input() lensSize = 160;        // Diamètre de la loupe en px

  @ViewChild('img', { static: true }) imgRef!: ElementRef<HTMLImageElement>;

  showLens = false;
  lensLeft = 0;
  lensTop = 0;
  bgSize = '';
  bgPos = '0 0';

  ngAfterViewInit(): void {
    const img = this.imgRef.nativeElement;
    if (img.complete) {
      this.updateBgSize();
    } else {
      img.addEventListener('load', () => this.updateBgSize(), { once: true });
    }
  }

  private updateBgSize(): void {
    const rect = this.imgRef.nativeElement.getBoundingClientRect();
    // On utilise les dimensions affichées * zoom pour un mapping parfait
    this.bgSize = `${rect.width * this.zoom}px ${rect.height * this.zoom}px`;
  }

  onPointerEnter(): void {
    this.showLens = true;
    this.updateBgSize();
  }

  onPointerLeave(): void {
    this.showLens = false;
  }

  onPointerMove(ev: PointerEvent | TouchEvent): void {
    let clientX: number;
    let clientY: number;

    if ('touches' in ev) {
      if (ev.touches.length === 0) return;
      clientX = ev.touches[0].clientX;
      clientY = ev.touches[0].clientY;
    } else {
      clientX = ev.clientX;
      clientY = ev.clientY;
    }

    const rect = this.imgRef.nativeElement.getBoundingClientRect();
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // Contraindre dans l’image
    x = Math.max(0, Math.min(rect.width, x));
    y = Math.max(0, Math.min(rect.height, y));

    // Position de la loupe (centrée sous le pointeur)
    this.lensLeft = x - this.lensSize / 2;
    this.lensTop = y - this.lensSize / 2;

    // Position d’arrière-plan pour faire correspondre le zoom
    const bgX = -(x * this.zoom - this.lensSize / 2);
    const bgY = -(y * this.zoom - this.lensSize / 2);
    this.bgPos = `${bgX}px ${bgY}px`;
  }
}