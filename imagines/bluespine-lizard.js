(function(){

  // lizard bonus arrays
  const BLUESPINE_LIZARD_PASSIVE_VERSATILITY_STAT = [5040, 6552, 8064, 9576, 11088, 12600];
  const BLUESPINE_LIZARD_ACTIVE_VERSATILITY_PCT = [6.5, 7.8, 9.1, 10.4, 11.7, 13];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'bluespine-lizard') return {};
    const level = state.level;

    const versatilityStat = BLUESPINE_LIZARD_PASSIVE_VERSATILITY_STAT && state.applyPassiveStats
        ? BLUESPINE_LIZARD_PASSIVE_VERSATILITY_STAT[level]
        : 0;

    const versatilityPct = state.mode === 'active'
        ? (BLUESPINE_LIZARD_ACTIVE_VERSATILITY_PCT?.[level] || 0)
        : 0;

    return { versatilityStat, versatilityPct };
  }

  function provideSkills(state) {
    if (state.imagine !== 'bluespine-lizard') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [125, 143.7, 162.5, 181.27, 200, 218.7];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 6 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Bluespine Lizard (${level})`;
    return [[
      'imagine',
      damageMultiplier,
      12,
      true,
      skillName,
      [
        ['damageType', 'physical'],
      ],
      hitsPerParse,
      0
    ]];
  }
  window.IMAGINES['bluespine-lizard'] = { displayname: 'Bluespine Lizard', provideBonuses, provideSkills };
})();