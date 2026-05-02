(function(){

  // Only passive versatility implemented.
  const GOBLIN_KING_PASSIVE_VERSATILITY_STAT = [3584, 4636, 5688, 6740, 7792, 8960];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'goblin-king') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const passiveStatsEl = document.getElementById(`imagine-${slot}-passive-stats`);
    const applyPassiveStats = passiveStatsEl ? passiveStatsEl.checked : false;
    let versatilityStat = 0;
    if (applyPassiveStats){
      versatilityStat = GOBLIN_KING_PASSIVE_VERSATILITY_STAT ? GOBLIN_KING_PASSIVE_VERSATILITY_STAT[level] : 0;
    }

    return { versatilityStat };
  }
  window.IMAGINES['goblin-king'] = { provideBonuses };
})();