//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct, haste: postWlHastePct,
function provideDissonanceClassBonuses(stats) {
  const isDissonanceClass = document.getElementById('class-select')?.value === 'dissonance';

  const masteryElemEl = document.getElementById('mastery-elem-dmg-pct');
  if (masteryElemEl) masteryElemEl.value = 0.00; // reset mastery element bonus (non mastery -> element class)

  let elemPct = 0;
  let finalLuckPct = 0;
  let matkPct = 0;
  let matk = 0;

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

  let luckMult = 0;
  if (isDissonanceClass && getChecked('luck-multiplier') && getChecked('in-heroic-melody')) {
    luckMult += (luckPct * 100);
  } else if (isDissonanceClass && getChecked('luck-multiplier')){
    luckMult += (luckPct * 100 * 0.5);
  }

  const targetType = document.getElementById('target-type').value;
  const isEliteOrBoss = targetType === 'elite' || targetType === 'boss';

  if (isDissonanceClass && getChecked('fire-day') && isEliteOrBoss) {
    elemPct += 8;
  }

  if(isDissonanceClass && getChecked('center-stage')) {
    matkPct += 8;
    matk += 80;
  }

  if(isDissonanceClass && parseFloat(document.getElementById('s2-set-value').value) >= 2 && getChecked('in-heroic-melody')){
    elemPct += 5;
  }
  console.log(`disso returning: ${elemPct}, ${finalLuckPct}, ${luckMult}, ${matkPct}, ${matk}`);

  return {
    classElemPct: elemPct,
    classFinalLuckPct: finalLuckPct,
    classLuckMult: luckMult,
    classMatkPct: matkPct,
    classMatk: matk,
  };
}

// Register provider for other modules to call
window.CLASS_BONUS_PROVIDERS = window.CLASS_BONUS_PROVIDERS || {};

function getDissonanceFactorValue(keyword) {
  const searchKeyword = keyword.toLowerCase().trim();
  let totalValue = 0;

  // Define keywords that require the checkbox to be checked
  const checkboxRequiredKeywords = ["x10"]; 
  const isCheckboxRequired = checkboxRequiredKeywords.includes(searchKeyword);

  const escapedKeyword = searchKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`\\b${escapedKeyword}\\b`);

  [1, 2, 3].forEach(index => {
    const nameInput = document.getElementById(`psychoscope-factor-class-${index}-name`);
    const valueInput = document.getElementById(`psychoscope-factor-class-${index}-value`);
    const applyCheckbox = document.getElementById(`psychoscope-factor-class-${index}-apply-imported`);
    
    const name = String(nameInput?.value || '').trim().toLowerCase();
    const value = parseFloat(valueInput?.value) || 0;

    if (regex.test(name) && value > 0) {
      
      // If the search requires the checkbox, check the box state.
      const shouldInclude = isCheckboxRequired 
        ? (applyCheckbox?.checked ?? false) 
        : true;

      if (shouldInclude) {
        totalValue += value;
      }
    }
  });

  return totalValue;
}

function getDissonanceRealityFactorValue(keyword){
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

function provideDissonanceFactorSuggestions(type = 'class') {
  if (type !== 'class' && type !== 'class-reality') return [];
  if(type === 'class'){
    return [
    {
      key: 'x1',
      label: 'X1 (Amplified Beat)',
      aliases: ['x1','amplified', 'beat'],
      defaultValue: 70,
    },
    {
      key: 'x2',
      label: 'X2 (Harmonic Anthem)',
      aliases: ['x2','harmonic', 'anthem'],
      defaultValue: 35,
    },
    {
      key: 'x3',
      label: 'X3 (Rhapsody)',
      aliases: ['x3', 'rhapsody', 'flame'],
      defaultValue: 23.3,
    },
    {
      key: 'x4',
      label: 'X4 (+MATK - Peaceful Tune)',
      aliases: ['x4', 'MATK', 'peaceful', 'tune'],
      defaultValue: 9,
    },
    {
      key: 'x6',
      label: 'X6 (Encore)',
      aliases: ['x6', 'encore'],
      defaultValue: 23.3,
    },
    {
      key: 'x7',
      label: 'X7 (Flame note)',
      aliases: ['x7', 'flame', 'note'],
      defaultValue: 17.5,
    },
    {
      key: 'x8',
      label: 'X8 (All element in Rhapsody)',
      aliases: ['x8', 'all', 'element', 'rhapsody'],
      defaultValue: 4.2,
    },
    {
      key: 'x10',
      label: 'X10 (Int above 80%)',
      aliases: ['x10', 'int', '80%'],
      defaultValue: 370,
      showApplyCheckbox: true,
    }
    ];
  } else if (type === 'class-reality') {
    return [
    ];
  }
}

// Returns simple bonus values for calc.js to consume.
function provideDissonanceFactorBonuses() {
  const isDissonanceClass = document.getElementById('class-select')?.value === 'dissonance';
  if (!isDissonanceClass) return {};

  const classFactorAllElementPct = getDissonanceFactorValue('x8');
  const classFactorMatkPct = getDissonanceFactorValue('x4');
  const classFactorMainStat = getDissonanceFactorValue('x10');

  return {
    classFactorAllElementPct,
    classFactorMatkPct,
    classFactorMainStat,
  };
}

function getAmplifiedBeatEffects(){
  const effects = [
    ["generic","-20"],
    ["generic","50"]
  ];
  const x1Value = getDissonanceFactorValue('x1');
  const s1set = parseFloat(document.getElementById('s1-set-value').value) || 0;
  if (x1Value > 0) {
    effects.push(["dreamDmg", String(x1Value)]);
  }
  if(s1set >= 2){
    effects.push(["generic","12"]);
  }
  return effects;
}

function getHarmonicAnthemEffects(){
  const effects = [
    ["generic","25"]
  ];
  const x2Value = getDissonanceFactorValue('x2');
  const s1set = parseFloat(document.getElementById('s1-set-value').value) || 0;
  if (x2Value > 0) {
    effects.push(["dreamDmg", String(x2Value)]);
  }
  if(s1set >= 2){
    effects.push(["generic","12"]);
  }
  return effects;
}

function getRhapsodyEffects(){
  const effects = [];
  const x3Value = getDissonanceFactorValue('x3');
  if (x3Value > 0) {
    effects.push(["dreamDmg", String(x3Value)]);
  }
  return effects;
}

function getEncoreEffects(){
  const effects = [];
  const x6Value = getDissonanceFactorValue('x6');
  if (x6Value > 0) {
    effects.push(["dreamDmg", String(x6Value)]);
  }
  return effects;
}

function getFlameNoteEffects(){
  const effects = [];
  const x7Value = getDissonanceFactorValue('x7');
  if (x7Value > 0) {
    effects.push(["dreamDmg", String(x7Value)]);
  }
  return effects;
}

function provideDissonanceSkills() {
  return [
    [
      "none",
      350,
      0,
      false,
      "Sound Blaze - Scorching Impact (average of ~41 soundwave energy)",
      [["generic","656"]],
      109,
      0
    ],
    [
      "expertise",
      629.99,
      2700,
      true,
      "Rhapsody of Flame - Shape 3",
      getRhapsodyEffects(),
      159,
      0
    ],
    [
      "none",
      700,
      0,
      false,
      "Flame Note Damage",
      getFlameNoteEffects(),
      171,
      0
    ],
    [
      "expertise",
      210,
      900,
      true,
      "Harmonic Anthem - Stage 4 (Encore persistence roughly implemented (25%))",
      getHarmonicAnthemEffects(),
      152,
      0
    ],
    [
      "none",
      350,
      0,
      true,
      "Rhapsody of Flame - Flame's Rampage",
      [],
      105,
      0
    ],
    [
      "special",
      112,
      480,
      true,
      "Amplified Beat (Concerto talent + Encore Persistence)",
      getAmplifiedBeatEffects(),
      117,
      0
    ],
    [
      "class",
      42,
      180,
      true,
      "Passive Effect Encore Damage",
      getEncoreEffects(),
      729,
      0
    ],
    [
      "class",
      42,
      180,
      true,
      "Encore Damage",
      getEncoreEffects(),
      730,
      0
    ],
    [
      "none",
      420,
      1800,
      true,
      "Fierce Strike (Not 100% sure, i don't have skill upgraded)",
      [],
      21,
      0
    ],
  ];
}


// Returns Strings for formula breakdowns
function provideDissonanceFormulaParts(kind = 'elem') {
  // kind: 'elem' | 'gen' | 'dream' | 'dreamLucky' | 'luckyGen'
  if (kind === 'elem') {
    const parts = [];
    if (getChecked('in-rhapsody')) parts.push(`in-rhapsody ${(0.10*100).toFixed(2)}%`);
    if (getChecked('fire-day') && (document.getElementById('target-type')?.value === 'elite' || document.getElementById('target-type')?.value === 'boss')) parts.push(`Fire Day ${(0.08*100).toFixed(2)}%`);
    if (getChecked('s2-2-set') && getChecked('in-heroic-melody')) parts.push(`S2 2-piece ${(0.05*100).toFixed(2)}%`);
    if (getChecked('tree-x8') && getChecked('in-rhapsody')) {
      const x8Value = parseFloat(document.getElementById('tree-x8-value').value) || 0;
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
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="luck-multiplier" style="width:14px;height:14px;" checked onchange="calc()"><label for="luck-multiplier">Luck Multiplier Talent</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Every 1% luck -> 0.5% Lucky Strike DMG Multiplier.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="fire-day" style="width:14px;height:14px;" checked onchange="calc()"><label for="fire-day">Fire Day Talent</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">8% Elite+ Fire damage.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="center-stage" style="width:14px;height:14px;" onchange="calc()"><label for="center-stage">Center Stage</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">8% MATK + 80 (15s) </span></span></div>
    <div class="cb-row" style="gap:6px;"><label>S1 Set (Void Corruption)</label><input type="number" id="s1-set-value" min="0" max="4" step="1" value="0" style="width:50px;" onInput="updateClassSkills(); clamp(this); calc()"><span class="tip"><span class="tip-icon">i</span><span class="tip-box"> 2 Set: Harmonic Anthem + Amplified Beat +12% dmg<br>4 Set: Trigger speed of fierce strike +30% </span></span></div>
    <div class="cb-row" style="gap:6px;"><label>S2 Set (Phantom)</label><input type="number" id="s2-set-value" min="0" max="4" step="1" value="0" style="width:50px;" onInput="updateClassSkills(); clamp(this); calc()"><span class="tip"><span class="tip-icon orange">i</span><span class="tip-box"> 2 Set: In Heroic Melody, Fire Bonus +5%.<br><span class="hl-orange">4 Set: Amplified Beat +1 hit.<br>(Not implemented, manually update hits per parse).</span></span></span></div>
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
  provideFactorBonuses: provideDissonanceFactorBonuses,
  provideFormulaParts: provideDissonanceFormulaParts,
  provideSkills: provideDissonanceSkills,
  mainStatType: mainStatType,
  elemType: elemType,
  mainStatModifier: mainStatModifier,
  mainStatModifierTalent: mainStatModifierTalent,
};



