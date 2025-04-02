import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BattleLoggerService {
  private logs: string[] = [];

  addLog(message: string): void {
    this.logs.push(message);
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}
