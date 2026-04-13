function createBaseMainStatModal() {
  if (document.getElementById('base-main-stat-modal')) return;

  const modal = document.createElement('div');
  let overlayMouseDown = false;
  modal.id = 'base-main-stat-modal';
  modal.className = 'modal-overlay';
  modal.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;align-items:center;justify-content:center;background:rgba(0,0,0,0.65);padding:24px;';
  modal.innerHTML = `
    <div class="modal-content" onclick="event.stopPropagation()" style="width:100%;max-width:540px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,0.25);">
      <div class="modal-header" style="display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--border);background:var(--bg-input);">
        <h2 style="margin:0;font-size:18px;">Base Main Stat Calculator</h2>
        <button class="modal-close" onclick="closeBaseMainStatModal()" style="border:none;background:none;font-size:24px;line-height:1;color:var(--text);cursor:pointer;">&times;</button>
      </div>
      <div class="modal-body" style="padding:18px;display:grid;gap:14px;">
        <div style="font-size:13px;color:var(--text-secondary);">Enter your sheet main stat and the percentage bonuses applied to it. The calculator will reverse the % bonuses to get the base main stat. It will also distribute the main stat % bonuses to the appropriate fields on clicking OK.</div>
        <div class="field" style="display:grid;gap:6px;">
          <label>Sheet main stat <span class="tip" style="font-size:11px;cursor:help;">(Your total main stat on the character sheet)</span></label>
          <input id="sheet-main-stat" type="number" min="0" placeholder="0" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:6px;background:var(--bg-input);color:var(--text);" oninput="updateBaseMainStatPreview()">
        </div>
        <div class="field" style="display:grid;gap:6px;">
          <label>Main stat factor % <span class="tip" style="font-size:11px;cursor:help;">(Any base main stat scaling factor applied before bonuses)</span></label>
          <input id="main-stat-factor-pct" type="number" placeholder="2" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:6px;background:var(--bg-input);color:var(--text);" oninput="updateBaseMainStatPreview()">
        </div>
        <div class="field" style="display:grid;gap:6px;">
          <label>Imagines bonus % <span class="tip" style="font-size:11px;cursor:help;">(Total percentage bonus from Imagines)</span></label>
          <input id="imagines-bonus-pct" type="number" placeholder="0" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:6px;background:var(--bg-input);color:var(--text);" oninput="updateBaseMainStatPreview()">
        </div>
        <div class="field" style="display:grid;gap:6px;">
          <label>Purple line sum % <span class="tip" style="font-size:11px;cursor:help;">(Combined percent bonus from purple gear lines)</span></label>
          <input id="purple-line-sum-pct" type="number" placeholder="0" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:6px;background:var(--bg-input);color:var(--text);" oninput="updateBaseMainStatPreview()">
        </div>
        <div style="padding:12px 14px;border:1px dashed var(--border);border-radius:10px;background:rgba(255,255,255,0.04);">
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">Calculated base main stat</div>
          <div id="calculated-base-main-stat" style="font-size:24px;font-weight:700;color:var(--text);">—</div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;">
          <button class="btn-add-skill" type="button" onclick="applyBaseMainStatFromModal()" style="padding:10px 18px;min-width:100px;">OK</button>
          <button class="btn-add-skill" type="button" onclick="closeBaseMainStatModal()" style="padding:10px 18px;min-width:100px;">Cancel</button>
        </div>
      </div>
    </div>
  `;

  modal.addEventListener('mousedown', event => {
    overlayMouseDown = event.target === modal;
  });

  modal.addEventListener('click', event => {
    if (overlayMouseDown && event.target === modal) closeBaseMainStatModal();
    overlayMouseDown = false;
  });
  document.body.appendChild(modal);
}

function openBaseMainStatModal() {
  const modal = document.getElementById('base-main-stat-modal');
  if (!modal) return;

  const sheetInput = document.getElementById('sheet-main-stat');
  const factorInput = document.getElementById('main-stat-factor-pct');
  const imaginesInput = document.getElementById('imagines-bonus-pct');
  const purpleInput = document.getElementById('purple-line-sum-pct');

  const currentBase = parseFloat(document.getElementById('main-attr')?.value) || 0;
  sheetInput.value = currentBase;
  factorInput.value = '';
  imaginesInput.value = '';
  purpleInput.value = '';

  updateBaseMainStatPreview();
  modal.style.display = 'flex';
}

function closeBaseMainStatModal() {
  const modal = document.getElementById('base-main-stat-modal');
  if (!modal) return;
  modal.style.display = 'none';
}

function updateBaseMainStatPreview() {
  const sheetValue = parseFloat(document.getElementById('sheet-main-stat')?.value);
  const factorValue = parseFloat(document.getElementById('main-stat-factor-pct')?.value);
  const imaginesValue = parseFloat(document.getElementById('imagines-bonus-pct')?.value);
  const purpleValue = parseFloat(document.getElementById('purple-line-sum-pct')?.value);

  const sheetMainStat = Number.isFinite(sheetValue) ? sheetValue : 0;
  const totalPercent = (Number.isFinite(factorValue) ? factorValue : 0)
    + (Number.isFinite(imaginesValue) ? imaginesValue : 0)
    + (Number.isFinite(purpleValue) ? purpleValue : 0);

  const resultEl = document.getElementById('calculated-base-main-stat');
  if (!resultEl) return;

  if (!Number.isFinite(sheetMainStat) || !Number.isFinite(totalPercent)) {
    resultEl.textContent = '—';
    return;
  }

  if (totalPercent <= -100) {
    resultEl.textContent = 'Invalid %';
    return;
  }

  const rawBaseValue = totalPercent === 0
    ? sheetMainStat
    : sheetMainStat / (1 + totalPercent / 100);
  const baseValue = Math.ceil(rawBaseValue);

  resultEl.textContent = Number.isFinite(baseValue)
    ? baseValue.toString()
    : '—';
}

function applyBaseMainStatFromModal() {
  const resultText = document.getElementById('calculated-base-main-stat')?.textContent;
  if (!resultText || resultText === '—' || resultText === 'Invalid %') {
    closeBaseMainStatModal();
    return;
  }

  const baseValue = parseFloat(resultText);
  if (!Number.isFinite(baseValue)) {
    closeBaseMainStatModal();
    return;
  }

  const factorValue = parseFloat(document.getElementById('main-stat-factor-pct')?.value);
  const imaginesValue = parseFloat(document.getElementById('imagines-bonus-pct')?.value);
  const purpleValue = parseFloat(document.getElementById('purple-line-sum-pct')?.value);
  const totalPercent = (Number.isFinite(factorValue) ? factorValue : 0)
    + (Number.isFinite(imaginesValue) ? imaginesValue : 0)
    + (Number.isFinite(purpleValue) ? purpleValue : 0);

  const mainAttrInput = document.getElementById('main-attr');
  if (mainAttrInput) {
    mainAttrInput.value = baseValue;
  }

  const mainStatPctInput = document.getElementById('main-stat-pct');
  if (mainStatPctInput) {
    mainStatPctInput.value = totalPercent;
  }

  closeBaseMainStatModal();
  if (typeof recalc === 'function') recalc();
}

if (document.readyState !== 'loading') {
  createBaseMainStatModal();
} else {
  document.addEventListener('DOMContentLoaded', createBaseMainStatModal);
}
