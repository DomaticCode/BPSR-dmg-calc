(function(){

  // Muku Chief bonus arrays
  const MUKU_CHIEF_PASSIVE_CRIT_DMG_PCT = [10, 13, 16, 19, 22, 25];
  const MUKU_CHIEF_ACTIVE_CRIT_STAT = [2040, 2688, 3136, 3584, 4032, 4480];
  const MUKU_CHIEF_ACTIVE_CRIT_DMG = [30, 37, 44, 51, 58, 65];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'muku-chief') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    const critDmgPct = mode === 'passive'
      ? (MUKU_CHIEF_PASSIVE_CRIT_DMG_PCT && MUKU_CHIEF_PASSIVE_CRIT_DMG_PCT[level]) || 0
      : (MUKU_CHIEF_ACTIVE_CRIT_DMG && MUKU_CHIEF_ACTIVE_CRIT_DMG[level]) || 0;
    const critStat = (mode === 'active') ? ((MUKU_CHIEF_ACTIVE_CRIT_STAT && MUKU_CHIEF_ACTIVE_CRIT_STAT[level]) || 0) : 0;
    return { critDmgPct, critStat };
  }
  window.IMAGINES['muku-chief'] = { provideBonuses };
})();