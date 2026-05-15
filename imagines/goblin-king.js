(function(){

  // Only passive versatility implemented.
  const GOBLIN_KING_PASSIVE_VERSATILITY_STAT = [3584, 4636, 5688, 6740, 7792, 8960];

  window.IMAGINES = window.IMAGINES || {};
function provideBonuses(state) {
  if (state.imagine !== 'goblin-king') return {};
  const level = state.level;
  let versatilityStat = 0;

  if (state.applyPassiveStats) {
    versatilityStat = GOBLIN_KING_PASSIVE_VERSATILITY_STAT
      ? GOBLIN_KING_PASSIVE_VERSATILITY_STAT[level]
      : 0;
  }

  return { versatilityStat };
}
  window.IMAGINES['goblin-king'] = { provideBonuses };
})();