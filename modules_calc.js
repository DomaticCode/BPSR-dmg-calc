// Module calculation utilities
(function(){
  function computeModuleBonusesFromDOM() {

    //TODO rewrite to use same pct structure as imagines/psychoscope (10.00 = 10% instead of 0.10)
    // Initialize module-related outputs (match names used in damage-calc.html)
    let moduleBonusCrit = 0, moduleBonusLuck = 0, moduleBonusMastery = 0, moduleBonusVers = 0, moduleBonusHaste = 0;
    let moduleAtkBonus = 0, moduleMatkBonus = 0, moduleAllAtkBonus = 0, moduleEliteDmgBonus = 0;
    let moduleMagicDmgBonus = 0, modulePhysicalDmgBonus = 0, moduleAllDmgBonus = 0, moduleCritDmgBonus = 0;
    let moduleLuckyStrikeBonus = 0, moduleSpecialAttackElemBonus = 0, autoTeamLuckCritOption = null;
    let moduleElementalAtkBonus = 0, moduleElementalDmgStatBonus = 0;
    let moduleIntellectBonus = 0, moduleAgilityBonus = 0, moduleStrengthBonus = 0, moduleAllMainStatBonus = 0;
    let moduleAtkBreakdown = [], moduleMatkBreakdown = [];
    let moduleCastSpeedBonus = 0, moduleAttackSpdLevel = 0, strengthBoostLevel = 0;

    // Compute temporary substat values to determine highest for life-wave logic
    const baseCritStat = (window.getVal ? window.getVal('crit-rate-stat') : 0) || 0;
    let extraCritStat = 0;
    if (typeof window.getImagineBonuses === 'function') {
      extraCritStat = (window.getImagineBonuses().critStat) || 0;
    }
    const critStat = baseCritStat + extraCritStat;
    const STAT_SCALER = 19975;
    const critRatePct = (critStat > 0 ? critStat / (critStat + STAT_SCALER) : 0) + ((window.getVal ? window.getVal('base-crit-pct') : 0) / 100) + ((window.getVal ? window.getVal('inspiration') : 0) / 100);
    const versStat = (window.getVal ? window.getVal('vers-dmg-pct') : 0) || 0;
    const versPct = (versStat > 0 ? versStat / (versStat + 11206) : 0) + ((window.getVal ? window.getVal('base-vers-pct') : 0) / 100) + ((window.getVal ? window.getVal('inspiration') : 0) / 100);
    const luckStat = (window.getVal ? window.getVal('luck-stat') : 0) || 0;
    const luckChancePct = (luckStat > 0 ? luckStat / (luckStat + STAT_SCALER) : 0) + ((window.getVal ? window.getVal('base-luck-pct') : 0) / 100) + ((window.getVal ? window.getVal('inspiration') : 0) / 100);
    const masteryStat = (window.getVal ? window.getVal('mastery-stat') : 0) || 0;
    const masteryPct = (masteryStat > 0 ? masteryStat / (masteryStat + STAT_SCALER) : 0) + ((window.getVal ? window.getVal('base-mastery-pct') : 0) / 100) + ((window.getVal ? window.getVal('inspiration') : 0) / 100);
    const hasteStat = (window.getVal ? window.getVal('haste-stat') : 0) || 0;
    const hastePct = (hasteStat > 0 ? hasteStat / (hasteStat + STAT_SCALER) : 0) + ((window.getVal ? window.getVal('base-haste-pct') : 0) / 100) + ((window.getVal ? window.getVal('inspiration') : 0) / 100);

    const substats = [
      { key: 'crit', val: critRatePct },
      { key: 'luck', val: luckChancePct },
      { key: 'mastery', val: masteryPct },
      { key: 'vers', val: versPct },
      { key: 'haste', val: hastePct },
    ];

    document.querySelectorAll('.module-card').forEach(card => {
      const id = card.id.replace('module-card-', '');
      const moduleType = card.dataset.selectedModule || '';
      const moduleLevel = parseInt(document.getElementById(`module-level-${id}`)?.value) || 0;

      if (moduleType === 'life-wave') {
        const allMainStatBonuses = [0, 0, 0, 20, 40, 60, 80];
        moduleAllMainStatBonus += allMainStatBonuses[moduleLevel] || 0;
        if (moduleLevel >= 5) {
          const bonus = moduleLevel === 5 ? 0.06 : 0.10;
          const highest = substats.reduce((a, b) => a.val >= b.val ? a : b);
          if (highest.key === 'crit')    moduleBonusCrit    += bonus;
          if (highest.key === 'luck')    moduleBonusLuck    += bonus;
          if (highest.key === 'mastery') moduleBonusMastery += bonus;
          if (highest.key === 'vers')    moduleBonusVers    += bonus;
          if (highest.key === 'haste')   moduleBonusHaste   += bonus;
        }
      }

      if (moduleType === 'cast-focus' && moduleLevel > 0) {
        const atkBonuses = [0, 5, 10, 20, 30, 40, 50];
        const bonus = atkBonuses[moduleLevel] || 0;
        moduleAllAtkBonus += bonus;
        moduleAtkBreakdown.push(`Cast Focus +${bonus}`);
        const castSpeedBonuses = [0, 0, 0, 0, 0, 7.2, 12];
        moduleCastSpeedBonus += castSpeedBonuses[moduleLevel] || 0;
      }

      if (moduleType === 'intellect-boost' && moduleLevel > 0) {
        const matkBonuses = [0, 5, 10, 15, 20, 25, 30];
        const bonus = matkBonuses[moduleLevel] || 0;
        moduleMatkBonus += bonus;
        moduleMatkBreakdown.push(`Intellect Boost +${bonus}`);
        const intellectBonuses = [0, 0, 0, 10, 20, 30, 40];
        moduleIntellectBonus += intellectBonuses[moduleLevel] || 0;
        const magicDmgBonuses = [0, 0, 0, 0, 0, 3.6, 6];
        moduleMagicDmgBonus += magicDmgBonuses[moduleLevel] || 0;
      }

      if (moduleType === 'elite-strike' && moduleLevel > 0) {
        const allAtkBonuses = [0, 5, 10, 15, 20, 25, 30];
        const bonus = allAtkBonuses[moduleLevel] || 0;
        moduleAllAtkBonus += bonus;
        moduleAtkBreakdown.push(`Elite Strike +${bonus}`);
        const allMainStatBonuses = [0, 0, 0, 10, 20, 30, 40];
        moduleAllMainStatBonus += allMainStatBonuses[moduleLevel] || 0;
        const eliteDmgBonuses = [0, 0, 0, 0, 0, 3.9, 6.6];
        moduleEliteDmgBonus += eliteDmgBonuses[moduleLevel] || 0;
      }

      if (moduleType === 'damage-stack' && moduleLevel > 0) {
        const allAtkBonuses = [0, 10, 20, 30, 40, 50, 60];
        const bonus = allAtkBonuses[moduleLevel] || 0;
        moduleAllAtkBonus += bonus;
        moduleAtkBreakdown.push(`Damage Stack +${bonus}`);
        const allMainStatBonuses = [0, 0, 0, 20, 40, 60, 80];
        moduleAllMainStatBonus += allMainStatBonuses[moduleLevel] || 0;
        const dmgBonuses = [0, 0, 0, 0, 0, 6.6, 11];
        moduleAllDmgBonus += dmgBonuses[moduleLevel] || 0;
      }

      if (moduleType === 'crit-focus' && moduleLevel > 0) {
        const elementalDmgStatBonuses = [0, 0, 0, 20, 40, 60, 80];
        const elementalDmgStatBonus = elementalDmgStatBonuses[moduleLevel] || 0;
        moduleElementalDmgStatBonus += elementalDmgStatBonus;
        const critDmgBonuses = [0, 0, 0, 0, 0, 0.071, 0.12];
        const critDmgBonus = critDmgBonuses[moduleLevel] || 0;
        moduleCritDmgBonus += critDmgBonus;
      }

      if (moduleType === 'luck-focus' && moduleLevel > 0) {
        const elementalDmgStatBonuses = [0, 0, 0, 20, 40, 60, 80];
        moduleElementalDmgStatBonus += elementalDmgStatBonuses[moduleLevel] || 0;
        const luckyStrikeBonuses = [0, 0, 0, 0, 0, 0.047, 0.078];
        moduleLuckyStrikeBonus += luckyStrikeBonuses[moduleLevel] || 0;
      }

      if ((moduleType === 'healing-boost' || moduleType === 'healing-enhance') && moduleLevel > 0) {
        const matkBonuses = [0, 5, 10, 15, 20, 25, 30];
        const intellectBonuses = [0, 0, 0, 10, 20, 30, 40];
        moduleMatkBonus += matkBonuses[moduleLevel] || 0;
        moduleIntellectBonus += intellectBonuses[moduleLevel] || 0;
      }

      if (moduleType === 'life-condense' && moduleLevel > 0) {
        const allAtkBonuses = [0, 10, 20, 30, 40, 50, 60];
        const allMainStatBonuses = [0, 0, 0, 20, 40, 60, 80];
        moduleAllAtkBonus += allAtkBonuses[moduleLevel] || 0;
        moduleAllMainStatBonus += allMainStatBonuses[moduleLevel] || 0;
      }

      if (moduleType === 'first-aid' && moduleLevel > 0) {
        const matkBonuses = [0, 10, 20, 30, 40, 50, 60];
        const intellectBonuses = [0, 0, 0, 20, 40, 60, 80];
        moduleMatkBonus += matkBonuses[moduleLevel] || 0;
        moduleIntellectBonus += intellectBonuses[moduleLevel] || 0;
      }

      if (moduleType === 'strength-boost' && moduleLevel > 0) {
        const atkBonuses = [0, 5, 10, 15, 20, 25, 30];
        const strengthBonuses = [0, 0, 0, 10, 20, 30, 40];
        moduleAtkBonus += atkBonuses[moduleLevel] || 0;
        moduleStrengthBonus += strengthBonuses[moduleLevel] || 0;
        strengthBoostLevel = moduleLevel;
      }

      if (moduleType === 'agility-boost' && moduleLevel > 0) {
        const atkBonuses = [0, 5, 10, 15, 20, 25, 30];
        const agilityBonuses = [0, 0, 0, 10, 20, 30, 40];
        moduleAtkBonus += atkBonuses[moduleLevel] || 0;
        moduleAgilityBonus += agilityBonuses[moduleLevel] || 0;
        if (moduleLevel === 5) modulePhysicalDmgBonus += 3.6;
        if (moduleLevel === 6) modulePhysicalDmgBonus += 6;
      }

      if (moduleType === 'armor' && moduleLevel > 0) {
        const elementalAtkBonuses = [0, 0, 0, 5, 10, 15, 20];
        moduleElementalAtkBonus += elementalAtkBonuses[moduleLevel] || 0;
      }

      if (moduleType === 'attack-spd' && moduleLevel > 0) {
        const allAtkBonuses = [0, 5, 10, 20, 30, 40, 50];
        moduleAllAtkBonus += allAtkBonuses[moduleLevel] || 0;
        moduleAttackSpdLevel = moduleLevel;
      }

      if (moduleType === 'agile' && moduleLevel > 0) {
        const allAtkBonuses = [0, 10, 20, 30, 40, 50, 60];
        const allMainStatBonuses = [0, 0, 0, 20, 40, 60, 80];
        moduleAllAtkBonus += allAtkBonuses[moduleLevel] || 0;
        moduleAllMainStatBonus += allMainStatBonuses[moduleLevel] || 0;
        if (moduleLevel === 5) modulePhysicalDmgBonus += 6;
        if (moduleLevel === 6) modulePhysicalDmgBonus += 10;
      }

      if (moduleType === 'final-protection' && moduleLevel > 0) {
        const strengthBonuses = [0, 0, 0, 20, 40, 60, 80];
        moduleStrengthBonus += strengthBonuses[moduleLevel] || 0;
      }

      if (moduleType === 'life-steal' && moduleLevel > 0) {
        const atkBonuses = [0, 10, 20, 30, 40, 50, 60];
        const strengthBonuses = [0, 0, 0, 20, 40, 60, 80];
        moduleAtkBonus += atkBonuses[moduleLevel] || 0;
        moduleStrengthBonus += strengthBonuses[moduleLevel] || 0;
      }

      if (moduleType === 'special-attack' && moduleLevel > 0) {
        const allAtkBonuses = [0, 5, 10, 15, 20, 25, 30];
        const allMainStatBonuses = [0, 0, 0, 10, 20, 30, 40];
        moduleAllAtkBonus += allAtkBonuses[moduleLevel] || 0;
        moduleAllMainStatBonus += allMainStatBonuses[moduleLevel] || 0;
        const specialAttackElemBonuses = [0, 0, 0, 0, 0, 0.072, 0.12];
        moduleSpecialAttackElemBonus += specialAttackElemBonuses[moduleLevel] || 0;
      }

      if (moduleType === 'team-luck-crit') {
        const allAtkBonuses = [0, 10, 20, 30, 40, 50, 60];
        const allMainStatBonuses = [0, 0, 0, 20, 40, 60, 80];
        moduleAllAtkBonus += allAtkBonuses[moduleLevel] || 0;
        moduleAllMainStatBonus += allMainStatBonuses[moduleLevel] || 0;
        autoTeamLuckCritOption = 'none';
        if (moduleLevel === 5) autoTeamLuckCritOption = 'tier3';
        if (moduleLevel === 6) autoTeamLuckCritOption = 'tier4';
      }
    });

    return {
      moduleBonusCrit, moduleBonusLuck, moduleBonusMastery, moduleBonusVers, moduleBonusHaste,
      moduleAtkBonus, moduleMatkBonus, moduleAllAtkBonus, moduleEliteDmgBonus,
      moduleMagicDmgBonus, modulePhysicalDmgBonus, moduleAllDmgBonus, moduleCritDmgBonus,
      moduleLuckyStrikeBonus, moduleSpecialAttackElemBonus, autoTeamLuckCritOption,
      moduleElementalAtkBonus, moduleElementalDmgStatBonus,
      moduleIntellectBonus, moduleAgilityBonus, moduleStrengthBonus, moduleAllMainStatBonus,
      moduleAtkBreakdown, moduleMatkBreakdown, moduleCastSpeedBonus, moduleAttackSpdLevel, strengthBoostLevel
    };
  }

  window.computeModuleBonusesFromDOM = computeModuleBonusesFromDOM;
})();
