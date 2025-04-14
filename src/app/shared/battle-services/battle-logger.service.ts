import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BattleLoggerService {
  private logs: string[] = [];

  addLog(messages: string | string[]): void {
    if (Array.isArray(messages)) {
      this.logs.push(...messages);
    } else {
      this.logs.push(messages);
    }
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}
