// base-dungeon.component.ts
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {DungeonEventsService} from './services/dungeon-events.service';

export type DungeonArea = 'corridor' | 'room' | 'hall' | 'cave';
type Direction = 'left' | 'right' | 'top' | 'bottom';

interface MapRoom {
  row: number;
  col: number;
  dungeonArea: DungeonArea;
  enterSide: Direction | null;
  leaveSides: Direction[];
  connections: MapRoom[];
  visited: boolean;
  roomSize: {
    width: number;
    heigth: number;
  }
}

@Component({
  selector: 'app-base-dungeon',
  templateUrl: './base-dungeon.component.html',
  styleUrls: ['./base-dungeon.component.scss']
})
export class BaseDungeonComponent implements OnInit, AfterViewInit {
  @Input() rows: number = 7;
  @Input() maxRoomsPerRow: number = 7;

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  mainArray: MapRoom[][] = [];
  currentRoom!: MapRoom;
  pathHistory: MapRoom[] = [];
  private roomPositions: Map<string, DOMRect> = new Map();

  constructor(private dungeonEventsService: DungeonEventsService) {}

  ngOnInit() {
    this.generateDarkestDungeonMap();
    this.currentRoom = this.mainArray[0][0];
    this.currentRoom.visited = true;
    this.pathHistory = [this.currentRoom];
  }

  ngAfterViewInit() {
    setTimeout(() => this.cacheRoomPositions(), 0);
  }
  generateDarkestDungeonMap() {
    // Initialize first room
    this.mainArray = [[this.createRoom(0, Math.floor(Math.random() * this.maxRoomsPerRow), 'corridor', null, ['bottom'])]];

    for (let row = 1; row < this.rows; row++) {
      const newRow: MapRoom[] = [];
      const occupiedCols = new Set<number>();

      // 1. Create vertical connections
      this.mainArray[row - 1].forEach(prevRoom => {
        if (prevRoom.leaveSides.includes('bottom')) {
          const newCol = this.findAvailableCol(occupiedCols, prevRoom.col, row);
          if (newCol !== -1) {
            const newRoom = this.createRoom(
              row,
              newCol,
              this.getRandomDungeonArea(row),
              'top',
              this.getRandomExits(row)
            );
            occupiedCols.add(newCol);
            this.connectRooms(prevRoom, newRoom);
            newRow.push(newRoom);
          }
        }
      });

      // 2. Create horizontal connections
      const processQueue = [...newRow];
      while (processQueue.length > 0) {
        const currentRoom = processQueue.shift()!;

        // Process right exits
        if (currentRoom.leaveSides.includes('right') && this.isValidExit(currentRoom.row, currentRoom.col, 'right')) {
          const rightCol = currentRoom.col + 1;
          if (!occupiedCols.has(rightCol)) {
            const newRoom = this.createRoom(
              row,
              rightCol,
              this.getRandomDungeonArea(row),
              'left',
              this.getRandomExits(row)
            );
            occupiedCols.add(rightCol);
            this.connectRooms(currentRoom, newRoom);
            newRow.push(newRoom);
            processQueue.push(newRoom);
          }
        }

        // Process left exits
        if (currentRoom.leaveSides.includes('left') && this.isValidExit(currentRoom.row, currentRoom.col, 'left')) {
          const leftCol = currentRoom.col - 1;
          if (!occupiedCols.has(leftCol)) {
            const newRoom = this.createRoom(
              row,
              leftCol,
              this.getRandomDungeonArea(row),
              'right',
              this.getRandomExits(row)
            );
            occupiedCols.add(leftCol);
            this.connectRooms(currentRoom, newRoom);
            newRow.push(newRoom);
            processQueue.push(newRoom);
          }
        }
      }

      // 3. Sort and validate
      newRow.sort((a, b) => a.col - b.col);
      newRow.forEach(room => {
        room.leaveSides = room.leaveSides.filter(exit =>
          this.validateExit(room, exit)
        );
      });

      this.mainArray.push(newRow);
    }
  }

  private findAvailableCol(occupiedCols: Set<number>, preferredCol: number, row: number): number {
    // Try preferred column first
    if (!occupiedCols.has(preferredCol) && preferredCol < this.maxRoomsPerRow) {
      return preferredCol;
    }

    // Find nearest available column
    for (let offset = 1; offset < this.maxRoomsPerRow; offset++) {
      const colsToCheck = [
        preferredCol + offset,
        preferredCol - offset
      ];

      for (const col of colsToCheck) {
        if (col >= 0 && col < this.maxRoomsPerRow && !occupiedCols.has(col)) {
          return col;
        }
      }
    }
    return -1;
  }

  private validateExit(room: MapRoom, exit: Direction): boolean {
    switch (exit) {
      case 'bottom':
        return room.row < this.rows - 1;
      case 'top':
        return room.row > 0;
      case 'left':
        return room.col > 0 && !!room.connections.find(r => r.col === room.col - 1);
      case 'right':
        return room.col < this.maxRoomsPerRow - 1 && !!room.connections.find(r => r.col === room.col + 1);
      default:
        return false;
    }
  }

  private isValidExit(row: number, col: number, exit: Direction): boolean {
    switch(exit) {
      case 'bottom': return row < this.rows - 1;
      case 'top': return row > 0;
      case 'left': return col > 0;
      case 'right': return col < this.maxRoomsPerRow - 1;
      default: return false;
    }
  }


  private connectRooms(a: MapRoom, b: MapRoom) {
    if (!a.connections.includes(b)) a.connections.push(b);
    if (!b.connections.includes(a)) b.connections.push(a);
  }

  private createRoom(
    row: number,
    col: number,
    area: DungeonArea,
    enterSide: Direction | null,
    leaveSides: Direction[]
  ): MapRoom {
    return {
      row,
      col,
      dungeonArea: area,
      enterSide,
      leaveSides: leaveSides.filter(exit =>
        this.isValidExit(row, col, exit)
      ),
      connections: [],
      visited: false,
      roomSize: this.getRoomSize(area)
    };
  }

  getRoomSize(roomName: DungeonArea) {
    switch (roomName) {
      case 'corridor':
        return {
          width: 100,
          heigth: 100
        }
      case 'room':
        return {
          width: 100,
          heigth: 100
        }
      case 'hall':
        return {
          width: 100,
          heigth: 100
        }
      case 'cave':
        return {
          width: 100,
          heigth: 100
        }
      default:
        return {
          width: 100,
          heigth: 100
        }
    }
  }

  private getRandomDungeonArea(row: number): DungeonArea {
    const areas: DungeonArea[] = ['corridor', 'room', 'hall', 'cave']

    return areas[Math.floor(Math.random() * areas.length)] || 'corridor';
  }

  private getRandomExits(row: number): Direction[] {
    const exits: Direction[] = [];
    if (row < this.rows - 1 && Math.random() < 0.8) exits.push('bottom');
    if (Math.random() < 0.4) exits.push('left');
    if (Math.random() < 0.4) exits.push('right');
    return exits;
  }

  isAccessible(room: MapRoom): boolean {
    return this.currentRoom.connections.includes(room);
  }

  onRoomClick(room: MapRoom) {
    if (this.isAccessible(room)) {
      this.currentRoom = room;
      if (!room.visited) {
        room.visited = true;
        this.pathHistory.push(room);

        // TODO add event on new room enter
        this.dungeonEventsService.getRandomEvent(room.dungeonArea, room.visited)
      }
    }
  }

  private cacheRoomPositions() {
    this.roomPositions.clear();
    const rooms = this.mapContainer.nativeElement.querySelectorAll('.map-room');
    rooms.forEach((room: HTMLElement) => {
      const rect = room.getBoundingClientRect();
      const id = room.getAttribute('data-room-id')!;
      this.roomPositions.set(id, rect);
    });
  }

  getRoomAtPosition(rowIndex: number, colIndex: number): MapRoom | undefined {
    return this.mainArray[rowIndex]?.find(room => room.col === colIndex);
  }
}
