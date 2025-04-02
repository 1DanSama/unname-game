import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdRandomizerService {

  generateUniqueId(prefix: string = ''): string {
    const timestamp = Date.now().toString(36); // Base 36 for shorter string
    const random = Math.random().toString(36).substring(2, 9); // Random string
    return `${prefix}${timestamp}${random}`;
  }
}
