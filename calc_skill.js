function calcSkill(id) {
  const c = window._calc;
  if (!c) return;


  const psych = (typeof getPsychoscopeBonuses === 'function') ? getPsychoscopeBonuses() : {};
  const psychoscopeTargetLuckPct = (psych.targetLuckPct || 0) / 100;
  const psychoscopeTargetCritPct = (psych.targetCritPct || 0) / 100;

  const imagineBonuses = (typeof getImagineBonuses === 'function') ? getImagineBonuses() : {};
  const imagineExpertiseDmgPct = (imagineBonuses.expertiseDmgPct || 0) / 100;
  const imagineSpecialSkillDmgPct = (imagineBonuses.specialDmgPct || 0) / 100;
  // don't believe these two exist at all, added for future
  const imagineBasicSkillDmgPct = (imagineBonuses.basicSkillDmgPct || 0) / 100; 
  const imagineUltimateSkillDmgPct = (imagineBonuses.ultimateSkillDmgPct || 0) / 100;

  const foodAtkBonus = c._foodAtkBonus || 0;
  const foodDmgBonusPct = c._foodDmgBonusPct || 0;

  const mult        = parseFloat(document.getElementById(`sk-mult-${id}`).value) / 100 || 0;
  const flat        = parseFloat(document.getElementById(`sk-flat-${id}`).value) || 0;
  const skillType   = document.getElementById(`sk-type-${id}`).value;
  const triggersLucky = document.getElementById(`sk-lucky-trigger-${id}`).checked;

  // TODO add companion bonuses for marksman.
  const typeMap   = { expertise: 'type-dmg-expertise', special: 'type-dmg-special', basic: 'type-dmg-basic', ultimate: 'type-dmg-ultimate' };
  const typeLabel = { expertise: 'Expertise', special: 'Special', basic: 'Basic', ultimate: 'Ultimate' };
  let typeDmgPct = typeMap[skillType] ? getVal(typeMap[skillType]) / 100 : 0;
  if(skillType === 'expertise'){
    typeDmgPct += imagineExpertiseDmgPct || 0;
  } else if(skillType === 'special') {
    typeDmgPct += imagineSpecialSkillDmgPct || 0;
  } else if (skillType === 'ultimate') {
    typeDmgPct += imagineUltimateSkillDmgPct || 0;
  } else if (skillType === 'basic') {
    typeDmgPct += imagineBasicSkillDmgPct || 0;
  }


  const effectRows = Array.from(document.querySelectorAll(`#skill-effects-${id} .skill-effect-row`));
  let effectGen = 0, effectDream = 0, effectCritChance = 0, effectCritDmg = 0, effectElem = 0, effectMagBoost = 0;
  effectRows.forEach(row => {
    const kind = row.querySelector('select')?.value;
    const value = parseFloat(row.querySelector('input')?.value);
    if (!kind || Number.isNaN(value) || value === 0) return;
    switch (kind) {
      case 'generic': effectGen += value / 100; break;
      case 'dreamDmg': effectDream += value / 100; break;
      case 'critChance': effectCritChance += value / 100; break;
      case 'critDamage': effectCritDmg += value / 100; break;
      case 'elemDmg': effectElem += value / 100; break;
      case 'magBoost': effectMagBoost += value / 100; break;
    }
  });

  effectCritChance += psychoscopeTargetCritPct;

  const totalGen = c.genDmgPct + c._foodDmgBonusPct + typeDmgPct + effectGen;
  const specialAttackElemBonus = (skillType === 'special') ? (c._moduleSpecialAttackElem || 0) : 0;
  const finalElemDmgPct = c.elemDmgPct + effectElem + specialAttackElemBonus;
  const finalDreamDmgPct = c._dreamforce + effectDream;
  const finalCritRatePct = Math.min(1, c.critRatePct + effectCritChance);
  const finalCritMult = c.critMultPct + effectCritDmg;
  const finalMagBoost = (c._magBoost || 0) + effectMagBoost;
  const oblivionPct = c._oblivionPct || 0;

  const stdBase   = (c.atkDefReduced + c.defenseFreeAtk) * mult + flat;
  const stdMult   = (1 + c.versDmgPct) * (1 + finalElemDmgPct) * (1 + totalGen) * (1 + finalDreamDmgPct) * (1 + finalMagBoost) * (1 + oblivionPct);
  const normalHit = stdBase * stdMult;
  const critHit   = normalHit * finalCritMult;
  const avgSkillHit = normalHit * (1 - finalCritRatePct) + critHit * finalCritRatePct;

  const luckyContrib  = triggersLucky ? (c.luckChancePct + psychoscopeTargetLuckPct) * c.lsAvg : 0;
  const avgWithLucky  = avgSkillHit + luckyContrib;

  document.getElementById(`sk-res-normal-${id}`).textContent = fmt(normalHit);
  document.getElementById(`sk-res-crit-${id}`).textContent   = fmt(critHit);
  document.getElementById(`sk-res-avg-${id}`).textContent    = fmt(avgSkillHit);
  document.getElementById(`sk-res-lucky-${id}`).textContent  = triggersLucky ? fmt(avgWithLucky) : '—';
  document.getElementById(`sk-res-lucky-${id}`).style.opacity = triggersLucky ? '1' : '0.3';

  // Build per-skill formula (only if a type is selected)
  const formulaEl = document.getElementById(`sk-formula-${id}`);
  const effectsCount = Array.from(document.querySelectorAll(`#skill-effects-${id} .skill-effect-row`))
    .filter(row => {
      const value = parseFloat(row.querySelector('input')?.value);
      return !Number.isNaN(value) && value !== 0;
    }).length;
  const showFormula = skillType !== 'none' || effectsCount > 0;

  if (formulaEl && showFormula) {
    const typeName = skillType !== 'none' ? typeLabel[skillType] : 'Skill';
    const baseGenStr = window._buildGenStr ? window._buildGenStr(c, typeDmgPct, typeName) : `${(totalGen*100).toFixed(2)}%`;
    const baseElemStr = window._buildElemStr ? window._buildElemStr(c, specialAttackElemBonus) : `${((c.elemDmgPct + specialAttackElemBonus)*100).toFixed(2)}%`;
    const baseDreamStr =  window._buildDreamStr ? window._buildDreamStr(c) : `${(c._dreamforce*100).toFixed(2)}%`;

    const finalGenStr = effectGen !== 0
      ? `${baseGenStr} + generic ${(effectGen*100).toFixed(2)}% = ${(totalGen*100).toFixed(2)}%`
      : `${baseGenStr}`;
    const finalElemStr = effectElem !== 0
      ? `${baseElemStr} + elem ${(effectElem*100).toFixed(2)}% = ${(finalElemDmgPct*100).toFixed(2)}%`
      : `${baseElemStr}`;
    const finalDreamStr = effectDream !== 0
      ? `${baseDreamStr}% + dream ${(effectDream*100).toFixed(2)}% = ${(finalDreamDmgPct*100).toFixed(2)}%`
      : `${baseDreamStr}%`;
    const critRateText = effectCritChance !== 0
      ? `${(c.critRatePct*100).toFixed(2)}% + ${(effectCritChance*100).toFixed(2)}% = ${(finalCritRatePct*100).toFixed(2)}%`
      : `${(c.critRatePct*100).toFixed(2)}%`;
    const critMultText = effectCritDmg !== 0
      ? `${(c.critMultPct*100).toFixed(2)}% + ${(effectCritDmg*100).toFixed(2)}% = ${(finalCritMult*100).toFixed(2)}%`
      : `${(c.critMultPct*100).toFixed(2)}%`;
    const magText = effectMagBoost !== 0
      ? `${((c._magBoost || 0)*100).toFixed(2)}% + ${(effectMagBoost*100).toFixed(2)}% = ${(finalMagBoost*100).toFixed(2)}%`
      : `${((c._magBoost || 0)*100).toFixed(2)}%`;

    formulaEl.style.display = '';
    formulaEl.innerHTML =
      `<span class="fb">${typeName}:</span> ` +
      `<span class="fwhite">(</span> <span class="fb">${atkLabel}</span><span class="fwhite">×(1-${c._resLabel})<span> + <span class="fref">Refined</span> + <span class="felem">Elemental</span> ) × <span class="fwhite">${(mult*100).toFixed(2)}%</span> + <span class="fwhite">${flat}</span>\n` +
      `× <span class="fvers">(1+Vers:${(c.versDmgPct*100).toFixed(2)}%)</span>\n` +
      `× <span class="felem">(1+Elem:${finalElemStr})</span>\n` +
      `× <span class="fg">(1+Gen:${finalGenStr})</span>\n` +
      `× <span class="fdream">(1+Dream:${finalDreamStr})</span>\n` +
      `× <span class="fmag">(1+MAG:${magText})</span>\n` +
      `${oblivionPct ? `× <span class="fob">(1+Oblivion: ${(oblivionPct*100).toFixed(2)}%)</span>\n` : ''}` +
      `× <span class="fr">CRIT(${critMultText}) (if crit)</span>\n`;
  } else if (formulaEl) {
    formulaEl.style.display = 'none';
  }

  // Keep persistent state in sync when skill changes are made.
  if (typeof window.updateSkillCompact === 'function') {
    window.updateSkillCompact(id);
  }

  try { persistCurrentState(); } catch (e) { console.warn('Failed to persist skill state', e); }
}