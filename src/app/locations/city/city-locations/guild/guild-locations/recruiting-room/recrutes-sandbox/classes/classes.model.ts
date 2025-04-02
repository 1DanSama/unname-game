import {ICharacter, IPersonalStats, rowPosition, Stat} from '../character-creator.interface';
import {CharacterClass} from '../../../../../../../../store/recruted-adventures/recruted-abventures.model';

export const defaultStats = {
  [Stat.Vitality]: 3,
  [Stat.Strength]: 3,
  [Stat.Agility]: 3,
  [Stat.Intellect]: 3
}

const ON_CLASS_STAT_POINTS = 5;
const ON_RANDOM_STAT_POINTS = 5;



const addClassPoints = (className:  CharacterClass) => {
  const result = defaultStats
  switch (className) {
    case CharacterClass.Warrior:
      return {
        ...defaultStats,
        vitality: defaultStats.vitality + ON_CLASS_STAT_POINTS
      };
    case CharacterClass.Wizard:
    case CharacterClass.Healer:
      return {
        ...defaultStats,
        intellect: defaultStats.intellect + ON_CLASS_STAT_POINTS
      };

    case CharacterClass.Rogue:
      return {
        ...defaultStats,
        agility: defaultStats.agility + ON_CLASS_STAT_POINTS
      };

    default:
      return { ...defaultStats };
  }
};


const setRandomPoints = (personalStats: IPersonalStats ) =>{
  const randomStatsPoint = ON_RANDOM_STAT_POINTS;
  const statsKeys: Stat[] = Object.values(Stat);
  for (let i = 0; i < ON_RANDOM_STAT_POINTS; i ++) {
    const randomStat: Stat = statsKeys[Math.floor(Math.random() * statsKeys.length)];
    personalStats[randomStat] +=1;
  }
  return personalStats
}

export const createPersonalStats = (className:  CharacterClass)=> {
  return setRandomPoints(addClassPoints(className))
}

export const getRowClassPosition = (className:  CharacterClass, priorityPosition: rowPosition| null = null): rowPosition => {
  if (priorityPosition) {
    return priorityPosition
  }

  switch (className) {
    case CharacterClass.Warrior:
      return 1;
    case CharacterClass.Wizard:
    case CharacterClass.Healer:
      return 3;

    case CharacterClass.Rogue:
      return 2;

    default:
      return 1;
  }
}
