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
  const factor1 = getSubstatFactorValues('substat-factor', 'substat-factor-value');
  const factor2 = getSubstatFactorValues('substat-factor-2', 'substat-factor-value-2');
  const factor3 = getSubstatFactorValues('substat-factor-3', 'substat-factor-value-3');
  return {
    crit: factor1.crit * factor2.crit * factor3.crit,
    luck: factor1.luck * factor2.luck * factor3.luck,
    mastery: factor1.mastery * factor2.mastery * factor3.mastery,
    haste: factor1.haste * factor2.haste * factor3.haste,
    vers: factor1.vers * factor2.vers * factor3.vers,
  };
}

function buildSubstatFactorValueMap(type, rawValue) {
  const value = Number.isFinite(rawValue) ? Math.max(0, Math.min(10, rawValue)) : 0;
  const plusFactor = 1 + value / 100;
  const minusFactor = 1 - (value * 0.6) / 100;

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

function normalizeSubstatFactorType(value) {
  const normalized = String(value || 'none').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
  if (['luck', 'lucky', 'x6'].some(term => normalized.includes(term))) return 'luck';
  if (['crit', 'critical', 'x5'].some(term => normalized.includes(term))) return 'crit';
  if (['mastery', 'masteries', 'x7'].some(term => normalized.includes(term))) return 'mastery';
  if (['haste', 'x8'].some(term => normalized.includes(term))) return 'haste';
  if (['mainstat', 'x234', 'x2', 'x3', 'x4', 'main', 'mainstatbonus'].some(term => normalized.includes(term))) return 'mainstat';
  return 'none';
}

function getSubstatFactorValues(selectId, inputId) {
  const option = document.getElementById(selectId);
  const valueInput = document.getElementById(inputId);
  const type = normalizeSubstatFactorType(option?.value || 'none');
  const rawValue = parseFloat(valueInput?.value);
  return buildSubstatFactorValueMap(type, rawValue);
}

function getPsychoscopeFactorEntries() {
  const entries = [];
  ['generic'].forEach(type => {
    for (let index = 1; index <= 3; index += 1) {
      const nameId = `psychoscope-factor-${type}-${index}-name`;
      const valueId = `psychoscope-factor-${type}-${index}-value`;
      const applyId = `psychoscope-factor-${type}-${index}-apply-imported`;
      const nameInput = document.getElementById(nameId);
      const valueInput = document.getElementById(valueId);
      const applyInput = document.getElementById(applyId);
      if (!nameInput && !valueInput && !applyInput) continue;

      const rawKey = String(nameInput?.value || '').trim();
      const suggestions = typeof getFactorSuggestionsForType === 'function' ? getFactorSuggestionsForType(type) : [];
      const key = typeof getFactorSelectionKey === 'function' ? getFactorSelectionKey(rawKey, suggestions) : null;
      const rawValueText = String(valueInput?.value ?? '').trim();
      const rawValue = rawValueText === '' ? NaN : parseFloat(rawValueText);
      const hasValue = rawValueText !== '';
      const value = hasValue && Number.isFinite(rawValue)
        ? rawValue
        : (key ? (typeof getFactorSuggestionDefaultValue === 'function' ? getFactorSuggestionDefaultValue(key, suggestions) : 0) : 0);
      const typeKey = key ? normalizeSubstatFactorType(key) : normalizeSubstatFactorType(rawKey);
      if (!key && !rawKey) continue;
      if (!key && !hasValue) continue;

      entries.push({
        key,
        type,
        value,
        apply: !!applyInput?.checked,
        factor: buildSubstatFactorValueMap(typeKey, value),
        bonus: type === 'class' && key === 'x11' ? { luckyDreamDmgPct: (value / 100) } : undefined,
      });
    }
  });
  return entries;
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
  switch (index) {
    case 1: return 'substat-factor';
    case 2: return 'substat-factor-2';
    case 3: return 'substat-factor-3';
    default: return null;
  }
}
function getSubstatFactorValueId(index) {
  switch (index) {
    case 1: return 'substat-factor-value';
    case 2: return 'substat-factor-value-2';
    case 3: return 'substat-factor-value-3';
    default: return null;
  }
}
function getSubstatFactorApplyImportedId(index) {
  switch (index) {
    case 1: return 'substat-factor-apply-imported';
    case 2: return 'substat-factor-2-apply-imported';
    case 3: return 'substat-factor-3-apply-imported';
    default: return null;
  }
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
  const selects = [1, 2, 3].map(index => document.getElementById(getSubstatFactorControlId(index))).filter(Boolean);
  if (selects.length < 2) return;

  const values = selects.map(select => select.value);

  selects.forEach((select, idx) => {
    Array.from(select.options).forEach(opt => {
      const duplicate = values.some((value, otherIdx) => otherIdx !== idx && value === opt.value);
      opt.disabled = opt.value !== 'none' && duplicate;
    });
  });

  selects.forEach((select, idx) => {
    const currentValue = select.value;
    const duplicate = values.some((value, otherIdx) => otherIdx !== idx && value === currentValue);
    if (currentValue !== 'none' && duplicate) {
      select.value = 'none';
    }
  });

  [1, 2, 3].forEach(index => updateSubstatFactorControls(index));

  console.group("Substat Factor Option States");
  [1, 2, 3].forEach(index => {
    const select = document.getElementById(getSubstatFactorControlId(index));
    const value = select ? select.value : 'not found';
    console.log(`Factor ${index}: ${value}`);
  });
  console.groupEnd();
}

// Migration of old weapon lines/setup state
const REMOVED_SAVE_FIELDS = [
  'substat-factor',
  'substat-factor-value',
  'substat-factor-2',
  'substat-factor-value-2',
  'substat-factor-apply-imported',
  'substat-factor-2-apply-imported',
  'substat-factor-3',
  'substat-factor-value-3',
  'substat-factor-3-apply-imported',
];

const REMOVED_CLASS_FIELDS = {
  smite: [
    'tree-x11',
    'tree-x4',
    'tree-x11-value',
    'tree-x4-value',
    'tree-x7',
    'tree-x7-value',
  ],
  dissonance: [
    'tree-x4',
    'tree-x4-value',
    'tree-x8',
    'tree-x8-value',
    'tree-x10',
    'tree-x10-value',
  ],
};

function removeFieldsByIndex(oldValues, order, removedFields) {
  if (!Array.isArray(oldValues)) return [];
  if (!Array.isArray(order) || !removedFields || removedFields.length === 0) {
    return oldValues.slice();
  }
  const removedIndices = new Set(
    removedFields
      .map(field => order.indexOf(field))
      .filter(idx => idx !== -1)
  );
  return oldValues.filter((_, idx) => !removedIndices.has(idx));
}

function migrateLegacySetupArray(oldValues) {
  return removeFieldsByIndex(oldValues, LEGACY_SAVE_FIELD_ORDER, REMOVED_SAVE_FIELDS);
}

function migrateLegacyClassFieldsArray(oldValues, classKey) {
  const legacyOrder = LEGACY_CLASS_FIELDS_ORDER[classKey] || [];
  const removedFields = REMOVED_CLASS_FIELDS[classKey] || [];
  return removeFieldsByIndex(oldValues, legacyOrder, removedFields);
}

function migrateSetupState(state) {
  console.log("Migrating setup state from version", state.vers, "to", SAVE_FORMAT_VERSION);
  if (!state || typeof state !== 'object') return state;
  if (state.vers === SAVE_FORMAT_VERSION) return state;

  const migrated = { ...state, vers: SAVE_FORMAT_VERSION };

  if (Array.isArray(state.v)) {
    migrated.v = migrateLegacySetupArray(state.v);
  }

  if (Array.isArray(state.cf)) {
    const classKey = state.c || 'none';
    migrated.cf = migrateLegacyClassFieldsArray(state.cf, classKey);
  }

  return migrated;
}
