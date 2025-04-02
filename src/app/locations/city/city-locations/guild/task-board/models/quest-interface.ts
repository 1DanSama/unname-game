import {MaterialType} from '../../../market/market.component';

export interface IQuests {
  services: IBaseQuest[];
  // crafting: ICraftingQuests;
  // harvesting: IHarvestingQuests;
  logistic: IBaseQuest[];
  // hunting: IHuntingQuest[];
  // extermination: IExterminationQuest[];
}

export type TQuestsStatus = 'active' | 'completed' | 'failed';


export interface IBaseQuest {
  id: string;
  type: string[];
  title: string;
  description: string;
  rating: IQuestRating;
  currentCount: number,
  finalizeCount: number,
  goldReward: number;
  status?: TQuestsStatus;
  location: string;
  questTargetKey: string
}

// export interface IServiceQuest extends IBaseQuest {
//   type: ['services'];
//   // Add service-specific properties if needed
// }
//
// export interface ILogisticQuest extends IBaseQuest {
//   type: 'logistic';
//   // Add logistics-specific properties if needed
// }
//
// // Define other categories with proper typing (even if empty for now)
// export interface ICraftingQuests {
//   // Define crafting-specific structure when needed
//   [key: string]: any; // Temporary until properly defined
// }
//
// export interface IHarvestingQuests {
//   // Define harvesting-specific structure when needed
//   [key: string]: any; // Temporary until properly defined
// }
//
// export interface IHuntingQuest extends IBaseQuest {
//   type: 'hunting';
//   // Add hunting-specific properties when needed
// }
//
// export interface IExterminationQuest extends IBaseQuest {
//   type: 'extermination';
//   // Add extermination-specific properties when needed
// }

// export type TQuestType = IServiceQuest | ILogisticQuest


// Type helpers
// export type IQuestType = 'services' | 'logistic' | 'hunting' | 'extermination';
export type IQuestRating = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S'; // Add all possible ratings
