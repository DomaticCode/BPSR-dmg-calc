//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct
function provideStormbladeClassBonuses(stats) {
  
  return {
  };
}

// Register provider for other modules to call
window.CLASS_BONUS_PROVIDERS = window.CLASS_BONUS_PROVIDERS || {};


// Returns Strings for formula breakdowns
function provideStormbladeFormulaParts(kind = 'elem') {
  return '';
}


const Stormblade_OPTIONS_HTML = ``;

function renderStormbladeOptions(containerId = 'class-options') {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }
  container.innerHTML = Stormblade_OPTIONS_HTML;
  container.style.display = '';
}

function onStormbladeSelected() {
  renderStormbladeOptions();
  if (typeof setType === 'function') setType('physical');
  const inspEl = document.getElementById('inspiration');
  if (inspEl) inspEl.value = '0';
}

function mainStatType() {
  return 'agi';
}

function elemType() {
  return 'thunder';
}

function mainStatModifier() {
  return 0.6;
}

function mainStatModifierTalent(){
  return 0.125;
}

// Register class module for UI/behavior
window.CLASS_MODULES = window.CLASS_MODULES || {};
window.CLASS_MODULES.stormblade = {
  renderOptions: renderStormbladeOptions,
  onSelected: onStormbladeSelected,
  provideClassBonuses: provideStormbladeClassBonuses,
  provideFormulaParts: provideStormbladeFormulaParts,
  mainStatType: mainStatType,
  elemType: elemType,
  mainStatModifier: mainStatModifier,
  mainStatModifierTalent: mainStatModifierTalent,
};



