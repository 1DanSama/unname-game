import {Component, Input, Output, EventEmitter, OnDestroy, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {dialogs} from './dialog';
import {NgClass} from '@angular/common';

export interface IDialogConfigs {
  scenes: DialogScene[];
}

export interface IChoiseData {
  text: string;
  pathId: number;
}

export interface DialogScene {
  id: number
  activeCharacterName: string;
  speechContext: string;
  speechDescription: string;
  backgroundImg: string;
  activeCharacterAvatar: string;
  avatarPosition: string;
  choise?: IChoiseData[]
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {
  @Input() configs!: IDialogConfigs;
  @Input() typingSpeed = 40;
  @Output() sceneChanged = new EventEmitter<number>();
  @Output() dialogCompleted = new EventEmitter<void>();

  currentSceneIndex = 0;
  displayedText = '';
  isTyping = false;
  private intervalId: any;
  private timeoutId: any;

  constructor(private activatedRoute: ActivatedRoute) {}


  get currentScene(): DialogScene | null {
    if (!this.configs?.scenes || this.currentSceneIndex >= this.configs.scenes.length) {
      return null;
    }
    return this.configs.scenes[this.currentSceneIndex];
  }

  get progress(): number {
    return ((this.currentSceneIndex + 1) / this.configs.scenes.length) * 100;
  }

  @HostListener('document:keydown.space', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault();
    this.nextScene();
  }

  ngOnDestroy() {
    this.clearTimers();
  }

  private clearTimers() {
    clearInterval(this.intervalId);
    clearTimeout(this.timeoutId);
  }

  startTypingEffect() {
    this.clearTimers();
    this.isTyping = true;
    let index = 0;
    const fullText = this.currentScene?.speechContext || '';

    this.intervalId = setInterval(() => {
      if (index < fullText.length) {
        this.displayedText += fullText.charAt(index);
        index++;
      } else {
        this.isTyping = false;
        this.clearTimers();
      }
    }, this.typingSpeed);
  }

  nextScene() {
    if (this.isTyping) {
      this.completeCurrentText();
      return;
    }

    if (this.currentSceneIndex < this.configs.scenes.length - 1) {
      this.currentSceneIndex++;
      this.sceneChanged.emit(this.currentSceneIndex);
      this.resetText();
      this.startTypingEffect();
    } else {
      this.dialogCompleted.emit();
    }
  }

  private completeCurrentText() {
    this.displayedText = this.currentScene?.speechContext || '';
    this.isTyping = false;
    this.clearTimers();
  }

  private resetText() {
    this.displayedText = '';
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const dialogNumber = params['chapterCount'];
      this.configs = dialogs[dialogNumber];
    });
    this.startTypingEffect()
  }

  makeChoise(pathId: number) {
    const newSceneIndex = this.configs.scenes.findIndex(scene => scene.id === pathId);

    if (newSceneIndex > -1) {
      this.currentSceneIndex = newSceneIndex;
      this.displayedText = '';
      this.startTypingEffect();
    } else {
      console.error(`Scene with id ${pathId} not found!`);
    }
  }
}
