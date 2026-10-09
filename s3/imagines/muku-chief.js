(function(){

  // Muku Chief bonus arrays
  const MUKU_CHIEF_PASSIVE_CRIT_DMG_PCT = [10, 13, 16, 19, 22, 25];
  const MUKU_CHIEF_ACTIVE_CRIT_STAT = [5600, 6720, 7840, 8960, 10080, 11200];
  const MUKU_CHIEF_ACTIVE_CRIT_DMG = [30, 37, 44, 51, 58, 65];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'muku-chief') return {};
    const level = state.level;

    const critDmgPct =
      state.mode === 'passive'
        ? (MUKU_CHIEF_PASSIVE_CRIT_DMG_PCT?.[level] || 0)
        : (MUKU_CHIEF_ACTIVE_CRIT_DMG?.[level] || 0);

    const critStat =
      state.mode === 'active'
        ? (MUKU_CHIEF_ACTIVE_CRIT_STAT?.[level] || 0)
        : 0;

    return { critStat, critDmgPct };
  }
  function provideSkills(state) {
    if (state.imagine !== 'muku-chief') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    // averaged out, first hit is small, 2nd hit is much larger, but for this calc its just doing 2 hits with same dmg.
    const damageMultipliers = [500, 575, 650, 725, 800, 875];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 2 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Muku Chief (${level})`;
    return [[
      'imagine',
      damageMultiplier,
      50,
      true,
      skillName,
      [
        ['damageType', 'physical'],
      ],
      hitsPerParse,
      0
    ]];
  }
  window.IMAGINES['muku-chief'] = { displayName: 'Muku Chief', provideBonuses, provideSkills };
})();