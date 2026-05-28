//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct, haste: postWlHastePct,
function provideDissonanceClassBonuses(stats) {
  const isDissonanceClass = document.getElementById('class-select')?.value === 'dissonance';

  const masteryElemEl = document.getElementById('mastery-elem-dmg-pct');
  if (masteryElemEl) masteryElemEl.value = 0.00; // reset mastery element bonus (non mastery -> element class)

  let elemPct = 0;
  let finalLuckPct = 0;

  if (isDissonanceClass && getChecked('in-rhapsody')) {
    elemPct += 10;
    finalLuckPct += 50;
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

  let matkPct = 0;
  let matk = 0;
  if(isDissonanceClass && getChecked('center-stage')) {
    matkPct += 8;
    matk += 80;
  }

  if(isDissonanceClass && getChecked('s2-2-set') && getChecked('in-heroic-melody')){
    elemPct += 5;
  }

  let magBoostPct = 0;
  if (isDissonanceClass && getChecked('tree-x4')) {
    const x4Value = parseFloat(document.getElementById('tree-x4-value').value) || 0;
    magBoostPct += x4Value;
  }

  if (isDissonanceClass && getChecked('tree-x8') && getChecked('in-rhapsody')) {
    const x8Value = parseFloat(document.getElementById('tree-x8-value').value) || 0;
    elemPct += x8Value;
  }

  let MainStat = 0;
  if(isDissonanceClass && getChecked('tree-x10')){
    const x10Value = parseFloat(document.getElementById('tree-x10-value').value) || 0;
    MainStat += x10Value;
  }

  if(isDissonanceClass && getChecked('trio-rhapsody') && getChecked('in-rhapsody')){
    const trioRhapsodyPct = stats.haste * 0.6 * 100;
    console.log(`Trio Rhapsody: ${trioRhapsodyPct.toFixed(2)}%`);
    matkPct += trioRhapsodyPct;
  }

  console.log(`disso returning: ${elemPct}, ${finalLuckPct}, ${luckMult}, ${magBoostPct}, ${MainStat}, ${matkPct}, ${matk}`);

  return {
    classElemPct: elemPct,
    classFinalLuckPct: finalLuckPct,
    classLuckMult: luckMult,
    classMagBoostPct: magBoostPct,
    classMainStat: MainStat,
    classMatkPct: matkPct,
    classMatk: matk,
  };
}

// Register provider for other modules to call
window.CLASS_BONUS_PROVIDERS = window.CLASS_BONUS_PROVIDERS || {};


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
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="center-stage" style="width:14px;height:14px;" checked onchange="calc()"><label for="center-stage">Center Stage</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">8% MATK + 80 (15s) </span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="luck-multiplier" style="width:14px;height:14px;" checked onchange="calc()"><label for="luck-multiplier">Luck Multiplier Talent</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Every 1% luck -> 0.5% Lucky Strike DMG Multiplier.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="fire-day" style="width:14px;height:14px;" checked onchange="calc()"><label for="fire-day">Fire Day Talent</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">8% Elite+ Fire damage.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="s2-2-set" style="width:14px;height:14px;" checked onchange="calc()"><label for="s2-2-set">Season2 2-piece set</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">+5% fire damage in Heroic Melody</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="tree-x4" style="width:14px;height:14px;"  onchange="calc()"><label for="tree-x4">X4 Factor</label><input type="number" id="tree-x4-value" min="0" max="6" step="0.1" value="6" style="width:50px;" onInput="clamp(this); calc()"><span class="tip"><span class="tip-icon">i</span><span class="tip-box"><span class="highlight-gold">Input the % in the factor tooltip NOT THE LEVEL.</span> X% MAG boost</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="tree-x8" style="width:14px;height:14px;"  onchange="calc()"><label for="tree-x8">X8 Factor</label><input type="number" id="tree-x8-value" min="0" max="4.2" step="0.1" value="4.2" style="width:50px;" onInput="clamp(this); calc()"><span class="tip"><span class="tip-icon">i</span><span class="tip-box"><span class="highlight-gold">Input the % in the factor tooltip NOT THE LEVEL.</span> X% all element in Healing Melody or Rhapsody of flame.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="tree-x10" style="width:14px;height:14px;"  onchange="calc()"><label for="tree-x10">X10 Factor</label><input type="number" id="tree-x10-value" min="0" max="265" step="0.1" value="265" style="width:50px;" onInput="clamp(this); calc()"><span class="tip"><span class="tip-icon">i</span><span class="tip-box"><span class="highlight-gold">Input the % in the factor tooltip NOT THE LEVEL.</span> X INT when above 80% hp.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="trio-rhapsody" style="width:14px;height:14px;"  onchange="calc()"><label for="trio-rhapsody">Trio Rhapsody</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">MATK increases by Haste % * 0.6.</span></span></div>
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
  provideFormulaParts: provideDissonanceFormulaParts,
  mainStatType: mainStatType,
  mainStatModifier: mainStatModifier,
  mainStatModifierTalent: mainStatModifierTalent,
};



