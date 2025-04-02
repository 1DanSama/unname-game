import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import {IBaseQuest} from '../models/quest-interface';

@Component({
  selector: 'app-quest-template',
  imports: [
    NgClass
  ],
  templateUrl: './quest-template.component.html',
  styleUrl: './quest-template.component.scss'
})
export class QuestTemplateComponent {
  @Input() quest!: IBaseQuest;
  @Output() selected = new EventEmitter<IBaseQuest>();

  onClick() {
    this.selected.emit(this.quest);
  }
}
