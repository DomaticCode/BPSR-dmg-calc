(function(){

  // Flamehorn lucky strike DMG boost by level
  const FLAMEHORN_BOOST = [8, 10.4, 12.8, 15.2, 17.6, 20];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'flamehorn') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const boost = (FLAMEHORN_BOOST && FLAMEHORN_BOOST[level]) || 0;
    return { flamehornBoost: boost };
  }
  window.IMAGINES['flamehorn'] = { provideBonuses };
})();