//generic utility
function getVal(id, fallback = 0) {
  const el = document.getElementById(id);
  if (!el) return fallback;
  const v = parseFloat(el.value);
  return isNaN(v) ? fallback : v;
}

function getChecked(id) {
  const el = document.getElementById(id);
  return el ? el.checked : false;
}

function clamp(el) {
  const min = parseFloat(el.min);
  const max = parseFloat(el.max);
  let val = parseFloat(el.value);

  if (isNaN(val)) return;

  if (val > max) el.value = max;
  if (val < min) el.value = min;
}

function setStatus(message, isError = false) {
  const el = document.getElementById('setup-status');
  if (!el) return;
  el.style.display = 'block';
  el.style.color = isError ? 'var(--accent-red)' : 'var(--accent-green)';
  el.textContent = message;
  window.clearTimeout(setStatus._timeout);
  setStatus._timeout = window.setTimeout(() => { el.style.display = 'none'; }, 4800);
}

function compareVersion(a, b) {
  const aParts = String(a).replace(/^v/, '').split('.').map(Number);
  const bParts = String(b).replace(/^v/, '').split('.').map(Number);
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aNum = aParts[i] || 0;
    const bNum = bParts[i] || 0;
    if (aNum < bNum) return -1;
    if (aNum > bNum) return 1;
  }
  return 0;
}

function getModuleLevelFromPoints(points) {
  let moduleLevel = 0;
  switch (true) {
    case (points >= 1 && points <= 3):
        moduleLevel = 1;
        break;
    case (points >= 4 && points <= 7):
        moduleLevel = 2;
        break;
    case (points >= 8 && points <= 11):
        moduleLevel = 3;
        break;
    case (points >= 12 && points <= 15):
        moduleLevel = 4;
        break;
    case (points >= 16 && points <= 19):
        moduleLevel = 5;
        break;
    case (points >= 20):
        moduleLevel = 6;
        break;
    default:
        moduleLevel = 0; // For inputs <= 0 or NaN
  }
  return moduleLevel;
}






// Class Module Utilities
function getSelectedClassKey() {
  return document.getElementById('class-select')?.value || 'none';
}

function getSelectedClassModule() {
  return window.CLASS_MODULES?.[getSelectedClassKey()] || null;
}

function getClassModule(classKey) {
  if (classKey) {
    return window.CLASS_MODULES?.[classKey] || null;
  }
  return getSelectedClassModule();
}

function getClassMainStatType() {
  return getSelectedClassModule()?.mainStatType?.();
}

function getClassElemType() {
  return getSelectedClassModule()?.elemType?.();
}





// Substat Factors and Optimizer

function getOptimizerFactor() {
  const factors = { crit: 1, luck: 1, mastery: 1, haste: 1, vers: 1 };
  const effectTypes = {
    'generic:crit-gained-in-any-way': 'crit',
    'generic:luck-gained-in-any-way': 'luck',
    'generic:mastery-gained-in-any-way': 'mastery',
    'generic:haste-gained-in-any-way': 'haste',
  };
  document.querySelectorAll('#psychoscope-factors .psychoscope-factor-socket-row').forEach(row => {
    const effectId = row.dataset.selectedEffect || '';
    const type = effectTypes[effectId];
    if (!type) return;
    const valueText = String(row.querySelector('.psychoscope-factor-socket-value')?.value || '').trim();
    const value = valueText === '' ? 0 : Number.parseFloat(valueText);
    if (!Number.isFinite(value) || value <= 0) return;

    const effectFactors = buildSubstatFactorValueMap(type, value);
    Object.keys(factors).forEach(stat => { factors[stat] *= effectFactors[stat] || 1; });
  });

  console.log('Optimizer factors:', factors);
  return factors;
}

function buildSubstatFactorValueMap(type, rawValue) {
  const value = Number.isFinite(rawValue) ? Math.max(0, Math.min(10, rawValue)) : 0;
  const plusFactor = 1 + value / 100;
  const minusFactor = 0.94;

  switch (type) {
    case 'luck':
      return { crit: 1, luck: plusFactor, mastery: 1, haste: minusFactor, vers: 1 };
    case 'crit':
      return { crit: plusFactor, luck: 1, mastery: minusFactor, haste: 1, vers: 1 };
    case 'mastery':
      return { crit: 1, luck: minusFactor, mastery: plusFactor, haste: 1, vers: 1 };
    case 'haste':
      return { crit: minusFactor, luck: 1, mastery: 1, haste: plusFactor, vers: 1 };
    case 'mainstat':
      return { crit: 1, luck: 1, mastery: 1, haste: 1, vers: 1 };
    default:
      return { crit: 1, luck: 1, mastery: 1, haste: 1, vers: 1 };
  }
}

function onOptimizerInputsChange() {
  optimizerDone = false;
  const output = document.getElementById('optimize-substats-output');
  if (output) {
    output.textContent = 'Optimizer is no longer current due to input changes. Click Optimize again.';
  }
  calc();
}
