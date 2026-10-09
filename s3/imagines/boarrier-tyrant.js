(function(){

  // boar bonus arrays
  const BOARRIER_TYRANT_PASSIVE_SPECIAL_DMG_PCT = [6, 7.8, 9.6, 11.4, 13.2, 15];
  const BOARRIER_TYRANT_ACTIVE_SPECIAL_DMG_PCT = [16, 19.2, 22.4, 25.6, 28.8, 32];


  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'boarrier-tyrant') return {};
    const level = state.level;

    const passive = BOARRIER_TYRANT_PASSIVE_SPECIAL_DMG_PCT
        ? BOARRIER_TYRANT_PASSIVE_SPECIAL_DMG_PCT[level]
        : 0;

    const active = state.mode === 'active'
        ? (BOARRIER_TYRANT_ACTIVE_SPECIAL_DMG_PCT?.[level] || 0)
        : 0;

    const specialDmgPct = passive + active;

    return { specialDmgPct };
  }

  function provideSkills(state) {
    if (state.imagine !== 'boarrier-tyrant') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [750, 862.5, 975, 1087.5, 1200, 1312.5];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 2 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Boarrier Tyrant (${level}) (only hits 2x if boar stops on target)`;
    return [[
      'imagine',
      damageMultiplier,
      75,
      true,
      skillName,
      [
        ['damageType', 'physical'],
      ],
      hitsPerParse,
      0
    ]];
  }
  window.IMAGINES['boarrier-tyrant'] = { displayName: 'Boarrier Tyrant', provideBonuses, provideSkills };
})();