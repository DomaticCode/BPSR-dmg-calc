//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct
function provideWindKnightClassBonuses(stats) {
  
  return {
  };
}

// Register provider for other modules to call
window.CLASS_BONUS_PROVIDERS = window.CLASS_BONUS_PROVIDERS || {};


// Returns Strings for formula breakdowns
function provideWindKnightFormulaParts(kind = 'elem') {
  return '';
}


const WindKnight_OPTIONS_HTML = ``;

function renderWindKnightOptions(containerId = 'class-options') {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }
  container.innerHTML = WindKnight_OPTIONS_HTML;
  container.style.display = '';
}

function onWindKnightSelected() {
  renderWindKnightOptions();
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
  return 0.125;
}

// Register class module for UI/behavior
window.CLASS_MODULES = window.CLASS_MODULES || {};
window.CLASS_MODULES.windknight = {
  renderOptions: renderWindKnightOptions,
  onSelected: onWindKnightSelected,
  provideClassBonuses: provideWindKnightClassBonuses,
  provideFormulaParts: provideWindKnightFormulaParts,
  mainStatType: mainStatType,
  mainStatModifier: mainStatModifier,
  mainStatModifierTalent: mainStatModifierTalent,
};



