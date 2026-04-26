(function(){

  // Muku Chief bonus arrays
  const MUKU_CHIEF_PASSIVE_CRIT_DMG = [0.10, 0.13, 0.16, 0.19, 0.22, 0.25];
  const MUKU_CHIEF_ACTIVE_CRIT_STAT = [2040, 2688, 3136, 3584, 4032, 4480];
  const MUKU_CHIEF_ACTIVE_CRIT_DMG = [0.30, 0.37, 0.44, 0.51, 0.58, 0.65];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'muku-chief') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    const critDmg = mode === 'passive'
      ? (MUKU_CHIEF_PASSIVE_CRIT_DMG && MUKU_CHIEF_PASSIVE_CRIT_DMG[level]) || 0
      : (MUKU_CHIEF_ACTIVE_CRIT_DMG && MUKU_CHIEF_ACTIVE_CRIT_DMG[level]) || 0;
    const critStat = (mode === 'active') ? ((MUKU_CHIEF_ACTIVE_CRIT_STAT && MUKU_CHIEF_ACTIVE_CRIT_STAT[level]) || 0) : 0;
    return { critDmg, critStat };
  }
  window.IMAGINES['muku-chief'] = { provideBonuses };
})();