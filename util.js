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
  const factor1 = getSubstatFactorValues('substat-factor', 'substat-factor-value');
  const factor2 = getSubstatFactorValues('substat-factor-2', 'substat-factor-value-2');
  return {
    crit: factor1.crit * factor2.crit,
    luck: factor1.luck * factor2.luck,
    mastery: factor1.mastery * factor2.mastery,
    haste: factor1.haste * factor2.haste,
    vers: factor1.vers * factor2.vers,
  };
}

function getSubstatFactorValues(selectId, inputId) {
  const option = document.getElementById(selectId);
  const valueInput = document.getElementById(inputId);
  if (!option || option.value === 'none') {
    return { crit: 1, luck: 1, mastery: 1, haste: 1, vers: 1 };
  }
  const rawValue = parseFloat(valueInput?.value);
  const value = Number.isFinite(rawValue) ? Math.max(0, Math.min(10, rawValue)) : 0;
  const plusFactor = 1 + value / 100;
  const minusFactor = 1 - (value * 0.6) / 100;

  switch (option.value) {
    case 'luck':
      return { crit: 1, luck: plusFactor, mastery: 1, haste: minusFactor, vers: 1 };
    case 'crit':
      return { crit: plusFactor, luck: 1, mastery: minusFactor, haste: 1, vers: 1 };
    case 'mastery':
      return { crit: 1, luck: minusFactor, mastery: plusFactor, haste: 1, vers: 1 };
    case 'haste':
      return { crit: minusFactor, luck: 1, mastery: 1, haste: plusFactor, vers: 1 };
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

function getSubstatFactorControlId(index) {
  return index === 1 ? 'substat-factor' : `substat-factor-${index}`;
}
function getSubstatFactorValueId(index) {
  return index === 1 ? 'substat-factor-value' : `substat-factor-value-${index}`;
}
function getSubstatFactorApplyImportedId(index) {
  return index === 1 ? 'substat-factor-apply-imported' : `substat-factor-${index}-apply-imported`;
}
function updateSubstatFactorControls(index) {
  const select = document.getElementById(getSubstatFactorControlId(index));
  const valueField = document.getElementById(getSubstatFactorValueId(index))?.closest('.field');
  const checkboxField = document.getElementById(getSubstatFactorApplyImportedId(index))?.closest('.field');
  if (!select || !valueField || !checkboxField) return;
  const active = select.value !== 'none';
  valueField.style.display = active ? '' : 'none';
  checkboxField.style.display = active ? '' : 'none';
}

function onSubstatFactorTypeChange(index) {
  const select = document.getElementById(getSubstatFactorControlId(index));
  if (select) {
    updateSubstatFactorControls(index);
  }
  updateSubstatFactorOptionStates();
  onOptimizerInputsChange();
}

function updateSubstatFactorOptionStates() {
  const select1 = document.getElementById('substat-factor');
  const select2 = document.getElementById('substat-factor-2');
  if (!select1 || !select2) return;

  const value1 = select1.value;
  const value2 = select2.value;

  Array.from(select1.options).forEach(opt => {
    opt.disabled = opt.value !== 'none' && opt.value === value2;
  });
  Array.from(select2.options).forEach(opt => {
    opt.disabled = opt.value !== 'none' && opt.value === value1;
  });

  if (value1 !== 'none' && value1 === value2) {
    select2.value = 'none';
    updateSubstatFactorControls(2);
  }
}






// Migration of old weapon lines/setup state
function migrateLegacyWeaponLineEffects(oldValues) {
  if (!Array.isArray(oldValues)) return [];
  const legacyIndex = Object.fromEntries(LEGACY_SAVE_FIELD_ORDER.map((id, idx) => [id, idx]));
  const effectKeys = [
    'wl-crit-pct',
    'wl-haste-pct',
    'wl-luck-pct',
    'wl-mastery-pct',
    'wl-vers-pct',
    'luck-effect-bonus',
    'wl-elem-bonus',
    'wl-crit-dmg',
    'wl-atk-dmg',
    'wl-magic-dmg',
    'wl-atk-pct',
    'lucky-strike-dmg-bonus'
  ];
  return effectKeys.reduce((effects, key) => {
    const idx = legacyIndex[key];
    if (idx === undefined) return effects;
    const value = oldValues[idx];
    if (value === '' || value === null || value === undefined) return effects;
    const num = Number(value);
    if (Number.isFinite(num) && num > 0) {
      effects.push([key, num]);
    } else if (String(value).trim() !== '' && Number.isNaN(num)) {
      effects.push([key, value]);
    }
    return effects;
  }, []);
}

function migrateLegacySetupArray(oldValues) {
  const legacyIndex = Object.fromEntries(LEGACY_SAVE_FIELD_ORDER.map((id, idx) => [id, idx]));
  return SAVE_FIELD_ORDER.map(fieldId => {
    if (fieldId === 'PhysResEnabled') return 1;
    const legacyIdx = legacyIndex[fieldId];
    return legacyIdx !== undefined ? oldValues[legacyIdx] : '';
  });
}

function migrateSetupState(state) {
  if (!state || typeof state !== 'object') return state;
  if (state.vers === SAVE_FORMAT_VERSION) return state;

  const migrated = { ...state, vers: SAVE_FORMAT_VERSION };
  if (!Array.isArray(migrated.v) && Array.isArray(state.v)) {
    migrated.v = state.v;
  }

  if (state.vers === undefined) {
    migrated.w = migrateLegacyWeaponLineEffects(state.v);
    migrated.v = migrateLegacySetupArray(state.v || []);
  }

  return migrated;
}
