(function(){

  // WB bonus arrays
  const WITHERED_BLOOMSHARD_PASSIVE_HASTE_PCT = [0.4, 0.52, 0.64, 0.76, 0.88, 1.0];
  const WITHERED_BLOOMSHARD_PASSIVE_HASTE_PCT_CAP = [6, 7.8, 9.6, 11.4, 13.2, 15];
  const WITHERED_BLOOMSHARD_ACTIVE_ALL_ELEMENT_PCT = [0.6, 0.72, 0.84, 0.96, 1.08, 1.2];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'withered-bloomshard') return {};
    const level = state.level;

    const hasteStat = Math.max(0, state.stats?.hasteStat || 0);
    const passiveHastePctPer10k = WITHERED_BLOOMSHARD_PASSIVE_HASTE_PCT[level] || 0;
    const passiveHastePctCap = WITHERED_BLOOMSHARD_PASSIVE_HASTE_PCT_CAP[level] || 0;
    const hastePct = Math.min(
      Math.floor(hasteStat / 10000) * passiveHastePctPer10k,
      passiveHastePctCap
    );

    const effectiveAtk = state.stats?.effectiveAtk;
    const finalHastePct = Math.max(0, state.stats?.haste || 0);
    const activeAllElementPctPer5Haste = WITHERED_BLOOMSHARD_ACTIVE_ALL_ELEMENT_PCT[level] || 0;
    const allElementATK = state.mode === 'active' && Number.isFinite(effectiveAtk)
      ? Math.floor(Math.floor(finalHastePct / 0.05) * (activeAllElementPctPer5Haste / 100) * effectiveAtk)
      : 0;

    return { hastePct, allElementATK };
  }

  function provideSkills(state) {
    if (state.imagine !== 'withered-bloomshard') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    // probably not a 1 hit skill
    const damageMultipliers = [299.6, 344.5, 389.48, 434.42, 479.36, 524.3];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 5 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Withered Bloomshard (${level}) (approximation)`;
    return [[
      'imagine',
      damageMultiplier,
      29.8,
      true,
      skillName,
      [
        ['damageType', 'physical'],
      ],
      hitsPerParse,
      0
    ]];
  }

  window.IMAGINES['withered-bloomshard'] = { 
    displayName: 'Withered Bloomshard',
    aliases: ['haste', 'withered', 'bloomshard', 'golem'],
    provideBonuses,
    provideSkills 
    };
})();