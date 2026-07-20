//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct
function provideSmiteClassBonuses(stats) {
  const isSmiteClass = document.getElementById('class-select')?.value === 'smite';

  let elemPct = 0;
  let matkPct = 0;
  let magBoostPct = 0;
  let luckyDreamDmgPct = 0;
  let luckyFinalDmgPct = 0;
  let luckMult = 0;

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
  // TODO factors should be able to be removed from here, but double check nothing breaks

  if (isSmiteClass && getChecked('tree-x4')) {
    const x4Value = parseFloat(document.getElementById('tree-x4-value').value) || 0;
    matkPct += x4Value;
  }


  if (isSmiteClass) {
    luckyFinalDmgPct += 50;
  }

  if (isSmiteClass && getChecked('luck-dmg-talent')) {
    const luckTalentMult = 1.5;
    luckMult += 5 + (stats.luck * 100 * luckTalentMult);
  }

  if (isSmiteClass && getChecked('tree-x7')) {
    const x7Value = parseFloat(document.getElementById('tree-x7-value').value) || 0;
    matkPct += x7Value;
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
    classMatkPct: matkPct,
  };
}

// Register provider for other modules to call
window.CLASS_BONUS_PROVIDERS = window.CLASS_BONUS_PROVIDERS || {};


function getSmiteFactorValue(keyword){
  const searchKeyword = keyword.toLowerCase().trim();
  let totalValue = 0;

  const escapedKeyword = searchKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`\\b${escapedKeyword}\\b`);

  [1, 2, 3].forEach(index => {
    const nameInput = document.getElementById(`psychoscope-factor-class-${index}-name`);
    const valueInput = document.getElementById(`psychoscope-factor-class-${index}-value`);
    
    const name = String(nameInput?.value || '').trim().toLowerCase();
    const value = parseFloat(valueInput?.value) || 0;

    if (regex.test(name) && value > 0) {
      totalValue += value;
    }
  });

  return totalValue;
}

function getSmiteRealityFactorValue(keyword){
  const searchKeyword = keyword.toLowerCase().trim();
  let totalValue = 0;

  const escapedKeyword = searchKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`\\b${escapedKeyword}\\b`);

  [1, 2, 3].forEach(index => {
    const nameInput = document.getElementById(`psychoscope-factor-class-reality-${index}-name`);
    const valueInput = document.getElementById(`psychoscope-factor-class-reality-${index}-value`);
    
    const name = String(nameInput?.value || '').trim().toLowerCase();
    const value = parseFloat(valueInput?.value) || 0;

    if (regex.test(name) && value > 0) {
      totalValue += value;
    }
  });

  return totalValue;
}

function provideSmiteFactorSuggestions(type = 'class') {
  if (type !== 'class' && type !== 'class-reality') return [];
  if(type === 'class'){
    return [
    {
      key: 'x1',
      label: 'X1 (Wild Bloom/Stag Charge)',
      aliases: ['x1', 'special', 'wild bloom', 'stag charge'],
      defaultValue: 31.3,
    },
    {
      key: 'x2',
      label: 'X2 (Infusion)',
      aliases: ['x2', 'infusion'],
      defaultValue: 16.7,
    },
    {
      key: 'x3',
      label: 'X3 (Regen Pulse)',
      aliases: ['x3', 'regen pulse'],
      defaultValue: 18.5,
    },
    {
      key: 'x4',
      label: 'X4 (Symbiotic Mark MATK)',
      aliases: ['x4', 'symbiotic mark', 'symbiotic-mark', 'symbiotic'],
      defaultValue: 7.5,
    }, 
    {
      key: 'x5',
      label: 'X5 (Feral Seed)',
      aliases: ['x5', 'feral seed'],
      defaultValue: 25.0,
    },
    {
      key: 'x7',
      label: 'X7 (Ward MATK)',
      aliases: ['x7', 'ward matk', 'ward-matk', 'ward'],
      defaultValue: 16.7,
    }, 
    {
      key: 'x11',
      label: 'X11 (Seasonal Luck DMG)',
      aliases: ['x11', 'seasonal luck dmg', 'seasonal-luck-dmg', 'luck dmg'],
      defaultValue: 50,
    }];
  } else if (type === 'class-reality') {
    return [
      {
        key: 'reality-x3',
        label: 'X3 (Thorns Lucky proc)',
        aliases: ['x3', 'thorns', 'luck', 'lucky', 'proc'],
        defaultValue: 100,
      }
    ];
  }
}

// Returns simple bonus values for calc.js to consume.
function provideSmiteFactorBonuses() {
  const isSmiteClass = document.getElementById('class-select')?.value === 'smite';
  if (!isSmiteClass) return {};

  const classFactorLuckyDreamDmgPct = getSmiteFactorValue('x11');
  const classFactorMatkPct = getSmiteFactorValue('x7') + getSmiteFactorValue('x4');

  return {
    classFactorLuckyDreamDmgPct,
    classFactorMatkPct,
  };
}


function getInfusionEffects(){
  const effects = [];
  const x2Value = getSmiteFactorValue('x2');
  const thornbreaker = !!document.getElementById('thornbreaker')?.checked;
  const s1set = parseFloat(document.getElementById('s1-set-value').value) || 0;
  if (thornbreaker) {
    effects.push(['finalDamage', '100 + (sub-mastery-pct * 4)']);
  }
  if(x2Value > 0){
    effects.push(['dreamDmg', `${x2Value}`]);
  }
  if(s1set >= 4){
    effects.push(['generic', '60']);
  }
  return effects;
}

function getStagChargeEffects(){
  const effects = [
    ['damageType', 'no-thorns'],
  ];
  const thornbreaker = !!document.getElementById('thornbreaker')?.checked;
  const x1Value = getSmiteFactorValue('x1');
  if (thornbreaker) {
    effects.push(['finalDamage', '100 + (sub-mastery-pct * 4)']);
  }
  if(x1Value > 0){
    effects.push(['dreamDmg', `${x1Value}`]);
  }
  return effects;
}

function getWildBloomEffects(){
  const effects = [];
  const x1Value = getSmiteFactorValue('x1');
  if(x1Value > 0){
    effects.push(['dreamDmg', `${x1Value}`]);
  }
  return effects;
}

function getRegenPulseEffects(){
  const effects = [
    ['damageType', 'no-thorns'],
  ];
  const x3Value = getSmiteFactorValue('x3');
  const pulseEcho = !!document.getElementById('pulse-echo')?.checked;
  if (pulseEcho) {
    effects.push(['generic', '100']);
  }
  if(x3Value > 0){
    effects.push(['dreamDmg', `${x3Value}`]);
  }
  return effects;
}

function getRegenBudEffects(){
  const effects = [
    ['damageType', 'no-thorns'],
  ];
  return effects;
}

function getFeralSeedEffects(){
  const effects = [];
  const x5Value = getSmiteFactorValue('x5');
  const s2set = parseFloat(document.getElementById('s2-set-value').value) || 0;
  if(x5Value > 0){
    effects.push(['dreamDmg', `${x5Value}`]);
  }
  // Season 2, 2 set is still bugged, does not give elemental dmg
  //if(s2set >= 2){
  //  effects.push(['elemDmg', '12']);
  //}
  return effects;
}

function getThornsLuck() {
  return getSmiteRealityFactorValue('x3');
}
function canThornsLucky() {
  return getSmiteRealityFactorValue('x3');
}

function provideSmiteSkills() {
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
      canThornsLucky(),
      "Thorns",
      [['luckUptime', getThornsLuck()]],
      243,
      0
    ],
    [
      "expertise",
      144.5565834,
      614.84,
      true,
      "Feral Seed - Seed Meteor",
      getFeralSeedEffects(),
      23,
      0
    ],
    [
      "expertise",
      53.7167083,
      232.58,
      true,
      "Feral Seed - Stage 1",
      getFeralSeedEffects(),
      23,
      0
    ],
    [
      "expertise",
      53.7167083,
      232.58,
      true,
      "Feral Seed - Stage 2",
      getFeralSeedEffects(),
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
  if (kind === 'dreamLucky') {
    const value = getSmiteFactorValue('x11');
    if(value) {
      return `x11 factor ${value.toFixed(2)}%`;
    }
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
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="wide-area-thorns" style="width:14px;height:14px;" checked onchange="updateClassSkills(); calc()"><label for="wide-area-thorns">Wide-area Thorns</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Hidden 4% Elite Forest DMG (always up).</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="arcane-of-green" style="width:14px;height:14px;" checked onchange="updateClassSkills(); calc()"><label for="arcane-of-green">Arcane of Green</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Balance Patch (full) only, MATK boost by Mastery % * Luck %.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="thornbreaker" style="width:14px;height:14px;" checked onchange="updateClassSkills(); calc()"><label for="thornbreaker">Thornbreaker</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Increased damage done by infusion and stag charge by 100% + Mastery % * 4 (final)</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="pulse-echo" style="width:14px;height:14px;" onchange="updateClassSkills(); calc()"><label for="pulse-echo">Pulse Echo</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Hitting with infusion boosts damage of Regen Pulse (up to 100%).</span></span></div>
    <div class="cb-row" style="gap:6px;"><label>S1 Set (Void Corruption)</label><input type="number" id="s1-set-value" min="0" max="4" step="1" value="0" style="width:50px;" onInput="updateClassSkills(); clamp(this); calc()"><span class="tip"><span class="tip-icon">i</span><span class="tip-box"> 2 Set: Increased Mark healing<br>4 Set: 60% generic dmg for infusion </span></span></div>
    <div class="cb-row" style="gap:6px;"><label>S2 Set (Phantom)</label><input type="number" id="s2-set-value" min="0" max="4" step="1" value="0" style="width:50px;" onInput="updateClassSkills(); clamp(this); calc()"><span class="tip"><span class="tip-icon">i</span><span class="tip-box"> 2 Set: Feral Seed: 12% Elemental DMG and 25% CDR<br>4 Set: Bigger ward shield </span></span></div>
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



