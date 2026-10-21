//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct, haste: postWlHastePct,
function provideDissonanceClassBonuses(stats) {
  const isDissonanceClass = document.getElementById('class-select')?.value === 'dissonance';

  let elemPct = 0;
  let finalLuckPct = 0;
  let matkPct = 0;
  let matk = 0;
  let luckyCritIncrement = 0;
  let luckyStaticCritDmg = 0;
  let mainStatPct = 0;
  let luckMult = 0;
  let luckMultFinalPct = 0;
  const classOtherMultipliersPct = [];


  if(isDissonanceClass){
    const masteryConversionFactor = 0.4;
    const masteryElemBonus = stats.mastery * masteryConversionFactor;
    const masteryElemPct = masteryElemBonus * 100;

    const masteryElemEl = document.getElementById('mastery-elem-dmg-pct');
    if (masteryElemEl) masteryElemEl.value = masteryElemPct.toFixed(3);

    elemPct += masteryElemPct;
  }

  if (isDissonanceClass && getChecked('in-rhapsody')) {
    elemPct += 10;
    finalLuckPct += 50;
  }

  if(isDissonanceClass && getChecked('trio-rhapsody') && getChecked('in-rhapsody')){
    const trioRhapsodyPct = stats.haste * 0.6 * 100;
    console.log(`Trio Rhapsody: ${trioRhapsodyPct.toFixed(2)}%`);
    matkPct += trioRhapsodyPct;
  }

  const luckPct = stats.luck * (1 + finalLuckPct / 100);


  if (isDissonanceClass && getChecked('luck-multiplier') && getChecked('in-heroic-melody')) {
    luckMult += (luckPct * 100);
  } else if (isDissonanceClass && getChecked('luck-multiplier')){
    luckMult += (luckPct * 100 * 0.5);
  }

  const targetType = document.getElementById('target-type').value;
  const isEliteOrBoss = targetType === 'elite' || targetType === 'boss' || targetType === 'elite-seasonal' || targetType === 'boss-seasonal';

  if (isDissonanceClass && getChecked('fire-day') && isEliteOrBoss) {
    elemPct += 8;
  }

  if(isDissonanceClass && getChecked('absolute-center-stage') && getChecked('in-center-stage')) {
    luckMultFinalPct += 30;
  }

  if(isDissonanceClass && getChecked('in-center-stage')) {
    matkPct += 8;
    matk += 80;
  }
  if(isDissonanceClass && getChecked('finale-command')) {
    mainStatPct += 10;
  }

  if (isDissonanceClass && getChecked('break-buff')) {
    classOtherMultipliersPct.push({ label: 'Break Buff', pct: 15 });
  }

  if(isDissonanceClass && getVal('set-value', 0) >= 2 && getChecked('in-heroic-melody')){
    luckyCritIncrement += 3;
  }
  if(isDissonanceClass && getVal('set-value', 0) >= 4 && getChecked('in-rhapsody')){
    luckyStaticCritDmg = 180;
  }

  //if(isDissonanceClass && getVal('set-value', 0) >= 2 && getChecked('in-heroic-melody')){
    //elemPct += 5;
  //}
  console.log(`disso returning: ${elemPct}, ${finalLuckPct}, ${luckMult}, ${matkPct}, ${matk}`);

  return {
    classElemPct: elemPct,
    classFinalLuckPct: finalLuckPct,
    classLuckMult: luckMult,
    classLuckyCritIncrement: luckyCritIncrement,
    classLuckyStaticCritDmg: luckyStaticCritDmg,
    classMatkPct: matkPct,
    classMatk: matk,
    classMainStatPct: mainStatPct,
    classLuckMultFinalPct: luckMultFinalPct,
    classOtherMultipliersPct,
  };
}

// Register provider for other modules to call
window.CLASS_BONUS_PROVIDERS = window.CLASS_BONUS_PROVIDERS || {};

function isDissoFactorSelected(key){
  if (document.getElementById('psychoscope-tree')?.value === 'none') return false;
  const suggestions = provideDissonanceFactorSuggestions('class');
  return [1, 2, 3].some(index => {
    const name = document.getElementById(`psychoscope-factor-class-${index}-name`)?.value || '';
    return getFactorSelectionKey(name, suggestions) === key;
  });
}

function isDissoSingularitySelected(key){
  if (document.getElementById('psychoscope-tree')?.value === 'none') return false;
  const name = document.getElementById('psychoscope-factor-singularity-1-name')?.value || '';
  const suggestions = provideDissonanceFactorSuggestions('singularity');
  return getFactorSelectionKey(name, suggestions) === key;
}

function provideDissonanceFactorSuggestions(type = 'class') {
  if (type !== 'class' && type !== 'singularity') return [];
  if(type === 'class'){
    return [
    {
      key: 'x1',
      label: 'X1 Amplified Beat Encore String',
      aliases: ['x1', 'amplified', 'encore', 'string'],
    },
    {
      key: 'x2',
      label: 'X2 Harmonic Anthem (scorch + luck final dmg)',
      aliases: ['x2', 'harmonic', 'anthem', 'scorching impact', 'luck', 'final', 'damage'],
    }
  ];
  } else if (type === 'singularity') {
    return [
      {
        key: 'singularity-x1',
        label: 'X1 (Center Stage Rhapsody)',
        aliases: ['x1', 'center stage', 'rhapsody', 'haste', 'automatically'],
      }
    ];
  }
}

function provideDissoFactorEffectSuggestions() {
  return [
    {
      key: 'scorching-impact-seasonal-damage',
      label: 'Scorching Impact Oath Damage',
      aliases: ['Scorching Impact Seasonal Damage', 'Scorching Impact Oath Damage', 'Scorching Impact Oath DMG', 'Scorching Impact Seasonal DMG'],
      unit: '%',
    },
  ];
}

// Returns simple bonus values for calc.js to consume.
function provideDissonanceFactorBonuses() {
  let classFactorLuckyFinalPct = 0;
  if(isDissoFactorSelected('x2') && getChecked('in-center-stage')) {
    classFactorLuckyFinalPct = 6;
  }

  return {
    classFactorLuckyFinalPct: classFactorLuckyFinalPct,
  };
}

function getAmplifiedBeatEffects(){
  const effects = [
    ["generic","-20"],
    ["generic","20"]
  ];
  return effects;
}

function getHarmonicAnthemEffects(){
  const effects = [
    ["generic","10"]
  ];
  return effects;
}

function getRhapsodyEffects(){
  const effects = [];
  return effects;
}

function getEncoreEffects(){
  const effects = [];
  return effects;
}

function getFlameNoteEffects(){
  const effects = [];
  return effects;
}

function getScorchingImpactEffects(){
  const effects = [
    ["generic","600"] // 800 = 50 stacks, 600 = 37.5 stacks
  ];
  const socketSeasonalDamage = window.getFactorSocketEffectTotal?.('class:dissonance:scorching-impact-seasonal-damage') || 0;
  if (socketSeasonalDamage !== 0) {
    effects.push(['dreamDmg', String(socketSeasonalDamage)]);
  }
  const x2 = isDissoFactorSelected('x2');
  if (x2 && getChecked('in-center-stage')) {
    effects.push(['finalDamage', '35']);
  }
  return effects;
}

function provideDissonanceSkills() {
  const skills = [
    [
      "none",
      350,
      0,
      false,
      "Sound Blaze - Scorching Impact (average of ~37.5 soundwave energy, Generic = 800 for 50 stacks)",
      getScorchingImpactEffects(),
      133,
      0
    ],
    [
      "expertise",
      629.99,
      2700,
      true,
      "Rhapsody of Flame - Shape 3",
      getRhapsodyEffects(),
      130,
      0
    ],
    [
      "none",
      700,
      0,
      false,
      "Flame Note Damage",
      getFlameNoteEffects(),
      133,
      0
    ],
    [
      "expertise",
      210,
      900,
      true,
      "Harmonic Anthem - Stage 4 (Encore persistence roughly implemented (10%))",
      getHarmonicAnthemEffects(),
      120,
      0
    ],
    [
      "special",
      112,
      480,
      true,
      "Amplified Beat (Concerto talent + Encore Persistence basically cancel each other out)",
      getAmplifiedBeatEffects(),
      259,
      0
    ],
    [
      "expertise",
      42,
      180,
      true,
      "Passive Effect Encore Damage",
      getEncoreEffects(),
      619,
      0
    ],
    [
      "expertise",
      42,
      180,
      true,
      "Encore Damage",
      getEncoreEffects(),
      619,
      0
    ],
    [
      "none",
      420,
      1800,
      true,
      "Fierce Strike",
      [],
      8,
      0
    ],
  ];

  if (getChecked('flames-rampage')) {
    skills.push([
      "none",
      350,
      0,
      true,
      "Rhapsody of Flame - Flame's Rampage",
      [],
      117,
      0
    ]);
  }

  return skills;
}


// Returns Strings for formula breakdowns
function provideDissonanceFormulaParts(kind = 'elem') {
  // kind: 'elem' | 'gen' | 'dream' | 'dreamLucky' | 'luckyGen'
  if (kind === 'elem') {
    const parts = [];
    if (getChecked('in-rhapsody')) parts.push(`in-rhapsody ${(0.10*100).toFixed(2)}%`);
    if (getChecked('fire-day') && ['elite', 'boss', 'elite-seasonal', 'boss-seasonal'].includes(document.getElementById('target-type')?.value)) parts.push(`Fire Day ${(0.08*100).toFixed(2)}%`);
    if (getChecked('tree-x8') && getChecked('in-rhapsody')) {
      const x8Value = getVal('tree-x8-value', 0);
      parts.push(`X8 Factor ${x8Value.toFixed(2)}%`);
    }
    // Mastery element bonus: prefer the input element if present, else leave out
    const masteryEl = document.getElementById('mastery-elem-dmg-pct');
    const masteryVal = masteryEl ? parseFloat(masteryEl.value) : NaN;
    if (!Number.isNaN(masteryVal) && masteryVal !== 0) parts.push(`Mastery ${(masteryVal).toFixed(3)}%`);
    return parts.length ? parts.join(' + ') : '';
  }
  // other kinds: no class-specific parts
  return '';
}


// HTML for Dissonance options (moved out of main file so class module can render it)
const DISSONANCE_OPTIONS_HTML = `
  <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.6px; color:var(--text-muted); margin-bottom:8px;">Dissonance/Class Options</div>
  <div class="checkbox-group" style="margin:0; gap:6px;">
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="in-rhapsody" style="width:14px;height:14px;" checked onchange="calc()"><label for="in-rhapsody">In Rhapsody</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">User is inside ground rhapsody.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="in-heroic-melody" style="width:14px;height:14px;" checked onchange="calc()"><label for="in-heroic-melody">Heroic Melody</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Doubles Luck Multiplier conversion.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="trio-rhapsody" style="width:14px;height:14px;" checked onchange="calc()"><label for="trio-rhapsody">Trio Rhapsody</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">MATK increases by Haste % * 0.6.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="luck-multiplier" style="width:14px;height:14px;" checked onchange="calc()"><label for="luck-multiplier">Luck Multiplier Talent</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Every 1% luck -> 0.5% Lucky Strike DMG Multiplier. This is doubled to 1% if you are in Heroic Melody.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="fire-day" style="width:14px;height:14px;" checked onchange="calc()"><label for="fire-day">Fire Day Talent</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">8% Elite+ Fire damage.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="absolute-center-stage" style="width:14px;height:14px;" onchange="calc()"><label for="absolute-center-stage">Absolute Center Stage</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">While in center stage,\nLucky strike damage multiplier +30%.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="in-center-stage" style="width:14px;height:14px;" onchange="updateClassSkills(); calc()"><label for="in-center-stage">Center Stage</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">8% MATK + 80 (15s) </span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="finale-command" style="width:14px;height:14px;" onchange="calc()"><label for="finale-command">Finale Command</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">10% main stat to allies (and self) for 10 seconds</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="flames-rampage" style="width:14px;height:14px;" onchange="updateClassSkills(); calc()"><label for="flames-rampage">Flame's Rampage</label><span class="tip"><span class="tip-icon gold">i</span><span class="tip-box">When Heroic Melody is active, Rhapsody erupts every 3s (scales with haste)\n<span class="hl-gold">This is not taken in most s4 builds.</span></span></div></div>
    <div class="cb-row" style="gap:6px;"><label>Set Bonus</label><input type="number" id="set-value" min="0" max="4" step="1" value="0" style="width:50px;" onInput="updateClassSkills(); clamp(this); calc()"><span class="tip"><span class="tip-icon gold">i</span><span class="tip-box">2 Set:In Heroic Melody, if Lucky Strike fails to trigger a crit, crit rate increases by 3% each time, then resets after triggering crit<br>4 Set: Fierce Strike trigger speed +30%; Amplified Beat +1 hit (manually update hits per parse).</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="break-buff" style="width:14px;height:14px;" onchange="calc()"><label for="break-buff">Break Buff</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Dissonance passive talent.\nGrants 15% damage to enemies when they are broken.</span></span></div>
  </div>
`;

function renderDissonanceOptions(containerId = 'class-options') {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }
  container.innerHTML = DISSONANCE_OPTIONS_HTML;
  container.style.display = '';
}

function onDissonanceSelected() {
  // Render options and apply Dissonance-specific defaults
  renderDissonanceOptions();
  // set damage type and inspiration default (does not call calc())
  if (typeof setType === 'function') setType('magical');
}

function mainStatType() {
  return 'int';
}

function elemType() {
  return 'fire';
}

function mainStatModifier() {
  return 0.5;
}

function mainStatModifierTalent(){
  return 0.1;
}

// Register class module for UI/behavior
window.CLASS_MODULES = window.CLASS_MODULES || {};
window.CLASS_MODULES.dissonance = {
  renderOptions: renderDissonanceOptions,
  onSelected: onDissonanceSelected,
  provideClassBonuses: provideDissonanceClassBonuses,
  provideFactorSuggestions: provideDissonanceFactorSuggestions,
  provideFactorEffectSuggestions: provideDissoFactorEffectSuggestions,
  provideFactorBonuses: provideDissonanceFactorBonuses,
  provideFormulaParts: provideDissonanceFormulaParts,
  provideSkills: provideDissonanceSkills,
  mainStatType: mainStatType,
  elemType: elemType,
  mainStatModifier: mainStatModifier,
  mainStatModifierTalent: mainStatModifierTalent,
};
