//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct
function provideFrostMageClassBonuses(stats) {
  
  return {
  };
}

// Register provider for other modules to call
window.CLASS_BONUS_PROVIDERS = window.CLASS_BONUS_PROVIDERS || {};


// Returns Strings for formula breakdowns
function provideFrostMageFormulaParts(kind = 'elem') {
  return '';
}


const FrostMage_OPTIONS_HTML = ``;

function renderFrostMageOptions(containerId = 'class-options') {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }
  container.innerHTML = FrostMage_OPTIONS_HTML;
  container.style.display = '';
}

function onFrostMageSelected() {
  renderFrostMageOptions();
  if (typeof setType === 'function') setType('magical');
  const inspEl = document.getElementById('inspiration');
  if (inspEl) inspEl.value = '0';
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
window.CLASS_MODULES.frostmage = {
  renderOptions: renderFrostMageOptions,
  onSelected: onFrostMageSelected,
  provideClassBonuses: provideFrostMageClassBonuses,
  provideFormulaParts: provideFrostMageFormulaParts,
  mainStatType: mainStatType,
  mainStatModifier: mainStatModifier,
  mainStatModifierTalent: mainStatModifierTalent,
};



