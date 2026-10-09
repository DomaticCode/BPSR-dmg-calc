// =============================================================================
// PSYCHOSCOPE_TREES
//
// Multiple trees are supported, but only one tree is active at a time. The active
// tree is built on the center-out spiral layout (see
// the SPIRAL_* engine below). Older top-down tree layouts have been removed;
// going forward every tree uses this spiral shape. Add real
// trees by copying this shape and swapping in real ids/labels/tips/satellite
// counts; SPIRAL_SKELETON (the fixed 5-slot + center + final positions)
// should not need to change.
// =============================================================================

const PSYCHOSCOPE_TREES = {

  // ---------------------------------------------------------------------
  // Boilerplate / test tree — every node is a placeholder worth a flat
  // +1% test Luck (wired up in the companion boilerplate-tree.js module)
  // purely to verify the spiral engine's gating, connector lines, and
  // save/restore behave correctly end to end. Swap in real content once an
  // actual tree is designed.
  // THIS IS NOT SELECTABLE IN LIVE, left here only for manually adding boilerplate dropdown option for testing.
  // ---------------------------------------------------------------------
  boilerplate: {
    title: 'Boilerplate Tree',
    containerId: 'psychoscope-boilerplate-options',
    modalId: 'psychoscope-boilerplate-modal',
    standalone: [],
    center: { id: 'psychoscope-boilerplate-center', label: 'Core', tip: 'Placeholder node — +1% test Luck.' },
    // Bottom-left of center — always the Class factor slot.
    slot1: {
      id: 'psychoscope-boilerplate-slot1', label: 'Class\nFactor', factorType: 'class',
      tip: 'Placeholder node — +1% test Luck.',
      showInSummary: false, // only exists to get the Class factor slot — nothing to summarize beyond the satellite pick
      satellites: [
        { id: 'psychoscope-boilerplate-slot1-a', dir: 'NW', label: 'Opt A', tip: 'Placeholder node — +1% test Luck.' },
        { id: 'psychoscope-boilerplate-slot1-b', dir: 'W',  label: 'Opt B', tip: 'Placeholder node — +1% test Luck.' },
        { id: 'psychoscope-boilerplate-slot1-c', dir: 'SW', label: 'Opt C', tip: 'Placeholder node — +1% test Luck.' },
        { id: 'psychoscope-boilerplate-slot1-d', dir: 'S',  label: 'Opt D', tip: 'Placeholder node — +1% test Luck.' },
      ],
    },
    // Top-left — Defensive factor slot (not used for damage calc).
    slot2: {
      id: 'psychoscope-boilerplate-slot2', label: 'Defensive\nFactor', factorType: 'defensive',
      tip: 'Placeholder node — +1% test Luck.',
      showInSummary: false, // only exists to get the Defensive factor slot
      satellites: [
        { id: 'psychoscope-boilerplate-slot2-a', dir: 'N',  label: 'Opt A', tip: 'Placeholder node — +1% test Luck.' },
        { id: 'psychoscope-boilerplate-slot2-b', dir: 'NE', label: 'Opt B', tip: 'Placeholder node — +1% test Luck.' },
        { id: 'psychoscope-boilerplate-slot2-c', dir: 'W',  label: 'Opt C', tip: 'Placeholder node — +1% test Luck.' },
      ],
    },
    // Top-right — the 2-way big-node choice. These two alternatives never
    // have satellites of their own (see project notes).
    slot3: {
      id: 'psychoscope-boilerplate-slot3', label: 'Choice\nNode', factorType: 'choice',
      tip: 'Placeholder node — +1% test Luck.',
      satellites: [
        { id: 'psychoscope-boilerplate-slot3-a', dir: 'N', label: 'Alt Top',   tip: 'Placeholder node — +1% test Luck.' },
        { id: 'psychoscope-boilerplate-slot3-b', dir: 'E', label: 'Alt Right', tip: 'Placeholder node — +1% test Luck.' },
      ],
    },
    // Mid-right — Class factor slot.
    slot4: {
      id: 'psychoscope-boilerplate-slot4', label: 'Class\nFactor', factorType: 'class',
      tip: 'Placeholder node — +1% test Luck.',
      showInSummary: false, // only exists to get a factor slot
      satellites: [
        { id: 'psychoscope-boilerplate-slot4-a', dir: 'NE', label: 'Opt A', tip: 'Placeholder node — +1% test Luck.' },
        { id: 'psychoscope-boilerplate-slot4-b', dir: 'E',  label: 'Opt B', tip: 'Placeholder node — +1% test Luck.' },
        { id: 'psychoscope-boilerplate-slot4-c', dir: 'SE', label: 'Opt C', tip: 'Placeholder node — +1% test Luck.' },
      ],
    },
    // Bottom-center — reached only via slot4 (no line back up to slot1).
    // factorType is still TBD per project notes — revisit later.
    slot5: {
      id: 'psychoscope-boilerplate-slot5', label: 'Class\nFactor', factorType: 'class',
      tip: 'Placeholder node — +1% test Luck.',
      showInSummary: false, // only exists to get a factor slot
      satellites: [
        { id: 'psychoscope-boilerplate-slot5-a', dir: 'SW', label: 'Left',  tip: 'Placeholder node — +1% test Luck.' },
        { id: 'psychoscope-boilerplate-slot5-b', dir: 'SE', label: 'Right', tip: 'Placeholder node — +1% test Luck.' },
      ],
    },
    final: { id: 'psychoscope-boilerplate-final', label: 'Final', tip: 'Placeholder node — +1% test Luck.' },
  },

  // ---------------------------------------------------------------------
  // Stat Symphony — new real tree, currently set up identically to
  // `boilerplate` (every node worth a flat +1% test Luck, wired up in the
  // companion stat-symphony.js module) just to confirm the spiral engine
  // works correctly for it end to end before its real content is designed.
  // Swap in real labels/tips/satellite counts/effects node by node from here.
  // ---------------------------------------------------------------------
  statSymphony: {
    title: 'Stat Symphony',
    containerId: 'psy-symphony-options',
    modalId: 'psy-symphony-modal',
    standalone: [],
    center: { id: 'psy-symphony-center', label: 'Stat Symphony', tip: 'Stat Symphony: \nBasic/Special/Exp/Ult all grant <span class="hl-gold">1.5% of your highest stat for 5 seconds</span>' },
    // Bottom-left of center — always the Class factor slot.
    slot1: {
      id: 'psy-symphony-slot1', label: 'Inspiration Factor', factorType: 'class',
      tip: '+1 <span class="hl-gold">Inspiration</span> factor slot',
      showInSummary: false, // only exists to get the Class factor slot — nothing to summarize beyond the satellite pick
      satellites: [
        { id: 'psy-symphony-slot1-a', dir: 'SW', label: 'Rapid Tempo', tip: 'Rapid Tempo:\n Each stack of Stat Symphony grants <span class="hl-gold">1% Attack SPD</span>\n<span class="hl-red">(NOT IMPLEMENTED)</span>' },
        { id: 'psy-symphony-slot1-b', dir: 'NW',  label: 'Power Movement', tip: 'Power Movement:\n Each stack of Stat Symphony grants <span class="hl-blue">1.12% ATK</span>' },
      ],
    },
    // Top-left — Defensive factor slot (not used for damage calc).
    slot2: {
      id: 'psy-symphony-slot2', label: 'Defensive\nFactor', factorType: 'defensive',
      tip: '+1 Generic Defensive factor slot.',
      showInSummary: false, // only exists to get the Defensive factor slot
      satellites: [
        { id: 'psy-symphony-slot2-a', dir: 'SW',  label: 'Sustained Note', tip: 'Sustained Note:\nStat Symphony stack for <span class="hl-gold">basic attacks</span> lasts +5 seconds\n<span class="hl-red">(NOT IMPLEMENTED)</span>' },
        { id: 'psy-symphony-slot2-b', dir: 'NW', label: 'Finale Echo', tip: 'Finale Echo:\nStat Symphony stack for <span class="hl-gold">ultimate attacks</span> lasts +8 seconds\n<span class="hl-red">(NOT IMPLEMENTED)</span>' },
        { id: 'psy-symphony-slot2-c', dir: 'NE',  label: 'Lingering Echo', tip: 'Lingering Echo:\n35% Chance to <span class="hl-gold">refund a stack</span> instead of expire\n<span class="hl-red">(NOT IMPLEMENTED)</span>' },
      ],
    },
    // Top-right — the 2-way big-node choice. These two alternatives never
    // have satellites of their own (see project notes).
    slot3: {
      id: 'psy-symphony-slot3', label: 'Refine', factorType: 'choice', size: 'satellite',
      tip: 'Refined\n<span class="hl-gold">ATK/MATK/</span><span class="hl-red">Armor</span> +15%</span>',
      satellites: [
        { id: 'psy-symphony-slot3-a', dir: 'NW', label: 'Singularity Factor', large: true, grantsFactor: 'singularity', tip: '+1 <span class="hl-gold">Singularity</span> factor slot' },
        { id: 'psy-symphony-slot3-b', dir: 'NE', label: 'Inspiration Factor', large: true, grantsFactor: 'class', tip: '+1 <span class="hl-gold">Class Inspiration</span> factor slot' },
      ],
    },
    // Mid-right — Class defensive factor slot.
    slot4: {
      id: 'psy-symphony-slot4', label: 'Stasis Factor', factorType: 'class-defensive',
      tip: '+1 <span class="hl-blue">Stasis (class defensive)</span> factor slot <span class="hl-red">\n(NOT IMPLEMENTED)</span>',
      showInSummary: false, // only exists to get the factor slot
      satellites: [
        { id: 'psy-symphony-slot4-a', dir: 'NE', label: 'Downbeat Reprise', tip: 'Downbeat Reprise:\n Stat Symphony for <span class="hl-gold">basic attacks</span> is multiplied by 1.6<span class="hl-orange">\nAssumes if you have 1 or more stacks one of these is basic attack stack</span>' },
        { id: 'psy-symphony-slot4-b', dir: 'SE', label: 'Finale Burst', tip: 'Finale Burst:\n Stat Symphony for <span class="hl-gold">Ultimate skills</span> is multiplied by 2<span class="hl-orange">\nAssumes if you have 4 or more stacks one of these is ultimate skill stack</span>' },
      ],
    },
    // Bottom-center — reached only via slot4 (no line back up to slot1).
    // factorType is still TBD per project notes — revisit later.
    slot5: {
      id: 'psy-symphony-slot5', label: 'Inspiration\nFactor', factorType: 'class',
      tip: '+1 <span class="hl-gold">Inspiration</span> factor slot',
      showInSummary: false, // only exists to get the factor slot
      satellites: [
        { id: 'psy-symphony-slot5-a', dir: 'SW', label: 'Modulation Resonance',  tip: 'Modulation Resonance:\nCasting a different non-basic attack skill grants an <span class="hl-gold">additional stack</span> of Stack Symphony (removed if same skill repeated)' },
        { id: 'psy-symphony-slot5-b', dir: 'SE', label: 'Perfect Symphony', tip: 'Perfect Symphony:\nAfter maintaining 3 stacks of Stat Symphony for 5 seconds, Stat Symphony <span class="hl-gold">effect doubles</span> for 10 seconds then removes all stacks\n(Applies to Power Movement/Rapid Tempo)' },
      ],
    },
    final: { id: 'psy-symphony-final', label: 'Fourfold Finale', tip: 'Fourfold Finale:\nWhen Stat Symphony has 3 (or more) stacks it also grants <span class="hl-seasonal">+20% seasonal damage</span>' },
  },

    // ---------------------------------------------------------------------
  // Momentum Burst
  // ---------------------------------------------------------------------
  momentumBurst: {
    title: 'Momentum Burst',
    containerId: 'psy-burst-options',
    modalId: 'psy-burst-modal',
    standalone: [],
    center: { id: 'psy-burst-center', label: 'Momentum Burst', tip: 'Momentum Burst:\n<span class="hl-gold">Dealing damage with special/basic attack</span> 15 times grants 1 stack of <span class="hl-light-blue">Charge</span> <span class="hl-blue">(74-112 ATK)</span>.\nWhen it reaches max stacks (default 5), it becomes <span class="hl-cyan">Burst</span> <span class="hl-blue">(400-700 ATK)</span>\n<span class="hl-seasonal">Scales with season level</span>' },
    // Bottom-left of center — always the Class factor slot.
    slot1: {
      id: 'psy-burst-slot1', label: 'Inspiration Factor', factorType: 'class',
      tip: '+1 <span class="hl-gold">Inspiration</span> factor slot',
      showInSummary: false, // only exists to get the Class factor slot — nothing to summarize beyond the satellite pick
      satellites: [
        { id: 'psy-burst-slot1-a', dir: 'SW', label: 'Momentum: Swift', tip: 'Momentum: Swift\n<span class="hl-cyan">Burst</span> additionally increases <span class="hl-gold">Casting SPD by 15%</span>\n<span class="hl-red">(NOT IMPLEMENTED)</span>' },
        { id: 'psy-burst-slot1-b', dir: 'W',  label: 'Momentum: Chant', tip: 'Momentum: Chant\nEach stack of <span class="hl-light-blue">Charge</span> grants <span class="hl-gold">0.8% Attack SPD.</span>\n<span class="hl-cyan">Burst</span> additionally increases <span class="hl-gold">Attack SPD by 5%</span>\n<span class="hl-red">(NOT IMPLEMENTED)</span>' },
        { id: 'psy-burst-slot1-c', dir: 'NW', label: 'Momentum: Break', tip: 'Momentum: Break\n<span class="hl-cyan">Burst</span> additionally increases <span class="hl-blue">ATK by 8%</span>' },
      ],
    },
    // Top-left — Defensive factor slot (not used for damage calc).
    slot2: {
      id: 'psy-burst-slot2', label: 'Defensive\nFactor', factorType: 'defensive',
      tip: '+1 Generic Defensive factor slot.',
      showInSummary: false, // only exists to get the Defensive factor slot
      satellites: [
        { id: 'psy-burst-slot2-a', dir: 'NW',  label: 'Momentum: Rapid Drive', tip: 'Momentum: Rapid Drive\nThe <span class="hl-gold">number of DMG instances</span> to gain each stack of Charge is <span class="hl-gold">reduced by 7 (to 8)</span>\n<span class="hl-red">(NOT IMPLEMENTED)</span>' },
        { id: 'psy-burst-slot2-b', dir: 'NE', label: 'Momentum: Engage', tip: 'Momentum: Engage\n<span class="hl-gold">Melee abilities count as 7 damage instances per hit</span> for building <span class="hl-light-blue">Charge</span>.\n<span class="hl-cyan">Burst</span> is <span class="hl-gold">extended by 0.5 seconds when standing still</span>, up to 5s per <span class="hl-cyan">Burst</span>\n<span class="hl-red">(NOT IMPLEMENTED)</span>' },
      ],
    },
    // Top-right — the 2-way big-node choice. These two alternatives never
    // have satellites of their own (see project notes).
    slot3: {
      id: 'psy-burst-slot3', label: 'Refine', factorType: 'choice', size: 'satellite',
      tip: 'Refined\n<span class="hl-gold">ATK/MATK/</span><span class="hl-red">Armor</span> +15%</span>',
      satellites: [
        { id: 'psy-burst-slot3-b', dir: 'NW', label: 'Inspiration Factor', large: true, grantsFactor: 'class', tip: '+1 <span class="hl-gold">Class Inspiration</span> factor slot' },
        { id: 'psy-burst-slot3-a', dir: 'NE', label: 'Singularity Factor', large: true, grantsFactor: 'singularity', tip: '+1 <span class="hl-gold">Singularity</span> factor slot' },

      ],
    },
    // Mid-right — Class factor slot.
    slot4: {
      id: 'psy-burst-slot4', label: 'Stasis Factor', factorType: 'class-defensive',
      tip: '+1 <span class="hl-blue">Stasis (class defensive)</span> factor slot <span class="hl-red">\n(NOT IMPLEMENTED)</span>',
      showInSummary: false, // only exists to get the factor slot
      satellites: [
        { id: 'psy-burst-slot4-a', dir: 'NE', label: 'Momentum: Surge', tip: 'Momentum: Surge\n<span class="hl-cyan">Burst</span> effect x 1.5\n (Applies to Momentum: Break, Finale)'},
        { id: 'psy-burst-slot4-b', dir: 'SE',  label: 'Momentum: Dual', tip: 'Momentum: Dual\n<span class="hl-cyan">Burst</span> and <span class="hl-light-blue">Charge</span> effects x 1.35 (Applies to Momentum: Break, Finale)' },
      ],
    },
    // Bottom-center — reached only via slot4 (no line back up to slot1).
    // factorType is still TBD per project notes — revisit later.
    slot5: {
      id: 'psy-burst-slot5', label: 'Inspiration\nFactor', factorType: 'class',
      tip: '+1 <span class="hl-gold">Inspiration</span> factor slot',
      showInSummary: false, // only exists to get a factor slot
      satellites: [
        { id: 'psy-burst-slot5-a', dir: 'SW', label: 'Momentum: Afterglow',  tip: 'Momentum: Afterglow\nAfter <span class="hl-cyan">Burst</span> ends, immediately 2 stacks of <span class="hl-light-blue">Charge</span>\n<span class="hl-red">(NOT IMPLEMENTED)</span>' },
        { id: 'psy-burst-slot5-b', dir: 'SE', label: 'Momentum: Deep Charge', tip: 'Momentum: Deep Charge\nMax <span class="hl-light-blue">Charge</span> stacks +2 (now requires 7 total for <span class="hl-cyan">Burst</span>), Base ATK from <span class="hl-cyan">Burst</span> increased to <span class="hl-blue">(480-840 ATK)</span>\n<span class="hl-seasonal">Scales with season level</span>' },
      ],
    },
    final: { id: 'psy-burst-final', label: 'Momentum: Finale', tip: 'Momentum: Finale\nEach stack of <span class="hl-light-blue">Charge</span> grants <span class="hl-seasonal">1.6% Seasonal DMG.</span>\n<span class="hl-cyan">Burst</span> additionally grants <span class="hl-seasonal">10% Seasonal DMG</span>' },
  },

};

// =============================================================================
// Factors (Class Inspiration, Class Singularity, Defensive)
//
// Named factors are supplied by the selected class module and have no numeric
// value or "Apply" checkbox. Each factor can hold up to FACTOR_SOCKET_MAX
// effect sockets. The generic "gained in any way" substat effects are the
// exception to class-owned effects; class-specific socket effects are defined
// by each class module.
//
// - Class Inspiration ('class'): 2 base slots, always present once a class is
//   selected, + up to 1 bonus slot. Slots 1 and 2 are created once in
//   initFactorsShell() and never re-created -- only the 3rd slot is ever
//   added/removed (by syncBonusSlot).
// - Class Singularity ('singularity'): 0 base slots -- a single slot only
//   exists at all when granted by the tree (max 1, never 2).
// - The bonus Inspiration slot and the Singularity slot are mutually
//   exclusive per project notes (3 Inspiration + 0 Singularity, or 2
//   Inspiration + 1 Singularity) -- that's enforced by the tree data itself
//   (see stat-symphony's slot3, whose two satellites are a radio-style
//   choice between `grantsFactor: 'class'` and `grantsFactor: 'singularity'`),
//   not by extra logic here; computeBonusFactorSlots() just reports which (if
//   either) is currently checked.
// - Defensive ('defensive'): always exactly 2 fixed organizational slots,
//   regardless of class selection. No name field at all -- defensive factor
//   effects aren't implemented, so these are just labeled socket containers.
//
// Mark tree nodes that grant a bonus slot with `grantsFactor: 'class'` or
// `grantsFactor: 'singularity'` in the PSYCHOSCOPE_TREES config above.
// =============================================================================

const FACTOR_SOCKET_MAX = 4;

const GENERIC_FACTOR_EFFECT_SUGGESTIONS = [
  { key: 'crit-gained-in-any-way', label: 'Crit gained', aliases: ['crit', 'critical', 'crit gain', 'x5'], unit: '%' },
  { key: 'luck-gained-in-any-way', label: 'Luck gained', aliases: ['luck', 'lucky', 'luck gain', 'x6'], unit: '%' },
  { key: 'mastery-gained-in-any-way', label: 'Mastery gained', aliases: ['mastery', 'masteries', 'mastery gain', 'x7'], unit: '%' },
  { key: 'haste-gained-in-any-way', label: 'Haste gained', aliases: ['haste', 'attack speed', 'haste gain', 'x8'], unit: '%' },
];

function getSelectedClassValue() {
  return document.getElementById('class-select')?.value || 'none';
}

function getFactorSlotPlaceholder(type, classSelectVal = getSelectedClassValue()) {
  if (type === 'class' || type === 'singularity') {
    const classModule = window.CLASS_MODULES?.[classSelectVal];
    return classModule?.provideFactorSuggestions?.(type)?.length ? 'Type class factor' : 'No class factors defined';
  }
  return '';
}

function getFactorSuggestionsForType(type) {
  const classSelectVal = getSelectedClassValue();
  const classModule = window.CLASS_MODULES?.[classSelectVal];
  const classSuggestions = classModule?.provideFactorSuggestions?.(type);

  return Array.isArray(classSuggestions) ? classSuggestions : [];
}

function getFactorEffectSuggestions() {
  const classValue = getSelectedClassValue();
  const classModule = window.CLASS_MODULES?.[classValue];
  const classSuggestions = classModule?.provideFactorEffectSuggestions?.() || [];
  const suggestions = [
    ...GENERIC_FACTOR_EFFECT_SUGGESTIONS.map(effect => ({ ...effect, id: `generic:${effect.key}`, source: 'generic' })),
    ...(Array.isArray(classSuggestions) ? classSuggestions.map(effect => ({
      ...effect,
      id: `class:${classValue}:${effect.key}`,
      source: 'class',
    })) : []),
  ];

  return suggestions;
}

// Maps the #psychoscope-tree <select> values to PSYCHOSCOPE_TREES keys.
// Update your <select id="psychoscope-tree"> HTML to have
// <option value="stat-symphony">...</option> entries (plus your existing
// "none").
const TREE_SELECT_VALUE_MAP = {
  boilerplate: 'boilerplate',
  'stat-symphony': 'statSymphony',
  'momentum-burst': 'momentumBurst',
};

function getActiveTreeConfig() {
  const val = document.getElementById('psychoscope-tree')?.value;
  const key = TREE_SELECT_VALUE_MAP[val];
  return key ? PSYCHOSCOPE_TREES[key] : null;
}

// =============================================================================
// Spiral tree engine (center-out layout)
//
// The five major-node positions (relative to the center) and the compass-
// direction satellite offsets are fixed across every tree — only the
// per-tree node content (ids/labels/tips/satellite counts+directions)
// changes.
// =============================================================================

const SPIRAL_STEP = 134; // px offset per compass step, from a major node to its satellites
const SPIRAL_DIRS = {
  N: [0, -1], NE: [1, -1], E: [1, 0], SE: [1, 1],
  S: [0, 1], SW: [-1, 1], W: [-1, 0], NW: [-1, -1],
};
// Fixed skeleton: same relative layout for every spiral tree.
const SPIRAL_SKELETON = {
  center: { x: 480, y: 500 },
  slot1:  { x: 215, y: 634 }, // bottom-left of center — always the Class factor slot
  slot2:  { x: 215, y: 234 }, // top-left — Defensive factor slot
  slot3:  { x: 750, y: 234 }, // top-right — 2-way big-node choice
  slot4:  { x: 750, y: 634 }, // mid-right — Class defensive factor slot
  slot5:  { x: 480, y: 768 }, // bottom-center — reached only via slot4
  final:  { x: 480, y: 1036 },
};
const SPIRAL_SLOT_KEYS = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5'];
// Natural (unscaled) size of the canvas — must match .tree-canvas-wrap's
// width/height in psychoscope-tree.css. scaleSpiralCanvas() shrinks the
// canvas to fit whatever space the modal actually has, rather than letting
// it overflow into a scrollbar.
const SPIRAL_CANVAS_SIZE = { width: 960, height: 1120 };

function resolveSpiralPositions(config) {
  const pos = {};
  pos[config.center.id] = SPIRAL_SKELETON.center;
  SPIRAL_SLOT_KEYS.forEach(key => {
    const slot = config[key];
    const anchor = SPIRAL_SKELETON[key];
    pos[slot.id] = anchor;
    slot.satellites.forEach(sat => {
      const [dx, dy] = SPIRAL_DIRS[sat.dir];
      pos[sat.id] = { x: anchor.x + dx * SPIRAL_STEP, y: anchor.y + dy * SPIRAL_STEP };
    });
  });
  pos[config.final.id] = SPIRAL_SKELETON.final;
  return pos;
}

// Flat list of every selectable node in a spiral tree (center, the 5 major
// nodes, every satellite, and the final leaf), each tagged with its input
// kind ('toggle' for majors/center/final, 'radio' for satellites), its CSS
// size modifier, its radio group (satellites only), and its resolved x/y.
function collectSpiralNodes(config) {
  const positions = resolveSpiralPositions(config);
  const nodes = [
    { ...config.center, kind: 'toggle', cls: 'tree-node--center', group: null },
  ];
  SPIRAL_SLOT_KEYS.forEach(key => {
    nodes.push({ ...config[key], kind: 'toggle', cls: 'tree-node--major', group: null });
  });
  nodes.push({ ...config.final, kind: 'toggle', cls: 'tree-node--final', group: null });
  SPIRAL_SLOT_KEYS.forEach(key => {
    config[key].satellites.forEach(sat => {
      nodes.push({ ...sat, kind: 'radio', cls: 'tree-node--sat', group: `${config.containerId}-${key}-group` });
    });
  });
  return nodes.map(node => ({ ...node, pos: positions[node.id] }));
}

// Gating chain — majors only. Reaching the next major node only requires the
// *previous major node* to be checked; picking a satellite is optional and no
// longer required to move on (you can go center -> slot1 -> slot2 -> ... and
// come back to fill in satellites later). Each slot's satellites are gated
// independently, purely by whether that slot's own major node is checked.
function buildSpiralMajorChain(config) {
  return [config.center.id, ...SPIRAL_SLOT_KEYS.map(key => config[key].id), config.final.id];
}

// Path order used only for display (the compact-trigger summary) — walks
// center -> slot1 major -> slot1 pick -> slot2 major -> ... -> final. A
// slot's major-node row can be left out via `showInSummary: false` in its
// config (e.g. slots that only exist to unlock a factor slot, with nothing
// worth summarizing beyond whichever satellite was picked) — its satellite
// row is still shown either way.
function buildSpiralDisplaySteps(config) {
  const steps = [{ ids: [config.center.id] }];
  SPIRAL_SLOT_KEYS.forEach(key => {
    const slot = config[key];
    if (slot.showInSummary !== false) {
      steps.push({ ids: [slot.id] });
    }
    steps.push({ ids: slot.satellites.map(s => s.id) });
  });
  steps.push({ ids: [config.final.id] });
  return steps;
}

// Connector edges, derived purely from the config. Note slot5 is only fed
// from slot4 — there's no line back to slot1, since slot5 is the last major
// node in the path, not a second parent.
function buildSpiralEdges(config) {
  const edges = [];
  edges.push([config.center.id, config.slot1.id]);
  config.slot1.satellites.forEach(s => edges.push([config.slot1.id, s.id]));
  edges.push([config.slot1.id, config.slot2.id]);
  config.slot2.satellites.forEach(s => edges.push([config.slot2.id, s.id]));
  edges.push([config.slot2.id, config.slot3.id]);
  config.slot3.satellites.forEach(s => edges.push([config.slot3.id, s.id]));
  edges.push([config.slot3.id, config.slot4.id]);
  config.slot4.satellites.forEach(s => edges.push([config.slot4.id, s.id]));
  edges.push([config.slot4.id, config.slot5.id]);
  config.slot5.satellites.forEach(s => edges.push([config.slot5.id, s.id]));
  config.slot5.satellites.forEach(s => edges.push([s.id, config.final.id]));
  return edges;
}

// Returns the sibling ids (including its own) of the satellite group a given
// satellite node id belongs to — used to enforce "at most one satellite
// checked per slot" now that satellites are plain checkboxes rather than
// native radios (see wireTreeEvents — native radios can't be click-to-uncheck).
function getSpiralSatelliteGroupIds(config, satelliteId) {
  for (const key of SPIRAL_SLOT_KEYS) {
    const ids = config[key].satellites.map(s => s.id);
    if (ids.includes(satelliteId)) return ids;
  }
  return [];
}

// Locks/unlocks the major-node chain (center -> slot1 -> ... -> final), each
// requiring only the previous major node to be checked. Unchecking a major
// node cascade-clears every major node after it. Each slot's satellites are
// gated independently — unlocked whenever that slot's own major node is
// checked, regardless of how far the major chain has otherwise progressed —
// and cleared/relocked only when their own major node is unchecked.
function applySpiralGating(config) {
  const chain = buildSpiralMajorChain(config);
  let prevChecked = true; // center has no prerequisite
  chain.forEach(id => {
    const input = document.getElementById(id);
    const wrap = input?.closest('.tree-node');
    if (!input || !wrap) return;
    let locked = !prevChecked;
    // Special case: unlike every other major node, the final node also
    // requires one of slot5's satellites (left/right) to be picked — it
    // can't be taken on slot5's major alone.
    if (id === config.final.id) {
      const slot5SatelliteChecked = config.slot5.satellites.some(s => document.getElementById(s.id)?.checked);
      locked = locked || !slot5SatelliteChecked;
    }
    if (locked && input.checked) input.checked = false;
    input.disabled = locked;
    wrap.classList.toggle('is-locked', locked);
    wrap.setAttribute('aria-disabled', locked ? 'true' : 'false');
    const lockIcon = wrap.querySelector('.lock');
    if (lockIcon) lockIcon.style.display = locked ? '' : 'none';
    prevChecked = input.checked;
  });

  SPIRAL_SLOT_KEYS.forEach(key => {
    const majorChecked = !!document.getElementById(config[key].id)?.checked;
    config[key].satellites.forEach(sat => {
      const input = document.getElementById(sat.id);
      const wrap = input?.closest('.tree-node');
      if (!input || !wrap) return;
      const locked = !majorChecked;
      if (locked && input.checked) input.checked = false;
      input.disabled = locked;
      wrap.classList.toggle('is-locked', locked);
      wrap.setAttribute('aria-disabled', locked ? 'true' : 'false');
      const lockIcon = wrap.querySelector('.lock');
      if (lockIcon) lockIcon.style.display = locked ? '' : 'none';
    });
  });
}

// Shrinks (never grows) the canvas to fit whatever space
// #<containerId>-canvas-outer actually has, via a CSS transform: scale() on
// the canvas-wrap, centered within the outer box. The outer box's size is
// determined entirely by CSS flex layout (see psychoscope-tree.css), so this
// just reads whatever space the browser already gave it — no scrollbar, the
// tree just gets smaller on a shorter/narrower modal.
function scaleSpiralCanvas(config) {
  const outer = document.getElementById(`${config.containerId}-canvas-outer`);
  const wrap = document.getElementById(`${config.containerId}-canvas`);
  if (!outer || !wrap) return;

  const outerRect = outer.getBoundingClientRect();
  if (!outerRect.width || !outerRect.height) return;

  const scale = Math.min(
    1,
    outerRect.width / SPIRAL_CANVAS_SIZE.width,
    outerRect.height / SPIRAL_CANVAS_SIZE.height,
  );
  wrap.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

// Measures the currently-rendered position of every node and updates the
// connector <line> elements. Lines are pulled back to each node's edge (not
// its center) so they never visually run through a node — this matters for
// locked/translucent nodes.
function layoutSpiralTree(config) {
  scaleSpiralCanvas(config); // must run first — line measurements below read post-scale positions
  const wrap = document.getElementById(`${config.containerId}-canvas`);
  const svg = wrap?.querySelector('svg.tree-lines');
  if (!wrap || !svg) return;

  const wrapRect = wrap.getBoundingClientRect();
  if (wrapRect.width === 0 && wrapRect.height === 0) return; // modal not visible yet

  svg.setAttribute('viewBox', `0 0 ${wrapRect.width} ${wrapRect.height}`);

  const nodeGeom = (id) => {
    const el = document.getElementById(id)?.closest('.tree-node');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - wrapRect.left,
      y: r.top + r.height / 2 - wrapRect.top,
      radius: r.width / 2,
    };
  };
  const edgePoint = (from, to, radius) => {
    const dx = to.x - from.x, dy = to.y - from.y;
    const dist = Math.hypot(dx, dy) || 1;
    return { x: from.x + (dx / dist) * radius, y: from.y + (dy / dist) * radius };
  };

  buildSpiralEdges(config).forEach(([a, b]) => {
    const line = document.getElementById(`${config.containerId}-edge-${a}__${b}`);
    const gA = nodeGeom(a), gB = nodeGeom(b);
    if (!line || !gA || !gB) return;
    const p1 = edgePoint(gA, gB, gA.radius);
    const p2 = edgePoint(gB, gA, gB.radius);
    line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x); line.setAttribute('y2', p2.y);
  });
}

function highlightSpiralEdges(config) {
  buildSpiralEdges(config).forEach(([a, b]) => {
    const line = document.getElementById(`${config.containerId}-edge-${a}__${b}`);
    if (!line) return;
    // Both endpoints must be checked, not just the destination — edges that
    // converge on a shared node (e.g. both slot5 satellites feeding into the
    // single final node) would otherwise all light up together whenever the
    // shared node is checked, regardless of which source was actually taken.
    const aChecked = !!document.getElementById(a)?.checked;
    const bChecked = !!document.getElementById(b)?.checked;
    line.classList.toggle('active', aChecked && bChecked);
  });
}

// The checked node for each gating step, in path order (center -> ... ->
// final) — used for the compact-trigger summary.
function computeSpiralOrderedChoices(config) {
  const nodeById = {};
  collectSpiralNodes(config).forEach(node => { nodeById[node.id] = node; });
  return buildSpiralDisplaySteps(config).map(step => {
    const checkedId = step.ids.find(id => document.getElementById(id)?.checked);
    return checkedId ? nodeById[checkedId] : null;
  });
}

// ---------- Tips / standalone controls (shared by every tree) ----------
function normalizeLineBreaks(value) {
  return String(value ?? '')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r/g, '\n');
}

function renderRichTextTip(rawText) {
  const normalized = normalizeLineBreaks(rawText ?? '');
  const withAllowedSpans = normalized
    .replace(/<span\s+class=(['"])hl-(gold|red|green|orange|purple|blue|light-blue|cyan|seasonal)\1>/gi, (_, __, color) => `<span class="hl-${color}">`)
    .replace(/<\/span>/gi, '</span>');

  return withAllowedSpans.replace(/\n/g, '<br>');
}

function renderTip(node) {
  if (!node.tip) return '';
  let warnColor = 'gold';
  if (node.warnColor === 'red') warnColor = 'var(--accent-red)';
  if (node.warnColor === 'orange') warnColor = 'var(--accent-orange)';
  const warnStyle = node.warn ? ` style="color:${warnColor};border-color:${warnColor};font-weight:bold;"` : '';
  const tipHtml = renderRichTextTip(node.tip);
  return `<span class="tip"><span class="tip-icon"${warnStyle}>i</span><span class="tip-box">${tipHtml}</span></span>`;
}

function renderStandalone(item) {
  if (item.kind === 'checkbox') {
    return `
      <div class="standalone-row">
        <label class="standalone-label" for="${item.id}">
          <input type="checkbox" id="${item.id}">
          ${item.label}
          ${renderTip(item)}
        </label>
      </div>`;
  }
  if (item.kind === 'checkbox-number') {
    return `
      <div class="standalone-row standalone-row--number">
        <label class="standalone-label" for="${item.id}">
          <input type="checkbox" id="${item.id}">
          ${item.label}
          ${renderTip(item)}
        </label>
        <input type="number" id="${item.numberId}" class="standalone-number"
               value="${item.numberDefault}" step="1" min="0" title="${item.label} value">
      </div>`;
  }
  return '';
}

// ---------- Spiral rendering ----------
function renderSpiralNode(node) {
  const groupAttr = node.group ? ` data-satellite-group="${node.group}"` : '';
  const satelliteSizeClass = node.size === 'satellite' ? ' tree-node--sat' : '';
  const largeClass = node.large ? ' tree-node--sat-large' : '';
  const labelHtml = normalizeLineBreaks(node.label || '').replace(/\n/g, '<br>');
  return `
    <label class="tree-node ${node.cls}${satelliteSizeClass}${largeClass}" data-node-id="${node.id}" style="left:${node.pos.x}px; top:${node.pos.y}px;">
      <input type="checkbox" id="${node.id}"${groupAttr}>
      <span class="lock" aria-hidden="true" style="display:none;">🔒</span>
      <span class="node-label">${labelHtml}</span>
    </label>`;
}

function renderSpiralConnectorSVG(config) {
  // Placeholder coordinates — layoutSpiralTree() fills these in with real
  // measurements once the modal is actually visible.
  const lines = buildSpiralEdges(config)
    .map(([a, b]) => `<line id="${config.containerId}-edge-${a}__${b}" x1="0" y1="0" x2="0" y2="0"></line>`)
    .join('');
  return `<svg class="tree-lines" viewBox="0 0 960 1120" preserveAspectRatio="xMidYMin meet">${lines}</svg>`;
}

function renderSpiralModal(key, config) {
  const standaloneHtml = (config.standalone || []).map(renderStandalone).join('');
  const nodesHtml = collectSpiralNodes(config).map(renderSpiralNode).join('');
  const connectorSvg = renderSpiralConnectorSVG(config);

  return `
    <div class="psychoscope-modal-overlay" id="${config.modalId}" data-tree="${key}">
      <div class="modal-content">
        <button class="modal-close psychoscope-modal-close-floating" type="button" aria-label="Close" data-close-modal="${config.modalId}">&times;</button>
        <div class="modal-body">
          ${standaloneHtml}
          <div class="tree-canvas-outer" id="${config.containerId}-canvas-outer">
            <div class="tree-canvas-wrap" id="${config.containerId}-canvas">
              ${connectorSvg}
              ${nodesHtml}
            </div>
          </div>
        </div>
        <div class="node-tooltip" id="${config.containerId}-tooltip" role="tooltip"></div>
      </div>
    </div>`;
}

function renderCompactTrigger(key, config) {
  return `
    <div class="psychoscope-compact" id="${config.containerId}-compact" data-tree="${key}"
         tabindex="0" role="button" aria-label="Configure ${config.title}">
      <div class="psychoscope-compact-header">
        <span class="psychoscope-compact-title">${config.title}</span>
        <span class="psychoscope-compact-edit">Configure ›</span>
      </div>
      <div class="psychoscope-compact-summary" id="${config.containerId}-summary"></div>
    </div>`;
}

// ---------- Compact trigger summary ----------
function rowSummaryHtml(label, active) {
  const dotClass = active ? 'psychoscope-dot psychoscope-dot--active' : 'psychoscope-dot';
  const textClass = active ? 'psychoscope-summary-text psychoscope-summary-text--active' : 'psychoscope-summary-text';
  return `<div class="psychoscope-summary-row"><span class="${dotClass}"></span><span class="${textClass}">${label}</span></div>`;
}

function computeCompactSummaryHtml(config) {
  const lines = [];

  (config.standalone || []).forEach(item => {
    const checked = document.getElementById(item.id)?.checked;
    let label = item.label;
    if (item.kind === 'checkbox-number' && checked) {
      const val = document.getElementById(item.numberId)?.value;
      label += ` · ${val}`;
    }
    lines.push(rowSummaryHtml(label, !!checked));
  });

  computeSpiralOrderedChoices(config).forEach(node => {
    lines.push(rowSummaryHtml(node ? normalizeLineBreaks(node.label).replace(/\n/g, ' ') : '—', !!node));
  });

  return lines.join('');
}

function updateCompactSummary(key) {
  const config = PSYCHOSCOPE_TREES[key];
  const el = document.getElementById(`${config.containerId}-summary`);
  const trigger = document.getElementById(`${config.containerId}-compact`);
  if (!el || !trigger) return;

  const anySet = (config.standalone || []).some(s => document.getElementById(s.id)?.checked)
    || collectSpiralNodes(config).some(node => document.getElementById(node.id)?.checked);

  trigger.classList.toggle('empty', !anySet);

  if (!anySet) {
    el.innerHTML = `<div class="note">Not configured yet — click to set up.</div>`;
    return;
  }
  el.innerHTML = computeCompactSummaryHtml(config);
}

// Counts how many of the 3rd-slot bonuses are currently active for a tree.
// Counts how many of the bonus factor slots are currently active for a tree
// (the 3rd Class Inspiration slot, and/or the single Class Singularity slot).
function computeBonusFactorSlots(config) {
  const result = { class: false, singularity: false };
  if (!config) return result;
  collectSpiralNodes(config).forEach(node => {
    if (node.grantsFactor && document.getElementById(node.id)?.checked) {
      result[node.grantsFactor] = true;
    }
  });
  return result;
}

function normalizeFactorSearchText(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function getFactorSelectionKey(value, suggestions = []) {
  const input = String(value || '').trim().toLowerCase();
  if (!input) return null;
  const match = suggestions.find(option => {
    const haystacks = [option.label, option.key, ...option.aliases];
    return haystacks.some(h => normalizeFactorSearchText(h) === normalizeFactorSearchText(input));
  });
  return match?.key || null;
}

function matchesFactorQuery(option, query) {
  const normalizedQuery = normalizeFactorSearchText(query);
  if (!normalizedQuery) return true;
  const haystacks = [option.label, option.key, ...option.aliases];
  return haystacks.some(h => normalizeFactorSearchText(h).includes(normalizedQuery));
}

// 'defensive' slots have no name field at all, so there's nothing to dedup
// there -- only 'class' (indices 1-3) and 'singularity' (index 1 only, since
// there's never more than one) have a name-based id list.
function getFactorSlotIds(type) {
  if (type === 'class') return [1, 2, 3].map(i => `psychoscope-factor-class-${i}`);
  if (type === 'singularity') return [1].map(i => `psychoscope-factor-singularity-${i}`);
  return [];
}

function getUsedFactorKeys(excludeSlotId, type) {
  const usedKeys = new Set();
  getFactorSlotIds(type).forEach(slotId => {
    if (slotId === excludeSlotId) return;
    const input = document.getElementById(`${slotId}-name`);
    const key = getFactorSelectionKey(input?.value || '', getFactorSuggestionsForType(type));
    if (key) usedKeys.add(key);
  });
  return usedKeys;
}

// Dedup is per factor type, so a Class Inspiration pick doesn't block the
// same name in the Singularity slot.
function sanitizeDuplicateFactorSelections(type = null) {
  const types = type ? [type] : ['class', 'singularity'];
  types.forEach(currentType => {
    const slotIds = getFactorSlotIds(currentType);
    const seen = new Map();
    slotIds.forEach(slotId => {
      const input = document.getElementById(`${slotId}-name`);
      const key = getFactorSelectionKey(input?.value || '', getFactorSuggestionsForType(currentType));
      if (!key) return;
      const existing = seen.get(key);
      if (existing && existing !== slotId) {
        if (input) input.value = '';
        return;
      }
      seen.set(key, slotId);
    });
  });
}

function escapeHtmlAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// =============================================================================
// Factor "sockets" -- up to FACTOR_SOCKET_MAX freeform effect lines per
// factor slot (class, singularity, or defensive), addable/removable like
// weapon line effects elsewhere in the app. Purely inert/placeholder for
// now -- nothing reads socket content for calc purposes yet, it's just
// captured and saved so the shape is right when effects get implemented.
// =============================================================================

function renderFactorSocketRow(slotId, index, socket = {}) {
  const socketData = typeof socket === 'string' ? { key: '', value: socket } : (socket || {});
  const key = socketData.key || '';
  const suggestions = getFactorEffectSuggestions();
  const selectedEffect = suggestions.find(effect => effect.id === key);
  const legacyWeaponEffect = WEAPON_LINE_EFFECT_OPTIONS[key];
  const legacyLabel = typeof legacyWeaponEffect === 'string' ? legacyWeaponEffect : (legacyWeaponEffect?.label || '');
  const effectLabel = selectedEffect?.label || socketData.label || legacyLabel;
  const optionMarkup = suggestions.map(effect => {
    const search = [effect.label, effect.key, ...(Array.isArray(effect.aliases) ? effect.aliases : [])].filter(Boolean).join(' ').toLowerCase();
    return `<div class="module-option" data-value="${escapeHtmlAttr(effect.id)}" data-search="${escapeHtmlAttr(search)}">${escapeHtmlAttr(effect.label || '')}</div>`;
  }).join('');

  return `
    <div class="psychoscope-factor-socket-row" data-socket-index="${index}" data-selected-effect="${escapeHtmlAttr(key)}">
      <div class="module-select-container psychoscope-factor-socket-select">
        <input type="text" class="module-search-input psychoscope-factor-socket-effect" id="${slotId}-socket-effect-${index}"
               placeholder="Select effect..." autocomplete="off" value="${escapeHtmlAttr(effectLabel)}">
        <div class="module-dropdown psychoscope-factor-socket-dropdown" style="display:none;">${optionMarkup}</div>
      </div>
            <input type="text" inputmode="decimal" class="module-level-input psychoscope-factor-socket-value" id="${slotId}-socket-value-${index}"
              placeholder="${escapeHtmlAttr(selectedEffect?.unit || socketData.unit || '%')}" value="${escapeHtmlAttr(socketData.value ?? '')}">
      <button type="button" class="psychoscope-factor-socket-remove" aria-label="Remove effect">&times;</button>
    </div>`;
}

function renderFactorSockets(slotId, values = []) {
  const rows = values.map((v, i) => renderFactorSocketRow(slotId, i, v)).join('');
  return `
    <div class="psychoscope-factor-sockets" id="${slotId}-sockets">${rows}</div>`;
}

function getFactorSocketValues(slotId) {
  return Array.from(document.querySelectorAll(`#${slotId}-sockets .psychoscope-factor-socket-row`)).map(row => ({
    key: row.dataset.selectedEffect || '',
    label: row.querySelector('.psychoscope-factor-socket-effect')?.value || '',
    unit: row.querySelector('.psychoscope-factor-socket-value')?.placeholder || '%',
    value: row.querySelector('.psychoscope-factor-socket-value')?.value || '',
  }));
}

// Re-numbers socket rows' ids/data-index after an add/remove, and shows or
// hides the "+ Add Effect" button once the cap is hit.
function reindexFactorSockets(slotId) {
  const rows = document.querySelectorAll(`#${slotId}-sockets .psychoscope-factor-socket-row`);
  rows.forEach((row, i) => {
    row.dataset.socketIndex = String(i);
    const effectInput = row.querySelector('.psychoscope-factor-socket-effect');
    const valueInput = row.querySelector('.psychoscope-factor-socket-value');
    if (effectInput) effectInput.id = `${slotId}-socket-effect-${i}`;
    if (valueInput) valueInput.id = `${slotId}-socket-value-${i}`;
  });
  const addBtn = document.getElementById(`${slotId}-socket-add`);
  if (addBtn) addBtn.style.display = rows.length < FACTOR_SOCKET_MAX ? '' : 'none';
}

// Delegated listeners scoped to this one slot's own sockets container/add
// button, so they're automatically cleaned up whenever the slot itself is
// removed/rebuilt (e.g. the bonus slot being un-granted, or a class-driven
// refresh) rather than piling up on a shared document-level listener.
function wireFactorSockets(slotId) {
  const container = document.getElementById(`${slotId}-sockets`);
  const addBtn = document.getElementById(`${slotId}-socket-add`);

  addBtn?.addEventListener('click', () => {
    const current = container?.querySelectorAll('.psychoscope-factor-socket-row').length || 0;
    if (current >= FACTOR_SOCKET_MAX) return;
    container?.insertAdjacentHTML('beforeend', renderFactorSocketRow(slotId, current));
    reindexFactorSockets(slotId);
    if (typeof calc === 'function') calc();
  });

  container?.addEventListener('focusin', (event) => {
    const effectInput = event.target.closest('.psychoscope-factor-socket-effect');
    if (!effectInput) return;
    const row = effectInput.closest('.psychoscope-factor-socket-row');
    const dropdown = row?.querySelector('.psychoscope-factor-socket-dropdown');
    filterFactorSocketOptions(row, effectInput.value);
    if (dropdown) dropdown.style.display = 'block';
  });

  container?.addEventListener('input', (event) => {
    const effectInput = event.target.closest('.psychoscope-factor-socket-effect');
    if (effectInput) {
      const row = effectInput.closest('.psychoscope-factor-socket-row');
      const dropdown = row?.querySelector('.psychoscope-factor-socket-dropdown');
      filterFactorSocketOptions(row, effectInput.value);
      if (dropdown) dropdown.style.display = 'block';
    }
    if (typeof calc === 'function') calc();
  });

  container?.addEventListener('click', (event) => {
    const option = event.target.closest('.psychoscope-factor-socket-dropdown .module-option');
    if (option) {
      const row = option.closest('.psychoscope-factor-socket-row');
      const effectInput = row?.querySelector('.psychoscope-factor-socket-effect');
      if (effectInput) effectInput.value = option.textContent;
      if (row) row.dataset.selectedEffect = option.dataset.value || '';
      const valueInput = row?.querySelector('.psychoscope-factor-socket-value');
      const selectedEffect = getFactorEffectSuggestions().find(effect => effect.id === option.dataset.value);
      if (valueInput && selectedEffect?.unit) valueInput.placeholder = selectedEffect.unit;
      const dropdown = row?.querySelector('.psychoscope-factor-socket-dropdown');
      if (dropdown) dropdown.style.display = 'none';
      if (typeof calc === 'function') calc();
      return;
    }
    const removeBtn = event.target.closest('.psychoscope-factor-socket-remove');
    if (!removeBtn) return;
    removeBtn.closest('.psychoscope-factor-socket-row')?.remove();
    reindexFactorSockets(slotId);
    if (typeof calc === 'function') calc();
  });

  container?.addEventListener('focusout', (event) => {
    const effectInput = event.target.closest('.psychoscope-factor-socket-effect');
    if (!effectInput) return;
    const dropdown = effectInput.closest('.psychoscope-factor-socket-row')?.querySelector('.psychoscope-factor-socket-dropdown');
    window.setTimeout(() => {
      dropdown?.style.setProperty('display', 'none');
    }, 150);
  });
}

function filterFactorSocketOptions(row, query) {
  const normalizedQuery = String(query || '').toLowerCase().trim();
  const currentKey = row?.dataset.selectedEffect || '';
  const selectedElsewhere = new Set(Array.from(row?.parentElement?.querySelectorAll('.psychoscope-factor-socket-row') || [])
    .filter(otherRow => otherRow !== row)
    .map(otherRow => otherRow.dataset.selectedEffect)
    .filter(Boolean));
  row?.querySelectorAll('.psychoscope-factor-socket-dropdown .module-option').forEach(option => {
    const key = option.dataset.value || '';
    const search = (option.dataset.search || option.textContent).toLowerCase();
    option.style.display = !selectedElsewhere.has(key) && (key === currentKey || search.includes(normalizedQuery)) ? 'block' : 'none';
  });
}

function renderFactorSocketAddButton(slotId, values) {
  const canAddMore = values.length < FACTOR_SOCKET_MAX;
  return `<button type="button" class="psychoscope-factor-socket-add" id="${slotId}-socket-add"${canAddMore ? '' : ' style="display:none;"'}>+ Add Imprint</button>`;
}

// 'defensive' slots have no name/dropdown at all -- just a label and sockets.
function renderFactorSlot(type, index, options = {}) {
  const slotId = `psychoscope-factor-${type}-${index}`;
  const initialSockets = Array.isArray(options.initialSockets) ? options.initialSockets.slice(0, FACTOR_SOCKET_MAX) : [];
  const socketsHtml = renderFactorSockets(slotId, initialSockets);

  if (type === 'defensive') {
    return `
      <div class="psychoscope-factor-slot psychoscope-factor-slot--defensive" id="${slotId}-row">
        <div class="psychoscope-factor-slot-header">
          <div class="psychoscope-factor-slot-label">Defensive Factor ${index}</div>
          ${renderFactorSocketAddButton(slotId, initialSockets)}
        </div>
        ${socketsHtml}
      </div>`;
  }

  const nameId = `${slotId}-name`;
  const dropdownId = `${nameId}-dropdown`;
  const classSelectVal = getSelectedClassValue();
  const placeholder = getFactorSlotPlaceholder(type, classSelectVal);
  const currentNameValue = String(options.initialNameValue ?? '').trim();
  const optionsHtml = getFactorSuggestionsForType(type)
    .map(option => `<button type="button" class="module-option" data-value="${option.label}" data-key="${option.key}">${option.label}</button>`)
    .join('');

  return `
    <div class="psychoscope-factor-slot" id="${slotId}-row">
      <div class="psychoscope-factor-slot-header">
        <div class="module-select-container psychoscope-factor-select-container">
          <input type="text" class="module-search-input psychoscope-factor-search"
                 id="${nameId}" placeholder="${placeholder}" autocomplete="off" data-dropdown-id="${dropdownId}"
                 value="${escapeHtmlAttr(currentNameValue)}">
          <div class="module-dropdown psychoscope-factor-dropdown" id="${dropdownId}" style="display:none;">
            ${optionsHtml}
          </div>
        </div>
        ${renderFactorSocketAddButton(slotId, initialSockets)}
      </div>
      ${socketsHtml}
    </div>`;
}

function wireFactorSlot(type, index) {
  const slotId = `psychoscope-factor-${type}-${index}`;
  wireFactorSockets(slotId);

  if (type === 'defensive') return; // no name/dropdown to wire for defensive slots

  const nameId = `${slotId}-name`;
  const dropdownId = `${nameId}-dropdown`;
  const nameInput = document.getElementById(nameId);
  const dropdown = document.getElementById(dropdownId);

  const refresh = () => {
    sanitizeDuplicateFactorSelections(type);
    if ((type === 'class' || type === 'singularity') && typeof updateClassSkills === 'function') updateClassSkills();
    if (typeof calc === 'function') calc();
  };

  const filterDropdown = (query) => {
    const usedKeys = getUsedFactorKeys(slotId, type);
    const currentKey = getFactorSelectionKey(nameInput.value, getFactorSuggestionsForType(type));
    dropdown?.querySelectorAll('.module-option').forEach(option => {
      const key = option.getAttribute('data-key') || '';
      const suggestion = getFactorSuggestionsForType(type).find(f => f.key === key);
      const shouldShow = !usedKeys.has(key) && (currentKey === key || matchesFactorQuery(suggestion, query));
      option.style.display = shouldShow ? '' : 'none';
    });
  };

  nameInput?.addEventListener('input', () => {
    const query = nameInput.value.trim();
    filterDropdown(query);
    if (dropdown) dropdown.style.display = query ? 'flex' : 'none';
    refresh();
  });
  nameInput?.addEventListener('focus', () => {
    if (!dropdown) return;
    filterDropdown(nameInput.value.trim());
    dropdown.style.display = 'flex';
  });
  nameInput?.addEventListener('blur', () => {
    window.setTimeout(() => {
      dropdown?.style.setProperty('display', 'none');
    }, 120);
  });
  dropdown?.querySelectorAll('.module-option').forEach(option => {
    option.addEventListener('mousedown', (event) => {
      event.preventDefault();
      const value = option.getAttribute('data-value') || '';
      const key = option.getAttribute('data-key') || '';
      if (getUsedFactorKeys(slotId, type).has(key) && key !== getFactorSelectionKey(nameInput?.value || '', getFactorSuggestionsForType(type))) {
        return;
      }
      if (nameInput) nameInput.value = value;
      dropdown.style.display = 'none';
      refresh();
    });
  });

  refresh();
}

// Builds the static shell once: Class Inspiration slots 1 & 2 (always
// present once a class is selected), and both fixed Defensive slots (always
// present regardless of class). The Class Inspiration bonus slot (3) and the
// single Class Singularity slot are NOT created here -- those are only ever
// added/removed by syncBonusSlot(), driven by the tree's grantsFactor nodes.
function initFactorsShell() {
  const root = document.getElementById('psychoscope-factors');
  if (!root) return;

  root.innerHTML = `
    <div class="section-label">Factors</div>
    <div class="factor-group" id="factor-group-class" style="display:none;">
      <span class="factor-group-label">Class Inspiration Factors<span class="tip"><span class="tip-icon">i</span><span class="tip-box">Pick a class factor. Generic stat-gain sockets affect the matching stat from all sources and reduce the paired stat by 6%.</span></span></span>
      <div class="factor-slots" id="factor-slots-class">
        ${renderFactorSlot('class', 1)}
        ${renderFactorSlot('class', 2)}
      </div>
    </div>
    <div class="factor-group" id="factor-group-singularity" style="display:none;">
      <span class="factor-group-label">Class Singularity Factor<span class="tip"><span class="tip-icon">i</span><span class="tip-box">Only exists when granted by a Singularity node in the tree (max 1). Socketed effects aren't implemented yet.</span></span></span>
      <div class="factor-slots" id="factor-slots-singularity"></div>
    </div>
    <div class="factor-group" id="factor-group-defensive">
      <span class="factor-group-label">Defensive Factors<span class="tip"><span class="tip-icon">i</span><span class="tip-box">Organizational only -- defensive factor effects aren't implemented. Use the socket lines to note what's slotted here.</span></span></span>
      <div class="factor-slots" id="factor-slots-defensive">
        ${renderFactorSlot('defensive', 1)}
        ${renderFactorSlot('defensive', 2)}
      </div>
    </div>`;

  wireFactorSlot('class', 1);
  wireFactorSlot('class', 2);
  wireFactorSlot('defensive', 1);
  wireFactorSlot('defensive', 2);
}

// Adds/removes a single bonus slot for a given factor type+index, leaving
// every other slot alone. Used for the 3rd Class Inspiration slot (index 3)
// and the single Class Singularity slot (index 1, since it has no base slots
// at all -- it's either granted or it doesn't exist).
function syncBonusSlot(type, index, shouldExist) {
  const slotId = `psychoscope-factor-${type}-${index}`;
  const existing = document.getElementById(`${slotId}-row`);
  if (shouldExist && !existing) {
    document.getElementById(`factor-slots-${type}`)?.insertAdjacentHTML('beforeend', renderFactorSlot(type, index));
    wireFactorSlot(type, index);
  } else if (!shouldExist && existing) {
    existing.remove();
  }
}

function getActiveOptionalInputDefinitions() {
  const treeKey = getActiveTreeConfigKey();
  const selectValue = document.getElementById('psychoscope-tree')?.value;
  const module = window.PSYCHOSCOPE_MODULES?.[selectValue] || window.PSYCHOSCOPE_MODULES?.[treeKey];
  if (!module) return [];

  if (typeof module.getOptionalInputs === 'function') {
    const defs = module.getOptionalInputs();
    return Array.isArray(defs) ? defs : [];
  }

  return Array.isArray(module.optionalInputs) ? module.optionalInputs : [];
}

function renderOptionalInputRow(definition) {
  const inputId = definition.id || `psychoscope-optional-${definition.key || String(Math.random()).slice(2)}`;
  if (definition.type === 'checkbox') {
    const existingInput = document.getElementById(inputId);
    const checked = existingInput ? existingInput.checked : !!definition.defaultChecked;
    return `
    <div class="psychoscope-optional-row">
      <label class="psychoscope-optional-label" for="${inputId}">${definition.label || 'Optional'}</label>
      <input type="checkbox"
        id="${inputId}"
        data-psychoscope-optional-input="true"
        data-psychoscope-optional-key="${definition.key || inputId}"
        ${checked ? 'checked' : ''}
        class="psychoscope-optional-input">
    </div>`;
  }

  const min = Number.isFinite(definition.min) ? definition.min : 0;
  const defaultValue = Number.isFinite(definition.defaultValue) ? definition.defaultValue : min;
  const currentValue = document.getElementById(inputId)?.value ?? defaultValue;
  const max = Number.isFinite(definition.max) ? definition.max : defaultValue;
  const label = definition.label || 'Optional Value';

  return `
    <div class="psychoscope-optional-row">
      <label class="psychoscope-optional-label" for="${inputId}">${label}</label>
      <input type="number"
        id="${inputId}"
        data-psychoscope-optional-input="true"
        data-psychoscope-optional-key="${definition.key || inputId}"
        min="${min}"
        max="${max}"
        step="1"
        value="${currentValue}"
        class="psychoscope-optional-input">
    </div>`;
}

function renderPsychoscopeOptionalInputs() {
  const root = document.getElementById('psychoscope-optional-inputs');
  if (!root) return;

  const defs = getActiveOptionalInputDefinitions().filter(def => {
    if (typeof def.showWhen === 'function') return def.showWhen();
    return true;
  });

  root.innerHTML = defs.map(renderOptionalInputRow).join('');
  root.style.display = defs.length ? 'block' : 'none';

  defs.forEach(def => {
    const input = document.getElementById(def.id || `psychoscope-optional-${def.key}`);
    if (!input) return;

    if (def.type === 'checkbox') {
      input.addEventListener('change', () => {
        if (typeof calc === 'function') calc();
      });
      return;
    }

    const applyBounds = () => {
      const min = Number.isFinite(def.min) ? def.min : 0;
      const max = typeof def.getMax === 'function' ? def.getMax() : (Number.isFinite(def.max) ? def.max : 9999);
      input.min = String(min);
      input.max = String(max);
      if (input.value === '') return;

      const value = Number.parseInt(input.value, 10);
      if (!Number.isFinite(value)) {
        input.value = String(def.defaultValue ?? min);
        return;
      }
      input.value = String(Math.min(Math.max(value, min), max));
    };

    input.addEventListener('input', () => {
      applyBounds();
      if (typeof calc === 'function') calc();
    });
    input.addEventListener('change', () => {
      applyBounds();
      if (typeof calc === 'function') calc();
    });
    applyBounds();
  });
}

// Rebuilds a single slot's dropdown options in place (they depend on the
// selected class) while preserving whatever the person already typed/added
// -- only called for slots that currently exist.
function refreshFactorSlotOptions(type, index) {
  const slotId = `psychoscope-factor-${type}-${index}`;
  const row = document.getElementById(`${slotId}-row`);
  if (!row) return;

  const nameInput = row.querySelector(`#${slotId}-name`);
  const savedName = nameInput ? nameInput.value : '';
  const savedSockets = getFactorSocketValues(slotId);

  row.outerHTML = renderFactorSlot(type, index, { initialNameValue: savedName, initialSockets: savedSockets });
  wireFactorSlot(type, index);
}

function updateFactors() {
  const wrap = document.getElementById('psychoscope-factors');
  if (!wrap) return;

  const config = getActiveTreeConfig();
  wrap.style.display = config ? 'block' : 'none';
  renderPsychoscopeOptionalInputs();
  if (!config) return;

  const classSelectVal = getSelectedClassValue();
  const hasClass = classSelectVal !== 'none';
  document.getElementById('factor-group-class')?.style.setProperty('display', hasClass ? '' : 'none');
  document.getElementById('factor-group-singularity')?.style.setProperty('display', hasClass ? '' : 'none');
  // Defensive Factors are always shown regardless of class selection -- they're
  // organizational slots for the tree's own defensive-factor node, not tied to
  // having a class picked at all.

  const bonus = computeBonusFactorSlots(config);

  refreshFactorSlotOptions('class', 1);
  refreshFactorSlotOptions('class', 2);
  if (document.getElementById('psychoscope-factor-class-3-row')) refreshFactorSlotOptions('class', 3);
  if (document.getElementById('psychoscope-factor-singularity-1-row')) refreshFactorSlotOptions('singularity', 1);

  syncBonusSlot('class', 3, hasClass && bonus.class);
  syncBonusSlot('singularity', 1, hasClass && bonus.singularity);
}

// ---------- Master change handler ----------
function handleTreeChange(key) {
  const config = PSYCHOSCOPE_TREES[key];
  applySpiralGating(config);
  layoutSpiralTree(config);
  highlightSpiralEdges(config);
  updateCompactSummary(key);
  updateFactors(); // a node toggle may add/remove a bonus factor slot
  const tree = document.getElementById('psychoscope-tree')?.value || '';
  if (typeof syncPsychoscopeSkillEffects === 'function') {
    syncPsychoscopeSkillEffects(tree);
  }
  if (typeof calc === 'function') calc();
}

function wireTreeEvents(key, config) {
  (config.standalone || []).forEach(s => {
    document.getElementById(s.id)?.addEventListener('change', () => handleTreeChange(key));
    if (s.numberId) document.getElementById(s.numberId)?.addEventListener('change', () => handleTreeChange(key));
  });

  collectSpiralNodes(config).forEach(node => {
    const input = document.getElementById(node.id);
    if (!input) return;

    if (node.kind === 'radio') {
      // Satellites are plain checkboxes (not native radios) so a person can
      // click a selected one again to clear it. When one gets checked,
      // uncheck any other satellite in the same slot so at most one stays
      // selected per slot.
      input.addEventListener('change', () => {
        if (input.checked) {
          getSpiralSatelliteGroupIds(config, node.id).forEach(otherId => {
            if (otherId === node.id) return;
            const other = document.getElementById(otherId);
            if (other && other.checked) other.checked = false;
          });
        }
        handleTreeChange(key);
      });
    } else {
      input.addEventListener('change', () => handleTreeChange(key));
    }
  });
}

// ---------- Modal open/close ----------
function openTreeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  const config = PSYCHOSCOPE_TREES[overlay.dataset.tree];
  // Wait a frame so the modal has actually been laid out before we measure it.
  requestAnimationFrame(() => {
    layoutSpiralTree(config);
    highlightSpiralEdges(config);
  });
}
function closeTreeModal(modalId) {
  const overlay = document.getElementById(modalId);
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
  overlay?.querySelectorAll('.node-tooltip').forEach(t => { t.style.display = 'none'; });
}

// Keep lines aligned if the window is resized while a tree is open.
window.addEventListener('resize', () => {
  document.querySelectorAll('.psychoscope-modal-overlay.open').forEach(o => {
    layoutSpiralTree(PSYCHOSCOPE_TREES[o.dataset.tree]);
  });
});

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('.psychoscope-compact');
  if (trigger) {
    openTreeModal(PSYCHOSCOPE_TREES[trigger.dataset.tree].modalId);
    return;
  }
  const closeBtn = e.target.closest('[data-close-modal]');
  if (closeBtn) {
    closeTreeModal(closeBtn.dataset.closeModal);
    return;
  }
  const overlay = e.target.closest('.psychoscope-modal-overlay');
  if (overlay && e.target === overlay) {
    closeTreeModal(overlay.id);
  }
});


function positionFloatingTip(tip) {
  const icon = tip.querySelector('.tip-icon');
  const box = tip.querySelector('.tip-box');
  if (!icon || !box) return;

  const iconRect = icon.getBoundingClientRect();
  const boxWidth = box.offsetWidth || 220;
  const boxHeight = box.offsetHeight || 60;
  const margin = 8, gap = 8;

  let left = iconRect.left + iconRect.width / 2;
  left = Math.max(boxWidth / 2 + margin, Math.min(window.innerWidth - boxWidth / 2 - margin, left));

  const showBelow = iconRect.top < boxHeight + gap + margin;
  box.style.left = `${left}px`;
  if (showBelow) {
    box.style.top = `${iconRect.bottom + gap}px`;
    box.style.transform = 'translate(-50%, 0)';
  } else {
    box.style.top = `${iconRect.top - gap}px`;
    box.style.transform = 'translate(-50%, -100%)';
  }
}

document.addEventListener('mouseover', (e) => {
  const tip = e.target.closest('.psychoscope-modal-overlay .tip');
  if (tip) positionFloatingTip(tip);
});

// ---------- Spiral node hover/focus tooltips (replaces the old per-node tip-icon) ----------
// One shared tooltip element per tree (rendered as a sibling of .tree-canvas-outer
// inside .modal-content — see renderSpiralModal), positioned here via JS rather
// than the icon-driven .tip/.tip-box approach used for standalone controls, since
// that approach relies on position:fixed staying relative to the *viewport* —
// which breaks once an ancestor (.tree-canvas-wrap) has a CSS transform on it
// (scaleSpiralCanvas), because a transformed ancestor becomes the containing
// block for fixed descendants. Rendering the tooltip outside the transformed
// subtree avoids that entirely, and keeps its text full-size regardless of how
// small the tree itself is currently scaled down to fit the modal.
function getSpiralNodeTip(config, nodeId) {
  return collectSpiralNodes(config).find(n => n.id === nodeId)?.tip || '';
}

function positionSpiralNodeTooltip(nodeEl, tooltip) {
  const rect = nodeEl.getBoundingClientRect();
  const boxWidth = tooltip.offsetWidth || 220;
  const boxHeight = tooltip.offsetHeight || 60;
  const margin = 8, gap = 8;

  let left = rect.left + rect.width / 2;
  left = Math.max(boxWidth / 2 + margin, Math.min(window.innerWidth - boxWidth / 2 - margin, left));

  const showBelow = rect.top < boxHeight + gap + margin;
  tooltip.style.left = `${left}px`;
  if (showBelow) {
    tooltip.style.top = `${rect.bottom + gap}px`;
    tooltip.style.transform = 'translate(-50%, 0)';
  } else {
    tooltip.style.top = `${rect.top - gap}px`;
    tooltip.style.transform = 'translate(-50%, -100%)';
  }
}

function showSpiralNodeTooltip(nodeEl) {
  const overlay = nodeEl.closest('.psychoscope-modal-overlay');
  const config = overlay ? PSYCHOSCOPE_TREES[overlay.dataset.tree] : null;
  const tooltip = config ? document.getElementById(`${config.containerId}-tooltip`) : null;
  const rawTip = config ? getSpiralNodeTip(config, nodeEl.dataset.nodeId) : '';
  if (!tooltip || !rawTip) return;
  const tipHtml = renderRichTextTip(rawTip);
  tooltip.innerHTML = tipHtml;
  tooltip.style.display = 'block';
  positionSpiralNodeTooltip(nodeEl, tooltip);
}

function hideSpiralNodeTooltip(nodeEl) {
  const overlay = nodeEl.closest('.psychoscope-modal-overlay');
  const config = overlay ? PSYCHOSCOPE_TREES[overlay.dataset.tree] : null;
  const tooltip = config ? document.getElementById(`${config.containerId}-tooltip`) : null;
  if (tooltip) tooltip.style.display = 'none';
}

document.addEventListener('mouseover', (e) => {
  const nodeEl = e.target.closest('.psychoscope-modal-overlay .tree-node[data-node-id]');
  if (nodeEl) showSpiralNodeTooltip(nodeEl);
});
document.addEventListener('mouseout', (e) => {
  const nodeEl = e.target.closest('.psychoscope-modal-overlay .tree-node[data-node-id]');
  if (nodeEl && !nodeEl.contains(e.relatedTarget)) hideSpiralNodeTooltip(nodeEl);
});
document.addEventListener('focusin', (e) => {
  const nodeEl = e.target.closest('.psychoscope-modal-overlay .tree-node[data-node-id]');
  if (nodeEl) showSpiralNodeTooltip(nodeEl);
});
document.addEventListener('focusout', (e) => {
  const nodeEl = e.target.closest('.psychoscope-modal-overlay .tree-node[data-node-id]');
  if (nodeEl) hideSpiralNodeTooltip(nodeEl);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const trigger = e.target.closest('.psychoscope-compact');
    if (trigger) {
      e.preventDefault();
      openTreeModal(PSYCHOSCOPE_TREES[trigger.dataset.tree].modalId);
    }
  }
  if (e.key === 'Escape') {
    document.querySelectorAll('.psychoscope-modal-overlay.open').forEach(o => closeTreeModal(o.id));
  }
});

// ---------- Init ----------
function initPsychoscopeTrees() {
  Object.entries(PSYCHOSCOPE_TREES).forEach(([key, config]) => {
    const container = document.getElementById(config.containerId);
    if (!container) return;

    container.innerHTML = renderCompactTrigger(key, config);
    document.body.insertAdjacentHTML('beforeend', renderSpiralModal(key, config));

    wireTreeEvents(key, config);
    applySpiralGating(config); // lock everything but the center node on first render
    updateCompactSummary(key);
    // Line layout is skipped here on purpose — the modal is still hidden
    // (display:none) at this point, so there's nothing to measure yet.
    // openTreeModal() runs layoutSpiralTree() as soon as it's actually shown.
  });

  initFactorsShell();
  document.getElementById('psychoscope-tree')?.addEventListener('change', updateFactors);
  document.getElementById('class-select')?.addEventListener('change', () => {
    updateFactors();
    if (typeof calc === 'function') calc();
  });
  updateFactors();
}

document.addEventListener('DOMContentLoaded', initPsychoscopeTrees);



function createEmptyPsychoscopeFactorState() {
  return { class: [], singularity: [], defensive: [] };
}

function normalizePsychoscopeSocketList(rawSockets) {
  const arr = Array.isArray(rawSockets) ? rawSockets : [];
  return arr.slice(0, FACTOR_SOCKET_MAX).map(socket => {
    if (typeof socket === 'string') return { key: '', label: '', unit: '%', value: socket };
    return {
      key: String(socket?.key || ''),
      label: String(socket?.label || ''),
      unit: String(socket?.unit || '%'),
      value: String(socket?.value ?? ''),
    };
  }).filter(socket => socket.key || socket.value !== '');
}

function normalizePsychoscopeSaveState(state) {
  const raw = state && typeof state === 'object' ? state : {};
  console.log('[psychoscope] normalize input', state);
  const normalized = {
    tree: raw.tree || 'none',
    values: raw.values && typeof raw.values === 'object' ? raw.values : {},
    optionalInputs: raw.optionalInputs && typeof raw.optionalInputs === 'object' ? raw.optionalInputs : {},
    factors: createEmptyPsychoscopeFactorState(),
  };

  const factorData = raw.factors && typeof raw.factors === 'object' ? raw.factors : {};

  const classSlots = Array.isArray(factorData.class) ? factorData.class : [];
  normalized.factors.class = classSlots
    .slice(0, 3)
    .map(slot => ({
      name: String(slot?.name || '').trim(),
      sockets: normalizePsychoscopeSocketList(slot?.sockets),
    }))
    .filter(slot => slot.name || slot.sockets.length);

  const singularitySlots = Array.isArray(factorData.singularity) ? factorData.singularity : [];
  normalized.factors.singularity = singularitySlots
    .slice(0, 1)
    .map(slot => ({
      name: String(slot?.name || '').trim(),
      sockets: normalizePsychoscopeSocketList(slot?.sockets),
    }))
    .filter(slot => slot.name || slot.sockets.length);

  // Defensive slots always exist (they're fixed, not granted) -- always
  // normalize to exactly 2 entries, even if the saved data has fewer/more.
  const defensiveSlots = Array.isArray(factorData.defensive) ? factorData.defensive : [];
  normalized.factors.defensive = [0, 1].map(i => ({
    sockets: normalizePsychoscopeSocketList(defensiveSlots[i]?.sockets),
  }));

  console.log('[psychoscope] normalize output', normalized);
  return normalized;
}

function getPsychoscopeElementSaveValue(el) {
  if (!el) return null;
  if (el.type === 'checkbox' || el.type === 'radio') {
    return el.checked ? 1 : null;
  }
  const val = el.value;
  if (val === '' || val === null || val === undefined) return null;
  const trimmed = String(val).trim();
  if (trimmed === '') return null;
  const num = Number(val);
  return !Number.isNaN(num) ? num : trimmed;
}

// Reads whatever factor slots currently exist in the DOM for a type (a slot
// that isn't currently granted/present just contributes nothing -- there's
// no separate "3 empty class slots" padding).
function collectPsychoscopeFactorSlots(type) {
  const results = [];
  getFactorSlotIds(type).forEach(slotId => {
    if (!document.getElementById(`${slotId}-row`)) return;
    const nameEl = document.getElementById(`${slotId}-name`);
    const name = String(nameEl?.value || '').trim();
    const sockets = getFactorSocketValues(slotId).filter(socket => socket.key || socket.value !== '');
    if (!name && !sockets.length) return;
    results.push({ name, sockets });
  });
  return results;
}

function getPsychoscopeSaveState() {
  const tree = document.getElementById('psychoscope-tree')?.value || 'none';
  const values = {};
  const optionalInputs = {};
  const config = getActiveTreeConfig();

  const collectConfigValues = (cfg) => {
    if (!cfg) return;
    (cfg.standalone || []).forEach(item => {
      if (item.id) {
        const el = document.getElementById(item.id);
        const value = getPsychoscopeElementSaveValue(el);
        if (value !== null) values[item.id] = value;
      }
      if (item.numberId) {
        const el = document.getElementById(item.numberId);
        const value = getPsychoscopeElementSaveValue(el);
        if (value !== null) values[item.numberId] = value;
      }
    });
    collectSpiralNodes(cfg).forEach(node => {
      const el = document.getElementById(node.id);
      const value = getPsychoscopeElementSaveValue(el);
      if (value !== null) values[node.id] = value;
    });
  };

  collectConfigValues(config);

  document.querySelectorAll('[data-psychoscope-optional-input]').forEach(el => {
    const key = el.dataset.psychoscopeOptionalKey || el.id;
    const value = getPsychoscopeElementSaveValue(el);
    if (value !== null) {
      values[el.id] = value;
      optionalInputs[key] = value;
    }
  });

  const factors = {
    class: collectPsychoscopeFactorSlots('class'),
    singularity: collectPsychoscopeFactorSlots('singularity'),
    // Defensive slots always exist and have no name -- always exactly 2
    // entries, each just whatever socket lines are currently filled in.
    defensive: [1, 2].map(index => {
      const slotId = `psychoscope-factor-defensive-${index}`;
      const sockets = document.getElementById(`${slotId}-row`)
        ? getFactorSocketValues(slotId).filter(socket => socket.key || socket.value !== '')
        : [];
      return { sockets };
    }),
  };

  return {
    tree,
    values,
    optionalInputs,
    factors,
  };
}


function applyPsychoscopeSaveState(state) {
  console.log('[psychoscope] applyPsychoscopeSaveState start', state);
  const savedState = normalizePsychoscopeSaveState(state);
  const treeSelect = document.getElementById('psychoscope-tree');
  console.log('[psychoscope] applying tree', savedState.tree, 'treeSelect exists', !!treeSelect);
  if (treeSelect) treeSelect.value = savedState.tree || 'none';

  if (typeof initFactorsShell === 'function' && !document.getElementById('psychoscope-factor-class-1-name')) {
    initFactorsShell();
  }

  const config = getActiveTreeConfig();
  const resetConfigValues = (cfg) => {
    if (!cfg) return;
    (cfg.standalone || []).forEach(item => {
      if (item.id) {
        const el = document.getElementById(item.id);
        if (el) {
          if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = false;
          } else {
            el.value = '';
          }
        }
      }
      if (item.numberId) {
        const el = document.getElementById(item.numberId);
        if (el) {
          if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = false;
          } else {
            el.value = item.numberDefault ?? '';
          }
        }
      }
    });
    collectSpiralNodes(cfg).forEach(node => {
      const el = document.getElementById(node.id);
      if (el) {
        if (el.type === 'checkbox' || el.type === 'radio') {
          el.checked = false;
        } else {
          el.value = '';
        }
      }
    });
  };

  const applyConfigValues = (cfg) => {
    if (!cfg) return;
    (cfg.standalone || []).forEach(item => {
      if (item.id) {
        const el = document.getElementById(item.id);
        if (el) {
          if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = Boolean(savedState.values?.[item.id]);
          } else {
            el.value = savedState.values?.[item.id] ?? '';
          }
        }
      }
      if (item.numberId) {
        const el = document.getElementById(item.numberId);
        if (el) {
          if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = Boolean(savedState.values?.[item.numberId]);
          } else {
            el.value = savedState.values?.[item.numberId] ?? '';
          }
        }
      }
    });
    collectSpiralNodes(cfg).forEach(node => {
      const el = document.getElementById(node.id);
      if (el) {
        if (el.type === 'checkbox' || el.type === 'radio') {
          el.checked = Boolean(savedState.values?.[node.id]);
        } else {
          el.value = savedState.values?.[node.id] ?? '';
        }
      }
    });

    document.querySelectorAll('[data-psychoscope-optional-input]').forEach(el => {
      const key = el.dataset.psychoscopeOptionalKey || el.id;
      const value = savedState.optionalInputs?.[key] ?? savedState.values?.[el.id];
      if (value === undefined || value === null || value === '') {
        el.value = '';
        return;
      }
      if (el.type === 'checkbox' || el.type === 'radio') {
        el.checked = Boolean(value);
      } else {
        el.value = String(value);
      }
    });
  };

  console.log('[psychoscope] reset/apply config for', config?.title || 'none');
  resetConfigValues(config);
  applyConfigValues(config);
  // Re-run gating so a restored state can't leave a downstream node checked
  // without its prerequisites (also redraws lines/highlighting once visible).
  if (config) {
    applySpiralGating(config);
    layoutSpiralTree(config);
    highlightSpiralEdges(config);
    updateCompactSummary(getActiveTreeConfigKey());
  }
  console.log('[psychoscope] applied values snapshot', savedState.values);

  if (typeof updateFactors === 'function') updateFactors();

  document.querySelectorAll('[data-psychoscope-optional-input]').forEach(el => {
    const key = el.dataset.psychoscopeOptionalKey || el.id;
    const value = savedState.optionalInputs?.[key] ?? savedState.values?.[el.id];
    if (value === undefined || value === null || value === '') return;
    el.value = String(value);
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Restore name (where applicable) + socket lines into whichever slots
  // currently exist -- updateFactors() above already created/removed the
  // bonus Class Inspiration slot and the Singularity slot based on the
  // restored tree's grantsFactor state, so a slot not existing here just
  // means it wasn't granted; there's nothing to restore into.
  const restoreFactorSlot = (type, index, slotData) => {
    const slotId = `psychoscope-factor-${type}-${index}`;
    if (!document.getElementById(`${slotId}-row`)) return;
    if (type !== 'defensive') {
      const nameEl = document.getElementById(`${slotId}-name`);
      if (nameEl) nameEl.value = slotData?.name || '';
    }
    const sockets = Array.isArray(slotData?.sockets) ? slotData.sockets.slice(0, FACTOR_SOCKET_MAX) : [];
    const socketsContainer = document.getElementById(`${slotId}-sockets`);
    if (socketsContainer) {
      socketsContainer.innerHTML = sockets.map((socket, i) => renderFactorSocketRow(slotId, i, socket)).join('');
      reindexFactorSockets(slotId);
    }
  };

  const classSlots = Array.isArray(savedState.factors?.class) ? savedState.factors.class : [];
  [1, 2, 3].forEach((index, i) => restoreFactorSlot('class', index, classSlots[i]));

  const singularitySlots = Array.isArray(savedState.factors?.singularity) ? savedState.factors.singularity : [];
  restoreFactorSlot('singularity', 1, singularitySlots[0]);

  const defensiveSlots = Array.isArray(savedState.factors?.defensive) ? savedState.factors.defensive : [];
  [1, 2].forEach((index, i) => restoreFactorSlot('defensive', index, defensiveSlots[i]));

  sanitizeDuplicateFactorSelections('class');
  sanitizeDuplicateFactorSelections('singularity');

  if (typeof updateClassSkills === 'function') updateClassSkills();

  if (typeof onPsychoscopeChange === 'function') {
    console.log('[psychoscope] calling onPsychoscopeChange');
    onPsychoscopeChange();
  }
}

// Small helper for applyPsychoscopeSaveState() above, since it only has the
// resolved config (not the #psychoscope-tree <select> key) in scope there.
function getActiveTreeConfigKey() {
  const val = document.getElementById('psychoscope-tree')?.value;
  return TREE_SELECT_VALUE_MAP[val] || null;
}

window.normalizePsychoscopeSaveState = normalizePsychoscopeSaveState;
window.getPsychoscopeSaveState = getPsychoscopeSaveState;
window.applyPsychoscopeSaveState = applyPsychoscopeSaveState;