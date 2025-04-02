import {
  IBattleCharacter
} from '../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';


export interface ITargetSelectionStrategy {
  selectTarget(targets: IBattleCharacter[]): IBattleCharacter;
}
