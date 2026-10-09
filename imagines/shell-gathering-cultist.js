(function(){

  // bonus arrays
  const SHELL_PICKING_ACOLYTE_PASSIVE_CRIT_STAT = [35840, 46592, 57344, 68096, 78848, 89600];
  const SHELL_PICKING_ACOLYTE_ACTIVE_CRIT_PCT = [10, 12, 14, 16, 18, 20];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'shell-gathering-cultist') return {};
    const level = state.level;

    const critStat = SHELL_PICKING_ACOLYTE_PASSIVE_CRIT_STAT && state.applyPassiveStats
        ? SHELL_PICKING_ACOLYTE_PASSIVE_CRIT_STAT[level]
        : 0;

    const critPct = state.mode === 'active'
        ? (SHELL_PICKING_ACOLYTE_ACTIVE_CRIT_PCT?.[level] || 0)
        : 0;

    return { critStat, critPct };
  }

  function provideSkills(state) {
    if (state.imagine !== 'shell-gathering-cultist') return [];
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

    const hitsPerParse = 2 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Shell-Picking Acolyte (${level})`;
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
  window.IMAGINES['shell-gathering-cultist'] = { displayName: 'Shell-Gathering Cultist', provideBonuses, provideSkills };
})();