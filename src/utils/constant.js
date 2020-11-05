
export const GameTypes = {
  FOOTBALL: 'football',
  BASTKETBALL: 'basketball'
};

export const CompetitionListItemTypes = {
  ALL: 'all',
  IN_PLAY: 'inplay',
  AGENDA: 'agenda',
  ENDS: 'ends',
  FAVOURITE: 'favourite'
};

export const CompetitionFootballEventTypes = {
  WILL_ENDS: 11, // 快结束
  CORNER_KICK: 2, // 角球
  YELLOW_CARD: 3, // 黄牌
  RED_CARD: 4, // 红牌
  OWN_GOAL: 5, // 乌龙球
  GOAL_IN: 1, // 进球
  TWO_YELLOW_TO_RED: 7, // 2黄变红
  PENALTY_KICK: 16, // 点球
  SUBSTITUTION: 9 // 替换
};

// 比赛状态
export const MatchStaus = {
  WAITING_BEGIN: 'WAITING_BEGIN',
  IN_PLAY: 'IN_PLAY',
  ENDS: 'ENDS',
  DELAY: 'DELAY',
  IN_PLAY_DELAY: 'IN_PLAY_DELAY',
  HALFTIME: 'HALFTIME'
};
