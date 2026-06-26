(function(){

  const J_G_W_PASSIVE_MAIN_STAT_PCT = [4, 5.2, 6.4, 7.6, 8.8, 10.0];
  const J_G_W_ACTIVE_MAIN_STAT_PCT = [10, 12, 14, 16, 18, 20];


  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'jungle-goblin-warrior') return {};

    const level = state.level;
    let mainStatPct = 0;
    if (getClassMainStatType() === 'str') {
      const passive = J_G_W_PASSIVE_MAIN_STAT_PCT
          ? J_G_W_PASSIVE_MAIN_STAT_PCT[level]
          : 0;

      const active = state.mode === 'active'
          ? (J_G_W_ACTIVE_MAIN_STAT_PCT?.[level] || 0)
          : 0;

      mainStatPct = passive + active;
    }

    return { mainStatPct };
  }
  function provideSkills(state) {
    if (state.imagine !== 'jungle-goblin-warrior') return [];
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

    const hitsPerParse = Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Jungle Goblin Warrior (${level})`;
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
  window.IMAGINES['jungle-goblin-warrior'] = { displayName: 'Jungle Goblin Warrior', provideBonuses, provideSkills };
})();