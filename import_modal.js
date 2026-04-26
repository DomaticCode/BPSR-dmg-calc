function openZdpsImportModal() {
  document.getElementById('zdps-modal').style.display = 'flex';
  document.getElementById('zdps-import-top').style.display = 'block';
  document.getElementById('zdps-toggle-top').style.display = 'none';
  document.getElementById('zdps-attribute-feedback').innerHTML = '';
  document.getElementById('element-selection').style.display = 'none';
  document.getElementById('element-options').innerHTML = '';
  document.getElementById('load-btn').style.display = 'inline-block';
  document.getElementById('apply-element-btn').style.display = 'none';
}

function closeZdpsImportModal() {
  document.getElementById('zdps-modal').style.display = 'none';
  document.getElementById('zdps-attributes').value = '';
  document.getElementById('zdps-attribute-feedback').innerHTML = '';
  document.getElementById('zdps-import-top').style.display = 'block';
  document.getElementById('zdps-toggle-top').style.display = 'none';
  document.getElementById('element-selection').style.display = 'none';
  document.getElementById('element-options').innerHTML = '';
  document.getElementById('load-btn').style.display = 'inline-block';
  document.getElementById('apply-element-btn').style.display = 'none';
}

function toggleZdpsImportTop() {
  const top = document.getElementById('zdps-import-top');
  const toggle = document.getElementById('zdps-toggle-top');
  const isHidden = top.style.display === 'none';
  top.style.display = isHidden ? 'block' : 'none';
  toggle.textContent = isHidden ? 'Hide import fields' : 'Show import fields';
}

let parsedAttrs = {};

function getZdpsMainStatInfo() {
  const stats = [
    { totalKey: 'AttrStrengthTotal', addKey: 'AttrStrengthAdd', label: 'Strength' },
    { totalKey: 'AttrIntelligenceTotal', addKey: 'AttrIntelligenceAdd', label: 'Intelligence' },
    { totalKey: 'AttrDexterityTotal', addKey: 'AttrDexterityAdd', label: 'Agility' }
  ];

  return stats.reduce((best, stat) => {
    const totalValue = Number.isFinite(parsedAttrs[stat.totalKey]) ? parsedAttrs[stat.totalKey] : -Infinity;
    const addValue = Number.isFinite(parsedAttrs[stat.addKey]) ? parsedAttrs[stat.addKey] : -Infinity;
    const compareValue = Number.isFinite(totalValue) ? totalValue : addValue;

    if (!best || compareValue > best.compareValue) {
      return {
        ...stat,
        total: Number.isFinite(totalValue) ? totalValue : null,
        add: Number.isFinite(addValue) ? addValue : null,
        compareValue
      };
    }
    return best;
  }, null);
}

function loadZdpsAttributes() {
  const text = document.getElementById('zdps-attributes').value;
  const lines = text.split('\n');
  parsedAttrs = {};

  // Reset modal state for repeated imports
  document.getElementById('zdps-attribute-feedback').innerHTML = '';
  document.getElementById('element-selection').style.display = 'none';
  document.getElementById('element-options').innerHTML = '';
  document.getElementById('load-btn').style.display = 'none';
  document.getElementById('apply-element-btn').style.display = 'inline-block';

  // Collapse the instructions/text area section after load
  document.getElementById('zdps-import-top').style.display = 'none';
  document.getElementById('zdps-toggle-top').style.display = 'inline-block';

  // Parse the attributes
  lines.forEach(line => {
    const match = line.match(/\[(\d+)\]\s+(\w+)\s*=\s*(\d+)/);
    if (match) {
      const [, index, key, value] = match;
      parsedAttrs[key] = parseInt(value);
    }
  });

  displayZdpsAttributePreview();

  const elementTypes = {
    'AttrWoodAtkTotal': 'forest',
    'AttrFireAtkTotal': 'fire',
    'AttrWaterAtkTotal': 'ice',
    'AttrLightAtkTotal': 'light',
    'AttrDarkAtkTotal': 'dark',
    'AttrWindAtkTotal': 'wind'
  };
  const foundElements = Object.keys(parsedAttrs).filter(key => elementTypes[key]);

  if (foundElements.length > 1) {
    showElementSelection(foundElements.map(key => elementTypes[key]));
  }
}

function displayZdpsAttributePreview() {
  const feedback = document.getElementById('zdps-attribute-feedback');

  // Pick highest main attribute
  const str = parsedAttrs.AttrStrengthTotal || 0;
  const int = parsedAttrs.AttrIntelligenceTotal || 0;
  const dex = parsedAttrs.AttrDexterityTotal || 0;
  const mainStatInfo = getZdpsMainStatInfo();
  const mainAttrKey = mainStatInfo ? mainStatInfo.totalKey : 'AttrIntelligenceTotal';

  const mainAttrLabel = {
    'AttrStrengthTotal': 'Base Strength',
    'AttrIntelligenceTotal': 'Base Intelligence',
    'AttrDexterityTotal': 'Base Agility'
  };

  const expectedAttrs = [
    { key: mainAttrKey, label: mainAttrLabel[mainAttrKey], isMainStat: true },
    { key: 'AttrLuckTotal', label: 'Luck' },
    { key: 'AttrCriTotal', label: 'Crit' },
    { key: 'AttrHasteTotal', label: 'Haste' },
    { key: 'AttrMasteryTotal', label: 'Mastery' },
    { key: 'AttrVersatilityTotal', label: 'Versatility' },
    { key: 'AttrRefineMattack', label: 'Refined ATK' }, // We'll handle total below
    { key: 'AttrElementAtkTotal', label: 'Elemental ATK' }
  ];

  const lines = expectedAttrs.map(attr => {
    let value;
    if (attr.key === 'AttrRefineMattack') {
      // Use either RefineMattack or RefineAttackTotal
      value = parsedAttrs.AttrRefineMattack ?? parsedAttrs.AttrRefineAttackTotal;
    } else if (attr.isMainStat && mainStatInfo && mainStatInfo.add !== null) {
      value = mainStatInfo.add;
    } else {
      value = parsedAttrs[attr.key];
    }
    const found = value !== undefined;
    const bonusLine = attr.isMainStat && mainStatInfo && mainStatInfo.add !== null && mainStatInfo.total !== null
      ? `<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">Main Stat bonus %: ${((mainStatInfo.total / mainStatInfo.add - 1) * 100).toFixed(1)}%</div>`
      : '';
    return `<div style="padding: 4px 8px; border-radius: 4px; margin-bottom: 4px; background:${found ? '#e7f7ea' : '#fdecea'}; color:${found ? '#1b5e20' : '#b71c1c'}; font-size:13px;">` +
      `<strong>${attr.label}</strong>: ${found ? value : 'not found'}` +
      bonusLine +
      `</div>`;
  }).join('');

  // Elemental attributes
  const elementAttrs = [
    { key: 'AttrWoodAtkTotal', label: 'Forest ATK' },
    { key: 'AttrFireAtkTotal', label: 'Fire ATK' },
    { key: 'AttrWaterAtkTotal', label: 'Ice ATK' },
    { key: 'AttrLightAtkTotal', label: 'Light ATK' },
    { key: 'AttrDarkAtkTotal', label: 'Dark ATK' },
    { key: 'AttrWindAtkTotal', label: 'Wind ATK' }
  ];

  const elementLines = elementAttrs
    .filter(attr => parsedAttrs[attr.key] !== undefined)
    .map(attr => {
      return `<div style="padding: 4px 8px; border-radius: 4px; margin-bottom: 4px; background:#e7f7ea; color:#1b5e20; font-size:13px;">` +
        `<strong>${attr.label}</strong>: ${parsedAttrs[attr.key]}` +
        `</div>`;
    }).join('');

  feedback.innerHTML = `<div style="margin-top: 12px; font-size: 13px; color: var(--text-secondary); margin-bottom: 6px;">Loaded attribute values:</div>${lines}${elementLines}`;
}
function applyElementSelection() {
  const elementTypes = {
    'AttrWoodAtkTotal': 'forest',
    'AttrFireAtkTotal': 'fire',
    'AttrWaterAtkTotal': 'ice',
    'AttrLightAtkTotal': 'light',
    'AttrDarkAtkTotal': 'dark',
    'AttrWindAtkTotal': 'wind'
  };

  const foundElements = Object.keys(parsedAttrs).filter(key => elementTypes[key]);
  let selectedElementKey;

  const selectionDiv = document.getElementById('element-selection');
  let warning = document.getElementById('element-warning');

  if (foundElements.length > 1) {
    const selectedElement = document.querySelector('input[name="element-type"]:checked');
    if (!selectedElement) {
      // Highlight selection and show note
      selectionDiv.style.border = '2px solid #b71c1c';
      if (!warning) {
        warning = document.createElement('div');
        warning.id = 'element-warning';
        warning.style.color = '#b71c1c';
        warning.style.fontSize = '12px';
        warning.style.marginTop = '4px';
        warning.textContent = 'You must select an element.';
        selectionDiv.appendChild(warning);
      }
      return; // Stop applying until selection is made
    }
    selectedElementKey = Object.keys(elementTypes).find(key => elementTypes[key] === selectedElement.value);
  } else if (foundElements.length === 1) {
    // Auto-select single element
    selectedElementKey = foundElements[0];
  }

  // Reset warning and highlight if selection is valid
  if (warning) warning.remove();
  selectionDiv.style.border = '';

  // --- Apply attributes as before ---
  const mainStatInfo = getZdpsMainStatInfo();
  const mainAttrInput = document.getElementById('main-attr');
  const mainStatPctInput = document.getElementById('main-stat-pct');

  if (mainStatInfo && mainStatInfo.add !== null) {
    mainAttrInput.value = mainStatInfo.add;
    if (mainStatInfo.total !== null && mainStatInfo.add > 0) {
      const percent = (mainStatInfo.total / mainStatInfo.add - 1) * 100;
      if (mainStatPctInput) mainStatPctInput.value = Number.isFinite(percent) ? percent.toFixed(1) : '0';
    } else if (mainStatPctInput) {
      mainStatPctInput.value = '0';
    }
  } else {
    const str = parsedAttrs.AttrStrengthTotal || 0;
    const int = parsedAttrs.AttrIntelligenceTotal || 0;
    const dex = parsedAttrs.AttrDexterityTotal || 0;
    mainAttrInput.value = Math.max(str, int, dex);
    if (mainStatPctInput) mainStatPctInput.value = '0';
  }

  if (parsedAttrs.AttrLuckTotal !== undefined) document.getElementById('luck-stat').value = parsedAttrs.AttrLuckTotal;
  if (parsedAttrs.AttrCriTotal !== undefined) document.getElementById('crit-rate-stat').value = parsedAttrs.AttrCriTotal;
  if (parsedAttrs.AttrHasteTotal !== undefined) document.getElementById('haste-stat').value = parsedAttrs.AttrHasteTotal;
  if (parsedAttrs.AttrMasteryTotal !== undefined) document.getElementById('mastery-stat').value = parsedAttrs.AttrMasteryTotal;
  if (parsedAttrs.AttrVersatilityTotal !== undefined) document.getElementById('vers-dmg-pct').value = parsedAttrs.AttrVersatilityTotal;

  const refinedAtk = parsedAttrs.AttrRefineMattack ?? parsedAttrs.AttrRefineAttackTotal;
  if (refinedAtk !== undefined) document.getElementById('refined-atk').value = refinedAtk;

  let elementalAtk = 0;
  if (parsedAttrs.AttrElementAtkTotal !== undefined) {
    elementalAtk += parsedAttrs.AttrElementAtkTotal;
  }
  if (selectedElementKey && parsedAttrs[selectedElementKey] !== undefined) {
    elementalAtk += parsedAttrs[selectedElementKey];
  }
  if (parsedAttrs.AttrElementAtkTotal !== undefined || (selectedElementKey && parsedAttrs[selectedElementKey] !== undefined)) {
    document.getElementById('elemental-atk').value = elementalAtk;
  }

  finishLoad();
}
function finishLoad() {
  // Recalc and close modal
  calc();
  closeZdpsImportModal();
}

function showElementSelection(elements) {
  const selectionDiv = document.getElementById('element-selection');
  const optionsDiv = document.getElementById('element-options');
  optionsDiv.innerHTML = '';

  // Remove any previous warning
  let warning = document.getElementById('element-warning');
  if (warning) warning.remove();

  elements.forEach(element => {
    const label = document.createElement('label');
    label.style.cssText = 'display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--text); cursor: pointer;';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'element-type';
    radio.value = element;

    const text = document.createTextNode(element.charAt(0).toUpperCase() + element.slice(1));

    label.appendChild(radio);
    label.appendChild(text);
    optionsDiv.appendChild(label);
  });

  selectionDiv.style.display = 'block';
  selectionDiv.style.border = ''; // Reset highlight
}