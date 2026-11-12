(function(){

  // EBA bonus arrays
  const EROSION_BLOOM_PASSIVE_MASTERY_PCT = [0.4, 0.52, 0.64, 0.76, 0.88, 1.0];
  const EROSION_BLOOM_PASSIVE_MASTERY_PCT_CAP = [6, 7.8, 9.6, 11.4, 13.2, 15];
  const EROSION_BLOOM_ACTIVE_ALL_ELEMENT_PCT = [0.6, 0.72, 0.84, 0.96, 1.08, 1.2];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'erosion-bloom-afterimage') return {};
    const level = state.level;

    const masteryStat = Math.max(0, state.stats?.masteryStat || 0);
    const passiveMasteryPctPer10k = EROSION_BLOOM_PASSIVE_MASTERY_PCT[level] || 0;
    const passiveMasteryPctCap = EROSION_BLOOM_PASSIVE_MASTERY_PCT_CAP[level] || 0;
    const masteryPct = Math.min(
      Math.floor(masteryStat / 10000) * passiveMasteryPctPer10k,
      passiveMasteryPctCap
    );

    const effectiveAtk = state.stats?.effectiveAtk;
    const finalMasteryPct = Math.max(0, state.stats?.mastery || 0);
    const activeAllElementPctPer5Mastery = EROSION_BLOOM_ACTIVE_ALL_ELEMENT_PCT[level] || 0;
    const allElementATK = state.mode === 'active' && Number.isFinite(effectiveAtk)
      ? Math.floor(Math.floor(finalMasteryPct / 0.05) * (activeAllElementPctPer5Mastery / 100) * effectiveAtk)
      : 0;
    let classSkillDmg = 0;
    if (finalMasteryPct > 0.9) {
      classSkillDmg += 30;
    }

    return { masteryPct, allElementATK, classSkillDmg };
  }

  function provideSkills(state) {
    if (state.imagine !== 'erosion-bloom-afterimage') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    // probably not a 1 hit skill
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
    const skillName = `Erosion Bloom Afterimage (${level}) (approximation)`;
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

  window.IMAGINES['erosion-bloom-afterimage'] = { 
    displayName: 'Erosion Bloom Afterimage',
    aliases: ['mastery', 'erosion', 'bloom', 'robot'],
    provideBonuses,
    provideSkills 
    };
})();