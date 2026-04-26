//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct
function provideSmiteClassBonuses(stats) {
  const isSmiteClass = document.getElementById('class-select')?.value === 'smite';

  let elemBonus = 0;

  if (isSmiteClass && getChecked('flowers-ascension')) {
    elemBonus += 0.10;
  }
  if (isSmiteClass && getChecked('thorn')) {
    elemBonus += 0.20;
  }

  const targetType = document.getElementById('target-type').value;
  const isEliteOrBoss = targetType === 'elite' || targetType === 'boss';

  if (isSmiteClass && getChecked('wide-area-thorns') && isEliteOrBoss) {
    elemBonus += 0.04;
  }

  if (isSmiteClass) {
    const masteryElemBonus = stats.mastery * 0.7;
    const masteryElemPct = masteryElemBonus * 100;

    const masteryElemEl = document.getElementById('mastery-elem-dmg-pct');
    if (masteryElemEl) masteryElemEl.value = masteryElemPct.toFixed(3);

    elemBonus += masteryElemBonus;
  }

  let magBoost = 0;
  if (isSmiteClass && getChecked('tree-x4')) {
    magBoost += 0.05;
  }

  let luckyDreamDamage = 0;
  if (isSmiteClass && getChecked('tree-x11')) {
    luckyDreamDamage += 0.50;
  }

  let luckyFinalDmg = 1;
  if (isSmiteClass && getChecked('smite-spec')) {
    luckyFinalDmg += 0.5;
  }

  let luckMult = 0;
  if (isSmiteClass && getChecked('luck-dmg-talent')) {
    luckMult += 5 + (stats.luck * 100 * 1.2);
  }

  console.log(`returning: ${elemBonus}, ${magBoost}, ${luckyDreamDamage}, ${luckMult}, ${luckyFinalDmg}`);

  return {
    classElemBonus: elemBonus,
    classMagBoost: magBoost,
    classLuckyDreamDamage: luckyDreamDamage,
    classLuckMult: luckMult,
    classLuckyFinalDmg: luckyFinalDmg,
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
    if (getChecked('wide-area-thorns') && (document.getElementById('target-type')?.value === 'elite' || document.getElementById('target-type')?.value === 'boss')) parts.push(`W.Thorns ${(0.04*100).toFixed(2)}%`);
    // Mastery element bonus: prefer the input element if present, else leave out
    const masteryEl = document.getElementById('mastery-elem-dmg-pct');
    const masteryVal = masteryEl ? parseFloat(masteryEl.value) : NaN;
    if (!Number.isNaN(masteryVal) && masteryVal !== 0) parts.push(`Mastery ${(masteryVal).toFixed(3)}%`);
    return parts.length ? parts.join(' + ') : '';
  }
  if (kind === 'dreamLucky') {
    // Smite provides +50% dream for lucky strikes when tree-x11 is checked
    if (getChecked('tree-x11')) return `x11 factor ${(0.50*100).toFixed(2)}%`;
    return '';
  }
  // other kinds: no class-specific parts
  return '';
}

provideSmiteClassBonuses.provideFormulaParts = provideSmiteFormulaParts;
window.CLASS_BONUS_PROVIDERS.smite = provideSmiteClassBonuses;

// HTML for Smite options (moved out of main file so class module can render it)
const SMITE_OPTIONS_HTML = `
  <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.6px; color:var(--text-muted); margin-bottom:8px;">Smite/Class Options</div>
  <div class="checkbox-group" style="margin:0; gap:6px;">
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="smite-spec" style="width:14px;height:14px;" checked onchange="calc()"><label for="smite-spec">Smite Spec</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">1.5x Lucky DMG Multiplier.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="luck-dmg-talent" style="width:14px;height:14px;" checked onchange="calc()"><label for="luck-dmg-talent">Luck Damage Talent</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">5% Lucky DMG Multiplier + 1.2% per 1% Luck.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="flowers-ascension" style="width:14px;height:14px;" checked onchange="calc()"><label for="flowers-ascension">Flowers Ascension</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">10% Forest dmg on spending buds. (8 seconds)</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="thorn" style="width:14px;height:14px;" checked onchange="calc()"><label for="thorn">Thorn</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">20% Forest dmg to targets with thorn (Regen Pulse is bugged for this).</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="wide-area-thorns" style="width:14px;height:14px;" checked onchange="calc()"><label for="wide-area-thorns">Wide-area Thorns</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Hidden 4% Elite Forest DMG (always up).</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="tree-x11" style="width:14px;height:14px;" checked onchange="calc()"><label for="tree-x11">X11 Factor</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">Adds 50% Dream DMG to Lucky Strikes.</span></span></div>
    <div class="cb-row" style="gap:6px;"><input type="checkbox" id="tree-x4" style="width:14px;height:14px;" onchange="calc()"><label for="tree-x4">X4 Factor</label><span class="tip"><span class="tip-icon">i</span><span class="tip-box">5% MAG Boost when you have symbiotic mark.</span></span></div>
  </div>
`;

function renderSmiteOptions(containerId = 'class-options') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = SMITE_OPTIONS_HTML;
  container.style.display = '';
}

function onSmiteSelected() {
  // Render options and apply Smite-specific defaults
  renderSmiteOptions();
  // set damage type and inspiration default (does not call calc())
  if (typeof setType === 'function') setType('magical');
  const inspEl = document.getElementById('inspiration');
  if (inspEl) inspEl.value = '1.5';
}

// Register class module for UI/behavior
window.CLASS_MODULES = window.CLASS_MODULES || {};
window.CLASS_MODULES.smite = {
  renderOptions: renderSmiteOptions,
  onSelected: onSmiteSelected,
  provideClassBonuses: provideSmiteClassBonuses,
};



