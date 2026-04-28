(function(){

  // CF bonus arrays
  const CELESTIAL_FLIER_PASSIVE_HASTE_STAT = [3584, 4636, 5688, 6740, 7792, 8960];
  const CELESTIAL_FLIER_ACTIVE_HASTE_PCT = [10, 12, 14, 16, 18, 20];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'celestial-flier') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    const passiveStatsEl = document.getElementById(`imagine-${slot}-passive-stats`);
    const applyPassiveStats = passiveStatsEl ? passiveStatsEl.checked : false;
    const hasteStat = CELESTIAL_FLIER_PASSIVE_HASTE_STAT ? CELESTIAL_FLIER_PASSIVE_HASTE_STAT[level] : 0;
    const hastePct = (mode === 'active') ? ((CELESTIAL_FLIER_ACTIVE_HASTE_PCT && CELESTIAL_FLIER_ACTIVE_HASTE_PCT[level]) || 0) : 0;
    const bonuses = {};
    if (applyPassiveStats) {
      bonuses.hasteStat = hasteStat;
    }
    if (mode === 'active') {
      bonuses.hastePct = hastePct;
    }
    return bonuses;
  }
  window.IMAGINES['celestial-flier'] = { provideBonuses };
})();