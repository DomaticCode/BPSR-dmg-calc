// Full calculation function, called on any input change for re-calculating
// Uses modules_calc.js and classes/*.js for modules and class specific bonuses
function calc() {
  updateAtkLabels();
  // === MATK ===
  const intBase      = getVal('main-attr');
  const intPct       = getVal('int-pct') / 100;
  const mainStatPct  = getVal('main-stat-pct') / 100;
  // Psychoscope: prefer centralized provider getPsychoscopeBonuses() defined in damage-calc.html
  const psych = (typeof getPsychoscopeBonuses === 'function') ? getPsychoscopeBonuses() : {};
  const psychoscopeMainStat = psych.mainStat || 0;
  const psychoscopeMainStatPct = psych.mainStatPct || 0;
  const psychoscopeDreamDamage = psych.dreamDamage || 0;
  const psychoscopeLuckPct = psych.luckPct || 0;
  const psychoscopeLuckyDmgMult = psych.luckyStrikeMult || 0;
  const psychoscopeHighestSubstatPctBonus = psych.highestSubstatPctBonus || 0;

  const imagineBonuses = (typeof getImagineBonuses === 'function') ? getImagineBonuses() : {};
  const imagineMainStat = (imagineBonuses.mainStat || 0) / 100;
  const imagineMatkPct  = (imagineBonuses.matkPct || 0) / 100;
  const imagineGenDamagePct = (imagineBonuses.genDamagePct || 0) / 100;

  const imagineHastePct = (imagineBonuses.hastePct || 0) / 100;

  const optimizerFactor = getOptimizerFactor(); // substat factors
  const imagineCritStat = (imagineBonuses.critStat || 0) * optimizerFactor.crit;
  const imagineHasteStat = (imagineBonuses.hasteStat || 0) * optimizerFactor.haste;
  const imagineLuckStat = (imagineBonuses.luckStat || 0) * optimizerFactor.luck;
  const imagineMasteryStat = (imagineBonuses.masteryStat || 0) * optimizerFactor.mastery;
  const imagineVersatilityStat = (imagineBonuses.versatilityStat || 0) * optimizerFactor.vers;

  console.log(`imagine added substats: crit ${imagineCritStat.toFixed(2)}, haste ${imagineHasteStat, imagineHasteStat  .toFixed(2)}, luck ${imagineLuckStat.toFixed(2)}, mastery ${imagineMasteryStat.toFixed(2)}, vers ${imagineVersatilityStat.toFixed(2)}`);

  console.log(`imagine`)

  const intScaled    = (intBase + psychoscopeMainStat) * (1 + intPct + mainStatPct + psychoscopeMainStatPct + imagineMainStat);
  const weaponMatk   = getVal('base-atk');
  const foodEnabled = getChecked('food-enabled');
  const foodAtkBonus = foodEnabled ? getVal('food-atk') : 0;
  const foodDmgBonusPct = foodEnabled ? getVal('food-dmg-bonus') / 100 : 0;
  
  const matkPct      = getVal('matk-pct') / 100;
  let adaptiveMatk;
  let innerFloor;
  let matkBase;
  // Gather imagine-provided bonuses via a single helper (defined in damage-calc.html)

  console.log('Imagine bonuses:', imagineBonuses);

  const totalMatkPct = matkPct + imagineMatkPct;
  let effectiveAtk;

  const refinedAtk   = getVal('refined-atk');

  // === Defense ===
  const enemyArmour = getVal('enemy-armour', 2786);
  const physResAuto = enemyArmour / (enemyArmour + 6500);
  const overrideVal = document.getElementById('phys-resist-override').value;
  const physRes     = overrideVal !== '' ? parseFloat(overrideVal) / 100 : physResAuto;
  const resistance  = damageType === 'physical' ? physRes : (magResEnabled ? 0.08 : 0);
  document.getElementById('res-phys-tag').textContent = `Phys Res: ${(physResAuto * 100).toFixed(2)}%`;

  // === Inspiration ===
  const inspirationBonus = parseFloat(document.getElementById('inspiration').value) / 100;

  // === Substats — all use X/(X+19975)+base% except Versatility X/(X+11206)+base% ===
  const STAT_SCALER = 19975;
  const VERS_SCALER = 11206;
  // Base %s are now editable inputs (class loading sets them, user can override)
  const baseCrit    = getVal('base-crit-pct') / 100;
  const baseHaste   = getVal('base-haste-pct') / 100;
  const baseLuck    = getVal('base-luck-pct') / 100;
  const baseMastery = getVal('base-mastery-pct') / 100;
  const baseVers    = getVal('base-vers-pct') / 100;

  const baseCritStat = getVal('crit-rate-stat');
  
  const critStat      = baseCritStat + imagineCritStat;
  const critRatePct = (critStat > 0 ? critStat / (critStat + STAT_SCALER) : 0) + baseCrit + inspirationBonus;

  const versStat    = getVal('vers-dmg-pct');
  const versPct     = (versStat > 0 ? versStat / (versStat + VERS_SCALER) : 0) + baseVers + inspirationBonus;
  const versDmgPct  = versPct * 0.35;

  const luckStat        = getVal('luck-stat');
  const luckChanceBonus = getVal('luck-chance-bonus') / 100;
  const luckChancePct   = (luckStat > 0 ? luckStat / (luckStat + STAT_SCALER) : 0) + baseLuck + inspirationBonus + luckChanceBonus;

  const masteryStat  = getVal('mastery-stat');
  const masteryPct   = (masteryStat > 0 ? masteryStat / (masteryStat + STAT_SCALER) : 0) + baseMastery + inspirationBonus;

  const hasteStat    = getVal('haste-stat') + imagineHasteStat;
  const hastePct     = (hasteStat > 0 ? hasteStat / (hasteStat + STAT_SCALER) : 0) + baseHaste + inspirationBonus + imagineHastePct;

  // Modules LifeWave bonuses (RAW PERCENTS)
  let moduleBonusCrit = 0, moduleBonusLuck = 0, moduleBonusMastery = 0, moduleBonusVers = 0, moduleBonusHaste = 0;

  const moduleResults = window.computeModuleBonusesFromDOM ? window.computeModuleBonusesFromDOM() : {};
  // Update substat (lifewave raw percent) bonuses
  moduleBonusCrit = moduleResults.moduleBonusCrit || 0;
  moduleBonusLuck = moduleResults.moduleBonusLuck || 0;
  moduleBonusMastery = moduleResults.moduleBonusMastery || 0;
  moduleBonusVers = moduleResults.moduleBonusVers || 0;
  moduleBonusHaste = moduleResults.moduleBonusHaste || 0;
  // These are fully implemented buffs which directly affect damage.
  let moduleAtkBonus = moduleResults.moduleAtkBonus || 0; // ATK bonus (physical only)
  let moduleMatkBonus = moduleResults.moduleMatkBonus || 0; // MATK bonus (magical only)
  let moduleAllAtkBonus = moduleResults.moduleAllAtkBonus || 0; // All ATK bonus (applies to both physical and magical)
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
  

  // ATK/MATK calculations (needs updated values from modules)
  const totalAtkBonus = moduleAtkBonus + moduleAllAtkBonus;
  const totalMatkBonus = moduleMatkBonus + moduleAllAtkBonus;
  const displayAtk = damageType === 'physical' ? totalAtkBonus : totalMatkBonus;
  adaptiveMatk = displayAtk;
  const adaptiveAtkInput = document.getElementById('adaptive-atk');
  if (adaptiveAtkInput) adaptiveAtkInput.value = displayAtk;
  innerFloor = Math.floor(intScaled * 0.5 + adaptiveMatk + weaponMatk);
  matkBase = Math.floor(intScaled * 0.1 + innerFloor);
  effectiveAtk = Math.floor(matkBase * (1 + totalMatkPct) + foodAtkBonus);
  document.getElementById('attr-atk').value = matkBase;
  document.getElementById('eff-matk-display').value = effectiveAtk;
  matkPctSummary = imagineMatkPct > 0
    ? `[${atkLabel}%: ${(matkPct*100).toFixed(2)}% gear + ${(imagineMatkPct*100).toFixed(2)}% Imagines = ${(totalMatkPct*100).toFixed(2)}%]`
    : `[${atkLabel}%: ${(matkPct*100).toFixed(2)}% gear = ${(totalMatkPct*100).toFixed(2)}%]`;
  document.getElementById('matk-breakdown').innerHTML =
    `FLOOR(${intScaled.toFixed(2)}×0.1 + FLOOR(${intScaled.toFixed(2)}×0.5 + ${adaptiveMatk}(modules) + ${weaponMatk}(weapon)))` +
    ` = ${matkBase}` +
    `  →  FLOOR(${matkBase}×${(1+totalMatkPct).toFixed(3)}) + ${foodAtkBonus}(food) = <span class="hl">${effectiveAtk}</span>` +
    (psychoscopeMainStat > 0 ? `  <span style="color:#ff79c6">[Psychoscope: +${psychoscopeMainStat} INT]</span>` : '') +
    `  <span style="color:var(--accent-purple)">${matkPctSummary}</span>`;

  const elementalAtk = getVal('elemental-atk') + moduleElementalAtkBonus;
  const moduleAllElementalDmgPct = moduleElementalDmgStatBonus * (1/6665);

  let psBonusCrit = 0, psBonusLuck = 0, psBonusMastery = 0, psBonusHaste = 0;
  if (psychoscopeHighestSubstatPctBonus) {
    const substats = [
      { key: 'crit', val: critRatePct + moduleBonusCrit },
      { key: 'luck', val: luckChancePct + moduleBonusLuck },
      { key: 'mastery', val: masteryPct + moduleBonusMastery },
      { key: 'haste', val: hastePct + moduleBonusHaste },
    ];
    const highest = substats.reduce((a, b) => a.val >= b.val ? a : b);
    if (highest.key === 'crit')    psBonusCrit    = 0.03;
    if (highest.key === 'luck')    psBonusLuck    = 0.03;
    if (highest.key === 'mastery') psBonusMastery = 0.03;
    if (highest.key === 'haste')   psBonusHaste   = 0.03;
  }

  // include imagine-provided crit bonus into final crit stat before WL
  const finalCritPct    = critRatePct + moduleBonusCrit + psBonusCrit;
  const finalLuckPct    = luckChancePct + moduleBonusLuck + psBonusLuck + psychoscopeLuckPct;
  const finalMasteryPct = masteryPct + moduleBonusMastery + psBonusMastery;
  const finalVersPct    = versPct + moduleBonusVers;
  const finalHastePct   = hastePct + moduleBonusHaste + psBonusHaste;
  const finalVersDmgPct = finalVersPct * 0.35;

  // Update substat displays (dropped weapon-line until postWl* is computed)
  document.getElementById('sub-crit-pct').textContent    = (finalCritPct * 100).toFixed(2) + '%';
  document.getElementById('sub-vers-pct').textContent    = (finalVersPct * 100).toFixed(2) + '%';
  document.getElementById('sub-luck-pct').textContent    = (finalLuckPct * 100).toFixed(2) + '%';
  document.getElementById('sub-mastery-pct').textContent = (finalMasteryPct * 100).toFixed(2) + '%';
  document.getElementById('sub-haste-pct').textContent   = (finalHastePct * 100).toFixed(2) + '%';

  const critPctEl = document.getElementById('crit-rate-pct');
  if (critPctEl) critPctEl.value = (finalCritPct * 100).toFixed(2);

  const critMultPct = getVal('crit-mult', 150) / 100;
  const imagineCritDmgPct = (imagineBonuses && typeof imagineBonuses.critDmg === 'number') ? imagineBonuses.critDmg : 0;

  // === Target type ===
  const targetType    = document.getElementById('target-type').value;
  const isEliteOrBoss = targetType === 'elite' || targetType === 'boss';
  const isBoss        = targetType === 'boss';

  // === DMG Bonuses ===
  const elemPower      = getVal('elem-power');
  const elemPowerBonus = elemPower / (elemPower + 4457);
  const wlElemBonus    = getVal('wl-elem-bonus') / 100;
  const additionalElemDmg = getVal('elem-dmg-pct') / 100;

  // Weapon line substats: flat boosts added directly to final substat %s
  const wlCritBonus  = getVal('wl-crit-pct') / 100;
  const wlHasteBonus = getVal('wl-haste-pct') / 100;
  const wlLuckBonus  = getVal('wl-luck-pct') / 100;
  const wlVersBonus  = getVal('wl-vers-pct') / 100;
  const wlMasteryBonus = getVal('wl-mastery-pct') / 100;
  const postWlCritPct    = finalCritPct + wlCritBonus;
  const postWlHastePct   = finalHastePct + wlHasteBonus; 
  const postWlLuckPct    = finalLuckPct + wlLuckBonus;
  const postWlVersPct    = finalVersPct + wlVersBonus;
  const postWlMasteryPct = finalMasteryPct + wlMasteryBonus;
  const postWlVersDmgPct = postWlVersPct * 0.35;

  console.log("haste % = " + postWlHastePct);

  // Get class-provided bonus toggles (smite provider exposes simple flags/values)
  const classSelectVal = document.getElementById('class-select')?.value || 'none';
  const provider = window.CLASS_BONUS_PROVIDERS && window.CLASS_BONUS_PROVIDERS[classSelectVal];
  const classBonuses = typeof provider === 'function'
  ? (() => {
      try {
        return provider({
          crit: postWlCritPct,
          haste: postWlHastePct,
          luck: postWlLuckPct,
          vers: postWlVersPct,
          mastery: postWlMasteryPct,
          versDmg: postWlVersDmgPct
        });
      } catch (e) {
        console.warn('class bonus provider error', e);
        return {};
      }
    })()
  : {};

  const classElemBonus = classBonuses.classElemBonus || 0;
  const classMagBoost = classBonuses.classMagBoost || 0;
  const classLuckyDreamDamage = classBonuses.classLuckyDreamDamage || 0;
  const classLuckMult = classBonuses.classLuckMult || 0;
  const classLuckyFinalDmg = classBonuses.classLuckyFinalDmg || 1;

  let masteryElemBonus = 0;
  let masteryElemPct = 0;
  const masteryElemEl = document.getElementById('mastery-elem-dmg-pct');

  const bossDmgPct  = isBoss        ? getVal('boss-dmg-pct') / 100  : 0;
  const eliteDmgPct = isEliteOrBoss ? getVal('elite-dmg-pct') / 100 : 0;
  const moduleEliteDmgPct = isEliteOrBoss ? moduleEliteDmgBonus / 100 : 0;
  const genDmgBase  = getVal('gen-dmg-pct') / 100;
  const typeDmgPct = damageType === 'physical' ? modulePhysicalDmgBonus / 100 : moduleMagicDmgBonus / 100;
  const genDmgPct   = genDmgBase + bossDmgPct + eliteDmgPct + moduleEliteDmgPct + moduleAllDmgBonus / 100 + typeDmgPct + imagineGenDamagePct;
  let magBoostPct   = getVal('mag-boost-pct') / 100;
  magBoostPct += classMagBoost;

  let elemDmgPct = additionalElemDmg + elemPowerBonus + wlElemBonus + classElemBonus + moduleAllElementalDmgPct;

  // Update substat displays with weapon-line contributions (after postWl computed)
  document.getElementById('sub-crit-pct').textContent    = (postWlCritPct * 100).toFixed(2) + '%';
  document.getElementById('sub-vers-pct').textContent    = (postWlVersPct * 100).toFixed(2) + '%';
  document.getElementById('sub-luck-pct').textContent    = (postWlLuckPct * 100).toFixed(2) + '%';
  document.getElementById('sub-mastery-pct').textContent = (postWlMasteryPct * 100).toFixed(2) + '%';
  document.getElementById('sub-haste-pct').textContent   = (postWlHastePct * 100).toFixed(2) + '%';

  if (critPctEl) critPctEl.value = (postWlCritPct * 100).toFixed(2);

  const wlCritDmg      = getVal('wl-crit-dmg') / 100;
  const wlAtkDmg       = getVal('wl-atk-dmg') / 100;
  const wlMagicDmg     = getVal('wl-magic-dmg') / 100;

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
  const totalGenDmgPct    = genDmgPct + wlAtkDmg + wlMagicDmg;

  // === Lucky Strike DMG Mult ===
  const isManual      = document.getElementById('lucky-mult-manual').checked;

  const baseDreamDmgPct = psychoscopeDreamDamage + getVal('dream-dmg-pct') / 100;
  const dreamDmgPct = baseDreamDmgPct; // for standard hits
  const dreamDmgPctLucky = baseDreamDmgPct + classLuckyDreamDamage; // for lucky strikes

  let luckyMult;
  if (isManual) {
    luckyMult = getVal('lucky-mult-display') / 100;
  } else {
    let multPct = 40 + (postWlLuckPct * 100 * 0.25);
    multPct += (imagineBonuses && imagineBonuses.flamehornBoost) ? imagineBonuses.flamehornBoost : 0;
    multPct += psychoscopeLuckyDmgMult * 100;
    multPct += moduleLuckyStrikeBonus * 100;
    multPct += getVal('lucky-mult-bonus');
    multPct += classLuckMult;
    multPct *= classLuckyFinalDmg;
    luckyMult = multPct / 100;
    document.getElementById('lucky-mult-display').value = multPct.toFixed(2);
  }

  const luckyMultFinal  = luckyMult;
  const luckEffectBonus = getVal('luck-effect-bonus') / 100;
  const luckEffectPct   = postWlLuckPct + luckEffectBonus;

  const serumOilEnabled = getChecked('serum-oil-enabled');
  const serumOilType = document.getElementById('serum-oil-type')?.value || 'serum';
  const serumOilValue = serumOilEnabled ? getVal('serum-oil-value') : 0;
  const serumOilPct = serumOilEnabled && serumOilValue > 0 ? serumOilValue / (serumOilValue + 6494) : 0;
  if (serumOilEnabled && serumOilType === 'serum') {
    elemDmgPct += serumOilPct;
  }
  if (serumOilEnabled && serumOilType === 'oil') {
    magBoostPct += serumOilPct;
  }

  const atkDefReduced  = effectiveAtk * (1 - resistance);
  const defenseFreeAtk = refinedAtk + elementalAtk;

  const luckyGenPct  = totalGenDmgPct + luckEffectPct + foodDmgBonusPct;
  const luckyDmgMult = (1 + postWlVersDmgPct) * (1 + elemDmgPct) * (1 + luckyGenPct) * (1 + dreamDmgPctLucky) * (1 + magBoostPct);
  const luckyBase    = (effectiveAtk + defenseFreeAtk) * luckyMultFinal;
  const lsNormal     = luckyBase * luckyDmgMult;
  const lsCrit       = lsNormal * effectiveCritMult;
  const lsAvg        = lsNormal * (1 - postWlCritPct) + lsCrit * postWlCritPct;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('ls-normal', fmt(lsNormal));
  setText('ls-crit', fmt(lsCrit));
  setText('ls-avg', fmt(lsAvg));
  setText('s-atk-matk', fmt(effectiveAtk));
  setText('s-crit-chance', `${(postWlCritPct * 100).toFixed(2)}%`);
  setText('s-crit-dmg', `${(effectiveCritMult * 100).toFixed(2)}%`);
  setText('s-lucky-chance', `${(postWlLuckPct * 100).toFixed(2)}%`);

  setText('s-eff-atk', fmt(effectiveAtk));
  setText('s-def-atk', fmt(atkDefReduced));
  setText('s-elem-pct', `${(elemDmgPct * 100).toFixed(1)}%`);
  setText('s-crit-rate', `${(postWlCritPct * 100).toFixed(2)}%`);

  window._calc = {
    atkDefReduced, defenseFreeAtk, effectiveAtk,
    critRatePct: postWlCritPct, critMultPct: effectiveCritMult,
    masteryPct: finalMasteryPct, luckPct: postWlLuckPct, versPct: postWlVersPct,
    elemDmgPct, genDmgPct: totalGenDmgPct, versDmgPct: postWlVersDmgPct,
    luckyMult, luckyMultFinal, luckChancePct: postWlLuckPct, luckEffectPct,
    lsNormal, lsCrit, lsAvg, resistance,
    // breakdown parts for formula display
    _resLabel:  damageType === 'physical' ? `${(physRes*100).toFixed(1)}%` : (magResEnabled ? '8%' : '0%'),
    _additionalElem: additionalElemDmg, _elemPower: elemPowerBonus, _wlElem: wlElemBonus,
    _genBase: genDmgBase, _boss: bossDmgPct, _elite: eliteDmgPct, _dreamforce: dreamDmgPct,
    _psychoscopeDreamDamage: psychoscopeDreamDamage, _dreamManual: getVal('dream-dmg-pct') / 100,
    _wlAtk: wlAtkDmg, _wlMagic: wlMagicDmg,
    _luckyEff: luckEffectBonus, _totalGenDmgPct: totalGenDmgPct, _luckyGenPct: luckyGenPct, _magBoost: magBoostPct,
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
    _moduleAllElementalDmg: moduleAllElementalDmgPct,
    _moduleAllElementalDmgStat: moduleElementalDmgStatBonus,
    _moduleIntellect: moduleIntellectBonus,
    _moduleStrength: moduleStrengthBonus,
    _moduleAgility: moduleAgilityBonus,
    _moduleAllMainStat: moduleAllMainStatBonus,
    _damageType: damageType,
  };

  // helper: build class specific damage formula detail strings
  function getClassFormulaParts(kind = 'elem') {
    try {
      const classSelectVal = document.getElementById('class-select')?.value || 'none';
      const provider = window.CLASS_BONUS_PROVIDERS && window.CLASS_BONUS_PROVIDERS[classSelectVal];
      if (!provider) return '';
      const fn = (provider && typeof provider.provideFormulaParts === 'function')
        ? provider.provideFormulaParts
        : (provider && typeof provider === 'function' && typeof provider.provideFormulaParts === 'function') ? provider.provideFormulaParts : null;
      if (fn) {
        const parts = fn(kind);
        return parts || '';
      }
    } catch (e) {
      console.warn('class formula parts provider error', e);
    }
    return '';
  }

  // helper: build imagine specific damage formula detail strings
  function getImagineFormulaParts(kind = 'gen') {
    const parts = [];
    for (let slot = 1; slot <= 3; slot++) {
      const sel = document.getElementById(`imagine-${slot}`);
      if (!sel || sel.value === 'none') continue;
      const provider = window.IMAGINES && window.IMAGINES[sel.value];
      if (!provider || typeof provider.provideFormulaParts !== 'function') continue;
      try {
        const part = provider.provideFormulaParts(kind, slot);
        if (part) parts.push(part);
      } catch (e) {
        console.warn('imagine formula parts error', e);
      }
    }
    return parts.join(' + ');
  }

  function buildElemStr(c, specialAttackBonus = 0) {
    const ps = [];
    if (c._additionalElem) ps.push(`additional ${(c._additionalElem*100).toFixed(1)}%`);
    if (c._elemPower)    ps.push(`power ${(c._elemPower*100).toFixed(2)}%`);
    if (c._wlElem)       ps.push(`wl ${(c._wlElem*100).toFixed(2)}%`);
    if (c._serumOilType === 'serum' && c._serumOilPct) ps.push(`serum ${(c._serumOilPct*100).toFixed(2)}%`);
    if (c._moduleAllElementalDmg) ps.push(`modules ${(c._moduleAllElementalDmg*100).toFixed(2)}%`);
    // Allow class modules to inject elemental parts (e.g., Smite: Flowers/Thorn/Mastery)
    const classElemParts = getClassFormulaParts('elem');
    if (classElemParts) ps.push(classElemParts);
    const imagineElemParts = getImagineFormulaParts('elem');
    if (imagineElemParts) ps.push(imagineElemParts);
    const totalElem = c.elemDmgPct;
    return ps.length ? ps.join(' + ') + ` = ${(totalElem*100).toFixed(2)}%`: `${(totalElem*100).toFixed(2)}%`;
  }
  function buildGenStr(c, typePct, typeLabel) {
    const ps = [];
    if (c._genBase)   ps.push(`gen ${(c._genBase*100).toFixed(2)}%`);
    if (c._boss)      ps.push(`boss ${(c._boss*100).toFixed(2)}%`);
    if (c._elite)     ps.push(`elite ${(c._elite*100).toFixed(2)}%`);
    if (c._moduleEliteDmg) ps.push(`elite-strike ${(c._moduleEliteDmg*100).toFixed(2)}%`);
    if (c._wlAtk)     ps.push(`wl-atk ${(c._wlAtk*100).toFixed(2)}%`);
    if (c._wlMagic)   ps.push(`wl-mag ${(c._wlMagic*100).toFixed(2)}%`);
    if (c._foodDmgBonusPct) ps.push(`food ${(c._foodDmgBonusPct*100).toFixed(2)}%`);
    if (c._moduleAllDmg) ps.push(`modules-all ${(c._moduleAllDmg*100).toFixed(2)}%`);
    if (c._damageType === 'magical' && c._moduleMagicDmg) ps.push(`modules-magic ${(c._moduleMagicDmg*100).toFixed(2)}%`);
    if (c._damageType === 'physical' && c._modulePhysicalDmg) ps.push(`modules-phys ${(c._modulePhysicalDmg*100).toFixed(2)}%`);
    if (typePct)      ps.push(`${typeLabel} ${(typePct*100).toFixed(2)}%`);
    const classGenParts = getClassFormulaParts('gen');
    if (classGenParts) ps.push(classGenParts);
    const imagineGenParts = getImagineFormulaParts('gen');
    if (imagineGenParts) ps.push(imagineGenParts);
    const total = c._totalGenDmgPct + (c._foodDmgBonusPct||0) + (typePct||0);
    return ps.length ? ps.join(' + ') + `=${(total*100).toFixed(2)}%` : `${(total*100).toFixed(2)}%`;
  }
  function buildDreamStr(c) {
    const ps = [];
    if (c._psychoscopeDreamDamage) ps.push(`psychoscope ${(c._psychoscopeDreamDamage*100).toFixed(2)}%`);
    if (c._dreamManual)    ps.push(`manual ${(c._dreamManual*100).toFixed(2)}%`);
    const classDreamParts = getClassFormulaParts('dream');
    if (classDreamParts) ps.push(classDreamParts);
    const imagineDreamParts = getImagineFormulaParts('dream');
    if (imagineDreamParts) ps.push(imagineDreamParts);
    return ps.length ? ps.join(' + ') + `=${(c._dreamforce*100).toFixed(2)}%` : `${(c._dreamforce*100).toFixed(2)}%`;
  }
  function buildLuckyGenStr(c) {
    const ps = [];
    if (c._genBase)     ps.push(`gen ${(c._genBase*100).toFixed(2)}%`);
    if (c._boss)        ps.push(`boss ${(c._boss*100).toFixed(2)}%`);
    if (c._elite)       ps.push(`elite ${(c._elite*100).toFixed(2)}%`);
    if (c._wlAtk)       ps.push(`wl-atk ${(c._wlAtk*100).toFixed(2)}%`);
    if (c._wlMagic)     ps.push(`wl-mag ${(c._wlMagic*100).toFixed(2)}%`);
    if (c._foodDmgBonusPct) ps.push(`food ${(c._foodDmgBonusPct*100).toFixed(2)}%`);
    if (c._moduleAllDmg) ps.push(`modules-all ${(c._moduleAllDmg*100).toFixed(2)}%`);
    if (c._damageType === 'magical' && c._moduleMagicDmg) ps.push(`modules-magic ${(c._moduleMagicDmg*100).toFixed(2)}%`);
    if (c._damageType === 'physical' && c._modulePhysicalDmg) ps.push(`modules-phys ${(c._modulePhysicalDmg*100).toFixed(2)}%`);
    ps.push(`luck-eff ${(c.luckEffectPct*100).toFixed(2)}%`);
    const classLuckyGenParts = getClassFormulaParts('luckyGen');
    if (classLuckyGenParts) ps.push(classLuckyGenParts);
    const imagineLuckyGenParts = getImagineFormulaParts('luckyGen');
    if (imagineLuckyGenParts) ps.push(imagineLuckyGenParts);
    return ps.length ? ps.join(' + ') + `=${(c._luckyGenPct*100).toFixed(2)}%` : `${(c._luckyGenPct*100).toFixed(2)}%`;
  }
  function buildDreamStrLucky(c) {
    const ps = [];
    if (c._psychoscopeDreamDamage) ps.push(`psychoscope ${(c._psychoscopeDreamDamage*100).toFixed(2)}%`);
    if (c._dreamManual)    ps.push(`manual ${(c._dreamManual*100).toFixed(2)}%`);
    const classDreamLuckyParts = getClassFormulaParts('dreamLucky');
    if (classDreamLuckyParts) ps.push(classDreamLuckyParts);
    const imagineDreamLuckyParts = getImagineFormulaParts('dreamLucky');
    if (imagineDreamLuckyParts) ps.push(imagineDreamLuckyParts);
    const total = dreamDmgPctLucky;
    return ps.length ? ps.join(' + ') + `=${(total*100).toFixed(2)}%` : `${(total*100).toFixed(2)}%`;
  }
  window._buildElemStr    = buildElemStr;
  window._buildGenStr     = buildGenStr;
  window._buildDreamStr   = buildDreamStr;
  window._buildDreamStrLucky = buildDreamStrLucky;
  window._buildLuckyGenStr = buildLuckyGenStr;

  updateImagineNotes();

  const c = window._calc;
  const tgLabel = targetType === 'boss' ? 'Boss' : targetType === 'elite' ? 'Elite' : 'Normal';
  const luTags = [];
  const luckyTag = luTags.length ? ` [${luTags.join(', ')}]` : '';

  document.getElementById('formula-preview').innerHTML =
    `<span style="color:var(--text-muted)">Target: ${tgLabel} | ${damageType.charAt(0).toUpperCase()+damageType.slice(1)}</span>\n` +
    `<span class="fb">Standard hit:</span>\n` +
    `(( <span class="fb">${atkLabel}(${effectiveAtk})</span>×(1-${c._resLabel}) + <span class="fref">Refined(${(refinedAtk)})</span> + <span class="felem">Elemental(${(elementalAtk)})</span>)` +
    `\n× <span class="fvers">(1 + Vers: ${(postWlVersDmgPct*100).toFixed(2)}%)</span>\n` +
    `× <span class="felem">(1 + Elem: ${buildElemStr(c)})</span>\n` +
    `× <span class="fg">(1 + Gen: ${buildGenStr(c, 0, '')})</span>\n` +
    `× <span class="fdream">(1 + Dream: ${buildDreamStr(c)})</span>\n` +
    `× <span class="fmag">(1 + MAG: ${(c._magBoost || 0)*100 >= 0 ? (c._magBoost*100).toFixed(2) : '0.0'}%)</span>\n` +
    `× <span class="fr">CRIT DMG(${(effectiveCritMult*100).toFixed(2)}%) (if crit)</span>\n\n` +
    `<span class="fp">Lucky Strike${luckyTag}:</span>\n` +
    `( <span class="fb">${atkLabel}(${effectiveAtk})</span> + <span class="fref">Refined(${(refinedAtk)})</span> + <span class="felem">Elemental(${(elementalAtk)})</span>)` +
    `\n× <span class="fls">Lucky Strike DMG Mult(${(luckyMult*100).toFixed(2)}%)</span>\n` +
    `× <span class="fvers">(1+Vers: ${(postWlVersDmgPct*100).toFixed(2)}%)</span>\n` +
    `× <span class="felem">(1+Elem: ${buildElemStr(c)})</span>\n` +
    `× <span class="fg">(1+Gen+LuckEff: (${buildLuckyGenStr(c)})</span>)\n` +
    `× <span class="fdream">(1 + Dream: ${buildDreamStrLucky(c)})</span>\n` +
    `× <span class="fmag">(1 + MAG: ${(c._magBoost || 0)*100 >= 0 ? (c._magBoost*100).toFixed(2) : '0.0'}%)</span>\n` +
    `× <span class="fr">CRIT DMG(${(effectiveCritMult*100).toFixed(2)}%) (if crit)</span>\n`;

  if (!optimizingSubstats && optimizerDone) {
    const output = document.getElementById('optimize-substats-output');
    if (output) {
      output.textContent = 'Inputs changed after optimization; re-run Optimize to refresh result.';
    }
    optimizerDone = false;
  }

  skills.forEach(s => calcSkill(s.id));
  persistCurrentState();

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
      const disclaimer = `(Main stat bonuses are expected to be in your Main Stat input (sheet value), the values shown here are just for reference)`;
      modulesTotalNote.innerHTML = `Module Bonuses: ${noteParts.join(', ')}<br><span style="display:block; margin-top:4px;">${disclaimer}</span>`;
      modulesTotalNote.style.display = 'block';
    } else {
      modulesTotalNote.style.display = 'none';
    }
  }

}
