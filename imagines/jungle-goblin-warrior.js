(function(){

  const J_G_W_PASSIVE_MAIN_STAT_PCT = [4, 5.2, 6.4, 7.6, 8.8, 10.0];
  const J_G_W_ACTIVE_MAIN_STAT_PCT = [10, 12, 14, 16, 18, 20];


  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'jungle-goblin-warrior') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    const passiveStatsEl = document.getElementById(`imagine-${slot}-passive-stats`);

    let passive = J_G_W_PASSIVE_MAIN_STAT_PCT ? J_G_W_PASSIVE_MAIN_STAT_PCT[level] : 0;

    const active = (mode === 'active') ? ((J_G_W_ACTIVE_MAIN_STAT_PCT && J_G_W_ACTIVE_MAIN_STAT_PCT[level]) || 0) : 0;

    const mainStatPct = passive + active;

    return { mainStatPct };
  }
  window.IMAGINES['jungle-goblin-warrior'] = { provideBonuses };
})();