// TODO copy paste from wind knight
//stats are crit: postWlCritPct, luck: postWlLuckPct, vers: postWlVersPct, mastery: postWlMasteryPct, versDmg: postWlVersDmgPct
function provideTwinAxeClassBonuses(stats) {
  
  return {
  };
}

// Register provider for other modules to call
window.CLASS_BONUS_PROVIDERS = window.CLASS_BONUS_PROVIDERS || {};


// Returns Strings for formula breakdowns
function provideTwinAxeFormulaParts(kind = 'elem') {
  return '';
}


const TwinAxe_OPTIONS_HTML = ``;

function renderTwinAxeOptions(containerId = 'class-options') {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }
  container.innerHTML = TwinAxe_OPTIONS_HTML;
  container.style.display = '';
}

function onTwinAxeSelected() {
  renderTwinAxeOptions();
  if (typeof setType === 'function') setType('physical');
  const inspEl = document.getElementById('inspiration');
  if (inspEl) inspEl.value = '0';
}

function mainStatType() {
  return 'str';
}

function elemType() {
  return 'fire';
}

function mainStatModifier() {
  return 0.6;
}

function mainStatModifierTalent(){
  return 0.125;
}

// Register class module for UI/behavior
window.CLASS_MODULES = window.CLASS_MODULES || {};
window.CLASS_MODULES.twinaxe = {
  renderOptions: renderTwinAxeOptions,
  onSelected: onTwinAxeSelected,
  provideClassBonuses: provideTwinAxeClassBonuses,
  provideFormulaParts: provideTwinAxeFormulaParts,
  mainStatType: mainStatType,
  elemType: elemType,
  mainStatModifier: mainStatModifier,
  mainStatModifierTalent: mainStatModifierTalent,
};



