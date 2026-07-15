(function(){

  // crab bonus arrays
  const WANDERING_VAGRANT_PASSIVE_LUCK_STAT = [8960, 11648, 14336, 17024, 19712, 22400];
  const WANDERING_VAGRANT_ACTIVE_LUCK_PCT = [10, 12, 14, 16, 18, 20];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'wandering-vagrant') return {};
    const level = state.level;

    const luckStat = WANDERING_VAGRANT_PASSIVE_LUCK_STAT && state.applyPassiveStats
        ? WANDERING_VAGRANT_PASSIVE_LUCK_STAT[level]
        : 0;

    const luckPct = state.mode === 'active'
        ? (WANDERING_VAGRANT_ACTIVE_LUCK_PCT?.[level] || 0)
        : 0;

    return { luckStat, luckPct };
  }

  function provideSkills(state) {
    if (state.imagine !== 'wandering-vagrant') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [1500, 1612.5, 1725, 2062.5, 2175, 2287.5];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Wandering Vagrant (${level})`;
    return [[
      'imagine',
      damageMultiplier,
      150,
      true,
      skillName,
      [
        ['damageType', 'physical'],
      ],
      hitsPerParse,
      0
    ]];
  }
  window.IMAGINES['wandering-vagrant'] = { displayName: 'Wandering Vagrant', provideBonuses, provideSkills };
})();