(function(){

  // Predator Spider MATK% / ATK% boost per level (passive = 3 stacks, active = 6 stacks)
  const PREDATOR_SPIDER_PASSIVE_PER_STACK = [1.2, 1.56, 1.92, 2.28, 2.64, 3];
  const PREDATOR_SPIDER_ACTIVE_BONUS_PER_STACK    = [0.2, 0.24, 0.28, 0.32, 0.36, 0.4];
  const PREDATOR_SPIDER_ACTIVE_BONUS_CAP_PER_STACK  = [2.4, 2.88, 3.36, 3.84, 4.32, 4.8];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'predator-spider') return {};
    const level = state.level;

    const stats = state.stats || {};
    const hastePct = (stats.haste || 0) * 100;
    const masteryPct = (stats.mastery || 0) * 100;

    // Calculate stacks based on haste
    const stacks = Math.min(Math.floor(hastePct / 10 + 1), 7);

    let perStack = 0;

    // Every 5% mastery gives ACTIVE_BONUS_PER_STACK
    const masteryTier = Math.floor(masteryPct / 5);

    // Mastery bonus is capped at ACTIVE_BONUS_CAP_PER_STACK
    const masteryActiveBonus = Math.min(
      (PREDATOR_SPIDER_ACTIVE_BONUS_PER_STACK[level] || 0) * masteryTier,
      (PREDATOR_SPIDER_ACTIVE_BONUS_CAP_PER_STACK[level] || 0)
    );

    if (state.mode === 'active') {
      perStack = (PREDATOR_SPIDER_PASSIVE_PER_STACK[level] || 0) + masteryActiveBonus;
    } else {
      perStack = (PREDATOR_SPIDER_PASSIVE_PER_STACK[level] || 0);
    }

    const matkPct = perStack * stacks;

    return { matkPct };
  }
  function provideSkills(state) {
    if (state.imagine !== 'predator-spider') return [];
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
    const skillName = `Predator Spider (${level})`;
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
  window.IMAGINES['predator-spider'] = { displayName: 'Predator Spider', provideBonuses, provideSkills };
})();