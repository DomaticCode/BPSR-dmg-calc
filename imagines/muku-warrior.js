(function(){

  // Muku warrior bonus arrays
  const MUKU_WARRIOR_ACTIVE_CRIT_STAT = [1792, 2150, 2508, 2867, 3225, 3584];
  const MUKU_WARRIOR_ACTIVE_CRIT_DMG = [8, 9.6, 11.2, 12.8, 14.4, 16];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'muku-warrior') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    const critStat = (mode === 'active') ? ((MUKU_WARRIOR_ACTIVE_CRIT_STAT && MUKU_WARRIOR_ACTIVE_CRIT_STAT[level]) || 0) : 0;
    const critDmgPct = mode === 'active' ? (MUKU_WARRIOR_ACTIVE_CRIT_DMG && MUKU_WARRIOR_ACTIVE_CRIT_DMG[level] || 0) : 0;
    return { critStat, critDmgPct };
  }
  window.IMAGINES['muku-warrior'] = { provideBonuses };
})();