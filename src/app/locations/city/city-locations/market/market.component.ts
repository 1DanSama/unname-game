import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IGuildStoreState, TEquipmentSlots } from '../../../../store/guild-store/guild-store.reducer';
import { take } from 'rxjs';
import {getGoldCount, getMaterialsCount, selectEquipment} from '../../../../store/guild-store/guild-store.selector';
import { EquipmentSlot, ItemForEquip } from '../../../../store/guild-store/models/item.model';
import { RandomItemGeneratorService } from '../../../../shared/item-creator.service';
import { FormsModule } from '@angular/forms';
import { GuildStoreActions } from '../../../../store/guild-store/guild-store.actions';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';

export enum MaterialType {
  StoneBlocks = 'stoneBlocks',
  WoodenBoards = 'woodenBoards',
  FoodBags = 'foodBags'
}

export interface Material {
  id: string;
  type: MaterialType;
  title: string;
  description: string;
  weight: number;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
  imports: [
    FormsModule,
    MatSelectModule,
    MatInputModule,
    CommonModule,
    MatButton
  ],
  standalone: true
})
export class MarketComponent implements OnInit {
  equipsForSell: TEquipmentSlots | undefined = {};
  materialsForSell: Material[] = [];
  goldCount: number = 0;

  // Selection options
  equipmentSlots = Object.values(EquipmentSlot);
  materialTypes = Object.values(MaterialType);
  selectedSlot: EquipmentSlot = this.equipmentSlots[0];
  selectedMaterialType: MaterialType = this.materialTypes[0];
  selectedMode: 'Buy' | 'Sell' = 'Buy';
  selectedCategory: 'Equipment' | 'Materials' = 'Equipment';

  constructor(
    private readonly guildStore: Store<IGuildStoreState>,
    private readonly randomItemGeneratorService: RandomItemGeneratorService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.guildStore.select(getGoldCount).pipe(take(1)).subscribe(gold => this.goldCount = gold);
  }

  ngOnInit(): void {
    this.generateMaterials();
    this.checkMode('Buy');
  }

  onCategoryChange() {
    if (this.selectedCategory === 'Equipment') {
      this.checkMode(this.selectedMode);
    } else {
      this.generateMaterials();
    }
  }

  generateMaterials() {
    this.materialsForSell = [
      {
        id: 'mat-1',
        type: MaterialType.StoneBlocks,
        title: 'Stone Blocks',
        description: 'Heavy building materials for construction',
        weight: 10,
        price: 15,
        quantity: 1
      },
      {
        id: 'mat-2',
        type: MaterialType.WoodenBoards,
        title: 'Wooden Boards',
        description: 'Processed lumber for building structures',
        weight: 5,
        price: 18,
        quantity: 1
      },
      {
        id: 'mat-3',
        type: MaterialType.FoodBags,
        title: 'Food Bags',
        description: 'Sustenance for workers and soldiers',
        weight: 2,
        price: 25,
        quantity: 1
      }
    ];
  }

  updateMaterialQuantity(material: Material, event: Event) {
    const input = event.target as HTMLInputElement;
    const numericValue = parseInt(input.value, 10) || 1;
    material.quantity = Math.max(1, Math.min(99, numericValue));
  }

  onBuyMaterial(material: Material) {
    const total = material.price * material.quantity;
    if (this.selectedMode === 'Buy') {
      if (this.goldCount >= total) {
        this.guildStore.dispatch(GuildStoreActions.decreaseGold({
          gold: total
        }));
        this.guildStore.dispatch(GuildStoreActions.addMaterials({
          materialName: material.type,
          amount: material.quantity
        }));
      }
    } else {
      this.guildStore.dispatch(GuildStoreActions.increaseGold({
        gold: total
      }));
      this.guildStore.dispatch(GuildStoreActions.removeMaterials({
        materialName: material.type,
        amount: material.quantity
      }));
    }
    this.updateGold();
  }

  private updateGold() {
    this.guildStore.select(getGoldCount).pipe(take(1)).subscribe(gold => {
      this.goldCount = gold;
      this.cdr.detectChanges();
    });
  }

  checkMode(selectedMode: "Buy" | "Sell") {
    if (this.selectedCategory === 'Equipment') {
      if (selectedMode === "Buy") {
        this.equipsForSell = {
          [this.selectedSlot]: this.randomItemGeneratorService.generateRandomItems(1, 9, EquipmentSlot[this.selectedSlot])
        };
      } else {
        this.guildStore.select(selectEquipment).pipe(take(1)).subscribe(
          equips => this.equipsForSell = equips
        );
      }
    }
  }

  onSlotChange(selectedSlot: EquipmentSlot) {
    this.checkMode(this.selectedMode);
  }

  protected readonly EquipmentSlot = EquipmentSlot;
  protected readonly MaterialType = MaterialType;
  protected readonly Number = Number;
  protected readonly Object = Object;
  protected readonly HTMLInputElement = HTMLInputElement;
}
