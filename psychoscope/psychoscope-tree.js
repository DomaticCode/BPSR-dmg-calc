const PSYCHOSCOPE_TREES = {

  dreamforce: {
    title: 'Dreamforce',
    containerId: 'psychoscope-dreamforce-options',
    modalId: 'psychoscope-dreamforce-modal',
    standalone: [
      { kind: 'checkbox', id: 'psychoscope-bond-lvl35', label: 'Bond lvl 35 (Dreamforce)',
        tip: 'Adds 2% Seasonal DMG.' },
      { kind: 'checkbox-number', id: 'psychoscope-main-stats', numberId: 'psychoscope-main-stats-bonus',
        numberDefault: 1470, label: 'Main Stats Active',
        tip: 'lvl 100 = 1470, (Displayed as 100% uptime, but impossible in game).' },
    ],
    rows: [
      { left:  { id: 'psychoscope-dreamforce-dream-massacre', label: 'Dream Massacre', placeholder: false, warn: true, warnColor: 'red',
        tip: '<span class="hl-red">Not Directly implemented in this calculator.</span> Defeating an enemy grants 2 vestige.'
        },
        right: { id: 'psychoscope-dreamforce-boundary', label: 'Boundary', warn: true, warnColor: 'red', 
          tip: '<span class="hl-red">Not Directly implemented in this calculator.</span> Standing still reduces vestige interval by 1 second.' 
        } 
      },
      { left:  { id: 'psychoscope-dreamforce-unbreaking-might', label: 'Unbreaking Might', warn: true,
          tip: '<span class="hl-gold">Non damaging effect</span> Dreamforce grants super armor'
       },
        right: { id: 'psychoscope-dreamforce-godspeed', label: 'GodSpeed', warn: true,
          tip: '<span class="hl-gold">Non damaging effect</span> Dreamforce increases max HP by 15%' } },
      { left:  { id: 'psychoscope-dreamforce-conserve', label: 'Conserve', grantsFactor: 'generic', warn: true, warnColor: 'red',
          tip: '<span class="hl-red">Dreamforce in this calculator assumes 100% uptime (impossible in game).</span> Dreamforce duration +5 seconds. +1 generic factor.'
        },
        right: { id: 'psychoscope-dreamforce-beauty-of-refinement', label: 'Beauty of Refinement', grantsFactor: 'class', warn: true, warnColor: 'orange',
          tip: '<span class="hl-orange">Make sure your refined ATK is unbuffed from this node when you input it. Otherwise you will double dip.</span> Refined ATK/Armor + 10%. +1 class factor.' 
        }
      },
    ],
    final: { id: 'psychoscope-amplify-rare', label: 'Amplify Rare', placeholder: false,
      tip: 'For damage calculation assumes 100% uptime.' },
  },

  fantasia: {
    title: 'Fantasia Impact',
    containerId: 'psychoscope-fantasia-options',
    modalId: 'psychoscope-fantasia-modal',
    standalone: [
      { kind: 'checkbox', id: 'psychoscope-fantasia-bond-35', label: 'Bond lvl 35 (Fantasia Impact)',
        tip: 'Adds +1% flat Luck %.' },
    ],
    rows: [
      { left:  { id: 'psychoscope-fantasia-linkage', label: 'Linkage',
                  percent: { id: 'psychoscope-fantasia-linkage-pct', options: [1, 2, 3], defaultValue: 3 }, tip: 'Adds +1%/2%/3% flat Luck %.' },
        right: { id: 'psychoscope-fantasia-reconstruct', label: 'Reconstruct',
                  tip: 'Adds +10% Lucky Strike DMG Mult.' } },
      { left:  { id: 'psychoscope-fantasia-time-step', label: 'Time-Step', tip: 'Internal CD + 5 seconds, +100% Seasonal Dmg to Fantasia Impact' },
        right: { id: 'psychoscope-fantasia-multi-phasic-strike', label: 'Multi-Phasic Strike', tip: 'Hits to trigger +10, +100% Seasonal Dmg to Fantasia Impact' } },
      { left:  { id: 'psychoscope-fantasia-ripple-of-fate', label: 'Ripple of Fate', grantsFactor: 'class', tip: 'Adds +15% Dream DMG to Fantasia Impact (per enemy hit). +1 class factor' },
        right: { id: 'psychoscope-fantasia-dual', label: 'Dual', grantsFactor: 'generic', warn: true, warnColor: 'orange', tip: '<span class="hl-orange">Update your hits per parse manually when enabling/disabling.</span> 50% chance to trigger Fantasia an extra time. +1 generic factor' } },
    ],
    final: { id: 'psychoscope-fantasia-ultimate-fortune', label: 'Ultimate Fortune',
      tip: 'Adds +10% main stat % bonus every 10 lucky hits for 5 seconds (assumes 100% uptime).' },
  },

  endlessMind: {
    title: 'Endless Mind',
    containerId: 'psychoscope-endless-mind-options',
    modalId: 'psychoscope-endless-mind-modal',
    standalone: [
      { kind: 'checkbox', id: 'psychoscope-endless-bond-35', label: 'Bond lvl 35', warn: true,
        tip: 'Adds 150 to main stats. <span class="highlight-purple">Only check if Endless Mind was not selected when you imported your stats.</span>' },
    ],
    rows: [
      { left:  { id: 'psychoscope-endless-aegis', label: 'Aegis of the Soul', defaultChecked: true,
        tip: 'Each stack of Endless Mind provides a 1% bonus to main stats.' },
        right: { id: 'psychoscope-endless-safeguard', label: 'Safeguard', warn:true, warnColor: 'red', disabled: true,
          tip: '<span class="hl-red">Just use the other node</span> 10% max hp shield to allies when hit (30 sec cd).'
        } 
      },
      { left:  { id: 'psychoscope-endless-swiftflow', label: 'Swiftflow', warn: true, warnColor: 'red',
          tip: '<span class="hl-red">Not directly implemented</span> Each stack grants 2.5% expertise CDR'
        },
        right: { id: 'psychoscope-endless-resurge', label: 'Resurge', warn:true, warnColor: 'red',
          tip: '<span class="hl-red">Not directly implemented</span> 15% Ultimate CDR'
         }
        },
      { left:  { id: 'psychoscope-endless-still-continuum', label: 'Still-Continuum', grantsFactor: 'class', placeholder: false,
          tip: 'Max stacks +1. (selfish) +1 class factor.' },
        right: { id: 'psychoscope-endless-split-brilliance', label: 'Split-Brilliance', grantsFactor: 'generic', placeholder: false,
          tip: 'Max stacks -1, applies to teammates. +1 generic factor.' } },
    ],
    final: { id: 'psychoscope-endless-finale-chant', label: 'Finale Chant', placeholder: false, warn: true, warnColor: 'orange',
      tip: '<span class="hl-orange">Assumes 100% uptime (not possible in game)</span> Doubles all stack effects, (after casting ult).' },
  },

  oblivion: {
    title: 'Oblivion',
    containerId: 'psychoscope-oblivion-options',
    modalId: 'psychoscope-oblivion-modal',
    standalone: [
      { kind: 'checkbox', id: 'psychoscope-oblivion-bond-35', label: 'Bond lvl 35',
        tip: 'Adds 2% crit, 2% luck against enemies with oblivion.' },
    ],
    rows: [
      { left:  { id: 'psychoscope-oblivion-bloodbound-surge', label: 'Bloodbound Surge', warn: true, warnColor: 'red',
          tip: '<span class="hl-red">Damage not implemented</span> 200% ATK damage to enemies when below 50% hp (15 sec cd).'
        },
        right: { id: 'psychoscope-oblivion-dream-obsession', label: 'Dream Obsession', warn: true,
          tip: '<span class="hl-gold">Non damaging effect</span> Grants allies Seasonal DMG reduction'
        }
      },
      { left:  { id: 'psychoscope-oblivion-chrono-elixir', label: 'Chrono Elixir', warn: true,
          tip: '<span class="hl-gold">Non damaging effect</span> Potions and food + 30% duration.'
        },
        right: { id: 'psychoscope-oblivion-limit-extension', label: 'Limit Extension', warn: true,
          tip: '<span class="hl-gold">Non damaging effect</span> Increases range of oblivion to 10m.'
         } 
      },
      { left:  { id: 'psychoscope-oblivion-harmony-grace', label: 'Harmony of Grace', grantsFactor: 'class',
          tip: 'Grants 2% main stat to self and allies for 8 seconds every 15 seconds. +1 class factor.' 
        },
        right: { id: 'psychoscope-oblivion-tuning', label: 'Tuning', grantsFactor: 'generic',
          tip: 'Grants (self) 3% all element bonus. +1 generic factor.' 
        }
      },
      { left:  { id: 'psychoscope-oblivion-illusion-obsession', label: 'Illusion Obsession', warn:true,
          tip: '<span class="hl-gold">Non damaging effect</span> Cheat death (45 second cd).'
        },
        right: { id: 'psychoscope-oblivion-beauty-refinement', label: 'Beauty of Refinement', placeholder: false, warn: true,
          tip: '<span class="highlight-purple">Only check if beauty of refinement was not included in your imported stats.</span> +10% refined attack bonus.' 
        } 
      },
    ],
    final: { id: 'psychoscope-oblivion-feint-strike', label: 'Feint Strike', placeholder: false,
      tip: '(self) 6% seasonal damage to enemies with oblivion.' },
  },

};

// =============================================================================
// Factors (Generic/Polarity, Class, Class Reality)
//
// Each tree normally has 2 Generic factor slots + 2 Class factor slots + 2 fixed
// Class Reality slots. A handful of nodes across the trees grant a 3rd slot to
// either Generic or Class (never both at once, and Class Reality never changes).
// Mark those nodes with `grantsFactor: 'generic' | 'class'` in the config above —
// e.g. Fantasia's Ripple of Fate / Dual, above. Everything else defaults to no
// effect on factor counts.
//
// Slots 1 and 2 of each type are created once and never re-created, so whatever
// the person picked in them survives tree switches and node toggling. Only the
// 3rd Generic/Class slot is ever added or removed.
// =============================================================================

const FACTOR_SUGGESTIONS = [
  { key: 'x1', label: 'X1 (All Element)', aliases: ['x1', 'all element', 'all-element', 'all'], defaultValue: 360 },
  { key: 'x234', label: 'X2/3/4 (Main Stat)', aliases: ['x2', 'x3', 'x4', 'x234', 'x2/3/4', 'main stat', 'main-stat', 'main'], defaultValue: 2 },
  { key: 'x5', label: 'X5 (Crit)', aliases: ['x5', 'crit', 'critical'], defaultValue: 10 },
  { key: 'x6', label: 'X6 (Luck)', aliases: ['x6', 'luck', 'lucky'], defaultValue: 10 },
  { key: 'x7', label: 'X7 (Mastery)', aliases: ['x7', 'mastery', 'masteries'], defaultValue: 10 },
  { key: 'x8', label: 'X8 (Haste)', aliases: ['x8', 'haste'], defaultValue: 10 },
  { key: 'x9', label: 'X9 (Special Attack)', aliases: ['x9', 'special attack', 'special-attack', 'special'], defaultValue: 6.5 },
  { key: 'x10', label: 'X10 (Expertise DMG)', aliases: ['x10', 'expertise dmg', 'expertise-dmg', 'expertise'], defaultValue: 7 },
  { key: 'x11', label: 'X11 (Versatility)', aliases: ['x11', 'versatility', 'vers'], defaultValue: 1800 },
];
const FACTOR_SUGGESTION_LIST_ID = 'psychoscope-factor-generic-suggestions';
const DEFAULT_CLASS_FACTOR_SUGGESTIONS = [];

function getSelectedClassValue() {
  return document.getElementById('class-select')?.value || 'none';
}

function getFactorSlotEnabledState(type, classSelectVal = getSelectedClassValue()) {
  if (type === 'generic') return true;
  if (type === 'class' || type === 'class-reality') return classSelectVal !== 'none';
  return false;
}

function getFactorSlotPlaceholder(type, classSelectVal = getSelectedClassValue()) {
  if (type === 'generic') {
    return 'Type factor (X1/X2/X3/X4/X5/X6/X7/X8/X9/X10/X11)';
  }
  if (type === 'class') {
    return classSelectVal === 'smite'
      ? 'Type factor (X11 Seasonal Luck DMG)'
      : 'Type factor (X1/X2/X3/X4/X5/X6/X7/X8/X9/X10/X11)';
  }
  return '';
}

function getFactorSuggestionsForType(type) {
  if (type === 'class' || type === 'class-reality') {
    const classSelectVal = getSelectedClassValue();
    const classModule = window.CLASS_MODULES?.[classSelectVal];
    const classSuggestions = classModule?.provideFactorSuggestions?.(type);

    if (Array.isArray(classSuggestions) && classSuggestions.length > 0) {
      return classSuggestions;
    }

    return DEFAULT_CLASS_FACTOR_SUGGESTIONS;
  }
  return FACTOR_SUGGESTIONS;
}

function getFactorSuggestionDefaultValue(key, suggestions = FACTOR_SUGGESTIONS) {
  const suggestion = suggestions.find(option => option.key === key);
  return Number.isFinite(suggestion?.defaultValue) ? suggestion.defaultValue : 0;
}

function getFactorValueMax(type, key, suggestions = FACTOR_SUGGESTIONS) {
  if (key) {
    const suggestion = suggestions.find(option => option.key === key);
    if (Number.isFinite(suggestion?.defaultValue)) {
      return suggestion.defaultValue;
    }
  }
  return type === 'class' ? 50 : 10;
}

function syncFactorValueConstraints(nameInput, valueInput, type, suggestions = FACTOR_SUGGESTIONS) {
  if (!nameInput || !valueInput) return;
  const key = getFactorSelectionKey(nameInput.value, suggestions);
  const maxValue = getFactorValueMax(type, key, suggestions);
  valueInput.min = '0';
  valueInput.setAttribute('max', String(maxValue));
  const previousKey = nameInput.dataset.factorKey || null;
  const shouldResetToDefault = Boolean(key) && (previousKey !== key || !previousKey);
  const hasUserValue = String(valueInput?.dataset?.userEdited || '').trim() === 'true';
  if (!hasUserValue || shouldResetToDefault) {
    if (key) {
      valueInput.value = getFactorSuggestionDefaultValue(key, suggestions);
    } else {
      valueInput.value = '';
    }
    valueInput.dataset.userEdited = 'false';
  }
  if (!key) {
    valueInput.value = '';
    valueInput.dataset.userEdited = 'false';
  }
  nameInput.dataset.factorKey = key || '';
  const numericValue = parseFloat(valueInput.value);
  if (Number.isFinite(numericValue) && numericValue > maxValue) {
    valueInput.value = String(maxValue);
  }
  if (typeof clamp === 'function') {
    clamp(valueInput);
  }
}

function applyFactorDefaultValue(nameInput, valueInput, suggestions = FACTOR_SUGGESTIONS, type = 'generic') {
  syncFactorValueConstraints(nameInput, valueInput, type, suggestions);
  updateClassSkills(); // (calling this refreshes the factor bonuses for the skills).
}

function getGenericNonSubstatFactorBonuses() {
  let genericFactorAllElement = 0, mainStatPct = 0, mainStat = 0, specialAttackPct = 0, expertiseDmgPct = 0, versatilityStat = 0;

  [1, 2, 3].forEach(index => {
    const nameInput = document.getElementById(`psychoscope-factor-generic-${index}-name`);
    const valueInput = document.getElementById(`psychoscope-factor-generic-${index}-value`);
    
    const key = getFactorSelectionKey(nameInput?.value || '', FACTOR_SUGGESTIONS);
    if (!key) return;
    if (['x5', 'x6', 'x7', 'x8'].includes(key)) return;
    
    const value = parseFloat(valueInput?.value);
    if (!Number.isFinite(value) || value <= 0) return;

    if (key === 'x1') {
      genericFactorAllElement += value;
    }
    if (key === 'x234' && getChecked(`psychoscope-factor-generic-${index}-apply-imported`)) {
      mainStatPct = value;
      mainStat = Math.round(44.68 * value + 15.64);
    }
    if (key === 'x9') {
      specialAttackPct = value;
    }
    if(key === 'x10') {
      expertiseDmgPct = value;
    }
    if(key === 'x11') {
      versatilityStat = value;
    }
  });

  return {
    genericFactorAllElement,
    mainStatPct,
    mainStat,
    specialAttackPct,
    expertiseDmgPct,
    versatilityStat
  };
}

window.getGenericNonSubstatFactorBonuses = getGenericNonSubstatFactorBonuses;

// Maps the #psychoscope-tree <select> values to PSYCHOSCOPE_TREES keys.
const TREE_SELECT_VALUE_MAP = {
  dreamforce: 'dreamforce',
  'fantasia-impact': 'fantasia',
  'endless-mind': 'endlessMind',
  oblivion: 'oblivion',
};

function getActiveTreeConfig() {
  const val = document.getElementById('psychoscope-tree')?.value;
  const key = TREE_SELECT_VALUE_MAP[val];
  return key ? PSYCHOSCOPE_TREES[key] : null;
}

// Counts how many of the 3rd-slot bonuses are currently active for a tree.
function computeBonusFactorSlots(config) {
  const result = { generic: false, class: false };
  if (!config) return result;
  config.rows.forEach(row => {
    [row.left, row.right].forEach(node => {
      if (node.grantsFactor && document.getElementById(node.id)?.checked) {
        result[node.grantsFactor] = true;
      }
    });
  });
  return result;
}

function normalizeFactorSearchText(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function getFactorSelectionKey(value, suggestions = FACTOR_SUGGESTIONS) {
  const input = String(value || '').trim().toLowerCase();
  if (!input) return null;
  const match = suggestions.find(option => {
    const haystacks = [option.label, option.key, ...option.aliases];
    return haystacks.some(h => normalizeFactorSearchText(h) === normalizeFactorSearchText(input));
  });
  return match?.key || null;
}

function matchesFactorQuery(option, query) {
  const normalizedQuery = normalizeFactorSearchText(query);
  if (!normalizedQuery) return true;
  const haystacks = [option.label, option.key, ...option.aliases];
  return haystacks.some(h => normalizeFactorSearchText(h).includes(normalizedQuery));
}

function getFactorSlotIds(type) {
  return [`psychoscope-factor-${type}-1`, `psychoscope-factor-${type}-2`, `psychoscope-factor-${type}-3`];
}

function getUsedFactorKeys(excludeSlotId, type = 'generic') {
  const usedKeys = new Set();
  getFactorSlotIds(type).forEach(slotId => {
    if (slotId === excludeSlotId) return;
    const input = document.getElementById(`${slotId}-name`);
    const key = getFactorSelectionKey(input?.value || '', getFactorSuggestionsForType(type));
    if (key) usedKeys.add(key);
  });
  return usedKeys;
}

function sanitizeDuplicateFactorSelections(type = null) {
  const types = type ? [type] : ['generic', 'class', 'class-reality'];
  types.forEach(currentType => {
    const slotIds = getFactorSlotIds(currentType);
    const seen = new Map();
    slotIds.forEach(slotId => {
      const input = document.getElementById(`${slotId}-name`);
      const valueInput = document.getElementById(`${slotId}-value`);
      const checkboxWrap = document.getElementById(`${slotId}-apply-imported-wrap`);
      const checkbox = document.getElementById(`${slotId}-apply-imported`);
      const key = getFactorSelectionKey(input?.value || '', getFactorSuggestionsForType(currentType));
      if (!key) return;
      const existing = seen.get(key);
      if (existing && existing !== slotId) {
        if (input) input.value = '';
        if (valueInput) {
          valueInput.removeAttribute('value');
          valueInput.value = '0';
          valueInput.dataset.userEdited = 'false';
        }
        if (checkboxWrap) checkboxWrap.style.setProperty('display', 'none');
        if (checkbox) checkbox.checked = false;
        return;
      }
      seen.set(key, slotId);
    });
  });
}

function renderFactorSlot(type, index, options = {}) {
  const isGeneric = type === 'generic';
  const isClassSlot = type === 'class';
  const showApplyCheckbox = options.showApplyCheckbox ?? isGeneric;
  const slotId = `psychoscope-factor-${type}-${index}`;
  const nameId = `${slotId}-name`;
  const valueId = `${slotId}-value`;
  const applyId = `${slotId}-apply-imported`;
  const dropdownId = `${nameId}-dropdown`;
  const classSelectVal = getSelectedClassValue();
  const placeholder = getFactorSlotPlaceholder(type, classSelectVal);
  const applyDisabled = showApplyCheckbox ? '' : ' disabled';
  const optionsHtml = getFactorSuggestionsForType(type).map(option => `<button type="button" class="module-option" data-value="${option.label}" data-key="${option.key}">${option.label}</button>`).join('');
  const inputHtml = `
    <div class="module-select-container psychoscope-factor-select-container">
      <input type="text" class="module-search-input psychoscope-factor-search"
             id="${nameId}" placeholder="${placeholder}" autocomplete="off" data-dropdown-id="${dropdownId}">
      <div class="module-dropdown psychoscope-factor-dropdown" id="${dropdownId}" style="display:none;">
        ${optionsHtml}
      </div>
    </div>`;
  const maxValue = isClassSlot && classSelectVal === 'smite' ? 50 : 10;
  const applyCheckboxHtml = showApplyCheckbox ? `
      <div class="psychoscope-factor-checkbox-wrap" id="${applyId}-wrap" style="display:none;">
        <label class="psychoscope-factor-checkbox${isGeneric ? '' : ' psychoscope-factor-checkbox--disabled'}">
          <input type="checkbox" id="${applyId}"${applyDisabled}> Apply
        </label>
      </div>` : '';
  return `
    <div class="psychoscope-factor-slot" id="${slotId}-row">
      ${inputHtml}
      <input type="number" class="psychoscope-factor-value" id="${valueId}" value="" min="0" max="${maxValue}" onInput="updateClassSkills(); clamp(this)" step="0.1">
      ${applyCheckboxHtml}
    </div>`;
}

function setFactorSlotEnabled(slotId, type, showApplyCheckbox = type === 'generic') {
  const nameInput = document.getElementById(`${slotId}-name`);
  const valueInput = document.getElementById(`${slotId}-value`);
  const applyInput = document.getElementById(`${slotId}-apply-imported`);
  if (nameInput) {
    nameInput.disabled = false;
    nameInput.removeAttribute('disabled');
  }
  if (valueInput) {
    valueInput.disabled = false;
    valueInput.removeAttribute('disabled');
  }
  if (applyInput) {
    applyInput.disabled = false;
    applyInput.removeAttribute('disabled');
  }
}

function syncFactorSlotState(slotId, isGenericSlot, showApplyCheckbox = isGenericSlot, forceShow = false) {
  const nameInput = document.getElementById(`${slotId}-name`);
  const valueInput = document.getElementById(`${slotId}-value`);
  const checkboxWrap = document.getElementById(`${slotId}-apply-imported-wrap`);
  const checkbox = document.getElementById(`${slotId}-apply-imported`);
  const slotType = slotId.includes('-class-reality-') ? 'class-reality' : (slotId.includes('-class-') ? 'class' : 'generic');
  const classSelectVal = getSelectedClassValue();
  const isEnabled = isGenericSlot || getFactorSlotEnabledState(slotType, classSelectVal);
  const key = getFactorSelectionKey(nameInput?.value || '', getFactorSuggestionsForType(isGenericSlot ? 'generic' : 'class'));
  const value = parseFloat(valueInput?.value);
  const hasSavedFactorData = Boolean(nameInput?.value?.trim() || (Number.isFinite(value) && value > 0) || checkbox?.checked);
  const supportsApplyCheckbox = isGenericSlot && (key === 'x234' || key === 'mainstat' || (/x[5-8]/.test(key)));
  const shouldShow = (showApplyCheckbox && isEnabled && supportsApplyCheckbox && Number.isFinite(value) && value > 0 && hasSavedFactorData);
  if (checkboxWrap) checkboxWrap.style.display = shouldShow ? '' : 'none';
  if (!shouldShow && checkbox) checkbox.checked = false;
}

function wireFactorSlot(type, index, options = {}) {
  const slotId = `psychoscope-factor-${type}-${index}`;
  const nameId = `${slotId}-name`;
  const valueId = `${slotId}-value`;
  const applyId = `${slotId}-apply-imported`;
  const dropdownId = `${nameId}-dropdown`;
  const nameInput = document.getElementById(nameId);
  const valueInput = document.getElementById(valueId);
  const applyInput = document.getElementById(applyId);
  const dropdown = document.getElementById(dropdownId);
  const isGeneric = type === 'generic';
  const showApplyCheckbox = options.showApplyCheckbox ?? isGeneric;

  setFactorSlotEnabled(slotId, type, showApplyCheckbox);

  const refresh = (options = {}) => {
    const shouldApplyDefaultValue = options.shouldApplyDefaultValue !== false;
    if (shouldApplyDefaultValue) {
      applyFactorDefaultValue(nameInput, valueInput, getFactorSuggestionsForType(type), type);
    }
    sanitizeDuplicateFactorSelections(type);
    syncFactorSlotState(slotId, isGeneric, showApplyCheckbox);
    if (typeof calc === 'function') calc();
  };

  if (type === 'generic' || type === 'class' || type === 'class-reality')  {
    nameInput?.addEventListener('input', () => {
      const query = nameInput.value.trim();
      const usedKeys = getUsedFactorKeys(slotId, type);
      const options = dropdown?.querySelectorAll('.module-option');
      const currentKey = getFactorSelectionKey(nameInput.value, getFactorSuggestionsForType(type));
      options?.forEach(option => {
        const key = option.getAttribute('data-key') || '';
        const suggestion = getFactorSuggestionsForType(type).find(f => f.key === key);
        const shouldShow = !usedKeys.has(key) && (currentKey === key || matchesFactorQuery(suggestion, query));
        option.style.display = shouldShow ? '' : 'none';
      });
      if (dropdown) dropdown.style.display = query ? 'flex' : 'none';
      refresh();
    });
    nameInput?.addEventListener('focus', () => {
      if (dropdown) {
        const query = nameInput.value.trim();
        const usedKeys = getUsedFactorKeys(slotId, type);
        const currentKey = getFactorSelectionKey(nameInput.value, getFactorSuggestionsForType(type));
        const options = dropdown.querySelectorAll('.module-option');
        options.forEach(option => {
          const key = option.getAttribute('data-key') || '';
          const suggestion = getFactorSuggestionsForType(type).find(f => f.key === key);
          const shouldShow = !usedKeys.has(key) && (currentKey === key || matchesFactorQuery(suggestion, query));
          option.style.display = shouldShow ? '' : 'none';
        });
        dropdown.style.display = 'flex';
      }
    });
    nameInput?.addEventListener('blur', () => {
      window.setTimeout(() => {
        dropdown?.style.setProperty('display', 'none');
      }, 120);
    });
    dropdown?.querySelectorAll('.module-option').forEach(option => {
      option.addEventListener('mousedown', (event) => {
        event.preventDefault();
        const value = option.getAttribute('data-value') || '';
        const key = option.getAttribute('data-key') || '';
        if (getUsedFactorKeys(slotId, type).has(key) && key !== getFactorSelectionKey(nameInput?.value || '', getFactorSuggestionsForType(type))) {
          return;
        }
        if (nameInput) {
          nameInput.value = value;
        }
        applyFactorDefaultValue(nameInput, valueInput, getFactorSuggestionsForType(type));
        dropdown.style.display = 'none';
        refresh();
      });
    });
  }

  valueInput?.addEventListener('input', () => {
    valueInput.dataset.userEdited = 'true';
    refresh();
  });
  valueInput?.addEventListener('change', () => {
    valueInput.dataset.userEdited = 'true';
    refresh();
  });
  if (applyInput) {
    applyInput.addEventListener('change', () => refresh({ shouldApplyDefaultValue: false }));
  }
  refresh();
}

// Builds the static shell once: slots 1 & 2 of Generic/Class, and both fixed
// Class Reality slots. The 3rd Generic/Class slot is NOT created here — that's
// handled by updateFactors() so slots 1/2 are never touched again after this.
function initFactorsShell() {
  const root = document.getElementById('psychoscope-factors');
  if (!root) return;

  root.innerHTML = `
    <div class="section-label">Factors</div>
    <datalist id="${FACTOR_SUGGESTION_LIST_ID}">
      ${FACTOR_SUGGESTIONS.map(s => `<option value="${s.label}"></option>`).join('')}
    </datalist>
    <div class="factor-group" id="factor-group-generic">
      <span class="factor-group-label">Generic (Polarity) Factors<span class="tip"><span class="tip-icon">i</span><span class="tip-box">Input the main percent or value the factor gives you, not the level.(defaults to G10 value)</span></span></span>
      <div class="factor-slots" id="factor-slots-generic">
        ${renderFactorSlot('generic', 1)}
        ${renderFactorSlot('generic', 2)}
      </div>
    </div>
    <div class="factor-group" id="factor-group-class" style="display:none;">
      <span class="factor-group-label">Class Factors<span class="tip"><span class="tip-icon">i</span><span class="tip-box">Input the main percent or value the factor gives you, not the level.(defaults to G10 value)</span></span></span>
      <div class="factor-slots" id="factor-slots-class">
        ${renderFactorSlot('class', 1)}
        ${renderFactorSlot('class', 2)}
      </div>
    </div>
    <div class="factor-group" id="factor-group-class-reality" style="display:none;">
      <span class="factor-group-label">Class Reality Factors<span class="tip"><span class="tip-icon">i</span><span class="tip-box">Most of these are more reliant on user updating hit counts, these will not be implemented, just update hits per parse manually. 
      \nOtherwise: Input the main percent, uptime, or value the factor gives you, not the level.(defaults to G10 value if applicable)</span></span></span>
      <div class="factor-slots" id="factor-slots-class-reality">
        ${renderFactorSlot('class-reality', 1)}
        ${renderFactorSlot('class-reality', 2)}
      </div>
    </div>`;

  wireFactorSlot('generic', 1);
  wireFactorSlot('generic', 2);
  wireFactorSlot('class', 1);
  wireFactorSlot('class', 2);
  wireFactorSlot('class-reality', 1);
  wireFactorSlot('class-reality', 2);
}

// Adds/removes only the 3rd slot for a given factor type, leaving slots 1 & 2 alone.
function syncBonusSlot(type, shouldExist) {
  const slotId = `psychoscope-factor-${type}-3`;
  const existing = document.getElementById(`${slotId}-row`);
  if (shouldExist && !existing) {
    document.getElementById(`factor-slots-${type}`)?.insertAdjacentHTML('beforeend', renderFactorSlot(type, 3));
    wireFactorSlot(type, 3);
  } else if (!shouldExist && existing) {
    existing.remove();
  }
}

function refreshDefaultFactorSlots(type) {
  [1, 2].forEach(index => {
    const slotId = `psychoscope-factor-${type}-${index}`;
    const row = document.getElementById(`${slotId}-row`);
    if (!row) return;

    const nameInput = row.querySelector(`#${slotId}-name`);
    const valueInput = row.querySelector(`#${slotId}-value`);
    const applyInput = row.querySelector(`#${slotId}-apply-imported`);
    const savedState = {
      name: nameInput?.value || '',
      value: valueInput?.value || '',
      userEdited: valueInput?.dataset.userEdited || 'false',
      applyChecked: applyInput?.checked || false,
    };

    row.outerHTML = renderFactorSlot(type, index, { showApplyCheckbox: type === 'generic' });
    wireFactorSlot(type, index, { showApplyCheckbox: type === 'generic' });

    const rebuiltRow = document.getElementById(`${slotId}-row`);
    const rebuiltNameInput = rebuiltRow?.querySelector(`#${slotId}-name`);
    const rebuiltValueInput = rebuiltRow?.querySelector(`#${slotId}-value`);
    const rebuiltApplyInput = rebuiltRow?.querySelector(`#${slotId}-apply-imported`);

    if (rebuiltNameInput) rebuiltNameInput.value = savedState.name;
    if (rebuiltValueInput) {
      rebuiltValueInput.value = savedState.value;
      rebuiltValueInput.dataset.userEdited = savedState.userEdited;
    }
    if (rebuiltApplyInput) rebuiltApplyInput.checked = savedState.applyChecked;

    const hasSavedFactorData = Boolean(savedState.name || (savedState.value !== '' && savedState.value !== '0' && savedState.value !== null && savedState.value !== undefined) || savedState.applyChecked);
    syncFactorSlotState(slotId, type === 'generic', type === 'generic', hasSavedFactorData);
  });
}

function updateFactors() {
  const wrap = document.getElementById('psychoscope-factors');
  if (!wrap) return;

  const config = getActiveTreeConfig();
  wrap.style.display = config ? 'block' : 'none';
  if (!config) return;

  const classSelectVal = getSelectedClassValue();
  const hasClass = classSelectVal !== 'none';
  document.getElementById('factor-group-class')?.style.setProperty('display', hasClass ? '' : 'none');
  document.getElementById('factor-group-class-reality')?.style.setProperty('display', hasClass ? '' : 'none');

  const bonus = computeBonusFactorSlots(config);
  refreshDefaultFactorSlots('generic');
  if (hasClass) {
    refreshDefaultFactorSlots('class');
    refreshDefaultFactorSlots('class-reality');
  }
  ['psychoscope-factor-class-1', 'psychoscope-factor-class-2', 'psychoscope-factor-class-3'].forEach(slotId => setFactorSlotEnabled(slotId, 'class'));
  ['psychoscope-factor-class-reality-1', 'psychoscope-factor-class-reality-2', 'psychoscope-factor-class-reality-3'].forEach(slotId => setFactorSlotEnabled(slotId, 'class-reality'));
  syncBonusSlot('generic', bonus.generic);
  syncBonusSlot('class', hasClass && bonus.class);
}

// Used to generate the <line> elements in the connector SVG
function getSegmentKeys(numRows) {
  const keys = [];
  for (let i = 1; i < numRows; i++) {
    keys.push(`t${i}-ll`, `t${i}-rr`, `t${i}-lr`, `t${i}-rl`);
  }
  keys.push('tF-l', 'tF-r');
  return keys;
}

// Measures the currently-rendered position of every node in a tree and updates the connector <line> elements
function layoutTree(config) {
  const wrap = document.querySelector(`#${config.modalId} .tree-wrap`);
  const svg = wrap?.querySelector('svg.tree-lines');
  if (!wrap || !svg) return;

  const wrapRect = wrap.getBoundingClientRect();
  if (wrapRect.width === 0 && wrapRect.height === 0) return; // modal not visible yet

  svg.setAttribute('viewBox', `0 0 ${wrapRect.width} ${wrapRect.height}`);

  const pointFor = (nodeId, edge) => {
    const node = document.getElementById(nodeId)?.closest('.tree-node');
    if (!node) return null;
    const r = node.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - wrapRect.left,
      y: (edge === 'top' ? r.top : r.bottom) - wrapRect.top,
    };
  };

  const setLine = (key, p1, p2) => {
    const line = document.getElementById(`${config.containerId}-seg-${key}`);
    if (!line || !p1 || !p2) return;
    line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x); line.setAttribute('y2', p2.y);
  };

  for (let i = 0; i < config.rows.length - 1; i++) {
    const rowA = config.rows[i], rowB = config.rows[i + 1];
    const aL = pointFor(rowA.left.id, 'bottom'), aR = pointFor(rowA.right.id, 'bottom');
    const bL = pointFor(rowB.left.id, 'top'), bR = pointFor(rowB.right.id, 'top');
    setLine(`t${i + 1}-ll`, aL, bL);
    setLine(`t${i + 1}-rr`, aR, bR);
    setLine(`t${i + 1}-lr`, aL, bR);
    setLine(`t${i + 1}-rl`, aR, bL);
  }

  const lastRow = config.rows[config.rows.length - 1];
  const lastL = pointFor(lastRow.left.id, 'bottom'), lastR = pointFor(lastRow.right.id, 'bottom');
  const finalPoint = pointFor(config.final.id, 'top');
  setLine('tF-l', lastL, finalPoint);
  setLine('tF-r', lastR, finalPoint);
}

// ---------- Rendering ----------
function renderTip(node) {
  if (!node.tip) return '';
  let warnColor = 'gold';
  if (node.warnColor === 'red') warnColor = 'var(--accent-red)';
  if (node.warnColor === 'orange') warnColor = 'var(--accent-orange)';
  const warnStyle = node.warn ? ` style="color:${warnColor};border-color:${warnColor};font-weight:bold;"` : '';
  return `<span class="tip"><span class="tip-icon"${warnStyle}>i</span><span class="tip-box">${node.tip}</span></span>`;
}

function renderStandalone(item) {
  if (item.kind === 'checkbox') {
    return `
      <div class="standalone-row">
        <label class="standalone-label" for="${item.id}">
          <input type="checkbox" id="${item.id}">
          ${item.label}
          ${renderTip(item)}
        </label>
      </div>`;
  }
  if (item.kind === 'checkbox-number') {
    return `
      <div class="standalone-row standalone-row--number">
        <label class="standalone-label" for="${item.id}">
          <input type="checkbox" id="${item.id}">
          ${item.label}
          ${renderTip(item)}
        </label>
        <input type="number" id="${item.numberId}" class="standalone-number"
               value="${item.numberDefault}" step="1" min="0" title="${item.label} value">
      </div>`;
  }
  return '';
}

function renderPairedNode(node, groupName) {
  const placeholderCls = node.placeholder ? ' placeholder' : '';
  const disabledCls = node.disabled ? ' is-disabled' : '';
  const checkedAttr = node.defaultChecked && !node.disabled ? ' checked' : '';
  const disabledAttr = node.disabled ? ' disabled' : '';
  const ariaAttr = node.disabled ? ' aria-disabled="true"' : '';
  const tbdChip = node.placeholder ? '<span class="node-note">TBD</span>' : '';
  const tipHtml = node.placeholder
    ? '<span class="tip"><span class="tip-icon">i</span><span class="tip-box">Effect not yet defined — placeholder node.</span></span>'
    : renderTip(node);
  return `
    <label class="tree-node${placeholderCls}${disabledCls}" data-node-id="${node.id}"${ariaAttr}>
      ${tbdChip}
      <input type="radio" name="${groupName}" id="${node.id}"${checkedAttr}${disabledAttr}>
      <span class="node-label">${node.label}</span>
      ${node.note ? `<div class="tree-node-note">${node.note}</div>` : ''}
      ${tipHtml}
    </label>`;
}

function renderTreeRow(row, rowIndex, groupPrefix) {
  const groupName = `${groupPrefix}-row${rowIndex}`;
  let html = `<div class="tree-row" data-row="${rowIndex}">`;
  html += renderPairedNode(row.left, groupName);
  html += renderPairedNode(row.right, groupName);
  html += `</div>`;

  const percentNode = [row.left, row.right].find(n => n.percent);
  if (percentNode) {
    const p = percentNode.percent;
    const opts = p.options.map(v => `<option value="${v}"${v === p.defaultValue ? ' selected' : ''}>${v}%</option>`).join('');
    html += `
      <div class="linkage-pct-row" id="${p.id}-row">
        <select id="${p.id}">${opts}</select>
      </div>`;
  }
  return html;
}

function renderFinalNode(node) {
  const disabledCls = node.disabled ? ' is-disabled' : '';
  const disabledAttr = node.disabled ? ' disabled' : '';
  const ariaAttr = node.disabled ? ' aria-disabled="true"' : '';
  return `
    <div class="tree-row single" data-row="final">
      <label class="tree-node final-node${disabledCls}" data-node-id="${node.id}"${ariaAttr}>
        <input type="checkbox" id="${node.id}"${disabledAttr}>
        <span class="node-label">${node.label}</span>
        ${renderTip(node)}
      </label>
    </div>`;
}

function renderConnectorSVG(numRows, prefix) {
  // Placeholder coordinates — layoutTree() fills these in with real measurements
  // once the modal is actually visible and has a layout to measure.
  const lines = getSegmentKeys(numRows)
    .map(key => `<line id="${prefix}-seg-${key}" x1="0" y1="0" x2="0" y2="0"></line>`)
    .join('');
  return `<svg class="tree-lines" viewBox="0 0 340 400" preserveAspectRatio="none">${lines}</svg>`;
}

function renderModal(key, config) {
  const standaloneHtml = config.standalone.map(renderStandalone).join('');
  const rowsHtml = config.rows.map((row, i) => renderTreeRow(row, i + 1, config.containerId)).join('');
  const connectorSvg = renderConnectorSVG(config.rows.length, config.containerId);
  const finalHtml = renderFinalNode(config.final);

  return `
    <div class="psychoscope-modal-overlay" id="${config.modalId}" data-tree="${key}">
      <div class="modal-content">
        <div class="modal-header">
          <h2>${config.title}</h2>
          <button class="modal-close" type="button" aria-label="Close" data-close-modal="${config.modalId}">&times;</button>
        </div>
        <div class="modal-body">
          ${standaloneHtml}
          <div class="tree-wrap">
            ${connectorSvg}
            ${rowsHtml}
            ${finalHtml}
          </div>
        </div>
      </div>
    </div>`;
}

function renderCompactTrigger(key, config) {
  return `
    <div class="psychoscope-compact" id="${config.containerId}-compact" data-tree="${key}"
         tabindex="0" role="button" aria-label="Configure ${config.title}">
      <div class="psychoscope-compact-header">
        <span class="psychoscope-compact-title">${config.title}</span>
        <span class="psychoscope-compact-edit">Configure ›</span>
      </div>
      <div class="psychoscope-compact-summary" id="${config.containerId}-summary"></div>
    </div>`;
}

// ---------- State reads / summary ----------
function isSelectableTreeNode(node) {
  return Boolean(node) && !node.disabled;
}

function isTreeNodeChecked(node) {
  if (!isSelectableTreeNode(node)) return false;
  return !!document.getElementById(node.id)?.checked;
}

function computeTreePath(config) {
  const rowSides = config.rows.map(row => {
    if (isTreeNodeChecked(row.left)) return 'l';
    if (isTreeNodeChecked(row.right)) return 'r';
    return null;
  });
  const finalChecked = isTreeNodeChecked(config.final);
  return { rowSides, finalChecked };
}

function rowSummaryHtml(label, active) {
  const dotClass = active ? 'psychoscope-dot psychoscope-dot--active' : 'psychoscope-dot';
  const textClass = active ? 'psychoscope-summary-text psychoscope-summary-text--active' : 'psychoscope-summary-text';
  return `<div class="psychoscope-summary-row"><span class="${dotClass}"></span><span class="${textClass}">${label}</span></div>`;
}

function computeCompactSummaryHtml(config) {
  const lines = [];

  config.standalone.forEach(item => {
    const checked = document.getElementById(item.id)?.checked;
    let label = item.label;
    if (item.kind === 'checkbox-number' && checked) {
      const val = document.getElementById(item.numberId)?.value;
      label += ` · ${val}`;
    }
    lines.push(rowSummaryHtml(label, !!checked));
  });

  config.rows.forEach(row => {
    const leftChecked = isTreeNodeChecked(row.left);
    const rightChecked = isTreeNodeChecked(row.right);
    const picked = leftChecked ? row.left : rightChecked ? row.right : null;
    if (picked) {
      let label = picked.label;
      if (picked.percent) {
        const val = document.getElementById(picked.percent.id)?.value;
        label += ` · ${val}%`;
      }
      lines.push(rowSummaryHtml(label, true));
    } else {
      lines.push(rowSummaryHtml('—', false));
    }
  });

  const finalChecked = isTreeNodeChecked(config.final);
  lines.push(rowSummaryHtml(config.final.label, !!finalChecked));

  return lines.join('');
}

function updateCompactSummary(key) {
  const config = PSYCHOSCOPE_TREES[key];
  const el = document.getElementById(`${config.containerId}-summary`);
  const trigger = document.getElementById(`${config.containerId}-compact`);
  if (!el || !trigger) return;

  const anySet = config.standalone.some(s => document.getElementById(s.id)?.checked)
    || config.rows.some(r => document.getElementById(r.left.id)?.checked || document.getElementById(r.right.id)?.checked)
    || document.getElementById(config.final.id)?.checked;

  trigger.classList.toggle('empty', !anySet);

  if (!anySet) {
    el.innerHTML = `<div class="note">Not configured yet — click to set up.</div>`;
    return;
  }
  el.innerHTML = computeCompactSummaryHtml(config);
}

// ---------- Line highlighting (traces the real path, diagonals included) ----------
function applyTreePathHighlight(prefix, path, numRows) {
  getSegmentKeys(numRows).forEach(key => document.getElementById(`${prefix}-seg-${key}`)?.classList.remove('active'));

  for (let i = 0; i < numRows - 1; i++) {
    const a = path.rowSides[i], b = path.rowSides[i + 1];
    if (a && b) {
      document.getElementById(`${prefix}-seg-t${i + 1}-${a}${b}`)?.classList.add('active');
    }
  }
  const lastSide = path.rowSides[numRows - 1];
  if (lastSide && path.finalChecked) {
    document.getElementById(`${prefix}-seg-tF-${lastSide}`)?.classList.add('active');
  }
}

function updatePercentRows(config) {
  config.rows.forEach(row => {
    [row.left, row.right].forEach(node => {
      if (node.percent) {
        const rowEl = document.getElementById(`${node.percent.id}-row`);
        const checked = isTreeNodeChecked(node);
        rowEl?.classList.toggle('visible', !!checked);
      }
    });
  });
}

// ---------- Master change handler ----------
function handleTreeChange(key) {
  const config = PSYCHOSCOPE_TREES[key];
  updatePercentRows(config);   // may change row spacing (e.g. Linkage % row appearing)
  layoutTree(config);          // so re-measure before redrawing the lines
  const path = computeTreePath(config);
  applyTreePathHighlight(config.containerId, path, config.rows.length);
  updateCompactSummary(key);
  updateFactors();             // a node toggle may add/remove a bonus factor slot
  const tree = document.getElementById('psychoscope-tree')?.value || '';
  if (typeof syncPsychoscopeSkillEffects === 'function') {
    syncPsychoscopeSkillEffects(tree);
  }
  if (typeof calc === 'function') calc();
}

function wireTreeEvents(key, config) {
  const inputIds = [];
  config.standalone.forEach(s => {
    inputIds.push(s.id);
    if (s.numberId) inputIds.push(s.numberId);
  });
  config.rows.forEach(row => {
    inputIds.push(row.left.id, row.right.id);
    if (row.left.percent) inputIds.push(row.left.percent.id);
    if (row.right.percent) inputIds.push(row.right.percent.id);
  });
  inputIds.push(config.final.id);

  inputIds.forEach(id => {
    document.getElementById(id)?.addEventListener('change', () => handleTreeChange(key));
  });
}

// ---------- Modal open/close ----------
function openTreeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Wait a frame so the modal has actually been laid out before we measure it.
  requestAnimationFrame(() => layoutTree(PSYCHOSCOPE_TREES[overlay.dataset.tree]));
}
function closeTreeModal(modalId) {
  document.getElementById(modalId)?.classList.remove('open');
  document.body.style.overflow = '';
}

// Keep lines aligned if the window is resized while a tree is open.
window.addEventListener('resize', () => {
  document.querySelectorAll('.psychoscope-modal-overlay.open').forEach(o => {
    layoutTree(PSYCHOSCOPE_TREES[o.dataset.tree]);
  });
});

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('.psychoscope-compact');
  if (trigger) {
    openTreeModal(PSYCHOSCOPE_TREES[trigger.dataset.tree].modalId);
    return;
  }
  const closeBtn = e.target.closest('[data-close-modal]');
  if (closeBtn) {
    closeTreeModal(closeBtn.dataset.closeModal);
    return;
  }
  const overlay = e.target.closest('.psychoscope-modal-overlay');
  if (overlay && e.target === overlay) {
    closeTreeModal(overlay.id);
  }
});


function positionFloatingTip(tip) {
  const icon = tip.querySelector('.tip-icon');
  const box = tip.querySelector('.tip-box');
  if (!icon || !box) return;

  const iconRect = icon.getBoundingClientRect();
  const boxWidth = box.offsetWidth || 220;
  const boxHeight = box.offsetHeight || 60;
  const margin = 8, gap = 8;

  let left = iconRect.left + iconRect.width / 2;
  left = Math.max(boxWidth / 2 + margin, Math.min(window.innerWidth - boxWidth / 2 - margin, left));

  const showBelow = iconRect.top < boxHeight + gap + margin;
  box.style.left = `${left}px`;
  if (showBelow) {
    box.style.top = `${iconRect.bottom + gap}px`;
    box.style.transform = 'translate(-50%, 0)';
  } else {
    box.style.top = `${iconRect.top - gap}px`;
    box.style.transform = 'translate(-50%, -100%)';
  }
}

document.addEventListener('mouseover', (e) => {
  const tip = e.target.closest('.psychoscope-modal-overlay .tip');
  if (tip) positionFloatingTip(tip);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const trigger = e.target.closest('.psychoscope-compact');
    if (trigger) {
      e.preventDefault();
      openTreeModal(PSYCHOSCOPE_TREES[trigger.dataset.tree].modalId);
    }
  }
  if (e.key === 'Escape') {
    document.querySelectorAll('.psychoscope-modal-overlay.open').forEach(o => closeTreeModal(o.id));
  }
});

// ---------- Init ----------
function initPsychoscopeTrees() {
  Object.entries(PSYCHOSCOPE_TREES).forEach(([key, config]) => {
    const container = document.getElementById(config.containerId);
    if (!container) return;

    container.innerHTML = renderCompactTrigger(key, config);
    document.body.insertAdjacentHTML('beforeend', renderModal(key, config));

    wireTreeEvents(key, config);
    updatePercentRows(config);
    updateCompactSummary(key);
    // Line layout is skipped here on purpose — the modal is still hidden
    // (display:none) at this point, so there's nothing to measure yet.
    // openTreeModal() runs layoutTree() as soon as it's actually shown.
  });

  initFactorsShell();
  document.getElementById('psychoscope-tree')?.addEventListener('change', updateFactors);
  document.getElementById('class-select')?.addEventListener('change', () => {
    updateFactors();
    if (typeof calc === 'function') calc();
  });
  updateFactors();
}

document.addEventListener('DOMContentLoaded', initPsychoscopeTrees);



function createEmptyPsychoscopeFactorState() {
  return { generic: [], class: [], 'class-reality': [] };
}

function normalizePsychoscopeSaveState(state) {
  const raw = state && typeof state === 'object' ? state : {};
  console.log('[psychoscope] normalize input', state);
  const normalized = {
    tree: raw.tree || 'none',
    values: raw.values && typeof raw.values === 'object' ? raw.values : {},
    factors: createEmptyPsychoscopeFactorState(),
  };

  const normalizeFactorValue = (rawValue) => {
    if (rawValue === '' || rawValue === null || rawValue === undefined) return '';
    if (rawValue === 0 || rawValue === '0') return '';
    return rawValue;
  };

  const factorData = raw.factors && typeof raw.factors === 'object' ? raw.factors : {};
  ['generic', 'class', 'class-reality'].forEach(type => {
    const slots = Array.isArray(factorData[type]) ? factorData[type] : [];
    normalized.factors[type] = slots
      .map(slot => ({
        name: String(slot?.name || '').trim(),
        value: normalizeFactorValue(slot?.value),
        apply: Boolean(slot?.apply),
      }))
      .filter(slot => slot.name || (slot.value !== '' && slot.value !== null && slot.value !== undefined) || slot.apply);
  });

  console.log('[psychoscope] normalize output', normalized);
  return normalized;
}

function getPsychoscopeElementSaveValue(el) {
  if (!el) return null;
  if (el.type === 'checkbox' || el.type === 'radio') {
    return el.checked ? 1 : null;
  }
  const val = el.value;
  if (val === '' || val === null || val === undefined) return null;
  const trimmed = String(val).trim();
  if (trimmed === '') return null;
  const num = Number(val);
  return !Number.isNaN(num) ? num : trimmed;
}

function getPsychoscopeSaveState() {
  const tree = document.getElementById('psychoscope-tree')?.value || 'none';
  const values = {};
  const config = getActiveTreeConfig();

  const collectConfigValues = (cfg) => {
    if (!cfg) return;
    (cfg.standalone || []).forEach(item => {
      if (item.id) {
        const el = document.getElementById(item.id);
        const value = getPsychoscopeElementSaveValue(el);
        if (value !== null) values[item.id] = value;
      }
      if (item.numberId) {
        const el = document.getElementById(item.numberId);
        const value = getPsychoscopeElementSaveValue(el);
        if (value !== null) values[item.numberId] = value;
      }
    });
    (cfg.rows || []).forEach(row => {
      [row.left, row.right].forEach(node => {
        if (node?.id) {
          const el = document.getElementById(node.id);
          const value = getPsychoscopeElementSaveValue(el);
          if (value !== null) values[node.id] = value;
        }
        if (node?.percent?.id) {
          const el = document.getElementById(node.percent.id);
          const value = getPsychoscopeElementSaveValue(el);
          if (value !== null) values[node.percent.id] = value;
        }
      });
    });
    if (cfg.final?.id) {
      const el = document.getElementById(cfg.final.id);
      const value = getPsychoscopeElementSaveValue(el);
      if (value !== null) values[cfg.final.id] = value;
    }
  };

  collectConfigValues(config);

  const factors = {
    generic: [],
    class: [],
    'class-reality': [],
  };

  ['generic', 'class', 'class-reality'].forEach(type => {
    [1, 2, 3].forEach(index => {
      const slotId = `psychoscope-factor-${type}-${index}`;
      const nameEl = document.getElementById(`${slotId}-name`);
      const valueEl = document.getElementById(`${slotId}-value`);
      const applyEl = document.getElementById(`${slotId}-apply-imported`);
      if (!nameEl && !valueEl && !applyEl) return;
      const name = String(nameEl?.value || '').trim();
      const rawValue = getPsychoscopeElementSaveValue(valueEl);
      const apply = !!applyEl?.checked;
      const value = rawValue === null || rawValue === undefined ? '' : rawValue;
      if (!name && value === '' && !apply) return;
      factors[type].push({
        name,
        value,
        apply,
      });
    });
  });

  return {
    tree,
    values,
    factors,
  };
}

function applyPsychoscopeSaveState(state) {
  console.log('[psychoscope] applyPsychoscopeSaveState start', state);
  const savedState = normalizePsychoscopeSaveState(state);
  const treeSelect = document.getElementById('psychoscope-tree');
  console.log('[psychoscope] applying tree', savedState.tree, 'treeSelect exists', !!treeSelect);
  if (treeSelect) treeSelect.value = savedState.tree || 'none';

  if (typeof initFactorsShell === 'function' && !document.getElementById('psychoscope-factor-generic-1-name')) {
    initFactorsShell();
  }

  const config = getActiveTreeConfig();
  const resetConfigValues = (cfg) => {
    if (!cfg) return;
    (cfg.standalone || []).forEach(item => {
      if (item.id) {
        const el = document.getElementById(item.id);
        if (el) {
          if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = false;
          } else {
            el.value = '';
          }
        }
      }
      if (item.numberId) {
        const el = document.getElementById(item.numberId);
        if (el) {
          if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = false;
          } else {
            el.value = item.numberDefault ?? '';
          }
        }
      }
    });
    (cfg.rows || []).forEach(row => {
      [row.left, row.right].forEach(node => {
        if (node?.id) {
          const el = document.getElementById(node.id);
          if (el) {
            if (el.type === 'checkbox' || el.type === 'radio') {
              el.checked = false;
            } else {
              el.value = '';
            }
          }
        }
        if (node?.percent?.id) {
          const el = document.getElementById(node.percent.id);
          if (el) {
            const defaultValue = node.percent?.defaultValue;
            el.value = defaultValue ?? '';
          }
        }
      });
    });
    if (cfg.final?.id) {
      const el = document.getElementById(cfg.final.id);
      if (el) {
        if (el.type === 'checkbox' || el.type === 'radio') {
          el.checked = false;
        } else {
          el.value = '';
        }
      }
    }
  };

  const applyConfigValues = (cfg) => {
    if (!cfg) return;
    (cfg.standalone || []).forEach(item => {
      if (item.id) {
        const el = document.getElementById(item.id);
        if (el) {
          if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = Boolean(savedState.values?.[item.id]);
          } else {
            el.value = savedState.values?.[item.id] ?? '';
          }
        }
      }
      if (item.numberId) {
        const el = document.getElementById(item.numberId);
        if (el) {
          if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = Boolean(savedState.values?.[item.numberId]);
          } else {
            el.value = savedState.values?.[item.numberId] ?? '';
          }
        }
      }
    });
    (cfg.rows || []).forEach(row => {
      [row.left, row.right].forEach(node => {
        if (node?.id) {
          const el = document.getElementById(node.id);
          if (el) {
            if (el.type === 'checkbox' || el.type === 'radio') {
              el.checked = Boolean(savedState.values?.[node.id]);
            } else {
              el.value = savedState.values?.[node.id] ?? '';
            }
          }
        }
        if (node?.percent?.id) {
          const el = document.getElementById(node.percent.id);
          if (el) {
            if (el.type === 'checkbox' || el.type === 'radio') {
              el.checked = Boolean(savedState.values?.[node.percent.id]);
            } else {
              el.value = savedState.values?.[node.percent.id] ?? '';
            }
          }
        }
      });
    });
    if (cfg.final?.id) {
      const el = document.getElementById(cfg.final.id);
      if (el) {
        if (el.type === 'checkbox' || el.type === 'radio') {
          el.checked = Boolean(savedState.values?.[cfg.final.id]);
        } else {
          el.value = savedState.values?.[cfg.final.id] ?? '';
        }
      }
    }
  };

  console.log('[psychoscope] reset/apply config for', config?.title || 'none');
  resetConfigValues(config);
  applyConfigValues(config);
  console.log('[psychoscope] applied values snapshot', savedState.values);

  if (typeof updateFactors === 'function') updateFactors();

  ['generic', 'class', 'class-reality'].forEach(type => {
    const slots = Array.isArray(savedState.factors?.[type]) ? savedState.factors[type] : [];
    console.log('[psychoscope] restoring factor slots', type, slots);
    [1, 2, 3].forEach(index => {
      const slotId = `psychoscope-factor-${type}-${index}`;
      const slotData = slots[index - 1] || {};
      const nameEl = document.getElementById(`${slotId}-name`);
      const valueEl = document.getElementById(`${slotId}-value`);
      const applyEl = document.getElementById(`${slotId}-apply-imported`);
      if (nameEl) nameEl.value = slotData.name || '';
      if (valueEl) {
        valueEl.value = slotData.value ?? '';
        valueEl.dataset.userEdited = slotData.name || slotData.value !== '' ? 'true' : 'false';
      }
      if (applyEl) applyEl.checked = Boolean(slotData.apply);
      const isGeneric = type === 'generic';
      const hasSavedFactorData = Boolean(slotData.name || (slotData.value !== '' && slotData.value !== null && slotData.value !== undefined) || slotData.apply);
      syncFactorSlotState(slotId, isGeneric, isGeneric, hasSavedFactorData);
    });
  });

  if (typeof onPsychoscopeChange === 'function') {
    console.log('[psychoscope] calling onPsychoscopeChange');
    onPsychoscopeChange();
  }
}

window.normalizePsychoscopeSaveState = normalizePsychoscopeSaveState;
window.getPsychoscopeSaveState = getPsychoscopeSaveState;
window.applyPsychoscopeSaveState = applyPsychoscopeSaveState;
