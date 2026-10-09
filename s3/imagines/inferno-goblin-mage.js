(function(){

  const I_G_M_PASSIVE_MAIN_STAT_PCT = [4, 5.2, 6.4, 7.6, 8.8, 10.0];
  const I_G_M_ACTIVE_MAIN_STAT_PCT = [10, 12, 14, 16, 18, 20];


  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'inferno-goblin-mage') return {};

    const level = state.level;
    let mainStatPct = 0;
    
    if (getClassMainStatType() === 'int') {
      const passive = I_G_M_PASSIVE_MAIN_STAT_PCT
          ? I_G_M_PASSIVE_MAIN_STAT_PCT[level]
          : 0;

      const active = state.mode === 'active'
          ? (I_G_M_ACTIVE_MAIN_STAT_PCT?.[level] || 0)
          : 0;

      mainStatPct = passive + active;
    }

    return { mainStatPct };
  }
  function provideSkills(state) {
    if (state.imagine !== 'inferno-goblin-mage') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [525, 603.7, 682.5, 761.2, 840, 918.7];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Inferno Goblin Mage (${level})`;
    return [[
      'imagine',
      damageMultiplier,
      52,
      true,
      skillName,
      [
        ['damageType', 'magical'],
      ],
      hitsPerParse,
      0
    ]];
  }

  window.IMAGINES['inferno-goblin-mage'] = { displayName: 'Inferno Goblin Mage', provideBonuses, provideSkills };
})();