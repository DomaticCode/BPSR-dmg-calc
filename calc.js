// Global tracking for disabled breakdown items (keyed by skill name or 'lucky-hit')
window.disabledBreakdownItems = new Set();

// Toggle a breakdown item's enabled state and recalculate
function toggleBreakdownItem(itemId) {
  if (window.disabledBreakdownItems.has(itemId)) {
    window.disabledBreakdownItems.delete(itemId);
  } else {
    window.disabledBreakdownItems.add(itemId);
  }
  calc();
}

// Setup event delegation for breakdown rows
function setupBreakdownEventDelegation() {
  const breakdownEl = document.getElementById('summary-skill-breakdown');
  if (breakdownEl) {
    breakdownEl.removeEventListener('click', window._breakdownClickHandler);
    window._breakdownClickHandler = function(e) {
      const row = e.target.closest('.breakdown-row');
      if (row) {
        const itemId = row.getAttribute('data-item-id');
        if (itemId) toggleBreakdownItem(itemId);
      }
    };
    breakdownEl.addEventListener('click', window._breakdownClickHandler);
  }
}

// Full calculation function, called on any input change for re-calculating
// Uses modules_calc.js and classes/*.js for modules and class specific bonuses
function calc() {
  updateAtkLabels();
  // === MATK ===
  const intBase      = getVal('main-attr');
  const extraMainAttr= getVal('extra-main-attr');
  const intPct       = getVal('int-pct') / 100;
  const mainStatPct  = getVal('main-stat-pct') / 100;
  // Psychoscope: prefer centralized provider getPsychoscopeBonuses() defined in damage-calc.html
  const psych = (typeof getPsychoscopeBonuses === 'function') ? getPsychoscopeBonuses() : {};
  const psychoscopeMainStat = psych.mainStat || 0;
  const psychoscopeMainStatPct = (psych.mainStatPct || 0) / 100;
  const psychoscopeDreamDmgPct = (psych.dreamDmgPct || 0) / 100;
  const psychoscopeLuckPct = (psych.luckPct || 0) / 100;
  const psychoscopeLuckyStrikeMultPct = (psych.luckyStrikeMultPct || 0) / 100;
  const psychoscopeHighestSubstatPctBonus = (psych.highestSubstatPctBonus || 0) / 100;

  const psychoscopeRefinePct = (psych.refinePct || 0) / 100;


  const psychoscopeTargetCritPct = (psych.targetCritPct || 0) / 100;


  const imagineBonuses = (typeof getImagineBonuses === 'function') ? getImagineBonuses() : {};
  const imagineMainStatPct = (imagineBonuses.mainStatPct || 0) / 100;
  const imagineMatkPct  = (imagineBonuses.matkPct || 0) / 100;
  const imagineGenDamagePct = (imagineBonuses.genDamagePct || 0) / 100;
  const imagineCritDmgPct = (imagineBonuses.critDmgPct || 0) / 100;

  const imagineElemPct = (imagineBonuses.elemPct || 0) / 100;

  const imagineLuckyStrikeMultPct = imagineBonuses.luckyStrikeMultPct || 0;
  const imagineLuckEffectPct = (imagineBonuses.luckEffectPct || 0) / 100;

  const imagineHastePct = (imagineBonuses.hastePct || 0) / 100;
  const imagineMasteryPct = (imagineBonuses.masteryPct || 0) / 100;
  const imagineLuckPct = (imagineBonuses.luckPct || 0) / 100;
  const imagineVersatilityPct = (imagineBonuses.versatilityPct || 0) / 100;
  const imagineCritPct = (imagineBonuses.critPct || 0) / 100;

  const optimizerFactor = getOptimizerFactor(); // substat factors
  const imagineCritStat = (imagineBonuses.critStat || 0) * optimizerFactor.crit;
  const imagineHasteStat = (imagineBonuses.hasteStat || 0) * optimizerFactor.haste;
  const imagineLuckStat = (imagineBonuses.luckStat || 0) * optimizerFactor.luck;
  const imagineMasteryStat = (imagineBonuses.masteryStat || 0) * optimizerFactor.mastery;
  const imagineVersatilityStat = (imagineBonuses.versatilityStat || 0) * optimizerFactor.vers;

  console.log(`imagine added substats: crit ${imagineCritStat.toFixed(2)}, haste ${imagineHasteStat.toFixed(2)}, luck ${imagineLuckStat.toFixed(2)}, mastery ${imagineMasteryStat.toFixed(2)}, vers ${imagineVersatilityStat.toFixed(2)}`);

  const oblivionChoice = document.getElementById('oblivion-buff')?.value || 'none';
  const oblivionPct = oblivionChoice !== 'none' ? 0.10 : 0;
  const oblivionMainStatPct = oblivionChoice === 'ob-ms' ? 0.02 : 0;
  const oblivionAllElementPct = oblivionChoice === 'ob-ae' ? 0.03 : 0;

  const endlessMindChoice = document.getElementById('endless-mind')?.value || 'none';
  let endlessMindMasteryPct, endlessMindMainStatPct = 0;
  if (endlessMindChoice === 'em') {
    endlessMindMasteryPct = 0.04;
    endlessMindMainStatPct = 0.02;
  } else if(endlessMindChoice === 'em-dbl' || endlessMindChoice === 'em-self-1') { // same values so reuse
    endlessMindMasteryPct = 0.08;
    endlessMindMainStatPct = 0.04;
  } else if (endlessMindChoice === 'em-self') {
    endlessMindMasteryPct = 0.06;
    endlessMindMainStatPct = 0.03;
  } else if(endlessMindChoice === 'em-self-1-dbl') {
    endlessMindMasteryPct = 0.16;
    endlessMindMainStatPct = 0.08;
  } else {
    endlessMindMasteryPct = 0;
    endlessMindMainStatPct = 0;
  }

  const classSelectVal = document.getElementById('class-select')?.value || 'none';
  const classModule = window.CLASS_MODULES?.[classSelectVal];

  const class_stat = classModule?.mainStatType?.() || 'none';
  let classDamageType = 'physical'
  if(class_stat === 'int') {
    classDamageType =  'magical';
  }

  // === Inspiration ===
  const inspirationBonusStatsPct = parseFloat(document.getElementById('inspiration').value) / 100;
  let inspirationMainStats = 0;
  if(inspirationBonusStatsPct === 0.015){
    inspirationMainStats = 135;
  } else if (inspirationBonusStatsPct === 0.03){
    inspirationMainStats = 540;
  } else if (inspirationBonusStatsPct === 0.036){
    inspirationMainStats = 648;
  } else if (inspirationBonusStatsPct === 0.039){
    inspirationMainStats = 702;
  }
  // remove 100 main stat from smite class if they have any inspiration selected. (Assume smites import their main stat with inspiration buff already active).
  // Still works correctly for overriding and giving more main stat from an LB in party, just removes their passive +100 main stat from existing.
  if (classSelectVal === 'smite' && inspirationMainStats > 0) {
    inspirationMainStats -= 135;
  }


  // Base %s are now editable inputs (class loading sets them, user can override)
  const getModifier = (apply, factorObj, statKey) => {
    return apply && factorObj ? (factorObj[statKey] - 1) : 0;
  };

  const baseCrit     = getVal('base-crit-pct') / 100;
  const baseHaste    = getVal('base-haste-pct') / 100;
  const baseLuck     = getVal('base-luck-pct') / 100;
  const baseMastery   = getVal('base-mastery-pct') / 100;
  const baseVers     = getVal('base-vers-pct') / 100;

  const factor1 = getSubstatFactorValues('substat-factor', 'substat-factor-value');
  const factor2 = getSubstatFactorValues('substat-factor-2', 'substat-factor-value-2');
  const factor3 = getSubstatFactorValues('substat-factor-3', 'substat-factor-value-3');
  const classFactorBonuses = classModule?.provideFactorBonuses?.() || {};
  // Returns object with keys for each generic non-substat value. e.g. genericNonSubstatFactors.versatilityStat
  const genericNonSubstatFactors = typeof window.getGenericNonSubstatFactorBonuses === 'function'
    ? window.getGenericNonSubstatFactorBonuses()
    : [];
  console.log('Generic non-substat factors:', genericNonSubstatFactors);
  const factorEntries = [
    ...getPsychoscopeFactorEntries(),
  ];
  console.log('Factor entries:', factorEntries);
  const getFactorScale = statKey => factorEntries.reduce((acc, entry) => {
    return acc + (entry.apply && entry.factor ? entry.factor[statKey] - 1 : 0);
  }, 1);

  const genericFactorVersatilityStat = genericNonSubstatFactors.versatilityStat || 0;

  const baseCritStat = getVal('crit-rate-stat');
  const baseHasteStat = getVal('haste-stat');
  const baseLuckStat = getVal('luck-stat');
  const baseMasteryStat = getVal('mastery-stat');
  const baseVersStat = getVal('vers-dmg-pct');

  // --- Factor Scale Calculations ---
  const critScale    = getFactorScale('crit');
  const versScale    = getFactorScale('vers');
  const luckScale    = getFactorScale('luck');
  const masteryScale = getFactorScale('mastery');
  const hasteScale   = getFactorScale('haste');

  console.log(`Factor Scales: crit ${critScale.toFixed(4)}, vers ${versScale.toFixed(4)}, luck ${luckScale.toFixed(4)}, mastery ${masteryScale.toFixed(4)}, haste ${hasteScale.toFixed(4)}`);

  const critStat    = (baseCritStat * critScale) + imagineCritStat;
  const critRatePct = (critStat > 0 ? critStat / (critStat + STAT_SCALER) : 0) + baseCrit + inspirationBonusStatsPct;

  const versStat    = (baseVersStat * versScale) + imagineVersatilityStat + genericFactorVersatilityStat;
  const versPct     = (versStat > 0 ? versStat / (versStat + VERS_SCALER) : 0) + baseVers + inspirationBonusStatsPct + imagineVersatilityPct ;
  const versDmgPct  = versPct * 0.35;
  console.log ('baseVersStat = ' + baseVersStat + ', versScale = ' + versScale + ', imagineVersatilityStat = ' + imagineVersatilityStat + ', versStat = ' + versStat + ', versPct = ' + versPct + ', versDmgPct = ' + versDmgPct);
  console.log('vers stat = ' + versStat + ', vers pct = ' + versPct + ', vers dmg pct = ' + versDmgPct);

  const luckStat        = (baseLuckStat * luckScale) + imagineLuckStat;
  const luckChancePct   = (luckStat > 0 ? luckStat / (luckStat + STAT_SCALER) : 0) + baseLuck + inspirationBonusStatsPct + imagineLuckPct;

  const masteryStat  = (baseMasteryStat * masteryScale) + imagineMasteryStat;
  const masteryPct   = (masteryStat > 0 ? masteryStat / (masteryStat + STAT_SCALER) : 0) + baseMastery + inspirationBonusStatsPct + imagineMasteryPct + endlessMindMasteryPct;

  const hasteStat    = (baseHasteStat * hasteScale) + imagineHasteStat;
  const hastePct     = (hasteStat > 0 ? hasteStat / (hasteStat + STAT_SCALER) : 0) + baseHaste + inspirationBonusStatsPct + imagineHastePct;

  document.getElementById('sub-crit-pct').textContent    = (critRatePct * 100).toFixed(2) + '%';
  document.getElementById('sub-vers-pct').textContent    = (versPct * 100).toFixed(2) + '%';
  document.getElementById('sub-luck-pct').textContent    = (luckChancePct * 100).toFixed(2) + '%';
  document.getElementById('sub-mastery-pct').textContent = (masteryPct * 100).toFixed(2) + '%';
  document.getElementById('sub-haste-pct').textContent   = (hastePct * 100).toFixed(2) + '%';

  console.log("stats before modules: critRatePct = " + critRatePct + ", hastePct = " + hastePct + ", luckChancePct = " + luckChancePct + ", masteryPct = " + masteryPct + ", versPct = " + versPct);

  // Modules LifeWave bonuses (RAW PERCENTS)
  let moduleBonusCrit = 0, moduleBonusLuck = 0, moduleBonusMastery = 0, moduleBonusVers = 0, moduleBonusHaste = 0;

const moduleResults = window.computeModuleBonusesFromDOM?.({
  critRatePct,
  versPct,
  luckChancePct,
  masteryPct,
  hastePct
}) || {};
  // Update substat (lifewave raw percent) bonuses
  moduleBonusCrit = moduleResults.moduleBonusCrit || 0;
  moduleBonusLuck = moduleResults.moduleBonusLuck || 0;
  moduleBonusMastery = moduleResults.moduleBonusMastery || 0;
  moduleBonusVers = moduleResults.moduleBonusVers || 0;
  moduleBonusHaste = moduleResults.moduleBonusHaste || 0;
  console.log("Module bonuses: crit " + moduleBonusCrit + ", haste " + moduleBonusHaste + ", luck " + moduleBonusLuck + ", mastery " + moduleBonusMastery + ", vers " + moduleBonusVers);
  // These are fully implemented buffs which directly affect damage.
  // Note: some of these are %s which do not use the whole number return and instead return as decimals, I am too lazy to standardize them all since they don't change for the foreseeable future...
  let moduleAtkBonus = moduleResults.moduleAtkBonus || 0; // ATK bonus (physical only)
  let moduleMatkBonus = moduleResults.moduleMatkBonus || 0; // MATK bonus (magical only)
  let moduleAllAtkBonus = moduleResults.moduleAllAtkBonus || 0; // All ATK bonus (applies to both physical and magical)
  let moduleAllAtkPct = (moduleResults.moduleAllAtkPct || 0) / 100; // All ATK % bonus (applies to both physical and magical)
  let moduleEliteDmgBonus = moduleResults.moduleEliteDmgBonus || 0; // Elite damage
  let moduleMagicDmgBonus = moduleResults.moduleMagicDmgBonus || 0; // Magic DMG bonus from Intellect Boost and Damage Stack
  let modulePhysicalDmgBonus = moduleResults.modulePhysicalDmgBonus || 0; // Physical DMG bonus from modules
  let moduleAllDmgBonus = moduleResults.moduleAllDmgBonus || 0; // Damage bonus for all damage types
  let moduleCritDmgBonus = moduleResults.moduleCritDmgBonus || 0; // Crit DMG bonus from modules
  let moduleLuckyStrikeBonus = moduleResults.moduleLuckyStrikeBonus || 0; // Lucky Strike DMG Mult bonus from modules
  let moduleSpecialAttackElemBonus = moduleResults.moduleSpecialAttackElemBonus || 0; // Special Attack Elemental DMG bonus
  let autoTeamLuckCritOption = moduleResults.autoTeamLuckCritOption ?? null; // Auto-update team luck/crit dropdown from the module
  let moduleElementalAtkBonus = moduleResults.moduleElementalAtkBonus || 0; // All Element Attack bonus from modules
  let moduleElementalDmgStatBonus = moduleResults.moduleElementalDmgStatBonus || 0; // Raw all-elemental DMG stat from modules
  let moduleLifeWavePct = moduleResults.moduleLifeWavePct || 0;
  let moduleLifeWaveStat = null;

  // These are locally calculated but not used anywhere outside the note for Modules. (if at all).
  let moduleIntellectBonus =  moduleResults.moduleIntellectBonus || 0; // Intellect stat bonus
  let moduleAgilityBonus =  moduleResults.moduleAgilityBonus || 0; // Agility stat bonus
  let moduleStrengthBonus =  moduleResults.moduleStrengthBonus || 0; // Strength stat bonus
  let moduleAllMainStatBonus =  moduleResults.moduleAllMainStatBonus || 0; // All Main Stat bonus (applies to all stats)
  let moduleAtkBreakdown = moduleResults.moduleAtkBreakdown || [];
  let moduleMatkBreakdown = moduleResults.moduleMatkBreakdown || [];
  let moduleCastSpeedBonus =  moduleResults.moduleCastSpeedBonus || 0; // Cast speed bonus (stored but not applied)
  let moduleAttackSpdLevel =  moduleResults.moduleAttackSpdLevel || 0; // Track Attack SPD for module note
  let strengthBoostLevel =  moduleResults.strengthBoostLevel || 0; // Track Strength Boost level for armor penetration note

  // Calculate substat values for highest substat determination
  const substats = [
    { key: 'crit', val: critRatePct },
    { key: 'luck', val: luckChancePct },
    { key: 'mastery', val: masteryPct },
    { key: 'vers', val: versPct },
    { key: 'haste', val: hastePct },
  ];
  if (autoTeamLuckCritOption !== null) {
    const teamLuckCritSelect = document.getElementById('team-luck-crit');
    if (teamLuckCritSelect) teamLuckCritSelect.value = autoTeamLuckCritOption;
  }

  // Weapon line substats: flat boosts added directly to final substat %s
  let wlCritBonus  = 0, wlHasteBonus = 0, wlLuckBonus = 0, wlMasteryBonus = 0, wlVersBonus = 0, wlAtkPct = 0, luckEffectBonus = 0, luckyStrikeDmgBonus = 0, wlExpMagPct = 0, wlPhyMagBoost = 0, wlLuckEffectPhyMagBoost = 0, wlElemBonus = 0;

  const weaponLineEffects = typeof getWeaponLineEffects === 'function' ? getWeaponLineEffects() : [];
  if (weaponLineEffects.length > 0) {
    weaponLineEffects.forEach(effect => {
      const amount = effect.value / 100;
      switch (effect.key) {
        case 'wl-crit-pct': wlCritBonus += amount; break;
        case 'wl-haste-pct': wlHasteBonus += amount; break;
        case 'wl-luck-pct': wlLuckBonus += amount; break;
        case 'wl-mastery-pct': wlMasteryBonus += amount; break;
        case 'wl-vers-pct': wlVersBonus += amount; break;
        case 'wl-atk-pct': wlAtkPct += amount; break;
        case 'wl-elem-bonus': wlElemBonus += amount; break;
        case 'luck-effect-bonus': luckEffectBonus += amount; break;
        case 'lucky-strike-dmg-bonus': luckyStrikeDmgBonus += amount; break;
        case 'wl-exp-mag-pct': wlExpMagPct += amount; break;
        case 'wl-phy-mag-boost': wlPhyMagBoost += amount; break;
        case 'wl-luck-effect-mag-boost': wlLuckEffectPhyMagBoost += amount; break;
      }
    });
  }

  let postWlCritPct    = critRatePct + moduleBonusCrit + wlCritBonus;
  let postWlHastePct   = hastePct + moduleBonusHaste + wlHasteBonus;
  let postWlLuckPct    = luckChancePct + moduleBonusLuck + psychoscopeLuckPct + wlLuckBonus;
  let postWlMasteryPct = masteryPct + moduleBonusMastery + wlMasteryBonus;
  let postWlVersPct    = versPct + moduleBonusVers + wlVersBonus;

  if (moduleLifeWavePct) {
    moduleLifeWaveStat = [
      { key: 'crit', val: postWlCritPct },
      { key: 'luck', val: postWlLuckPct },
      { key: 'mastery', val: postWlMasteryPct },
      { key: 'vers', val: postWlVersPct },
      { key: 'haste', val: postWlHastePct },
    ].reduce((a, b) => a.val >= b.val ? a : b).key;

    if (moduleLifeWaveStat === 'crit')    postWlCritPct += moduleLifeWavePct;
    if (moduleLifeWaveStat === 'luck')    postWlLuckPct += moduleLifeWavePct;
    if (moduleLifeWaveStat === 'mastery') postWlMasteryPct += moduleLifeWavePct;
    if (moduleLifeWaveStat === 'vers')    postWlVersPct += moduleLifeWavePct;
    if (moduleLifeWaveStat === 'haste')   postWlHastePct += moduleLifeWavePct;
  }

  let psBonusCrit = 0, psBonusLuck = 0, psBonusMastery = 0, psBonusHaste = 0, psBonusVersatility = 0;
  if (psychoscopeHighestSubstatPctBonus) {
    const substats = [
      { key: 'crit', val: postWlCritPct },
      { key: 'luck', val: postWlLuckPct },
      { key: 'mastery', val: postWlMasteryPct },
      { key: 'haste', val: postWlHastePct },
      { key: 'vers', val: postWlVersPct },
    ];
    const highest = substats.reduce((a, b) => a.val >= b.val ? a : b);
    if (highest.key === 'crit')    psBonusCrit    = 0.03;
    if (highest.key === 'luck')    psBonusLuck    = 0.03;
    if (highest.key === 'mastery') psBonusMastery = 0.03;
    if (highest.key === 'haste')   psBonusHaste   = 0.03;
    if (highest.key === 'vers')    psBonusVersatility   = 0.03;
  }

  postWlCritPct    += psBonusCrit;
  postWlHastePct   += psBonusHaste;
  postWlLuckPct    += psBonusLuck;
  postWlMasteryPct += psBonusMastery;
  postWlVersPct    += psBonusVersatility;
  const postWlVersDmgPct = postWlVersPct * 0.35;

  // Update substat displays (dropped weapon-line until postWl* is computed)
  document.getElementById('sub-crit-pct').textContent    = (postWlCritPct * 100).toFixed(2) + '%';
  document.getElementById('sub-vers-pct').textContent    = (postWlVersPct * 100).toFixed(2) + '%';
  document.getElementById('sub-luck-pct').textContent    = (postWlLuckPct * 100).toFixed(2) + '%';
  document.getElementById('sub-mastery-pct').textContent = (postWlMasteryPct * 100).toFixed(2) + '%';
  document.getElementById('sub-haste-pct').textContent   = (postWlHastePct * 100).toFixed(2) + '%';

  const critPctEl = document.getElementById('crit-rate-pct');
  if (critPctEl) critPctEl.value = (critPct * 100).toFixed(2);

  const critMultPct = getVal('crit-mult', 150) / 100;

  // === Target type ===
  const targetType    = document.getElementById('target-type').value;
  const isEliteOrBoss = targetType === 'elite' || targetType === 'boss';
  const isBoss        = targetType === 'boss';

  // === DMG Bonuses ===
  const elemPower      = getVal('elem-power');
  const elemPowerBonus = elemPower / (elemPower + ALL_ELEMENTAL_DMG_SCALER);
  const additionalElemDmg = getVal('elem-dmg-pct') / 100;

  console.log("haste % = " + postWlHastePct);

  // Get class-provided bonus toggles (smite provider exposes simple flags/values)

  let classBonuses = {};

  try {
    classBonuses = classModule?.provideClassBonuses?.({
      crit: postWlCritPct,
      haste: postWlHastePct,
      luck: postWlLuckPct,
      vers: postWlVersPct,
      mastery: postWlMasteryPct,
      versDmg: postWlVersDmgPct
    }) || {};
  } catch (e) {
    console.warn('class bonus provider error', e);
  }

  const classElemPct = (classBonuses.classElemPct || 0) / 100;
  const classThornsPct = (classBonuses.classThornsPct || 0) / 100; // Smite buggy skill which requires special handling...
  const classMagBoostPct = (classBonuses.classMagBoostPct || 0) / 100;
  const classLuckMult = classBonuses.classLuckMult || 0; // NOT A PERCENT SCALER, it's flat, do not divide by 100.
  const classLuckyFinalDmgPct = (classBonuses.classLuckyFinalDmgPct || 0) / 100;

  const classFactorLuckyDreamDmgPct = (classFactorBonuses.classFactorLuckyDreamDmgPct || 0) / 100;
  const classFactorMatkPct = (classFactorBonuses.classFactorMatkPct || 0) / 100;
  const classFactorAtkPct = (classFactorBonuses.classFactorAtkPct || 0) / 100;
  const classFactorMainStat = classFactorBonuses.classFactorMainStat || 0;
  const classFactorAllElementPct = (classFactorBonuses.classFactorAllElementPct || 0) / 100;

  const genericFactorAllElement = genericNonSubstatFactors.genericFactorAllElement || 0;
  const genericFactorMainStatPct = (genericNonSubstatFactors.mainStatPct || 0) / 100;
  const genericFactorMainStat = genericNonSubstatFactors.mainStat || 0;

  const classMainStat = classBonuses.classMainStat || 0; // flat main stat bonus from class, not a percent

  let classMatkPct = 0;
  let classAtkPct = 0;
  if( damageType === 'physical') {
    classAtkPct = (classBonuses.classAtkPct || 0) / 100 + classFactorAtkPct;
  } else if (damageType === 'magical') {
    classMatkPct = (classBonuses.classMatkPct || 0) / 100 + classFactorMatkPct;
  }

  let classMatk = 0;
  let classAtk = 0;
  if( damageType === 'physical') {
    classAtk = classBonuses.classAtk || 0;
  } else if (damageType === 'magical') {
    classMatk = classBonuses.classMatk || 0;
  }


  const classFinalCritPct = (classBonuses.classFinalCritPct || 0) / 100; // not in use yet
  const classFinalHastePct = (classBonuses.classFinalHastePct || 0) / 100;  // not in use yet
  const classFinalLuckPct = (classBonuses.classFinalLuckPct || 0) / 100; // disso luck boost
  const classFinalMasteryPct = (classBonuses.classFinalMasteryPct || 0) / 100; // not in use yet
  const classFinalVersPct = (classBonuses.classFinalVersPct || 0) / 100; // not in use yet

  let masteryElemBonus = 0;
  let masteryElemPct = 0;
  const masteryElemEl = document.getElementById('mastery-elem-dmg-pct');

  const bossDmgPct  = isBoss        ? getVal('boss-dmg-pct') / 100  : 0;
  const eliteDmgPct = isEliteOrBoss ? getVal('elite-dmg-pct') / 100 : 0;
  const moduleEliteDmgPct = isEliteOrBoss ? moduleEliteDmgBonus / 100 : 0;
  const genDmgBase  = getVal('gen-dmg-pct') / 100;
  const typeDmgPct = damageType === 'physical' ? modulePhysicalDmgBonus / 100 : moduleMagicDmgBonus / 100;
  const genDmgPct   = genDmgBase + bossDmgPct + eliteDmgPct + moduleEliteDmgBonus / 100 + moduleAllDmgBonus / 100 + typeDmgPct + imagineGenDamagePct;
  let magBoostPct   = getVal('mag-boost-pct') / 100;
  magBoostPct += classMagBoostPct + wlPhyMagBoost;
  let finalDmgPct   = getVal('final-dmg-pct') / 100;

  const finalCritPct = postWlCritPct * (1 + classFinalCritPct); // not in use yet
  const finalHastePct = postWlHastePct * (1 + classFinalHastePct);  // not in use yet
  const finalLuckPct = postWlLuckPct * (1 + classFinalLuckPct); // disso luck boost
  const finalMasteryPct = postWlMasteryPct * (1 + classFinalMasteryPct); // not in use yet
  const finalVersPct = postWlVersPct * (1 + classFinalVersPct); // not in use yet
  const finalVersDmgPct = postWlVersDmgPct;

  console.log('final luck pct before cap: ' + finalLuckPct);
  const finalLuckChance = Math.min(finalLuckPct, 1); // cap luck chance at 100% (luckPct > 100 still gives bonuses, but can only proc 100% of the time)

  // Update substat displays with weapon-line contributions (after postWl computed)
  document.getElementById('sub-crit-pct').textContent    = (finalCritPct * 100).toFixed(2) + '%';
  document.getElementById('sub-haste-pct').textContent   = (finalHastePct * 100).toFixed(2) + '%';
  document.getElementById('sub-luck-pct').textContent    = (finalLuckPct * 100).toFixed(2) + '%';
  document.getElementById('sub-mastery-pct').textContent = (finalMasteryPct * 100).toFixed(2) + '%';
  document.getElementById('sub-vers-pct').textContent    = (finalVersPct * 100).toFixed(2) + '%';

  // Apply module stats if checked (based on class selected)
  let moduleApplyMainStats = 0;
  if(getChecked('module-apply-main-stats')) {
    const type = classModule?.mainStatType?.() || 'none';
    moduleApplyMainStats = moduleAllMainStatBonus;
    if(type === 'int') {
      moduleApplyMainStats += moduleIntellectBonus;
    } else if(type === 'agi') {
      moduleApplyMainStats += moduleAgilityBonus;
    } else if(type === 'str') {
      moduleApplyMainStats += moduleStrengthBonus;
    }
  }
  console.log(`moduleApplyMainStats = ${moduleApplyMainStats}`);

  // INT/ATK calculations
  const intScaled    = (intBase + extraMainAttr + psychoscopeMainStat + inspirationMainStats + classMainStat + genericFactorMainStat + moduleApplyMainStats + classFactorMainStat) * (1 + intPct + mainStatPct + psychoscopeMainStatPct + imagineMainStatPct + oblivionMainStatPct + endlessMindMainStatPct + genericFactorMainStatPct);
  const weaponMatk   = getVal('base-atk');
  const foodEnabled = getChecked('food-enabled');
  const foodAtkBonus = foodEnabled ? getVal('food-atk') : 0;
  const foodDmgBonusPct = foodEnabled ? getVal('food-dmg-bonus') / 100 : 0;
  
  const matkPct      = getVal('matk-pct') / 100;
  let adaptiveMatk; // adaptive atk from modules
  let innerFloor;
  let matkBase;

  console.log('Imagine bonuses:', imagineBonuses);

  const totalMatkPct = matkPct + imagineMatkPct + classMatkPct + classAtkPct + wlAtkPct + moduleAllAtkPct;
  let effectiveAtk;

  const refinedAtk   = getVal('refined-atk') * (1 + psychoscopeRefinePct);

  // Not directly used, was going to use it for atk calculations, but seems its class based not archetype based.
  const mainStat = getClassMainStatType();
  console.log(`Class ${classSelectVal} main stat: ${mainStat}`);

  // Fetching main stat X:1 mainStat to ATK/MATK, and talent X:1 mainStat to atk/matk
  const mainStatModifier = classModule?.mainStatModifier?.() || 0.5;
  const mainStatModifierTalent = classModule?.mainStatModifierTalent?.() || 0;
  console.log(`Class ${classSelectVal} main stat modifier: ${mainStatModifier}, talent modifier: ${mainStatModifierTalent}`);

  // ATK/MATK calculations (needs updated values from modules)
  const totalAtkBonus = moduleAtkBonus + moduleAllAtkBonus;
  const totalMatkBonus = moduleMatkBonus + moduleAllAtkBonus;
  const displayAtk = damageType === 'physical' ? totalAtkBonus : totalMatkBonus;
  adaptiveMatk = displayAtk;
  const adaptiveAtkInput = document.getElementById('adaptive-atk');
  if (adaptiveAtkInput) adaptiveAtkInput.value = displayAtk;

  innerFloor = Math.floor(intScaled * mainStatModifier + adaptiveMatk + weaponMatk + classMatk + classAtk);
  if(mainStat === 'str'){ // Unsure why but strength seems to round up, others round down.
    matkBase = Math.ceil(intScaled * mainStatModifierTalent + innerFloor);
  } else {
    matkBase = Math.floor(intScaled * mainStatModifierTalent + innerFloor);
  }

  effectiveAtk = Math.floor(matkBase * (1 + totalMatkPct) + foodAtkBonus);
  document.getElementById('attr-atk').value = matkBase;
  document.getElementById('eff-matk-display').value = effectiveAtk;
  // MATK breakdown summary
  const pctSegments = [];
  if (matkPct > 0) pctSegments.push(`gear:${(matkPct * 100).toFixed(2)}%`);
  if (wlAtkPct > 0) pctSegments.push(`wl:${(wlAtkPct * 100).toFixed(2)}%`);
  if (imagineMatkPct > 0) pctSegments.push(`Imagines:${(imagineMatkPct * 100).toFixed(2)}%`);
  if (classMatkPct > 0) pctSegments.push(`Class:${(classMatkPct * 100).toFixed(2)}%`);
  const matkPctSummary = pctSegments.length > 0
    ? `[${atkLabel}%: ${pctSegments.join(' + ')} = ${(totalMatkPct * 100).toFixed(2)}%]`
    : `[${atkLabel}%: ${(totalMatkPct * 100).toFixed(2)}%]`;
  document.getElementById('matk-breakdown').innerHTML =
    `FLOOR(${intScaled.toFixed(2)}x0.1 + FLOOR(${intScaled.toFixed(2)}x0.5 + ${adaptiveMatk}(modules) + ${weaponMatk}(weapon)))` +
    ` = ${matkBase}` +
    `  →  FLOOR(${matkBase}x${(1 + totalMatkPct).toFixed(3)}) + ${foodAtkBonus}(food) = <span class="hl">${effectiveAtk}</span>` +
    (psychoscopeMainStat > 0 ? `  <span style="color:#ff79c6">[Psychoscope: +${psychoscopeMainStat} INT]</span>` : '') +
    `  <span style="color:var(--accent-purple)">${matkPctSummary}</span>`;

  const elementalAtk = getVal('elemental-atk') + moduleElementalAtkBonus;
  const classElementalAtk = getVal('class-elemental-atk');
  const totalElementalAtk = elementalAtk + classElementalAtk;

  // Sum all element raw stats together, get pct from that, then add with pct sources of all element for final all element pct.
  const sumAllElement = elemPowerBonus + moduleElementalDmgStatBonus + genericFactorAllElement;
  const sumAllElementPct = sumAllElement / (sumAllElement + ALL_ELEMENTAL_DMG_SCALER);
  const finalAllElementPct = sumAllElementPct + classFactorAllElementPct;

  let elemDmgPct = additionalElemDmg + wlElemBonus + classElemPct + oblivionAllElementPct + imagineElemPct + finalAllElementPct;

  // === Defense ===
  const enemyArmour = getVal('enemy-armour', 2786);
  const physResAuto = enemyArmour / (enemyArmour + 6500);
  const overrideVal = document.getElementById('phys-resist-override').value;
  const physRes     = overrideVal !== '' ? parseFloat(overrideVal) / 100 : physResAuto;
  const resistance  = damageType === 'physical' ? (physResEnabled ? physRes : 0) : (magResEnabled ? 0.08 : 0);
  const physResLabel = physResEnabled ? physResAuto : 0;
  const physResTag = document.getElementById('res-phys-tag');
  if (physResTag) {
    physResTag.textContent = `Phys Res: ${(physResLabel * 100).toFixed(2)}% ${physResEnabled ? '✓' : '✗'}`;
    physResTag.classList.toggle('inactive', !physResEnabled);
  }

  if (critPctEl) critPctEl.value = (postWlCritPct * 100).toFixed(2);


  let wlCritDmg = 0, wlAtkDmg = 0, wlMagicDmg = 0, wlRangedDmgBonus = 0;
  if (weaponLineEffects.length > 0) {
    weaponLineEffects.forEach(effect => {
      const amount = effect.value / 100;
      switch (effect.key) {
        case 'wl-crit-dmg': wlCritDmg += amount; break;
        case 'wl-atk-dmg': wlAtkDmg += amount; break;
        case 'wl-magic-dmg': wlMagicDmg += amount; break;
        case 'wl-ranged-dmg': wlRangedDmgBonus += amount; break;
      }
    });
  }

  const teamLuckCritChoice = document.getElementById('team-luck-crit')?.value || 'none';
  let teamCritDmgBonus = 0;
  let teamLuckyDmgBonus = 0;
  switch (teamLuckCritChoice) {
    case 'tier1': teamCritDmgBonus = 0.031; teamLuckyDmgBonus = 0.02; break;
    case 'tier2': teamCritDmgBonus = 0.052; teamLuckyDmgBonus = 0.034; break;
    case 'tier3': teamCritDmgBonus = 0.061; teamLuckyDmgBonus = 0.04; break;
    case 'tier4': teamCritDmgBonus = 0.102; teamLuckyDmgBonus = 0.068; break;
  }

  const effectiveCritMult = critMultPct + wlCritDmg + imagineCritDmgPct + moduleCritDmgBonus + teamCritDmgBonus;
  const totalGenDmgPct    = genDmgPct + wlAtkDmg + wlMagicDmg + wlRangedDmgBonus;

  // === Lucky Strike DMG Mult ===
  const isManual      = document.getElementById('lucky-mult-manual').checked;

  const baseDreamDmgPct = psychoscopeDreamDmgPct +  oblivionPct + getVal('dream-dmg-pct') / 100;
  const dreamDmgPct = baseDreamDmgPct; // for standard hits
  const dreamDmgPctLucky = baseDreamDmgPct + classFactorLuckyDreamDmgPct; // for lucky strikes

  let luckyMult;
  if (isManual) {
    luckyMult = getVal('lucky-mult-display') / 100;
  } else {
    let multPct = 40 + (finalLuckPct * 100 * 0.25);
    multPct += (imagineBonuses && imagineBonuses.flamehornBoost) ? imagineBonuses.flamehornBoost : 0;
    multPct += psychoscopeLuckyStrikeMultPct * 100;
    multPct += moduleLuckyStrikeBonus * 100;
    multPct += getVal('lucky-mult-bonus');
    multPct += imagineLuckyStrikeMultPct;
    multPct += classLuckMult;
    luckyMult = multPct / 100;
    document.getElementById('lucky-mult-display').value = multPct.toFixed(2);
  }

  const luckyMultFinal  = luckyMult;
  const luckEffectPct   = finalLuckPct + luckEffectBonus + imagineLuckEffectPct;
  const luckFinalDamagePct = finalDmgPct + classLuckyFinalDmgPct;

  const serumOilEnabled = getChecked('serum-oil-enabled');
  const serumOilType = document.getElementById('serum-oil-type')?.value || 'serum';
  const serumOilValue = serumOilEnabled ? getVal('serum-oil-value') : 0;
  const serumOilPct = serumOilEnabled && serumOilValue > 0 ? serumOilValue / (serumOilValue + ALL_ELEMENTAL_DMG_SCALER) : 0;
  if (serumOilEnabled && serumOilType === 'serum') {
    elemDmgPct += serumOilPct;
  }
  if (serumOilEnabled && serumOilType === 'oil') {
    magBoostPct += serumOilPct;
  }

  const atkDefReduced  = effectiveAtk * (1 - resistance);
  const defenseFreeAtk = refinedAtk + totalElementalAtk;

  const luckyMagBoostPct = magBoostPct + wlLuckEffectPhyMagBoost;

  const luckyGenPct     = totalGenDmgPct + luckEffectPct + foodDmgBonusPct + luckyStrikeDmgBonus;
  const luckyBase       = (effectiveAtk + defenseFreeAtk) * luckyMultFinal;
  const baseMultipliers = (1 + postWlVersDmgPct) * (1 + elemDmgPct) * (1 + luckyGenPct) * (1 + dreamDmgPctLucky) * (1 + luckyMagBoostPct) * (1 + luckFinalDamagePct);

  let additionalDamage = 0;
  if (imagineBonuses.additionalDamageProc !== undefined) {
    const additionalDamageProc = imagineBonuses.additionalDamageProc / 100 || 0;
    additionalDamage = effectiveAtk * additionalDamageProc * baseMultipliers;
  }

  const lsNormal        = (luckyBase * baseMultipliers) + additionalDamage;
  const lsCrit          = lsNormal * effectiveCritMult;
  console.log('psychoscopeTargetCritPct', psychoscopeTargetCritPct);

  // Cap final luck crit between 0 and 100%
  let luckCritChancePct = document.getElementById('luck-crit-chance')
    ? getVal('luck-crit-chance') / 100
    : 0;
  const finalLuckCritPct = Math.max(
    0,
    Math.min(1, finalCritPct + luckCritChancePct)
  );
  const lsAvg = lsNormal * (1 - (finalLuckCritPct + psychoscopeTargetCritPct)) 
            + lsCrit   * (finalLuckCritPct + psychoscopeTargetCritPct);

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (typeof value === 'number' && Number.isFinite(value)) {
      el.textContent = fmt(value);
      el.dataset.value = String(value);
    } else {
      el.textContent = value;
    }
  };

  setText('ls-normal', lsNormal);
  setText('ls-crit', lsCrit);
  setText('ls-avg', lsAvg);
  setText('s-atk-matk', effectiveAtk);
  setText('s-crit-chance', `${(finalCritPct * 100).toFixed(2)}%`);
  setText('s-crit-dmg', `${(effectiveCritMult * 100).toFixed(2)}%`);
  setText('s-lucky-chance', `${(finalLuckChance * 100).toFixed(2)}%`);

  setText('s-eff-atk', effectiveAtk);
  setText('s-def-atk', atkDefReduced);
  setText('s-elem-pct', `${(elemDmgPct * 100).toFixed(1)}%`);
  setText('s-crit-rate', `${(finalCritPct * 100).toFixed(2)}%`);

  window._calc = {
    atkDefReduced, defenseFreeAtk, effectiveAtk, elementalAtk, classElementalAtk, totalElementalAtk,
    critRatePct: finalCritPct, critMultPct: effectiveCritMult,
    masteryPct: postWlMasteryPct, luckPct: postWlLuckPct, versPct: finalVersDmgPct,
    elemDmgPct, genDmgPct: totalGenDmgPct, versDmgPct: postWlVersDmgPct,
    luckyMult, luckyMultFinal, luckChancePct: finalLuckChance, luckEffectPct, luckyStrikeDmgBonus,
    wlExpMagPct, classDamageType,
    lsNormal, lsCrit, lsAvg, resistance,
    _physRes: physRes, _magResEnabled: magResEnabled,
    // breakdown parts for formula display
    _resLabel:  damageType === 'physical' ? `${((physResEnabled ? physRes : 0)*100).toFixed(1)}%` : (magResEnabled ? '8%' : '0%'),
    _additionalElem: additionalElemDmg, _elemPower: elemPowerBonus, _wlElem: wlElemBonus,
    _genBase: genDmgBase, _boss: bossDmgPct, _elite: eliteDmgPct, _dreamDmgPct: dreamDmgPct,
    _psychoscopeDreamDmgPct: psychoscopeDreamDmgPct, _dreamManual: getVal('dream-dmg-pct') / 100,
    _wlAtk: wlAtkDmg, _wlMagic: wlMagicDmg, _wlRanged: wlRangedDmgBonus,
    _luckyEff: luckEffectBonus, _totalGenDmgPct: totalGenDmgPct, _totalMatkPct: totalMatkPct, _matkBase: matkBase, _magBoost: magBoostPct, _luckyMagBoostPct: luckyMagBoostPct, _luckyStrikeDmgBonus: luckyStrikeDmgBonus,
    _finalDmgPct: finalDmgPct,
    _oblivionPct: oblivionPct, _oblivionMainStatPct: oblivionMainStatPct, _oblivionAllElementPct: oblivionAllElementPct,
    _serumOilEnabled: serumOilEnabled, _serumOilType: serumOilType, _serumOilValue: serumOilValue, _serumOilPct: serumOilPct,
    _targetType: targetType,
    _foodEnabled: foodEnabled,
    _foodAtkBonus: foodAtkBonus,
    _foodDmgBonusPct: foodDmgBonusPct,
    _wlCritPct: wlCritBonus, _wlLuckPct: wlLuckBonus, _wlVersPct: wlVersBonus, _wlMasteryPct: wlMasteryBonus,
    _moduleMagicDmg: moduleMagicDmgBonus / 100,
    _modulePhysicalDmg: modulePhysicalDmgBonus / 100,
    _moduleAllDmg: moduleAllDmgBonus / 100,
    _moduleEliteDmg: moduleEliteDmgPct,
    _moduleSpecialAttackElem: moduleSpecialAttackElemBonus,
    _finalAllElementPct: finalAllElementPct,
    _moduleAllElementalDmgStat: moduleElementalDmgStatBonus,
    thornsPct: classThornsPct,
    _moduleIntellect: moduleIntellectBonus,
    _moduleStrength: moduleStrengthBonus,
    _moduleAgility: moduleAgilityBonus,
    _moduleAllMainStat: moduleAllMainStatBonus,
    _damageType: damageType,
  };

  // helper: build class specific damage formula detail strings
  function getClassFormulaParts(kind = 'elem') {
    try {
      const classSelectVal =
        document.getElementById('class-select')?.value || 'none';

      return (
        getClassModule(classSelectVal)
          ?.provideFormulaParts?.(kind) || ''
      );
    } catch (e) {
      console.warn('class formula parts provider error', e);
      return '';
    }
  }

  // helper: build imagine specific damage formula detail strings
  function getImagineFormulaParts(kind = 'gen') {
    const parts = [];
    for (let slot = 1; slot < 3; slot++) {
      const state = getImagineState(slot);
      if (!state.imagine || state.imagine === 'none') continue;

      const module = window.IMAGINES?.[state.imagine];
      try {
        const part = module?.provideFormulaParts?.(kind, state);
        if (part) parts.push(part);
      } catch (e) {
        console.warn('imagine formula parts error', e);
      }
    }
    return parts.join(' + ');
  }

  function buildElemStr(c, specialAttackBonus = 0, options = {}) {
    const ps = [];
    if (!options.skipSources) {
      if (c._additionalElem) ps.push(`additional ${(c._additionalElem*100).toFixed(3)}%`);
      if (c._elemPower)    ps.push(`power ${(c._elemPower*100).toFixed(3)}%`);
      if (c._wlElem)       ps.push(`wl ${(c._wlElem*100).toFixed(3)}%`);
      if (c._serumOilType === 'serum' && c._serumOilPct) ps.push(`serum ${(c._serumOilPct*100).toFixed(3)}%`);
      if (c._finalAllElementPct) ps.push(`all element ${(c._finalAllElementPct*100).toFixed(3)}%`);
      if (c._oblivionAllElementPct) ps.push(`oblivion ${(c._oblivionAllElementPct*100).toFixed(3)}%`);
      const classElemParts = getClassFormulaParts('elem');
      if (classElemParts) ps.push(classElemParts);
      const imagineElemParts = getImagineFormulaParts('elem');
      if (imagineElemParts) ps.push(imagineElemParts);
    }
    const totalElem = options.skipSources ? 0 : c.elemDmgPct;
    return ps.length ? ps.join(' + ') + ` = ${(totalElem*100).toFixed(3)}%` : `${(totalElem*100).toFixed(3)}%`;
  }
  function buildGenStr(c, typePct, typeLabel, options = {}) {
    const ps = [];
    if (c._genBase)   ps.push(`gen ${(c._genBase*100).toFixed(3)}%`);
    if (c._boss)      ps.push(`boss ${(c._boss*100).toFixed(3)}%`);
    if (c._elite)     ps.push(`elite ${(c._elite*100).toFixed(3)}%`);
    if (c._moduleEliteDmg) ps.push(`elite-strike ${(c._moduleEliteDmg*100).toFixed(3)}%`);
    if (c._wlAtk)     ps.push(`wl-atk ${(c._wlAtk*100).toFixed(3)}%`);
    if (c._wlMagic)   ps.push(`wl-magic ${(c._wlMagic*100).toFixed(3)}%`);
    if (c._wlRanged)  ps.push(`wl-ranged ${(c._wlRanged*100).toFixed(3)}%`);
    if (c._foodDmgBonusPct) ps.push(`food ${(c._foodDmgBonusPct*100).toFixed(3)}%`);
    if (c._moduleAllDmg) ps.push(`modules-all ${(c._moduleAllDmg*100).toFixed(3)}%`);
    if (c._damageType === 'magical' && c._moduleMagicDmg) ps.push(`modules-magic ${(c._moduleMagicDmg*100).toFixed(3)}%`);
    if (c._damageType === 'physical' && c._modulePhysicalDmg) ps.push(`modules-phys ${(c._modulePhysicalDmg*100).toFixed(3)}%`);
    if (typePct)      ps.push(`${typeLabel} ${(typePct*100).toFixed(3)}%`);
    const classGenParts = getClassFormulaParts('gen');
    if (classGenParts) ps.push(classGenParts);
    const imagineGenParts = getImagineFormulaParts('gen');
    if (imagineGenParts) ps.push(imagineGenParts);
    const total = c._totalGenDmgPct + (c._foodDmgBonusPct||0) + (typePct||0);
    return ps.length ? ps.join(' + ') + ` = ${(total*100).toFixed(3)}%` : `${(total*100).toFixed(3)}%`;
  }
  function buildDreamStr(c) {
    const ps = [];
    if (c._psychoscopeDreamDmgPct) ps.push(`psychoscope ${(c._psychoscopeDreamDmgPct*100).toFixed(3)}%`);
    if (c._oblivionPct) ps.push(`Oblivion ${(c._oblivionPct*100).toFixed(3)}%`);
    if (c._dreamManual) ps.push(`manual ${(c._dreamManual*100).toFixed(3)}%`);
    const classDreamParts = getClassFormulaParts('dream');
    if (classDreamParts) ps.push(classDreamParts);
    const imagineDreamParts = getImagineFormulaParts('dream');
    if (imagineDreamParts) ps.push(imagineDreamParts);
    return ps.length ? ps.join(' + ') + `= ${(c._dreamDmgPct*100).toFixed(3)}%` : `${(c._dreamDmgPct*100).toFixed(3)}%`;
  }
  function buildFinalStr(c) {
    if (finalDmgPct > 0) {
      const ps = [];
      if (finalDmgPct) ps.push(`final ${(finalDmgPct*100).toFixed(3)}%`);
      const classFinalParts = getClassFormulaParts('final');
      if (classFinalParts) ps.push(classFinalParts);
      const total = finalDmgPct;
      return ps.length ? 'x <span class="ffinal">(1 + Final: ' + ps.join(' + ') + `)=${(total*100).toFixed(3)}%</span>\n` : `${(total*100).toFixed(3)}%`;
    }
    return '';
  }
  function buildLuckyGenStr(c) {
    const ps = [];
    if (c._genBase)     ps.push(`gen ${(c._genBase*100).toFixed(3)}%`);
    if (c._boss)        ps.push(`boss ${(c._boss*100).toFixed(3)}%`);
    if (c._elite)       ps.push(`elite ${(c._elite*100).toFixed(3)}%`);
    if (c._wlAtk)       ps.push(`wl-atk ${(c._wlAtk*100).toFixed(3)}%`);
    if (c._wlMagic)     ps.push(`wl-magic ${(c._wlMagic*100).toFixed(3)}%`);
    if (c._wlRanged)    ps.push(`wl-ranged ${(c._wlRanged*100).toFixed(3)}%`);
    if (c._foodDmgBonusPct) ps.push(`food ${(c._foodDmgBonusPct*100).toFixed(3)}%`);
    if (c._moduleAllDmg) ps.push(`modules-all ${(c._moduleAllDmg*100).toFixed(3)}%`);
    if (c._damageType === 'magical' && c._moduleMagicDmg) ps.push(`modules-magic ${(c._moduleMagicDmg*100).toFixed(3)}%`);
    if (c._damageType === 'physical' && c._modulePhysicalDmg) ps.push(`modules-phys ${(c._modulePhysicalDmg*100).toFixed(3)}%`);
    if (c._luckyStrikeDmgBonus) ps.push(`lucky strike DMG ${(c._luckyStrikeDmgBonus*100).toFixed(3)}%`);
    ps.push(`luck-eff ${(c.luckEffectPct*100).toFixed(3)}%`);
    const classLuckyGenParts = getClassFormulaParts('luckyGen');
    if (classLuckyGenParts) ps.push(classLuckyGenParts);
    const imagineLuckyGenParts = getImagineFormulaParts('luckyGen');
    if (imagineLuckyGenParts) ps.push(imagineLuckyGenParts);
    return ps.length ? ps.join(' + ') + ` = ${(luckyGenPct*100).toFixed(3)}%` : `${(luckyGenPct*100).toFixed(3)}%`;
  }
  function buildDreamStrLucky(c) {
    const ps = [];
    if (c._psychoscopeDreamDmgPct) ps.push(`psychoscope ${(c._psychoscopeDreamDmgPct*100).toFixed(3)}%`);
    if (c._oblivionPct) ps.push(`Oblivion ${(c._oblivionPct*100).toFixed(3)}%`)
    if (c._dreamManual)    ps.push(`manual ${(c._dreamManual*100).toFixed(3)}%`);
    const classDreamLuckyParts = getClassFormulaParts('dreamLucky');
    if (classDreamLuckyParts) ps.push(classDreamLuckyParts);
    const imagineDreamLuckyParts = getImagineFormulaParts('dreamLucky');
    if (imagineDreamLuckyParts) ps.push(imagineDreamLuckyParts);
    const total = dreamDmgPctLucky;
    return ps.length ? ps.join(' + ') + `=${(total*100).toFixed(3)}%` : `${(total*100).toFixed(3)}%`;
  }
  function buildLuckyFinalStr(c) {
    if (luckFinalDamagePct > 0) {
      const ps = [];
      if (finalDmgPct) ps.push(`final ${(finalDmgPct*100).toFixed(3)}%`);
      const classLuckyFinal = getClassFormulaParts('luckyFinal');
      if (classLuckyFinal) ps.push(classLuckyFinal);
      const total = luckFinalDamagePct;
      return ps.length ? 'x <span class="ffinal">(1 + Final: ' + ps.join(' + ') + `)=${(total*100).toFixed(3)}%</span>\n` : `${(total*100).toFixed(3)}%`;
    }
    return '';
  }
  window._buildElemStr    = buildElemStr;
  window._buildGenStr     = buildGenStr;
  window._buildDreamStr   = buildDreamStr;
  window._buildFinalStr = buildFinalStr;
  window._buildDreamStrLucky = buildDreamStrLucky;
  window._buildLuckyGenStr = buildLuckyGenStr;
  window._buildLuckyFinalStr = buildLuckyFinalStr;

  updateImagineNotes();

  const c = window._calc;
  const tgLabel = targetType === 'boss' ? 'Boss' : targetType === 'elite' ? 'Elite' : 'Normal';
  const luTags = [];
  const luckyTag = luTags.length ? ` [${luTags.join(', ')}]` : '';



  document.getElementById('formula-preview').innerHTML =
    `<span style="color:var(--text-muted)">Target: ${tgLabel} | ${damageType.charAt(0).toUpperCase()+damageType.slice(1)}</span>\n` +
    `<span class="fb">Standard hit:</span>\n` +
    `(( <span class="fb">${atkLabel}(${effectiveAtk})</span>x(1-${c._resLabel}) + <span class="fref">Refined(${(refinedAtk)})</span> + <span class="felem">All Element ATK(${(elementalAtk)})</span> + <span class="felem">Class Element ATK(${(classElementalAtk)})</span>) x skill multiplier + skill flat damage` +
    `\nx <span class="fvers">(1 + Vers: ${(postWlVersDmgPct*100).toFixed(2)}%)</span>\n` +
    `x <span class="felem">(1 + Elem: ${buildElemStr(c)})</span>\n` +
    `x <span class="fg">(1 + Gen: ${buildGenStr(c, 0, '')})</span>\n` +
    `x <span class="fdream">(1 + Seasonal: ${buildDreamStr(c)})</span>\n` +
    `x <span class="fmag">(1 + MAG: ${(c._magBoost || 0)*100 >= 0 ? (c._magBoost*100).toFixed(2) : '0.0'}%)</span>\n` +
    buildFinalStr(c) +
    `x <span class="fr">CRIT DMG(${(effectiveCritMult*100).toFixed(2)}%) (if crit)</span>\n\n` +
    `<span class="fp">Lucky Strike${luckyTag}:</span>\n` +
    `( <span class="fb">${atkLabel}(${effectiveAtk})</span> + <span class="fref">Refined(${(refinedAtk)})</span> + <span class="felem">All Element ATK(${(elementalAtk)})</span> + <span class="felem">Class Element ATK(${(classElementalAtk)})</span>)` +
    `\nx <span class="fls">Lucky Strike DMG Mult(${(luckyMult*100).toFixed(2)}%)</span>\n` +
    `x <span class="fvers">(1 + Vers: ${(postWlVersDmgPct*100).toFixed(2)}%)</span>\n` +
    `x <span class="felem">(1 + Elem: ${buildElemStr(c)})</span>\n` +
    `x <span class="fg">(1 + Gen: ${buildLuckyGenStr(c)})</span>\n` +
    `x <span class="fdream">(1 + Seasonal: ${buildDreamStrLucky(c)})</span>\n` +
    `x <span class="fmag">(1 + MAG: ${(c._luckyMagBoostPct || 0)*100 >= 0 ? (c._luckyMagBoostPct*100).toFixed(2) : '0.0'}%)</span>\n` +
    buildLuckyFinalStr(c) +
    `x <span class="fr">CRIT DMG(${(effectiveCritMult*100).toFixed(2)}%) (if crit)</span>\n`;

  if (!optimizingSubstats && optimizerDone) {
    const output = document.getElementById('optimize-substats-output');
    if (output) {
      output.textContent = 'Inputs changed after optimization; re-run Optimize to refresh result.';
      setButtonProgress('optimize-substats-button', 0);
    }
    optimizerDone = false;
  }

  skills.forEach(s => calcSkill(s.id));
  persistCurrentState();
  updateDamageSummary();

  // Update modules total note
  const modulesTotalNote = document.getElementById('modules-total-note');
  if (modulesTotalNote) {
    const totalAtkBonus = moduleAtkBonus + moduleAllAtkBonus;
    const totalMatkBonus = moduleMatkBonus + moduleAllAtkBonus;
    const totalIntellect = moduleIntellectBonus + moduleAllMainStatBonus;
    const totalStrength = moduleStrengthBonus + moduleAllMainStatBonus;
    const totalAgility = moduleAgilityBonus + moduleAllMainStatBonus;
    const totalDamageBonus = (damageType === 'physical' ? modulePhysicalDmgBonus : moduleMagicDmgBonus) + moduleAllDmgBonus;
    
    const displayAtk = damageType === 'physical' ? totalAtkBonus : totalMatkBonus;
    const atkLabel = damageType === 'physical' ? 'ATK' : 'MATK';
    
    if (displayAtk > 0 || totalIntellect > 0 || totalStrength > 0 || totalAgility > 0 || modulePhysicalDmgBonus > 0 || moduleAttackSpdLevel >= 5 || strengthBoostLevel >= 5) {
      let noteParts = [];
      if (displayAtk > 0) {
        noteParts.push(`${atkLabel}: ${displayAtk}`);
      }
      if (totalIntellect > 0) {
        noteParts.push(`Intellect: +${totalIntellect}`);
      }
      if (totalStrength > 0) {
        noteParts.push(`Strength: +${totalStrength}`);
      }
      if (totalAgility > 0) {
        noteParts.push(`Agility: +${totalAgility}`);
      }
      if (modulePhysicalDmgBonus > 0) {
        noteParts.push(`Physical DMG: +${modulePhysicalDmgBonus}%`);
      }
      if (moduleAttackSpdLevel >= 5) {
        const attackSpeed = moduleAttackSpdLevel === 5 ? 3.6 : 6;
        noteParts.push(`Attack Speed: +${attackSpeed}% (Attack SPD Lv.${moduleAttackSpdLevel}, not directly implemented yet)`);
      }
      // Armor pen from Strength Boost module
      if (strengthBoostLevel >= 5) {
        const armorPen = strengthBoostLevel === 5 ? 11.5 : 18.8;
        noteParts.push(`Armor Penetration: +${armorPen}% (Strength Boost Lv.${strengthBoostLevel}, not directly implemented yet)`);
      }
      const disclaimer = `ATK/MATK and bonuses from modules are applied. Main stats are assumed to be imported, so leave it unchecked.<br><span class="highlight-purple"> To test different module setups:</span>
                          <br>1. Unequip Modules<br>2. Import/Input stats<br>3. Enable Apply main stats<br>Module changes will now adjust main stat from modules/Effects.`;
      modulesTotalNote.innerHTML = `Module Bonuses: ${noteParts.join(', ')}<br><span style="display:block; margin-top:4px;">${disclaimer}</span>`;
      modulesTotalNote.style.display = 'block';
    } else {
      modulesTotalNote.style.display = 'none';
    }
  }

}

function updateDamageSummary() {
  const skillCards = document.querySelectorAll('#skills-list .skill-card');
  if (skillCards.length === 0) {
    document.getElementById('summary-total-damage').textContent = '—';
    document.getElementById('summary-total-dps').textContent = '—';
    document.getElementById('summary-skill-breakdown').innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 12px;">Add skills to see breakdown</div>';
    return;
  }

  const parseDurationSecondsEl = document.getElementById('parse-duration');
  let parseDurationSeconds = parseDurationSecondsEl ? parseFloat(parseDurationSecondsEl.value) : 180;
  if (Number.isNaN(parseDurationSeconds) || parseDurationSeconds <= 0) parseDurationSeconds = 180;

  let totalDamage = 0;
  let luckyHitCount = 0;
  const skillDamages = [];

  const lsAvgEl = document.getElementById('ls-avg');
  let lsAvg = 0;
  if (lsAvgEl) {
    if (lsAvgEl.dataset && lsAvgEl.dataset.value) lsAvg = parseFloat(lsAvgEl.dataset.value) || 0;
    else lsAvg = parseFloat(lsAvgEl.textContent.replace(/,/g, '')) || 0;
  }

  const psych = (typeof getPsychoscopeBonuses === 'function') ? getPsychoscopeBonuses() : {};
  const psychoscopeTargetLuckPct = (psych.targetLuckPct || 0) / 100;
  const finalLuckyChance = window._calc?.luckChancePct || 0;

  skillCards.forEach(card => {
    const id = card.id.replace('skill-card-', '');
    const nameInput = card.querySelector('.skill-name-input');
    const skillName = nameInput ? nameInput.value.trim() || `Skill ${id}` : `Skill ${id}`;
    const skillType = document.getElementById(`sk-type-${id}`)?.value || 'none';
    const triggersLucky = document.getElementById(`sk-lucky-trigger-${id}`).checked;

    // Use skill name as ID for tracking disabled items
    const itemId = `skill-${skillName}`;
    const isManualDisabled = window.disabledBreakdownItems.has(itemId);
    const imagineOriginSlot = card.getAttribute('data-imagine-skill-origin');
    let isAutoDisabled = false;
    if (skillType === 'imagine' && imagineOriginSlot) {
      const originSlot = Number(imagineOriginSlot);
      if (!Number.isNaN(originSlot) && originSlot >= 1 && originSlot <= 2) {
        const originState = getImagineState(originSlot);
        if (originState.mode === 'passive') {
          isAutoDisabled = true;
        }
      }
    }
    const isDisabled = isManualDisabled || isAutoDisabled;

    // Prefer cached numeric results when available (avoid reading formatted DOM)
    const skillResult = window._skillResults?.[id];
    let skillTotalDamage = 0;
    let hitsPerParse = 1;
    let triggersLuckyEffective = triggersLucky;
    if (skillResult) {
      hitsPerParse = skillResult.hitsPerParse || 1;
      skillTotalDamage = (skillResult.totalDamage != null) ? skillResult.totalDamage : (skillResult.avg || 0) * hitsPerParse;
      triggersLuckyEffective = typeof skillResult.triggersLucky === 'boolean' ? skillResult.triggersLucky : triggersLucky;
    } else {
      // Fallback: parse from DOM (legacy)
      let damageValue = 0;
      const avgEl = document.getElementById(`sk-res-avg-${id}`);
      if (avgEl && avgEl.textContent !== '—') {
        if (avgEl.dataset && avgEl.dataset.value) damageValue = parseFloat(avgEl.dataset.value) || 0;
      }
      const hitsEl = document.getElementById(`sk-hits-${id}`);
      const hitsValue = hitsEl ? parseFloat(hitsEl.value) : 1;
      hitsPerParse = Number.isNaN(hitsValue) ? 1 : hitsValue;
      skillTotalDamage = damageValue * hitsPerParse;
    }

    // Only add to total if not disabled
    if (!isDisabled) {
      totalDamage += skillTotalDamage;
    }

    if (triggersLuckyEffective && !isDisabled) {
      const skillLuckyChance = Math.min(finalLuckyChance + psychoscopeTargetLuckPct, 1);
      const luckUptimeBonus = skillResult.effectLuckUptime;
      luckyHitCount += hitsPerParse * skillLuckyChance * luckUptimeBonus;
    }

    skillDamages.push({
      name: skillName,
      totalDamage: skillTotalDamage,
      itemId: itemId,
      isDisabled: isDisabled
    });
  });

  if (luckyHitCount >= 0 && lsAvg > 0) {
    luckyHitCount = Math.floor(luckyHitCount); // round down to nearest whole lucky hit
    const luckyTotalDamage = lsAvg * luckyHitCount;
    const luckyItemId = 'lucky-hit';
    const isLuckyDisabled = window.disabledBreakdownItems.has(luckyItemId);
    
    // Only add to total if not disabled
    if (!isLuckyDisabled) {
      totalDamage += luckyTotalDamage;
    }
    
    skillDamages.push({
      name: `Lucky Hit${Number.isFinite(luckyHitCount) ? ` (${luckyHitCount})` : ''}`,
      totalDamage: luckyTotalDamage,
      itemId: luckyItemId,
      isDisabled: isLuckyDisabled
    });
  }

  // Calculate DPS
  const dps = totalDamage / parseDurationSeconds;

  // Update displays
  const totalDamageEl = document.getElementById('summary-total-damage');
  const dpsEl = document.getElementById('summary-total-dps');
  const breakdownEl = document.getElementById('summary-skill-breakdown');

  if (totalDamageEl) { totalDamageEl.textContent = Math.round(totalDamage).toLocaleString(); totalDamageEl.dataset.value = String(Math.round(totalDamage)); }
  if (dpsEl) dpsEl.textContent = fmt(dps);

  // Build breakdown
  if (breakdownEl) {
    if (skillDamages.length === 0) {
      breakdownEl.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 12px;">Add skills to see breakdown</div>';
    } else {
      const headerRow = `
        <div style="display: grid; grid-template-columns: 1fr auto auto auto; gap: 8px; padding: 6px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); align-items: center;">
          <div>Skill</div>
          <div style="text-align: right;">Total damage</div>
          <div style="text-align: right;">Per second</div>
          <div style="text-align: right; width: 50px;">% total</div>
        </div>
      `;
      const breakdownRows = skillDamages.map(skill => {
        const skillDps = skill.totalDamage / parseDurationSeconds;
        const skillPct = totalDamage > 0 ? ((skill.totalDamage / totalDamage) * 100).toFixed(1) : 0;
        const disabledClass = skill.isDisabled ? 'breakdown-row-disabled' : '';
        return `
          <div class="breakdown-row ${disabledClass}" data-item-id="${skill.itemId}" style="display: grid; grid-template-columns: 1fr auto auto auto; gap: 8px; padding: 6px 8px; background: rgba(255,255,255,0.02); border-radius: 3px; font-size: 11px; align-items: center; cursor: pointer; transition: opacity 0.15s ease;">
            <div style="color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${skill.name}</div>
            <div style="color: var(--accent); text-align: right; white-space: nowrap;" data-total-value="${Math.round(skill.totalDamage)}">${Math.round(skill.totalDamage).toLocaleString()}</div>
            <div style="color: var(--accent-green); text-align: right; white-space: nowrap;">${fmt(skillDps)}/s</div>
            <div style="color: var(--text-muted); text-align: right; width: 50px;">${skillPct}%</div>
          </div>
        `;
      }).join('');
      breakdownEl.innerHTML = headerRow + breakdownRows;
      setupBreakdownEventDelegation();
    }
  }
}
