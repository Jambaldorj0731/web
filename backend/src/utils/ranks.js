export const rankSteps = [
  { name: 'Сумын Заан', xp: 0 },
  { name: 'Аймгийн Арслан', xp: 1000 },
  { name: 'Улсын Аварга', xp: 2000 },
  { name: 'Дархан Аварга', xp: 5000 }
];

export const getRankProgress = (xp = 0) => {
  const currentIndex = rankSteps.reduce((idx, rank, i) => (xp >= rank.xp ? i : idx), 0);
  const current = rankSteps[currentIndex];
  const next = rankSteps[currentIndex + 1] || current;
  return {
    currentRank: current.name,
    nextRank: next.name,
    xpToNext: Math.max(0, next.xp - xp)
  };
};
