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
  const typeLabel = { expertise: 'Expertise', special: 'Special', basic: 'Basic', ultimate: 'Ultimate', imagine: 'Imagine', 'imagine(passive)': 'Imagine (passive)' };
  const isImagineType = skillType === 'imagine' || skillType === 'imagine(passive)';
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


  const parseSkillEffectValue = rawValue => {
    const valueText = String(rawValue || '').trim();
    if (valueText === '') return 0;
    const numericValue = Number(valueText);
    if (!Number.isNaN(numericValue) && /^[+-]?(?:\d+|\d*\.\d+)(?:[eE][+-]?\d+)?$/.test(valueText)) {
      return numericValue;
    }
    // Try to evaluate as expression
    return evaluateExpression(valueText);
  };

  const evaluateExpression = expr => {
    try {
      let result = expr;
      // Replace special placeholder "luck-effect"
      result = result.replace(/\bluck-effect(?!-)\b/g, () => (c.luckEffectPct || 0) * 100);
      // Replace input IDs with their values (e.g., "sub-luck-pct" -> actual value)
      const idPattern = /(#?[a-zA-Z_][a-zA-Z0-9_-]*)/g;
      result = result.replace(idPattern, (match) => {
        const targetId = match.replace(/^#/, '');
        const element = document.getElementById(targetId);
        if (element) {
          const val = element.value !== undefined ? element.value : element.textContent;
          const cleaned = String(val || '').trim().replace(/%$/, '');
          const num = parseFloat(cleaned);
          return Number.isNaN(num) ? match : num;
        }
        return match;
      });
      // Safe evaluation: only allow numbers, operators, and parentheses
      if (!/^[0-9+\-*/%().\s]+$/.test(result)) {
        return 0;
      }
      const evaluated = Function('"use strict"; return (' + result + ')')();
      return Number.isNaN(evaluated) || !Number.isFinite(evaluated) ? 0 : evaluated;
    } catch (e) {
      return 0;
    }
  };

  const effectRows = Array.from(document.querySelectorAll(`#skill-effects-${id} .skill-effect-row`));
  let effectGen = 0, effectDream = 0, effectCritChance = 0, effectCritDmg = 0, effectElem = 0, effectMagBoost = 0, effectOtherScaler = 0, effectFinalDamage = 0, effectNoIntellectBoostDeduction = 0, effectNoAgilityBoostAtk = 0, skillDamageType = null, luckEffectBonus = 0;
  let effectNoElem = false, effectNoElemAtk = false, effectNoDream = false, effectNoMagBoost = false, effectNoVers = false, effectNoGen = false, effectNoWlAtk = false, effectNoWlMagic = false, effectNoAgilityBoost = false, effectNoWlRanged = false;
  let luckEffectSkill = false;
  effectRows.forEach(row => {
    const kind = row.querySelector('select')?.value;
    const rawValue = row.querySelector('input')?.value;
    const valueText = String(rawValue || '').trim().toLowerCase();
    if (!kind) return;
    if (kind === 'damageType') {
      const tokens = valueText.split(/\s+/).filter(Boolean);
      let noIntellectBoost = false;
      tokens.forEach(token => {
        if (token === 'physical') skillDamageType = 'physical';
        else if (token === 'magical') skillDamageType = 'magical';
        else if (token === 'no-intellect-boost') noIntellectBoost = true;
        else if (token === 'no-agility-boost') effectNoAgilityBoost = true;
        else if (['no-elem', 'no-element', 'no-elemental'].includes(token)) effectNoElem = true;
        else if (['no-elem-atk', 'no-elemental-atk'].includes(token)) effectNoElemAtk = true;
        else if (['imagine'].includes(token)) {
          effectNoElemAtk = true;
          effectNoElem = true;
          effectNoWlAtk = true;
          effectNoWlMagic = true;
          effectNoWlRanged = true;
          noIntellectBoost = true;
          effectNoAgilityBoost = true;
        }
        else if (['no-season-dmg', 'no-seasonal-dmg', 'no-season'].includes(token)) effectNoDream = true;
        else if (token === 'no-mag' || token === 'no-phy') effectNoMagBoost = true;
        else if (['no-vers', 'no-versatility'].includes(token)) effectNoVers = true;
        else if (['no-gen', 'no-generic'].includes(token)) effectNoGen = true;
        else if (['no-typed-dmg', 'no-type-dmg'].includes(token)){
          effectNoWlAtk = true;
          effectNoWlMagic = true;
          effectNoWlRanged = true;
        }
        else if (token === 'no-wl-atk-dmg') effectNoWlAtk = true;
        else if (token === 'no-wl-magic-dmg') effectNoWlMagic = true;
        else if (token === 'no-wl-ranged-dmg') effectNoWlRanged = true;
        else if (token === 'luck-effect') {
          luckEffectSkill = true;
          luckEffectBonus = c.luckEffectPct || 0;
        }
      });
      if (noIntellectBoost) {
        const intellectBoostLevel = Array.from(document.querySelectorAll('.module-card')).reduce((maxLevel, card) => {
          const selectedModule = card.dataset.selectedModule || '';
          if (selectedModule !== 'intellect-boost') return maxLevel;
          const moduleId = card.id.replace(/^module-card-/, '');
          const level = parseInt(document.getElementById(`module-level-${moduleId}`)?.value, 10) || 0;
          return Math.max(maxLevel, level);
        }, 0);
        if (intellectBoostLevel === 5) effectNoIntellectBoostDeduction = 0.036;
        else if (intellectBoostLevel === 6) effectNoIntellectBoostDeduction = 0.06;
      }
      return;
    }
    const value = parseSkillEffectValue(rawValue);
    if (Number.isNaN(value) || value === 0) return;
    switch (kind) {
      case 'generic': effectGen += value / 100; break;
      case 'dreamDmg': effectDream += value / 100; break;
      case 'critChance': effectCritChance += value / 100; break;
      case 'critDamage': effectCritDmg += value / 100; break;
      case 'elemDmg': effectElem += value / 100; break;
      case 'magBoost': effectMagBoost += value / 100; break;
      case 'otherScaler': effectOtherScaler += value / 100; break;
      case 'finalDamage': effectFinalDamage += value / 100; break;
    }
  });

  if (isImagineType) {
    effectNoElem = true;
    effectNoElemAtk = true;
    effectNoWlAtk = true;
    effectNoWlMagic = true;
    effectNoWlRanged = true;
    effectNoAgilityBoost = true;
    const intellectBoostLevel = Array.from(document.querySelectorAll('.module-card')).reduce((maxLevel, card) => {
      const selectedModule = card.dataset.selectedModule || '';
      if (selectedModule !== 'intellect-boost') return maxLevel;
      const moduleId = card.id.replace(/^module-card-/, '');
      const level = parseInt(document.getElementById(`module-level-${moduleId}`)?.value, 10) || 0;
      return Math.max(maxLevel, level);
    }, 0);
    if (intellectBoostLevel === 5) effectNoIntellectBoostDeduction = 0.036;
    else if (intellectBoostLevel === 6) effectNoIntellectBoostDeduction = 0.06;
  }

  if (effectNoAgilityBoost) {
    const agilityBoostLevel = Array.from(document.querySelectorAll('.module-card')).reduce((maxLevel, card) => {
      const selectedModule = card.dataset.selectedModule || '';
      if (selectedModule !== 'agility-boost') return maxLevel;
      const moduleId = card.id.replace(/^module-card-/, '');
      const level = parseInt(document.getElementById(`module-level-${moduleId}`)?.value, 10) || 0;
      return Math.max(maxLevel, level);
    }, 0);
    const agilityBoostAtkValues = [0, 5, 10, 15, 20, 25, 30];
    effectNoAgilityBoostAtk = agilityBoostAtkValues[agilityBoostLevel] || 0;
  }

  effectCritChance += psychoscopeTargetCritPct;
  effectCritChance = Math.max(effectCritChance, -c.critRatePct); // Don't allow negative crit rate

  const preDeductionGen = c.genDmgPct + c._foodDmgBonusPct + typeDmgPct + effectGen + luckEffectBonus;
  const specialAttackElemBonus = (skillType === 'special') ? (c._moduleSpecialAttackElem || 0) : 0;
  const originalGen = preDeductionGen;
  const originalElem = c.elemDmgPct + effectElem + specialAttackElemBonus;
  const originalDream = c._dreamDmgPct + effectDream;
  const originalMag = (c._magBoost || 0) + effectMagBoost;
  const originalVers = c.versDmgPct;
  const totalGen = effectNoGen ? 0 : preDeductionGen - effectNoIntellectBoostDeduction - (effectNoWlAtk ? (c._wlAtk || 0) : 0) - (effectNoWlMagic ? (c._wlMagic || 0) : 0) - (effectNoWlRanged ? (c._wlRanged || 0) : 0);
  const finalElemDmgPct = effectNoElem ? 0 : originalElem;
  const finalDreamDmgPct = effectNoDream ? 0 : originalDream;
  const finalCritRatePct = Math.min(1, c.critRatePct + effectCritChance);
  const finalCritMult = c.critMultPct + effectCritDmg;
  const finalMagBoost = effectNoMagBoost ? 0 : originalMag;
  const versDmgPct = effectNoVers ? 0 : originalVers;
  const finalDmgPct = c._finalDmgPct + effectFinalDamage;

  const skillResistance = skillDamageType === 'physical' ? c._physRes : (skillDamageType === 'magical' ? (c._magResEnabled ? 0.08 : 0) : c.resistance);
  let effectiveAtk = c.effectiveAtk;
  if (effectNoAgilityBoost && c._damageType === 'physical' && typeof c._matkBase === 'number' && typeof c._totalMatkPct === 'number') {
    effectiveAtk = Math.floor(Math.max(0, c._matkBase - effectNoAgilityBoostAtk) * (1 + c._totalMatkPct) + c._foodAtkBonus);
  }
  const skillAtkDefReduced = effectiveAtk * (1 - skillResistance);
  const classElementalAtk = c.classElementalAtk || 0;
  const defenseFreeAtk = effectNoElemAtk ? Math.max(0, c.defenseFreeAtk - classElementalAtk) : c.defenseFreeAtk;
  const stdBase   = (skillAtkDefReduced + defenseFreeAtk) * mult + flat;
  const stdMult   = (1 + versDmgPct) * (1 + finalElemDmgPct) * (1 + totalGen) * (1 + finalDreamDmgPct) * (1 + finalMagBoost) * (1 + effectOtherScaler) * (1 + finalDmgPct); // Assume final is after other

  let additionalDamage = 0;
  if (imagineBonuses.additionalDamageProc !== undefined && skillType !== 'none') {
    const additionalDamageProc = imagineBonuses.additionalDamageProc / 100 || 0;
    additionalDamage = effectiveAtk * additionalDamageProc * stdMult;
  }
  const normalHit = (stdBase * stdMult) + additionalDamage;
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
      const rawValue = row.querySelector('input')?.value;
      const value = parseSkillEffectValue(rawValue);
      return !Number.isNaN(value) && value !== 0;
    }).length;
  const showFormula = skillType !== 'none' || effectsCount > 0;

  if (formulaEl && showFormula) {
    const typeName = skillType !== 'none' ? typeLabel[skillType] : 'Skill';
    const skipWl = effectNoWlAtk || effectNoWlMagic;
    const baseGenStr = window._buildGenStr ? window._buildGenStr(c, typeDmgPct, typeName, { skipWl }) : `${(totalGen*100).toFixed(2)}%`;
    const baseElemStr = window._buildElemStr ? window._buildElemStr(c, specialAttackElemBonus, { skipSources: effectNoElem && isImagineType }) : `${((c.elemDmgPct + specialAttackElemBonus)*100).toFixed(2)}%`;
    const baseDreamStr =  window._buildDreamStr ? window._buildDreamStr(c) : `${(c._dreamDmgPct*100).toFixed(2)}%`;

    const finalGenStr = (() => {

      if (effectNoGen) {
        return '0.00%';
      }
      // Strip out any existing total (e.g., "=14.00%") and split by the '+' sign
      const cleanBase = baseGenStr.replace(/\s*=\s*\d+(\.\d+)?%$/, '');
      const baseComponents = cleanBase.split('+').map(s => s.trim());

      // Filter out components that are being removed
      const activeComponents = baseComponents.filter(component => {
        if (effectNoWlRanged && component.startsWith('wl-ranged')) return false;
        if (effectNoWlMagic && component.startsWith('wl-magic')) return false;
        if (effectNoWlAtk && component.startsWith('wl-atk')) return false;
        if (effectNoIntellectBoostDeduction > 0 && component.startsWith('modules-magic')) return false;
        return true; // Keep everything else
      });

      if (effectGen !== 0) {
        activeComponents.push(`generic ${(effectGen * 100).toFixed(2)}%`);
      }

      let resultStr = activeComponents.join(' + ');

      let currentTotal = originalGen; 
      if (effectNoIntellectBoostDeduction) currentTotal -= effectNoIntellectBoostDeduction;
      if (effectNoWlAtk)    currentTotal -= (c._wlAtk || 0);
      if (effectNoWlMagic)  currentTotal -= (c._wlMagic || 0);
      if (effectNoWlRanged) currentTotal -= (c._wlRanged || 0);
      
      if (activeComponents.length > 1) {
        resultStr += ` = ${(currentTotal * 100).toFixed(2)}%`;
      } else if (activeComponents.length === 0) {
        resultStr = `0.00%`;
      }

      return resultStr;
    })();
    // TODO the above way is much easier to read for code and user, leaving these below in old style for now because lazy
    const finalElemStr = (() => {
      if (effectNoElem && isImagineType) {
        return '0%';
      }
      let result = baseElemStr;
      if (effectElem !== 0) {
        if (result.includes('=')) {
          result = result.replace(/= \d+\.\d+%$/, '') + ` + elem ${(effectElem*100).toFixed(2)}% = ${(originalElem*100).toFixed(2)}%`;
        } else {
          result = `${result} + elem ${(effectElem*100).toFixed(2)}% = ${(originalElem*100).toFixed(2)}%`;
        }
      }
      if (effectNoElem) {
        if (!result.includes('=')) result += ` = ${(originalElem*100).toFixed(2)}%`;
        result += ` - no-elem ${(originalElem*100).toFixed(2)}% = 0%`;
      }
      return result;
    })();
    const finalDreamStr = (() => {
      let result = baseDreamStr;
      if (effectDream !== 0) {
        if (result.includes('=')) {
          result = result.replace(/= \d+\.\d+%$/, '') + ` + seasonal ${(effectDream*100).toFixed(2)}% = ${(originalDream*100).toFixed(2)}%`;
        } else {
          result = `${result} + seasonal ${(effectDream*100).toFixed(2)}% = ${(originalDream*100).toFixed(2)}%`;
        }
      }
      if (effectNoDream) {
        if (!result.includes('=')) result += ` = ${(originalDream*100).toFixed(2)}%`;
        result += ` - no-seasonal-dmg ${(originalDream*100).toFixed(2)}% = 0%`;
      }
      return result;
    })();
    const critRateText = effectCritChance !== 0
      ? `${(c.critRatePct*100).toFixed(2)}% + ${(effectCritChance*100).toFixed(2)}% = ${(finalCritRatePct*100).toFixed(2)}%`
      : `${(c.critRatePct*100).toFixed(2)}%`;
    const critMultText = effectCritDmg !== 0
      ? `${(c.critMultPct*100).toFixed(2)}% + ${(effectCritDmg*100).toFixed(2)}% = ${(finalCritMult*100).toFixed(2)}%`
      : `${(c.critMultPct*100).toFixed(2)}%`;
    const magText = (() => {
      let result = effectMagBoost !== 0 ? `${((c._magBoost || 0)*100).toFixed(2)}% + ${(effectMagBoost*100).toFixed(2)}% = ${(originalMag*100).toFixed(2)}%` : `${((c._magBoost || 0)*100).toFixed(2)}%`;
      if (effectNoMagBoost) {
        if (!result.includes('=')) result += ` = ${(originalMag*100).toFixed(2)}%`;
        result += ` - no-mag ${(originalMag*100).toFixed(2)}% = 0%`;
      }
      return result;
    })();
    const otherText = `${(effectOtherScaler*100).toFixed(2)}%`;
    const otherLine = effectOtherScaler !== 0
      ? `× <span class="forange">(1+Other: ${otherText})</span>\n`
      : '';
    const finalDmgLine = finalDmgPct !== 0
      ? `× <span class="ffinal">(1+Final: ${(finalDmgPct*100).toFixed(2)}%)</span>\n`
      : '';
    const skillResLabel = skillDamageType === 'physical' 
      ? `${(c._physRes*100).toFixed(1)}%` 
      : (skillDamageType === 'magical' ? (c._magResEnabled ? '8%' : '0%') : c._resLabel);
    const dmgTypeNote = skillDamageType ? ` (${skillDamageType.toUpperCase()})` : '';
    const versPctText = effectNoVers ? `${(originalVers*100).toFixed(2)}% - no-vers ${(originalVers*100).toFixed(2)}% = 0%` : `${(originalVers*100).toFixed(2)}%`;

    formulaEl.style.display = '';
    const refElemSegment = effectNoElemAtk
      ? `<span class="fref">Refined</span> + <span class="felem">All Element ATK</span>`
      : `<span class="fref">Refined</span> + <span class="felem">All Element ATK</span> + <span class="felem">Class Element ATK</span>`;

    formulaEl.innerHTML =
      `<span class="fb">${typeName}${dmgTypeNote}:</span> ` +
      `<span class="fwhite">(</span> <span class="fb">${atkLabel}</span><span class="fwhite">×(1-${skillResLabel})</span> + ${refElemSegment} ) × <span class="fwhite">${(mult*100).toFixed(2)}%</span> + <span class="fwhite">${flat}</span>\n` +
      `× <span class="fvers">(1+Vers: ${versPctText})</span>\n` +
      `${!(effectNoElem && isImagineType) ? `× <span class="felem">(1+Elem: ${finalElemStr})</span>\n` : ''}` +
      `× <span class="fg">(1+Gen: ${finalGenStr})</span>\n` +
      `× <span class="fdream">(1+Seasonal: ${finalDreamStr})</span>\n` +
      `× <span class="fmag">(1+MAG: ${magText})</span>\n` +
      otherLine +
      finalDmgLine +
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