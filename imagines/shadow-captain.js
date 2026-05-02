(function(){

  // shadow captain bonus arrays
  const SHADOW_CAPTAIN_PASSIVE_EXPERTISE_DMG_PCT = [6, 7.8, 9.6, 11.4, 13.2, 15];
  const SHADOW_CAPTAIN_ACTIVE_EXPERTISE_DMG_PCT = [16, 19.2, 22.4, 25.6, 28.8, 32];


  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'shadow-captain') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    const passiveStatsEl = document.getElementById(`imagine-${slot}-passive-stats`);

    let passive = SHADOW_CAPTAIN_PASSIVE_EXPERTISE_DMG_PCT ? SHADOW_CAPTAIN_PASSIVE_EXPERTISE_DMG_PCT[level] : 0;

    const active = (mode === 'active') ? ((SHADOW_CAPTAIN_ACTIVE_EXPERTISE_DMG_PCT && SHADOW_CAPTAIN_ACTIVE_EXPERTISE_DMG_PCT[level]) || 0) : 0;

    const expertiseDmgPct = passive + active;

    return { expertiseDmgPct };
  }
  window.IMAGINES['shadow-captain'] = { provideBonuses };
})();