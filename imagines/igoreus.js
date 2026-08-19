/*
  Notes for Igor:
  Active: Crit rate PAST 60% gives 1 % -> 0.4% crit damage, up to 24% (t5) Thus needs 120% crit to cap.
    Also gives flat crit % and crit stat.


  Passive: 14% flat + 4.2% up to 5 stacks

*/


(function(){

  // Main stat passive, active damage boost is for 20 seconds (cannot be extended), and stacks are a bonus on top of active damage boost
  // Increasing every 10 hits up to 5 stacks, at max stacks its extended up to 5 times for 3 seconds each. 
  // In a basic test it lasted ~38 seconds total. (probably depends on how fast you hit to get a lot of stacks).
  const IGOR_PASSIVE_CRIT_DMG_PER_LEVEL = [5.6, 7.28, 8.96, 10.64, 12.32, 14.0];
  const IGOR_PASSIVE_CRIT_DMG_BONUS_PER_STACK = [1.66, 2.16, 2.67, 3.18, 3.69, 4.2];
  const IGOR_ACTIVE_CRIT_PCT_PER_LEVEL = [6.0, 7.2, 8.4, 9.6, 10.8, 12];
  const IGOR_ACTIVE_CRIT_STAT_PER_LEVEL = [7000, 8400, 9800, 11200, 12600, 14000];
  const IGOR_CRIT_DMG_CONVERSION_PCT = [20, 24, 28, 32, 36, 40];
  const IGOR_CRIT_DMG_CONVERSION_LIMIT = [12, 14.4, 16.8, 19.2, 21.6, 24];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.level > 5 || state.level < 0) return;

    let critStat = 0, critPct = 0, critDmgPct = 0;
    if(state.mode === 'active'){
      // Raw crit stat and crit %
      critStat = (IGOR_ACTIVE_CRIT_STAT_PER_LEVEL && IGOR_ACTIVE_CRIT_STAT_PER_LEVEL[state.level] ? IGOR_ACTIVE_CRIT_STAT_PER_LEVEL[state.level] : 0) || 0;
      critPct = (IGOR_ACTIVE_CRIT_PCT_PER_LEVEL && IGOR_ACTIVE_CRIT_PCT_PER_LEVEL[state.level] ? IGOR_ACTIVE_CRIT_PCT_PER_LEVEL[state.level] : 0) || 0;

      // Crit over 60 % -> Crit DMG conversion
      const stats = state.stats || {};
      const statsCrit = (stats.crit || 0) * 100;
      const critOver60 = Math.min(statsCrit - 60); // AFAIK, crit can go beyond 100% (cannot double crit, but basically % still matters, I know it works like this for luck)
      if(critOver60 > 0){
        critDmgConversion = critOver60 * (IGOR_CRIT_DMG_CONVERSION_PCT[state.level] / 100);
        critDmgPct += Math.min(critDmgConversion, IGOR_CRIT_DMG_CONVERSION_LIMIT[state.level]);
      }
    }

    // Passives
    const passiveCritDmg = (IGOR_PASSIVE_CRIT_DMG_PER_LEVEL && IGOR_PASSIVE_CRIT_DMG_PER_LEVEL[state.level] ? IGOR_PASSIVE_CRIT_DMG_PER_LEVEL[state.level] : 0) || 0;
    const passiveStacksCritDmg = Math.min(state.stacks, 5) * (IGOR_PASSIVE_CRIT_DMG_BONUS_PER_STACK && IGOR_PASSIVE_CRIT_DMG_BONUS_PER_STACK[state.level] ? IGOR_PASSIVE_CRIT_DMG_BONUS_PER_STACK[state.level] : 0) || 0;
    critDmgPct += passiveCritDmg + passiveStacksCritDmg;

    return {
      critStat,
      critPct,
      critDmgPct
    };
  }
  function provideSkills(state) {
    if (state.imagine !== 'igoreus') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [1500, 1725, 1950, 2175, 2400, 2625];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 1 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Igoreus (${level})`;
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
  window.IMAGINES['igoreus'] = { displayName: 'Igoreus', provideBonuses, provideSkills };
})();