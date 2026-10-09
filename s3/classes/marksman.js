//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct
function provideMarksmanClassBonuses(stats) {
  
  return {
  };
}

// Register provider for other modules to call
window.CLASS_BONUS_PROVIDERS = window.CLASS_BONUS_PROVIDERS || {};


// Returns Strings for formula breakdowns
function provideMarksmanFormulaParts(kind = 'elem') {
  return '';
}


const Marksman_OPTIONS_HTML = ``;

function renderMarksmanOptions(containerId = 'class-options') {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }
  container.innerHTML = Marksman_OPTIONS_HTML;
  container.style.display = '';
}

function onMarksmanSelected() {
  renderMarksmanOptions();
  if (typeof setType === 'function') setType('physical');
  const inspEl = document.getElementById('inspiration');
  if (inspEl) inspEl.value = '0';
}

function mainStatType() {
  return 'agi';
}

function elemType() {
  return 'light';
}

function mainStatModifier() {
  return 0.58;
}

function mainStatModifierTalent(){
  return 0;
}

// Register class module for UI/behavior
window.CLASS_MODULES = window.CLASS_MODULES || {};
window.CLASS_MODULES.marksman = {
  renderOptions: renderMarksmanOptions,
  onSelected: onMarksmanSelected,
  provideClassBonuses: provideMarksmanClassBonuses,
  provideFormulaParts: provideMarksmanFormulaParts,
  mainStatType: mainStatType,
  elemType: elemType,
  mainStatModifier: mainStatModifier,
  mainStatModifierTalent: mainStatModifierTalent,
};



