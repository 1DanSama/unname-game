import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NameGeneratorService {
  private readonly nameParts = {
    Warrior: {
      prefixes: [
        'Iron', 'Stone', 'Steel', 'Thunder', 'Flame', 'Frost', 'Mountain', 'Blood',
        'Valiant', 'Dauntless', 'Obsidian', 'Titan', 'Vanguard', 'Raging', 'Juggernaut',
        'Colossus', 'Berserk', 'Phoenix', 'Dragon', 'Wolf', 'Bear', 'Glory', 'Honor',
        'Sovereign', 'Imperium', 'Oathkeeper', 'Storm', 'Valkyr', 'Rune', 'Forge'
      ],
      suffixes: [
        'Fist', 'Guardian', 'Wrath', 'Hammer', 'Breaker', 'Crusher', 'Aegis', 'Bastion',
        'Wall', 'Titan', 'Anvil', 'Might', 'Slayer', 'Defender', 'Bulwark', 'Colossus',
        'Fortress', 'Paladin', 'Champion', 'Sentinel', 'Warmonger', 'Juggernaut', 'Rage',
        'Gauntlet', 'Sunder', 'Ram', 'Vanguard', 'Heart', 'Brand', 'Forge'
      ]
    },
    Rogue: {
      prefixes: [
        'Shadow', 'Silent', 'Swift', 'Night', 'Ghost', 'Raven', 'Phantom', 'Viper',
        'Whisper', 'Crow', 'Dusk', 'Shade', 'Cloak', 'Serpent', 'Fang', 'Blade',
        'Smoke', 'Eclipse', 'Midnight', 'Thorn', 'Venom', 'Cobra', 'Hawk', 'Falcon',
        'Wraith', 'Specter', 'Prowler', 'Stalker', 'Void', 'Nether'
      ],
      suffixes: [
        'Dagger', 'Whisper', 'Stalker', 'Edge', 'Claw', 'Shiv', 'Veil', 'Sting',
        'Bite', 'Grin', 'Mask', 'Shroud', 'Talon', 'Fang', 'Blade', 'Strike',
        'Step', 'Kiss', 'Silhouette', 'Gale', 'Wind', 'Echo', 'Gambit', 'Trick',
        'Feint', 'Lurk', 'Ambush', 'Vanish', 'Decoy', 'Mirage'
      ]
    },
    Wizard: {
      prefixes: [
        'Arcane', 'Elder', 'Mystic', 'Enlightened', 'Celestial', 'Astral', 'Cosmic',
        'Enigma', 'Ethereal', 'Primal', 'Void', 'Rune', 'Sigil', 'Glyph', 'Alchemical',
        'Elemental', 'Chronos', 'Nexus', 'Oracle', 'Archmage', 'Arcanum', 'Eldritch',
        'Mythic', 'Esoteric', 'Occult', 'Spectral', 'Thaumaturge', 'Warden', 'Zephyr',
        'Nebula'
      ],
      suffixes: [
        'Mind', 'Spark', 'Wise', 'Oracle', 'Tome', 'Orb', 'Ward', 'Sigil', 'Glyph',
        'Vortex', 'Infinity', 'Pinnacle', 'Enigma', 'Focus', 'Dominion', 'Essence',
        'Aegis', 'Pact', 'Equinox', 'Eclipse', 'Conflux', 'Paradox', 'Catalyst',
        'Apex', 'Paragon', 'Epitome', 'Quintessence', 'Zenith', 'Mandala', 'Lore'
      ]
    },
    Healer: {
      prefixes: [
        'Holy', 'Divine', 'Blessed', 'Sacred', 'Radiant', 'Pure', 'Serene', 'Elysian',
        'Harmony', 'Luminous', 'Hallowed', 'Celestial', 'Resplendent', 'Virtuous',
        'Sanctified', 'Ethereal', 'Ascendant', 'Beatific', 'Redemptive', 'Benevolent',
        'Compassionate', 'Graceful', 'Merciful', 'Guiding', 'Sacrificial', 'Pious',
        'Enlightened', 'Tranquil', 'Redeemer', 'Savior'
      ],
      suffixes: [
        'Light', 'Hand', 'Grace', 'Word', 'Touch', 'Veil', 'Balm', 'Covenant',
        'Sanctuary', 'Benediction', 'Absolution', 'Embrace', 'Aegis', 'Promise',
        'Legacy', 'Sacrament', 'Incarnation', 'Font', 'Chalice', 'Purity', 'Vow',
        'Oath', 'Rite', 'Hymn', 'Psalm', 'Canticle', 'Homily', 'Icon', 'Relic',
        'Respite'
      ]
    }
  };

  generateName(className: string): string {
    const parts = this.nameParts[className as keyof typeof this.nameParts];
    if (!parts) return 'Unknown Wanderer';

    const prefix = this.randomElement(parts.prefixes);
    const suffix = this.randomElement(parts.suffixes);
    return `${prefix} ${suffix}`;
  }

  private randomElement(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }
}
