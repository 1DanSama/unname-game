import {Component, EventEmitter, Output} from '@angular/core';
import {SaveLoadService} from '../save-load.service';

@Component({
  selector: 'app-load-modal',
  imports: [],
  templateUrl: './load-modal.component.html',
  styleUrl: './load-modal.component.scss'
})

export class LoadModalComponent {
  @Output() closed = new EventEmitter<void>();
  visible = true;
  loading = false;
  error = '';

  constructor(private saveLoad: SaveLoadService) {}

  handleFileInput(event: Event) {
    this.loading = true;
    this.error = '';
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.saveLoad.loadGame(file).subscribe({
        next: () => {
          this.close();
        },
        error: (err) => {
          this.loading = false;
          this.error = err.message || 'Invalid save file';
          input.value = '';
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  close() {
    this.visible = false;
    this.closed.emit();
  }
}
