// services/quest.service.ts
import { Injectable } from '@angular/core';
import { IBaseQuest, IQuests } from '../models/quest-interface';
import { IdRandomizerService } from '../../../../../../shared/id-randomizer.service';
import { MaterialType } from '../../../market/market.component';

interface Zone {
  code: string;
  name: string;
}

interface Sector {
  sector: number;
  zones: Zone[];
}

interface MaterialConfig {
  name: string;
  description: string;
  unit: string;
}

@Injectable({ providedIn: 'root' })
export class QuestService {
  private readonly zoneData: Sector[] = [
    {
      sector: 1,
      zones: [
        { code: 'A', name: 'north' },
        { code: 'B', name: 'east' },
        { code: 'C', name: 'south' },
        { code: 'D', name: 'west' },
        // { code: 'E', name: 'city' }
      ]
    },
    // {
    //   sector: 2,
    //   zones: [
    //     { code: 'A', name: 'north' },
    //     { code: 'B', name: 'east' },
    //     { code: 'C', name: 'south' },
    //     { code: 'D', name: 'west' },
    //   ]
    // },
    // {
    //   sector: 3,
    //   zones: [
    //     { code: 'A', name: 'north' },
    //     { code: 'B', name: 'east' },
    //     { code: 'C', name: 'south' },
    //     { code: 'D', name: 'west' },
    //   ]
    // },
    // {
    //   sector: 4,
    //   zones: [
    //     { code: 'A', name: 'north' },
    //     { code: 'B', name: 'east' },
    //     { code: 'C', name: 'south' },
    //     { code: 'D', name: 'west' },
    //   ]
    // },
  ];

  getZoneCodeByName(zoneName: string): string | undefined {
    const sectorOne = this.zoneData.find(s => s.sector === 1);
    return sectorOne?.zones.find(z => z.name === zoneName)?.code;
  }

  getZoneByCode(code: string): Zone | undefined {
    return this.zoneData
      .flatMap(s => s.zones)
      .find(z => z.code === code);
  }

  private readonly materialConfig: Record<MaterialType, MaterialConfig> = {
    [MaterialType.StoneBlocks]: {
      name: 'Stone Blocks',
      description: 'Heavy building materials for construction',
      unit: 'units'
    },
    [MaterialType.WoodenBoards]: {
      name: 'Wooden Boards',
      description: 'Processed lumber for building structures',
      unit: 'units'
    },
    [MaterialType.FoodBags]: {
      name: 'Food Bags',
      description: 'Sustenance for workers and soldiers',
      unit: 'bags'
    }
  };

  constructor(private idRandomizerService: IdRandomizerService) {}

  private generateDynamicLocation(): string {
    const selectedSector = this.zoneData.find(s => s.sector === 1)!;
    const randomZone = selectedSector.zones[Math.floor(Math.random() * selectedSector.zones.length)];
    return randomZone.name === 'city'
      ? randomZone.name
      : `${randomZone.name}${selectedSector.sector}`;
  }

  private getRandomMaterialType(): MaterialType {
    const materials = Object.values(MaterialType);
    return materials[Math.floor(Math.random() * materials.length)];
  }

  private calculateMaterialReward(materialType: MaterialType): number {
    const basePrices = {
      [MaterialType.StoneBlocks]: 15,
      [MaterialType.WoodenBoards]: 18,
      [MaterialType.FoodBags]: 25
    };

    return (basePrices[materialType] * 30) + Math.floor(Math.random() * 30);
  }

  private getDefaultQuests(): IQuests {
    const dynamicLocation = this.generateDynamicLocation();
    const isCity = dynamicLocation === 'E';

    return {
      services: [
        {
          id: 'service-template',
          type: ['services'],
          title: 'Show a good fight in the arena!',
          description: `In honor of a holiday in ${isCity ? 'the city' : 'a wealthy family'}, we order a grand fight in the arena.`,
          rating: 'F',
          currentCount: 0,
          finalizeCount: 1,
          goldReward: 100,
          location: dynamicLocation,
          questTargetKey: 'arena',
        }
      ],
      logistic: [
        {
          id: 'logistic-template',
          type: ['logistic', 'fort-post', 'MATERIAL_TYPE'],
          title: 'MATERIAL_TITLE',
          description: 'MATERIAL_DESCRIPTION',
          rating: 'F',
          currentCount: 0,
          finalizeCount: 30,
          goldReward: 200,
          location: dynamicLocation,
          questTargetKey: 'MATERIAL_TYPE' as MaterialType,
        }
      ]
    };
  }

  getRandomQuests(): IBaseQuest | null {
    const defaultQuests = this.getDefaultQuests();
    const categories = Object.keys(defaultQuests) as Array<keyof IQuests>;
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const questsInCategory = defaultQuests[randomCategory];

    if (questsInCategory?.length) {
      const baseQuest = {...questsInCategory[Math.floor(Math.random() * questsInCategory.length)]};
      const dynamicLocation = this.generateDynamicLocation();
      const isCity = dynamicLocation === 'E';

      if (randomCategory === 'logistic') {
        const materialType = this.getRandomMaterialType();
        const material = this.materialConfig[materialType];

        baseQuest.title = `Buy and deliver 30 ${material.unit} of ${material.name}`;
        baseQuest.description = `Your target location - ${dynamicLocation} fort post. ${material.description}`;
        baseQuest.questTargetKey = materialType;
        baseQuest.type = baseQuest.type.map(t => t === 'MATERIAL_TYPE' ? materialType : t);
        baseQuest.goldReward = this.calculateMaterialReward(materialType);
      }

      return {
        ...baseQuest,
        id: this.idRandomizerService.generateUniqueId(),
        location: dynamicLocation
      };
    }

    return null;
  }
}
