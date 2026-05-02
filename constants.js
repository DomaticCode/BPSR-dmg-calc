// Base % by class: crit, haste, luck, mastery, vers
const CLASS_BASES = {
  none:  { crit: 5, haste: 0, luck: 5, mastery: 6, vers: 0 },
  smite: { crit: 5, haste: 0, luck: 5, mastery: 6, vers: 4 },
};

// Module data
const MODULE_DATA = {
  'agile': { name: 'Agile' },
  'agility-boost': { name: 'Agility Boost' },
  'armor': { name: 'Armor' },
  'attack-spd': { name: 'Attack SPD' },
  'cast-focus': { name: 'Cast Focus' },
  'crit-focus': { name: 'Crit Focus' },
  'damage-stack': { name: 'DMG Stack' },
  'elite-strike': { name: 'Elite Strike' },
  'final-protection': { name: 'Final Protection' },
  'first-aid': { name: 'First Aid' },
  'healing-boost': { name: 'Healing Boost' },
  'healing-enhance': { name: 'Healing Enhance' },
  'intellect-boost': { name: 'Intellect Boost' },
  'life-condense': { name: 'Life Condense' },
  'life-steal': { name: 'Life Steal' },
  'life-wave': { name: 'Life Wave' },
  'luck-focus': { name: 'Luck Focus' },
  'resistance': { name: 'Resistance' },
  'special-attack': { name: 'Special Attack' },
  'strength-boost': { name: 'Strength Boost' },
  'team-luck-crit': { name: 'Team Luck & Crit' }
};

// Not used atm, but for future use
const IMAGINE_DATA = {
  'flamehorn': { name: 'Flamehorn' },
  'muku-scout': { name: 'Muku Scout' },
  'muku-chief': { name: 'Muku Chief' },
  'rorola': { name: 'Rorola' },
};

// ADD NEW FIELDS AT THE END OF THE ARRAY
const SAVE_FIELD_ORDER = [
  'damageType',
  'magResEnabled',
  'inspiration',
  'target-type',
  'main-attr',
  'adaptive-atk',
  'base-atk',
  'refined-atk',
  'elemental-atk',
  'crit-rate-stat',
  'base-crit-pct',
  'haste-stat',
  'base-haste-pct',
  'luck-stat',
  'base-luck-pct',
  'mastery-stat',
  'base-mastery-pct',
  'vers-dmg-pct',
  'base-vers-pct',
  'crit-mult',
  'luck-chance-bonus',
  'wl-crit-pct',
  'wl-haste-pct',
  'wl-luck-pct',
  'wl-mastery-pct',
  'wl-vers-pct',
  'luck-effect-bonus',
  'wl-elem-bonus',
  'wl-crit-dmg',
  'wl-atk-dmg',
  'wl-magic-dmg',
  'wl-atk-pct',
  'matk-pct',
  'int-pct',
  'cast-speed-pct',
  'atk-speed-pct',
  'boss-dmg-pct',
  'mastery-elem-dmg-pct',
  'elem-dmg-pct',
  'elem-power',
  'gen-dmg-pct',
  'elite-dmg-pct',
  'mag-boost-pct',    
  'type-dmg-bonus',
  'type-dmg-expertise',
  'type-dmg-special',
  'type-dmg-basic',
  'type-dmg-ultimate',
  'lucky-mult-display',
  'lucky-mult-bonus',
  'lucky-mult-manual',
  'enemy-armour',
  'phys-resist-override',
  'lock-crit',
  'lock-luck',
  'lock-mastery',
  'lock-vers',
  'substat-factor',
  'food-enabled',
  'food-atk',
  'food-dmg-bonus',
  'dream-dmg-pct',    
  'team-luck-crit',
  'main-stat-pct',
  'serum-oil-enabled',
  'serum-oil-type',
  'serum-oil-value',
  'oblivion-buff',
  'endless-mind',
];

// Class-specific field orders: ADD NEW CLASS FIELDS AT THE END OF EACH CLASS ARRAY (for dropdown selection)
const CLASS_FIELDS_ORDER = {
  none: [],
  smite: [
    'smite-spec',
    'luck-dmg-talent',
    'flowers-ascension',
    'thorn',
    'wide-area-thorns',
    'tree-x11',
    'tree-x4',
  ],
};

// Psychoscope tree field orders: ADD NEW PSYCHOSCOPE FIELDS AT THE END OF EACH TREE ARRAY (for dropdown selection)
const PSYCHOSCOPE_FIELDS_ORDER = {
  none: [],
  dreamforce: [
    'psychoscope-bond-lvl35',
    'psychoscope-main-stats',
    'psychoscope-main-stats-bonus',
    'psychoscope-amplify-rare',
  ],
  'fantasia-impact': [
    'psychoscope-fantasia-bond-35',
    'psychoscope-fantasia-linkage',
    'psychoscope-fantasia-linkage-pct',
    'psychoscope-fantasia-reconstruct',
    'psychoscope-fantasia-ultimate-fortune',
  ],
  'endless-mind': [
    'psychoscope-endless-bond-35',
    'psychoscope-endless-aegis',
    'psychoscope-endless-still-continuum',
    'psychoscope-endless-split-brilliance',
    'psychoscope-endless-finale-chant',
  ],
  'oblivion': [
    'psychoscope-oblivion-bond-35',
    'psychoscope-oblivion-harmony-grace',
    'psychoscope-oblivion-tuning',
    'psychoscope-oblivion-beauty-refinement',
    'psychoscope-oblivion-feint-strike',
  ],
};


const LOCAL_STORAGE_STATE_KEY = 'bpsr-dmg-simulator-state';
const LOCAL_STORAGE_PROFILES_KEY = 'bpsr-dmg-simulator-profiles';