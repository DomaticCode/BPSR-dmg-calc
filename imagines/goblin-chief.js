(function(){

  // goblin chief bonus arrays
  const GOBLIN_CHIEF_PASSIVE_EXPERTISE_DMG_PCT = [9, 11.7, 14.4, 17.1, 19.8, 22.5];
  const GOBLIN_CHIEF_ACTIVE_EXPERTISE_DMG_PCT = [22, 26.4, 30.8, 35.2, 39.6, 44];


  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'goblin-chief') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    const passiveStatsEl = document.getElementById(`imagine-${slot}-passive-stats`);

    let passive = GOBLIN_CHIEF_PASSIVE_EXPERTISE_DMG_PCT ? GOBLIN_CHIEF_PASSIVE_EXPERTISE_DMG_PCT[level] : 0;

    const active = (mode === 'active') ? ((GOBLIN_CHIEF_ACTIVE_EXPERTISE_DMG_PCT && GOBLIN_CHIEF_ACTIVE_EXPERTISE_DMG_PCT[level]) || 0) : 0;

    const expertiseDmgPct = passive + active;

    return { expertiseDmgPct };
  }
  window.IMAGINES['goblin-chief'] = { provideBonuses };
})();