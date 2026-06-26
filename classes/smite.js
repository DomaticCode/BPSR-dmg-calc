//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct
function provideSmiteClassBonuses(stats) {
  const isSmiteClass = document.getElementById('class-select')?.value === 'smite';

  let elemPct = 0;
  let matkPct = 0;
  let magBoostPct = 0;
  let luckyDreamDmgPct = 0;
  let luckyFinalDmgPct = 0;
  let luckMult = 0;

  if (isSmiteClass && getChecked('flowers-ascension')) {
    elemPct += 10;
  }
  if (isSmiteClass && getChecked('thorn')) {
    elemPct += 20;
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

  if (isSmiteClass && getChecked('tree-x4')) {
    const x4Value = parseFloat(document.getElementById('tree-x4-value').value) || 0;
    matkPct += x4Value;
  }


  if (isSmiteClass && getChecked('tree-x11')) {
    const x11Value = parseFloat(document.getElementById('tree-x11-value').value) || 0;
    luckyDreamDmgPct += x11Value;
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

  console.log(`smite class returning: ${elemPct}, ${magBoostPct}, ${luckyDreamDmgPct}, ${luckMult}, ${luckyFinalDmgPct}, ${matkPct}`);

  return {
    classElemPct: elemPct,
    classMagBoostPct: magBoostPct,
    classLuckyDreamDmgPct: luckyDreamDmgPct,
    classLuckMult: luckMult, // NOT A PERCENT SCALER, it's flat
    classLuckyFinalDmgPct: luckyFinalDmgPct,
    classMatkPct: matkPct,
  };
}

// Register provider for other modules to call
window.CLASS_BONUS_PROVIDERS = window.CLASS_BONUS_PROVIDERS || {};


// Returns Strings for formula breakdowns
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
    // Smite provides +variable% dream for lucky strikes when tree-x11 is checked
    if (getChecked('tree-x11')) {
      const x11Value = parseFloat(document.getElementById('tree-x11-value').value) || 0;
      return `x11 factor ${x11Value.toFixed(2)}%`;
    }
    return '';
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
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="luck-dmg-talent" style="width:14px;height:14px;" checked onchange="calc()"><label for="luck-dmg-talent">Luck Damage Talent</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">5% Lucky DMG Multiplier + 1.2% per 1% Luck.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="flowers-ascension" style="width:14px;height:14px;" checked onchange="calc()"><label for="flowers-ascension">Flowers Ascension</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">10% Forest dmg on spending buds. (8 seconds)</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="thorn" style="width:14px;height:14px;" checked onchange="calc()"><label for="thorn">Thorn</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">20% Forest dmg to targets with thorn (Regen Pulse is bugged for this).</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="wide-area-thorns" style="width:14px;height:14px;" checked onchange="calc()"><label for="wide-area-thorns">Wide-area Thorns</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Hidden 4% Elite Forest DMG (always up).</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="tree-x11" style="width:14px;height:14px;" checked onchange="calc()"><label for="tree-x11">X11 Factor</label><input type="number" id="tree-x11-value" min="0" max="50" step="0.1" value="50" style="width:50px;" onInput="clamp(this); calc()"><span class="tip"><span class="tip-icon">i</span><span class="tip-box"><span class="highlight-gold">Input the % in the factor tooltip NOT THE LEVEL.</span> Adds X% Dream DMG to Lucky Strikes. </span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="tree-x4" style="width:14px;height:14px;" onchange="calc()"><label for="tree-x4">X4 Factor</label><input type="number" id="tree-x4-value" min="0" max="7.5" step="0.1" value="7.5" style="width:50px;" onInput="clamp(this); calc()"><span class="tip"><span class="tip-icon">i</span><span class="tip-box"><span class="highlight-gold">Input the % in the factor tooltip NOT THE LEVEL.</span> X% MATK when you have symbiotic mark. <span class="highlight-gold">CHANGED TO MATK IN S3</span></span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="tree-x7" style="width:14px;height:14px;" onchange="calc()"><label for="tree-x7">X7 Factor</label><input type="number" id="tree-x7-value" min="0" max="16.7" step="0.1" value="16.7" style="width:50px;" onInput="clamp(this); calc()"><span class="tip"><span class="tip-icon">i</span><span class="tip-box"><span class="highlight-gold">Input the % in the factor tooltip NOT THE LEVEL.</span> X% MATK after casting Nature Ward (10sec).</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="arcane-of-green" style="width:14px;height:14px;" checked onchange="calc()"><label for="arcane-of-green">Arcane of Green</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Balance Patch (full) only, MATK boost by Mastery % * Luck %.</span></span></div>
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
  provideFormulaParts: provideSmiteFormulaParts,
  mainStatType: mainStatType,
  elemType: elemType,
  mainStatModifier: mainStatModifier,
  mainStatModifierTalent: mainStatModifierTalent,
};



