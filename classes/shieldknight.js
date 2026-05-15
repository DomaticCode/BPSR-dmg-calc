//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct
function provideShieldKnightClassBonuses(stats) {
  
  return {
  };
}

// Register provider for other modules to call
window.CLASS_BONUS_PROVIDERS = window.CLASS_BONUS_PROVIDERS || {};


// Returns Strings for formula breakdowns
function provideShieldKnightFormulaParts(kind = 'elem') {
  return '';
}


const ShieldKnight_OPTIONS_HTML = ``;

function renderShieldKnightOptions(containerId = 'class-options') {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }
  container.innerHTML = ShieldKnight_OPTIONS_HTML;
  container.style.display = '';
}

function onShieldKnightSelected() {
  renderShieldKnightOptions();
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
window.CLASS_MODULES.shieldknight = {
  renderOptions: renderShieldKnightOptions,
  onSelected: onShieldKnightSelected,
  provideClassBonuses: provideShieldKnightClassBonuses,
  provideFormulaParts: provideShieldKnightFormulaParts,
  mainStatType: mainStatType,
  mainStatModifier: mainStatModifier,
  mainStatModifierTalent: mainStatModifierTalent,
};



