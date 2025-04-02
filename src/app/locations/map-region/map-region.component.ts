import {Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from './map-region-modals/moving-confirmation-modal/moving-confirmation-modal.component';
import {FortPostMenuComponent} from './map-region-modals/fort-post-menu/fort-post-menu.component';

@Component({
  selector: 'app-map-region',
  templateUrl: './map-region.component.html',
  styleUrls: ['./map-region.component.scss']
})
export class MapRegionComponent implements OnInit {
  zones = [
    { id: 1, name: 'North Zone 1', health: 25, position: 'north' },
    { id: 2, name: 'East Zone 1', health: 25, position: 'east' },
    { id: 3, name: 'South Zone 1', health: 25, position: 'south' },
    { id: 4, name: 'West Zone 1', health: 25, position: 'west' },
    { id: 5, name: 'Central City', health: 100, position: 'city' }
  ];

  @ViewChild('cityElement') cityElement!: ElementRef;
  isAnimating = false;
  currentZonePosition = 'city';

  constructor(public dialog: MatDialog, private renderer: Renderer2) {}

  onZoneClick(event: MouseEvent) {
    const zoneElement = this.getZoneFromEvent(event);
    if (!zoneElement) return;

    const zone = zoneElement.dataset['zone']; // Use data-zone attribute
    if(zone !== this.currentZonePosition) {
    if (this.isAnimating || !zone || zone === this.currentZonePosition) return;
    }
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        target: zone,
        content: `Move from ${this.currentZonePosition} to ${zone}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const sourceEl = this.currentZonePosition === 'city'
          ? this.cityElement.nativeElement
          : document.querySelector(`[data-zone="${this.currentZonePosition}"]`);

        const targetEl = zone === 'city'
          ? this.cityElement.nativeElement
          : document.querySelector(`[data-zone="${zone}"]`);

        if (sourceEl && targetEl) {
          this.animateMovement(sourceEl, targetEl, zone);
        }
      }
    });

  }

  private getZoneFromEvent(event: MouseEvent): HTMLElement | null {
    const element = event.target as HTMLElement;
    return element.closest('[data-zone]');
  }

  private animateMovement(sourceEl: HTMLElement, targetEl: HTMLElement, targetZone: string) {
    if (this.isAnimating || !sourceEl || !targetEl) return;

    try {
      if(targetZone === this.currentZonePosition) {
        this.openSelectionModal(targetZone);
        return;
      }
      this.isAnimating = true;

      // Cache elements and rectangles
      const animationContainer = document.querySelector('.animation-container') as HTMLElement;
      if (!animationContainer) return;

      const [sourceRect, targetRect] = [sourceEl, targetEl]
        .map(el => el.getBoundingClientRect());

      // Calculate positions using destructuring
      const { left: sLeft, top: sTop, width: sWidth, height: sHeight } = sourceRect;
      const { left: tLeft, top: tTop, width: tWidth, height: tHeight } = targetRect;

      // Calculate center points
      const startX = sLeft + sWidth / 2;
      const startY = sTop + sHeight / 2;
      const endX = tLeft + tWidth / 2;
      const endY = tTop + tHeight / 2;

      // Calculate animation parameters
      const deltaX = endX - startX;  // Directly affects movement speed perception
      const deltaY = endY - startY;  // Longer distance + fixed duration = faster apparent speed
      const lineLength = Math.hypot(deltaX, deltaY);
      const lineAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      // Batch CSS variable updates
      const cssVars = {
        '--start-x': `${startX}px`,
        '--start-y': `${startY}px`,
        '--delta-x': `${deltaX}px`,
        '--delta-y': `${deltaY}px`,
        '--line-length': `${lineLength}px`,
        '--line-angle': `${lineAngle}deg`
      };

      Object.entries(cssVars).forEach(([key, value]) => {
        animationContainer.style.setProperty(key, value);
      });

      // Specific animation end listener
      const movingIcon = animationContainer.querySelector('.moving-icon');
      const animationEndHandler = () => {
        this.isAnimating = false;
        this.currentZonePosition = targetZone;
        movingIcon?.removeEventListener('animationend', animationEndHandler);

        this.openSelectionModal(targetZone);
      };

      movingIcon?.addEventListener('animationend', animationEndHandler, { once: true });
    } catch (error) {
      console.error('Animation error:', error);
      this.isAnimating = false;
    }
  }

  openSelectionModal(targetZone: string): void {
    const dialogRef  = this.dialog.open(FortPostMenuComponent, {
      width: '600px',
      disableClose: false,
      autoFocus: false,
      panelClass: 'custom-modal',
      data:{targetZone}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result', result)
      }
    })
  }

  ngOnInit(): void {
    console.log('Component initialized');
  }
}
