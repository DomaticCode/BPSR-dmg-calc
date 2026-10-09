//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct
function provideSmiteClassBonuses(stats) {
  const isSmiteClass = document.getElementById('class-select')?.value === 'smite';

  let elemPct = 0;
  let matkPct = 0;
  let magBoostPct = 0;
  let luckyDreamDmgPct = 0;
  let luckyFinalDmgPct = 0;
  let luckMult = 0;
  let skillFinalDmgPct = 0;
  let luckyDmgPct = 0;

  let thornsPct = 0;
  if (isSmiteClass && getChecked('flowers-ascension')) {
    elemPct += 10;
  }
  if (isSmiteClass && getChecked('thorn')) {
    elemPct += 20;
    thornsPct = 20;
  }

  const targetType = document.getElementById('target-type').value;
  const isEliteOrBoss = targetType === 'elite' || targetType === 'boss';

  if (isSmiteClass && getChecked('wide-area-thorns') && isEliteOrBoss) {
    let wideAreaThornsPct = 8;
    elemPct += wideAreaThornsPct;
  }

  if (isSmiteClass) {
    const masteryConversionFactor = 0.75;
    const masteryElemBonus = stats.mastery * masteryConversionFactor;
    const masteryElemPct = masteryElemBonus * 100;

    const masteryElemEl = document.getElementById('mastery-elem-dmg-pct');
    if (masteryElemEl) masteryElemEl.value = masteryElemPct.toFixed(3);

    elemPct += masteryElemPct;
  }

  if (isSmiteClass) {
    luckyFinalDmgPct += 50;
  }

  if (isSmiteClass && getChecked('bloomheal')) {
    skillFinalDmgPct -= 10;
  }

  if (isSmiteClass && getChecked('luck-dmg-talent')) {
    const luckTalentMult = 1.5;
    luckMult += 5 + (stats.luck * 100 * luckTalentMult);
  }

  if (isSmiteClass && getChecked('lucky-pulse')) {
    luckyDmgPct += 30;
  }

  if(isSmiteClass && getChecked('arcane-of-green')) {
    const arcaneOfGreenPct = stats.mastery * stats.luck * 100;
    matkPct += arcaneOfGreenPct;
  }

  matkPct = Math.floor(matkPct * 100) / 100;

  console.log(`smite class returning bonuses: ${elemPct}, ${magBoostPct}, ${luckyDreamDmgPct}, ${luckMult}, ${luckyFinalDmgPct}, ${matkPct}`);

  return {
    classElemPct: elemPct,
    classThornsPct: thornsPct,
    classMagBoostPct: magBoostPct,
    classLuckyDreamDmgPct: luckyDreamDmgPct,
    classLuckMult: luckMult, // NOT A PERCENT SCALER, it's flat
    classLuckyFinalDmgPct: luckyFinalDmgPct,
    classLuckyDmgPct: luckyDmgPct, // generic dmg to lucky strikes
    classSkillFinalDmgPct: skillFinalDmgPct,
    classMatkPct: matkPct,
  };
}

// Register provider for other modules to call
window.CLASS_BONUS_PROVIDERS = window.CLASS_BONUS_PROVIDERS || {};


function isSmiteFactorSelected(key){
  if (document.getElementById('psychoscope-tree')?.value === 'none') return false;
  const suggestions = provideSmiteFactorSuggestions('class');
  return [1, 2, 3].some(index => {
    const name = document.getElementById(`psychoscope-factor-class-${index}-name`)?.value || '';
    return getFactorSelectionKey(name, suggestions) === key;
  });
}

function isSmiteSingularitySelected(key){
  if (document.getElementById('psychoscope-tree')?.value === 'none') return false;
  const name = document.getElementById('psychoscope-factor-singularity-1-name')?.value || '';
  const suggestions = provideSmiteFactorSuggestions('singularity');
  return getFactorSelectionKey(name, suggestions) === key;
}

function hasSmiteThornsLuckySingularity() {
  if (document.getElementById('psychoscope-tree')?.value === 'none') return false;
  const name = document.getElementById('psychoscope-factor-singularity-1-name')?.value || '';
  const suggestions = provideSmiteFactorSuggestions('singularity');
  return getFactorSelectionKey(name, suggestions) === 'singularity-x1';
}

function provideSmiteFactorSuggestions(type = 'class') {
  if (type !== 'class' && type !== 'singularity') return [];
  if(type === 'class'){
    return [
    {
      key: 'x1',
      label: 'X1 Regen Pulse',
      aliases: ['x1', 'regen', 'pulse', 'crit'],
    },
    {
      key: 'x2',
      label: 'X2 (Ward -> Stag Charge)',
      aliases: ['x2', 'ward', 'stag', 'stag charge'],
    },
    {
      key: 'x3',
      label: 'X3 (Regen bud -> Season Dmg)',
      aliases: ['x3', 'Healing', 'Regen Bud', 'Season Dmg', 'rest', 'oath', '8%'],
      defaultValue: 18.5,
    }
  ];
  } else if (type === 'singularity') {
    return [
      {
        key: 'singularity-x1',
        label: 'X1 (Thorns trigger lucky)',
        aliases: ['x1', 'thorns', 'luck', 'lucky', 'proc'],
      },
      {
        key: 'singularity-x2',
        label: 'X2 (Special +1 bud, 10% mastery)',
        aliases: ['x2', 'special', 'bud', 'mastery', 'wild bloom'],
      }
    ];
  }
}

// Returns simple bonus values for calc.js to consume.
function provideSmiteFactorBonuses() {
  const isSmiteClass = document.getElementById('class-select')?.value === 'smite';
  if (!isSmiteClass) return {};

  let classFactorCritPct = 0;
  let classFactorCritDmgPct = 0;
  let classFactorSeasonDmgPct = 0;
  let classFactorMasteryPct = 0;
  if (isSmiteFactorSelected('x1')){
    classFactorCritPct += 10;
    classFactorCritDmgPct = 30;
  }
  if (isSmiteFactorSelected('x3')){
    classFactorSeasonDmgPct += 8;
  }

  if (isSmiteSingularitySelected('singularity-x2')){
    classFactorMasteryPct += 10;
  }

  console.log(' smite class returning = ', classFactorMasteryPct)

  return {
    classFactorCritPct,
    classFactorCritDmgPct,
    classFactorSeasonDmgPct,
    classFactorMasteryPct
  };
}


function getInfusionEffects(){
  const effects = [];
  const thornbreaker = !!document.getElementById('thornbreaker')?.checked;
  //const s1set = getVal('s1-set-value');
  if (thornbreaker) {
    effects.push(['finalDamage', '100 + (sub-mastery-pct * 4)']);
  }
  //if(s1set >= 4){
  //  effects.push(['generic', '60']);
  //}
  return effects;
}

function getStagChargeEffects(){
  const effects = [];
  const thornbreaker = !!document.getElementById('thornbreaker')?.checked;
  if (thornbreaker) {
    effects.push(['finalDamage', '100 + (sub-mastery-pct * 4)']);
  }
  if(isSmiteFactorSelected('x2')){
    effects.push(['dreamDmg', 'sub-luck-pct'])
    effects.push(['critChance', '100'])
  }
  return effects;
}

function getWildBloomEffects(){
  return [];
}

function getRegenPulseEffects(){
  const effects = [];
  const pulseEcho = !!document.getElementById('pulse-echo')?.checked;
  if (pulseEcho) {
    effects.push(['generic', '100']);
  }
  return effects;
}

function getRegenBudEffects(){
  const effects = [
    ['damageType', 'luck-effect'],
  ];
  return effects;
}

function provideSmiteSkills() {
  const thornsCanProcLucky = hasSmiteThornsLuckySingularity();
  return [
    [
      'expertise',
      63,
      272,
      true,
      'Infusion',
      getInfusionEffects(),
      812,
      0
    ],
    [
      'none',
      700,
      3000,
      false,
      'Stag Charge',
      getStagChargeEffects(),
      34,
      0
    ],
    ["expertise",
      168,
      480,
      true,
      "Regen Pulse",
      getRegenPulseEffects(),
      54,
      0
    ],
    [
      "none",
      100,
      0,
      false,
      "Regen Bud: Wild Seed",
      getRegenBudEffects(),
      153,
      0
    ],
    [
      "special",
      140,
      600,
      true,
      "Wild Bloom",
      getWildBloomEffects(),
      49,
      0
    ],
    [
      "none",
      20,
      0,
      thornsCanProcLucky,
      "Thorns",
      [],
      243,
      0
    ],
    [
      "expertise",
      144.5565834,
      614.84,
      true,
      "Feral Seed - Seed Meteor",
      [],
      23,
      0
    ],
    [
      "expertise",
      53.7167083,
      232.58,
      true,
      "Feral Seed - Stage 1",
      [],
      23,
      0
    ],
    [
      "expertise",
      53.7167083,
      232.58,
      true,
      "Feral Seed - Stage 2",
      [],
      23,
      0
    ],
    [
      "basic",
      12.6,
      54,
      true,
      "Vines Embrace",
      [],
      12,
      0
    ]
  ];
}

function provideSmiteFormulaParts(kind = 'elem') {
  // kind: 'elem' | 'gen' | 'dream' | 'dreamLucky' | 'luckyGen'
  if (kind === 'elem') {
    const parts = [];
    if (getChecked('flowers-ascension')) parts.push(`Flowers ${(0.10*100).toFixed(2)}%`);
    if (getChecked('thorn')) parts.push(`Thorn ${(0.20*100).toFixed(2)}%`);
    if (getChecked('wide-area-thorns') && (document.getElementById('target-type')?.value === 'elite' || document.getElementById('target-type')?.value === 'boss')) parts.push(`W.Thorns ${(0.08*100).toFixed(2)}%`);
    // Mastery element bonus: prefer the input element if present, else leave out
    const masteryEl = document.getElementById('mastery-elem-dmg-pct');
    const masteryVal = masteryEl ? parseFloat(masteryEl.value) : NaN;
    if (!Number.isNaN(masteryVal) && masteryVal !== 0) parts.push(`Mastery ${(masteryVal).toFixed(3)}%`);
    return parts.length ? parts.join(' + ') : '';
  }
  if (kind === 'luckyFinal') {
    return `Smite ${50}%`;
  }
  // other kinds: no class-specific parts
  return '';
}


// HTML for Smite options (moved out of main file so class module can render it)
const SMITE_OPTIONS_HTML = `
  <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.6px; color:var(--text-muted); margin-bottom:8px;">Smite/Class Options</div>
  <div class="checkbox-group" style="margin:0; gap:6px;">
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="luck-dmg-talent" style="width:14px;height:14px;" checked onchange="updateClassSkills(); calc()"><label for="luck-dmg-talent">Luck Damage Talent</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">5% Lucky DMG Multiplier + 1.2% per 1% Luck.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="flowers-ascension" style="width:14px;height:14px;" checked onchange="updateClassSkills(); calc()"><label for="flowers-ascension">Flowers Ascension</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">10% Forest dmg on spending buds. (8 seconds)</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="thorn" style="width:14px;height:14px;" checked onchange="updateClassSkills(); calc()"><label for="thorn">Thorn</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">20% Forest dmg to targets with thorn (Regen Pulse is bugged for this).</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="wide-area-thorns" style="width:14px;height:14px;" checked onchange="updateClassSkills(); calc()"><label for="wide-area-thorns">Wide-area Thorns</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Hidden 8% Elite Forest DMG (always up).</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="arcane-of-green" style="width:14px;height:14px;" checked onchange="updateClassSkills(); calc()"><label for="arcane-of-green">Arcane of Green</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Balance Patch (full) only, MATK boost by Mastery % * Luck %.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="thornbreaker" style="width:14px;height:14px;" checked onchange="updateClassSkills(); calc()"><label for="thornbreaker">Thornbreaker</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Increased damage done by infusion and stag charge by 100% + Mastery % * 4 (final)</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="pulse-echo" style="width:14px;height:14px;" onchange="updateClassSkills(); calc()"><label for="pulse-echo">Pulse Echo</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Hitting with infusion boosts damage of Regen Pulse (up to 100%).</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="bloomheal" style="width:14px;height:14px;" onchange="onSmiteInspirationToggle()"><label for="bloomheal">Bloomheal</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Doubles inspiration bonus at the cost of 10% final damage.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="lucky-pulse" style="width:14px;height:14px;" onchange="onSmiteInspirationToggle()"><label for="lucky-pulse">Lucky Pulse</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Lucky Strike DMG +30%, removes inspiration.</span></span></div>
    <div class="cb-row" style="gap:6px;"><label>Set Bonus (WIP)</label><input type="number" id="set-value" min="0" max="6" step="1" value="0" style="width:50px;" onInput="updateClassSkills(); clamp(this); calc()"><span class="tip"><span class="tip-icon">i</span><span class="tip-box"> 2 Set: WIP<br>4 Set: WIP </span></span></div>
  </div>
`;

function renderSmiteOptions(containerId = 'class-options') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.log(`Container with id ${containerId} not found for Smite options.`);
    return;
  }
  container.innerHTML = SMITE_OPTIONS_HTML;
  container.style.display = '';
}

function syncSmiteInspiration() {
  if (document.getElementById('class-select')?.value !== 'smite') return;
  const luckyPulseEnabled = !!document.getElementById('lucky-pulse')?.checked;
  const bloomhealEnabled = !!document.getElementById('bloomheal')?.checked;
  const inspirationEl = document.getElementById('inspiration');
  if (inspirationEl) {
    inspirationEl.value = luckyPulseEnabled ? '0' : bloomhealEnabled ? '3' : '1.5';
  }
}

function onSmiteInspirationToggle() {
  syncSmiteInspiration();
  updateClassSkills();
  calc();
}

function onSmiteSelected() {
  // Render options and apply Smite-specific defaults
  console.log('Smite selected, rendering options and setting defaults.');
  renderSmiteOptions();
  // set damage type and inspiration default (does not call calc())
  if (typeof setType === 'function') setType('magical');
  const inspEl = document.getElementById('inspiration');
  if (inspEl) inspEl.value = '1.5';
}

function mainStatType() {
  return 'int';
}

function elemType() {
  return 'forest';
}

function mainStatModifier() {
  return 0.5;
}

function mainStatModifierTalent(){
  return 0.1;
}

// Register class module for UI/behavior
window.CLASS_MODULES = window.CLASS_MODULES || {};
window.CLASS_MODULES.smite = {
  renderOptions: renderSmiteOptions,
  onSelected: onSmiteSelected,
  provideClassBonuses: provideSmiteClassBonuses,
  provideFactorSuggestions: provideSmiteFactorSuggestions,
  provideFactorBonuses: provideSmiteFactorBonuses,
  provideSkills: provideSmiteSkills,
  provideFormulaParts: provideSmiteFormulaParts,
  mainStatType: mainStatType,
  elemType: elemType,
  mainStatModifier: mainStatModifier,
  mainStatModifierTalent: mainStatModifierTalent,
};



