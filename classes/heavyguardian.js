//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct
function provideHeavyGuardianClassBonuses(stats) {
  
  return {
  };
}

// Register provider for other modules to call
window.CLASS_BONUS_PROVIDERS = window.CLASS_BONUS_PROVIDERS || {};


// Returns Strings for formula breakdowns
function provideHeavyGuardianFormulaParts(kind = 'elem') {
  return '';
}


const HeavyGuardian_OPTIONS_HTML = ``;

function renderHeavyGuardianOptions(containerId = 'class-options') {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }
  container.innerHTML = HeavyGuardian_OPTIONS_HTML;
  container.style.display = '';
}

function onHeavyGuardianSelected() {
  renderHeavyGuardianOptions();
  if (typeof setType === 'function') setType('physical');
  const inspEl = document.getElementById('inspiration');
  if (inspEl) inspEl.value = '0';
}

function mainStatType() {
  return 'str';
}

function mainStatModifier() {
  return 0.6;
}

function mainStatModifierTalent(){
  return 0;
}

// Register class module for UI/behavior
window.CLASS_MODULES = window.CLASS_MODULES || {};
window.CLASS_MODULES.heavyguardian = {
  renderOptions: renderHeavyGuardianOptions,
  onSelected: onHeavyGuardianSelected,
  provideClassBonuses: provideHeavyGuardianClassBonuses,
  provideFormulaParts: provideHeavyGuardianFormulaParts,
  mainStatType: mainStatType,
  mainStatModifier: mainStatModifier,
  mainStatModifierTalent: mainStatModifierTalent,
};



