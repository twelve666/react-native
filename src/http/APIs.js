import http from './core';
// 登录 注册 找回密码
// 通用接口
const getinit = query => {
  return http({
    url: query[0],
    method: 'post',
    data: query[1]
  }).then(res => {
    return res;
  });
};
const getLink = query => {
  return http({
    url: query[0],
    method: 'get',
    params: query[1]
  }).then(res => {
    return res;
  });
};
const postinit = query => {
  return http({
    url: query[0],
    method: 'post',
    data: query[1],
    isRaw: true
  }).then(res => {
    return res;
  });
};
// 验证手机号是否存在本平台
const handlePhone = query => {
  return http({
    url: 'api/members/validPhone/' + query,
    method: 'get',
  }).then(res => {
    return res;
  });
};
const getdata = query => {
  return http({
    url: query[0],
    method: 'get',
    params: query[1]
  }).then(res => {
    return res;
  });
};
const handleMatch = (url,type,data)=> {
  return http({
    url: url + type,
    method: 'get',
    params: data
  }).then(res => {
    return res;
  });
  // return http.get(`${url}+${type}`,data);
};
const loginApi = 'api/members/loginByPassword',// 账号密码登录
  regApi = 'api/members/registerMember',// 注册
  loginCodeApi = 'api/members/loginBySmsCode',// 验证码登录
  sendCodeApi = 'api/members/sendSMSCode',// 发送短信验证码
  updatePassApi = 'api/members/updatePasswordByEmail',// 根据邮箱更新密码
  updatePasswordByPhone = 'api/members/updatePasswordByPhone',// 根据手机号更新密码
  sendMailCode = 'api/members/sendMailCode',// 发送邮箱验证码
  logout = 'api/members/logout', // 退出登录
  // 猛料接口
  newsList = 'api/newsContent/app/newsList/',// 不同赛事对应的猛料列表
  apprecord = 'api/newsrelease/recommendExpert', // 专家推荐
  appstraightwins = 'api/newsrelease/readList', // 红单榜
  newsContent = 'api/newsContent/app/recommend/',// 根据比赛ID查询所有推荐
  newsTotal = 'api/newsContent/app/total/', // 根据赛事类型统计相关的猛料数量
  findSoccer = 'api/news/soccerDaysData',// 选择赛事-足球
  findBasketball = 'api/news/basketballDaysData',// 选择赛事-篮球
  getFootball = 'api/news/soccerRecommend',// 足球-推荐赛事全部
  getBasketball = 'api/news/basketballRecommend',// 篮球-推荐赛事全部
  checkisexpert = 'api/newsrelease/checkisexpert', // 发布猛料 
  competitionstarted = 'api/newsrelease/competitionstarted',// 发布猛料-校验是否已开赛
  savenewscontent = 'api/newsrelease/savenewscontent',// 保存猛料
  readOnline ='api/news/readOnline' ,// 阅读在线
  onlineMemebers = 'api/news/onlineMemebers', // 统计阅读在线人数接口
  getMatchByMatchId ='api/newsMatch/getMatchByMatchId' // app:猛料赛事查询
  ;// 红单 

export {
  loginApi, regApi, loginCodeApi, sendCodeApi, updatePassApi, updatePasswordByPhone, getinit, handlePhone, sendMailCode, logout,
  getdata, apprecord, appstraightwins, postinit,
  checkisexpert, getLink, competitionstarted, savenewscontent,getMatchByMatchId,
  handleMatch, newsList, newsContent,newsTotal,
  findSoccer,findBasketball,getFootball,getBasketball,
  readOnline,onlineMemebers
};
let page = 1;
let pageSize = 10;

/**
 * 获取足球全部列表数据
 * @param {*} params 
 * from
 * page
 * pageSize
 * where 进行中
 */
export function getMatchList(params = {}) {
  params = Object.assign({
    from: 'foot_match_v_all',
    page,
    size: 50
  }, params);
  let str;
  switch (params.from) {
  case 'foot_match_v_all':
    str = 'api/match/findTodayEventData';
    break;
  case 'foot_match_v_jinxinzhong':
    str = 'api/match/findNowRunMatchData';
    break;
  case 'foot_match_ex_saichen':
    str = 'api/match/findMatchSchedule';
    break;
  case 'foot_match_ex_saiguo':
    str = 'api/match/findMatchByMatchTime';
    break;
  case 'mat_fav':
    str = 'api/members/findMemberFootballConcerned';
    break;
  }
  // if (params.cancelToken) {
  //   queryParams.cancelToken = params.cancelToken
  // }
  console.log('数据参数是：', params);
  return http.post(`${str}`, params);
}

/**
 * 添加关注
 * @param {*} params {
 *   id
 * }
 */
export function updateFavourite(params = {}) {
  // params = Object.assign({
  //   '@name': 'fav_foot_match'
  // }, params);
  // return http.get('bizSql', { params });
  return http.post('api/members/insertMemberConcerned', params);
}

/**
 * 取消关注
 * @param {*} params {
 *   id
 * }
 */
export function cancelFavourite(params = {}) {
  return http.post('api/members/deleteMemberConcerned', params);
}

/**
 * 获取赛事详情
 * @param {*} params 
 * from
 * where
 * match_id
 */
export function getMatchDetailById(params = {}) {
  params = Object.assign({
    from: 'foot_match_ex',
    page,
    pagesize: 1
  }, params);
  return http.get('queryPage', { params });
}

/**
 * 获取文字直播信息
 * @param {*} params 
 * from
 * match_id
 */
export function getTextInfosForLive(params = {}) {
  params = Object.assign({
    from: 'football_tlive_t',
    page,
    pagesize: pageSize
  }, params);
  return http.get('queryPage', { params });
}

/**
 * 获取直播重要事件
 * @param {*} params 
 * from
 */
export function getImportantEventsForLive(params = {}) {
  params = Object.assign({
    from: 'football_incident_t',
    page,
    pagesize: pageSize
  }, params);
  return http.get('queryPage', { params });
}

/**
 * 获取比赛双方的控球率、射门、射正、进攻、危险进攻、角球、红牌、黄牌数据
 * @param {*} params 
 */
export function getCompetitionEventStat(params = {}, query = {}) {
  return http.get(`sport/queryPageTrad/football_tlive_v/1/1`, { params: query });
}

/**
 * 获取用户信息
 * @param {*} data 
 */
export function getUserInfo(data) {
  console.log('data', data);
  return http.post('api/members/info', data);
}

/**
 * 修改用户信息
 * @param {*} data 
 */
export function updataUserInfo(data = {}) {
  return http.post('api/members/update', data);
}


/**
 * 资讯页面获取分类类型
 * @param {*} data 
 */
export function getTypesById(params = {}) {
  // console.log(params);
  return http.get('api/articleCategorys/getByType', { params });
}

export function getByCatsgoryId(params = {}) {
  // console.log('params',params)
  return http.get(`api/articles/getByCatsgoryId`, { params });

}
// 根据id获取该篇资讯信息
export function getArticleDetail(data = {}) {
  return http({
    url: 'api/articles/articleDetail',
    method: 'post',
    data: data,
    // isRaw:true
  });
}
// 文章点赞
export function giveThumb(data = {}) {
  return http({
    url: 'api/articles/changeDigg',
    method: 'get',
    params: data,
  });
}
// 文章收藏
export function giveACollect(data = {}) {
  return http({
    url: 'api/articles/collect',
    method: 'get',
    params: data,
  });
}
// 资讯模块二接口
/**
 * 获取赛事筛选tabs菜单数据
 */
export function getTabsOfMatchFilter() {
  return http.get(`sport/queryPageTrad/sys_tab`);
}

/**
 * 获取赛事筛选tab对应的数据
 */
export function getTabTypesOfMatchFilter() {
  return http.get(`sport/queryPageTrad/league`);
}

/**
 * 获取赛事详情-阵容数据
 * @param {*} params 
 */
export function getTeamOfDetail(params = {}, query = {}) {
  params = Object.assign({
    page,
    pagesize: pageSize
  }, params);
  return http.get(`sport/queryPageTrad/foot_zhenron/${params.pagesize}/${params.page}`, { params: query });
}


/**
 * 获取赛事详情-指数数据
 * @param {*} params 
 */
export function getExponentData(params = {}, query = {}) {
  params = Object.assign({
    page,
    pagesize: pageSize
  }, params);
  return http.get(`sport/queryPageTrad/football_odds_t_ex/${params.pagesize}/${params.page}`, { params: query });
}

/**
 * 获取赛事详情-情报数据
 * @param {*} params 
 */
export function getInfosDataOfDetail(params = {}) {
  params = Object.assign({
    from: 'foot_qinbao_v',
    page,
    pagesize: pageSize
  }, params);
  return http.get('queryPage', { params });
}

/**
 * 获取赛事详情-数据-历史数据
 * @param {*} params 
 */
export function getHistoryDataOfDetail(params = {}, query = {}) {
  params = Object.assign({
    page,
    pagesize: pageSize
  }, params);
  return http.get(`sport/queryPageTrad/foot_detail_data_v/${params.pagesize}/${params.page}`, { params: query });
}

/**
 * 获取赛事详情-数据-最近数据
 * @param {*} params 
 */
export function getRecentDataOfDetail(params = {}, query = {}) {
  params = Object.assign({
    page,
    pagesize: pageSize
  }, params);
  return http.get(`sport/queryPageTrad/foot_detail_data_recent/${params.pagesize}/${params.page}`, { params: query });
}

export default {
  getMatchList,
  updataUserInfo,
  getUserInfo,
  getMatchDetailById,
  updateFavourite,
  cancelFavourite,
  getTextInfosForLive,
  getImportantEventsForLive,
  getCompetitionEventStat,
  getTypesById,
  getByCatsgoryId,
  getArticleDetail,
  getTabsOfMatchFilter,
  getTabTypesOfMatchFilter,
  getExponentData,
  getInfosDataOfDetail,
  getHistoryDataOfDetail,
  getRecentDataOfDetail,
  getTeamOfDetail,
  giveThumb,
  giveACollect,
  handleMatch,
};
