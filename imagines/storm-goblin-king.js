(function(){

  // NOTE: unknown if the luck effect bonus is flat, or if it is luck effect * 1.xx, Smite weapon is just flat 15% but worded differently (Lucky Strike DMG % vs Luck Effect Bonus)
  // sgk bonus arrays
  const STORM_GOBLIN_KING_ACTIVE_LUCK_STAT = [5600, 6720, 7840, 8960, 10080, 11200];
  const STORM_GOBLIN_KING_ACTIVE_LUCK_EFFECT_PCT = [16, 19.2, 22.4, 25.6, 28.8, 32];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'storm-goblin-king') return {};
    const level = state.level;

    const luckStat = state.mode === 'active'
        ? (STORM_GOBLIN_KING_ACTIVE_LUCK_STAT?.[level] || 0)
        : 0;

    const luckEffectPct = state.mode === 'active'
        ? (STORM_GOBLIN_KING_ACTIVE_LUCK_EFFECT_PCT?.[level] || 0)
        : 0;

    return { luckStat, luckEffectPct };
  }
  function provideSkills(state) {
    if (state.imagine !== 'storm-goblin-king') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [210, 241.4, 273, 304.5, 336, 367.5];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 125 : 150;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }
    const passiveDamageMultipliers = [22.4, 29.12, 35.84, 42.56, 49.28, 56];
    const passiveDamageMultiplier = passiveDamageMultipliers[level] || passiveDamageMultipliers[0];

    const hitsPerParse = 5 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Storm Goblin King (${level})`;
    const procSkillName = `Storm Goblin King (${level}) passive proc (assuming 33% of lucky hits per parse)`;

    // Fetching lucky hit count
    const parentRow = document.querySelector('.breakdown-row[data-item-id="lucky-hit"]');
    const firstChild = parentRow.querySelector('div'); // Grabs the first child div
    const match = firstChild.textContent.match(/\(([^)]+)\)/);
    const luckyHitsCount = match ? parseInt(match[1], 10) : null;

    const passiveHitsPerParse = Math.round(luckyHitsCount * 0.33);
    const skills = [
      [
        'imagine',
        damageMultiplier,
        21,
        true,
        skillName,
        [
          ['damageType', 'magical'],
        ],
        hitsPerParse,
        0
      ],
      [
        'imagine(passive)',
        passiveDamageMultiplier,
        0,
        false,
        procSkillName,
        [
          ['damageType', 'magical'],
          ['generic', ' luck-effect'],
        ],
        passiveHitsPerParse,
        0
      ]
    ];

    const t5LuckPassiveHitsPerParse = 66 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const brigandPassiveHitsPerParse = 70 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));

    if (level === 5) {
      skills.push(
        [
          'imagine',
          28,
          0,
          false,
          'Goblin Warrior T5 passive (SGK proc), assuming 66 hits per SGK cast',
          [
            ['damageType', 'physical'],
            ['generic', ' luck-effect'],
          ],
          t5LuckPassiveHitsPerParse,
          0
        ],
        [
          'imagine',
          28,
          0,
          false,
          'Void Bzzar T5 passive (SGK proc), assuming 66 hits per SGK cast',
          [
            ['damageType', 'physical'],
            ['generic', ' luck-effect'],
          ],
          t5LuckPassiveHitsPerParse,
          0
        ],
        [
          'imagine',
          28,
          0,
          false,
          'LizardMan Hunter T5 passive (SGK proc), assuming 66 hits per SGK cast',
          [
            ['damageType', 'magical'],
            ['generic', ' luck-effect'],
          ],
          t5LuckPassiveHitsPerParse,
          0
        ],
        [
          'imagine',
          29.1,
          0,
          false,
          'Brigand Leader T0 passive (SGK proc), (extra hits added to simulate dots expiring damage) For other tiers: [29.1, 37.83, 46.56, 55.29, 64.02, 72.75]',
          [
            ['damageType', 'physical'],
            ['generic', ' luck-effect'],
          ],
          brigandPassiveHitsPerParse,
          0
        ]
      );
    }

    return skills;
  }
  window.IMAGINES['storm-goblin-king'] = { displayName: 'Storm Goblin King', provideBonuses, provideSkills };
})();