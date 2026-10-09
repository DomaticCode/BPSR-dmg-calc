// Base % by class: crit, haste, luck, mastery, vers
const CLASS_BASES = {
  none:  { crit: 5, haste: 0, luck: 5, mastery: 6, vers: 0 },
  smite: { crit: 5, haste: 0, luck: 5, mastery: 6, vers: 4 },
  dissonance: { crit: 5, haste: 0, luck: 5, mastery: 6, vers: 0 },
};

const STAT_SCALER = 200000;
const VERS_SCALER = 112000;
const ALL_ELEMENTAL_DMG_SCALER = 18000;

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

const WEAPON_LINE_EFFECT_OPTIONS = {
  'wl-crit-pct': { label: 'CRIT %', aliases: ['crit', 'crit pct', 'crit rate'] },
  'wl-haste-pct': { label: 'Haste %', aliases: ['haste'] },
  'wl-luck-pct': { label: 'Luck %', aliases: ['luck'] },
  'wl-mastery-pct': { label: 'Mastery %', aliases: ['mastery'] },
  'wl-vers-pct': { label: 'Versatility %', aliases: ['vers', 'versatility', 'vers pct'] },
  'wl-elem-bonus': { label: 'Element Bonus %', aliases: ['element bonus', 'elem bonus', 'elemental bonus', 'elem', 'fire bonus', 'ice bonus', 'forest bonus', 'rock bonus', 'light bonus', 'dark bonus', 'thunder bonus', 'wind bonus'] },
  'wl-crit-dmg': { label: 'Crit DMG %', aliases: ['crit dmg', 'critical damage', 'crit damage'] },
  'wl-atk-dmg': { label: 'Attack DMG %', aliases: ['attack dmg', 'atk dmg', 'physical dmg'] },
  'wl-magic-dmg': { label: 'Magic DMG %', aliases: ['magic dmg', 'mag dmg', 'magic damage'] },
  'wl-atk-pct': { label: 'ATK/MATK %', aliases: ['atk', 'matk', 'atk/matk'] },
  'wl-ranged-dmg': { label: 'Ranged DMG %', aliases: ['ranged dmg', 'ranged damage', 'range dmg'] },
  'luck-effect-bonus': { label: 'Luck Effect DMG %', aliases: ['luck effect', 'luck effect dmg', 'lucky effect'] },
  'lucky-strike-dmg-bonus': { label: 'Lucky Strike DMG %', aliases: ['lucky strike', 'lucky strike dmg', 'lucky dmg'] },
  'wl-phy-mag-boost': { label: 'PHY/MAG Boost%', aliases: ['phy mag boost', 'phy/mag boost', 'physical magical boost', 'mag boost', 'phy boost'] },
  'wl-exp-mag-pct': { label: 'Expertise Skill PHY/MAG Boost', aliases: ['expertise', 'expertise skill', 'phy boost', 'mag boost'] },
  'wl-luck-effect-mag-boost': { label: 'Luck Effect PHY/MAG Boost', aliases: ['luck effect phy boost', 'luck effect mag boost'] },
};


// Core field IDs used to serialize the named character fields.
const SAVE_FIELD_IDS = [
  'damageType',
  'PhysResEnabled',
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
  'luck-effect-bonus',
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
  'food-enabled',
  'food-atk',
  'food-dmg-bonus',
  'dream-dmg-pct',    
  'team-luck-crit',
  'main-stat-pct',
  'serum-oil-enabled',
  'serum-oil-type',
  'serum-oil-value',
  'inspiring-chant',
  'parse-duration',
  'extra-main-attr',
  'lucky-strike-dmg-bonus',
  'luck-crit-chance',
  'class-elemental-atk',
  'module-apply-main-stats',
];

// Class field IDs used to serialize the named class values.
const CLASS_FIELD_IDS = {
  none: [],
  smite: [
    'smite-spec',
    'luck-dmg-talent',
    'flowers-ascension',
    'thorn',
    'wide-area-thorns',
    'arcane-of-green',
    'thornbreaker',
    'pulse-echo',
    'bloomheal',
    'lucky-pulse',
    'set-value',
  ],
  dissonance: [
    'in-rhapsody',
    'in-heroic-melody',
    'trio-rhapsody',
    'luck-multiplier',
    'fire-day',
    'center-stage',
    's1-set-value',
    's2-set-value',
  ],
  stormblade: [
    // no fields
  ],
  marksman: [
    // no fields
  ],
  windknight: [
    // no fields
  ],
  heavyguardian: [
    // no fields
  ],
  shieldknight: [
    // no fields
  ],
  twinaxe: [
    // no fields
  ],
};

const elementTypes = {
  'AttrWoodAtkTotal': 'forest',
  'AttrFireAtkTotal': 'fire',
  'AttrWaterAtkTotal': 'ice',
  'AttrLightAtkTotal': 'light',
  'AttrDarkAtkTotal': 'dark',
  'AttrWindAtkTotal': 'wind',
  'AttrElectricityAtkTotal': 'thunder',
  'AttrRockAtkTotal': 'rock',
};

const elementAttrs = [
  { key: 'AttrWoodAtkTotal', label: 'Forest ATK' },
  { key: 'AttrFireAtkTotal', label: 'Fire ATK' },
  { key: 'AttrWaterAtkTotal', label: 'Ice ATK' },
  { key: 'AttrLightAtkTotal', label: 'Light ATK' },
  { key: 'AttrDarkAtkTotal', label: 'Dark ATK' },
  { key: 'AttrWindAtkTotal', label: 'Wind ATK' },
  { key: 'AttrElectricityAtkTotal', label: 'Thunder ATK' },
  { key: 'AttrRockAtkTotal', label: 'Rock ATK' }
];


const LOCAL_STORAGE_STATE_KEY = 'bpsr-dmg-simulator-state';
const LOCAL_STORAGE_PROFILES_KEY = 'bpsr-dmg-simulator-profiles';