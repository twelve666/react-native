import * as React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  RefreshControl,
  BackHandler,
  AppState,
  TouchableHighlightBase,
} from 'react-native';
import { Tabs, Button, Toast, Portal, Modal } from '@ant-design/react-native';
import { connect } from 'react-redux';
import AppActions from '../../store/actions';
import {
  GameTypes,
  CompetitionFootballEventTypes,
  CompetitionListItemTypes,
} from '../../utils/constant';
import Header from './Header';
import { px, winHeight } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import ListItem from '../../components/competition-list-item';
import WeekHeader, { getCurDate } from '../../components//week-header';
import NoDataPlaceHolder from '../../components/no-data-placeholder';
import BackTop from '../../components/back-top';
import Reminder from '../../components/competition-reminder';
import APIs from '../../http/APIs';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { processNetworkException } from '../../http';
import NetWorkError from '../../components/network-error';
// import { ONE_DAY } from '../../utils/date';
import Badge from '../../components/badge';
import MyWebSocket from '../../socket';
import NoMoreData from '../../components/no-more-data';
import MatchFilter from '../../components/match-filter';
import { withWrapTeleport } from '../../components/portal';
// import { /* filterTabs, typesData, */ typesData1 } from './data';
import { ShadowBox } from 'react-native-neomorph-shadows';
import EventBus from '../../utils/eventBus';
import { enptyFn } from '../../utils/common';
import { getUniqueId } from 'react-native-device-info';
import { getMatchStatus, MatchStaus } from '../../utils/matchCommon';
import axios, { CancelToken } from 'axios';
import { formatFilterData } from './matchFilter';
import store from '../../store';

// import { curEvn, EVN_DEV, EVN_TEST } from '../../../config';
const IMAGE_BASE_DIR = '../../assets/images/';

const devideId = getUniqueId();
const mapState = (state) => ({
  state,
});
function showToast(text) {
  Toast.info(text, 3, enptyFn, false);
}
const mapDispatch = {
  updateFooterTabBar: AppActions.updateFooterTabBar,
};

const StatusTab = {
  ALL: 0,
  IN_PLAY: 1,
  AGENDA: 2,
  ENDS: 3,
  FAVOURITE: 4,
};

const imageFilter = require(IMAGE_BASE_DIR + 'icon-filter.png');
const imageSetting = require(IMAGE_BASE_DIR + 'icon-setting.png');

function HeaderLeft(props) {
  return (
    <View style={[cstyle.flexJcC, cstyle.flexAiC, cstyle.flex1]}>
      <TouchableOpacity
        activeOpacity={theme.activeOpacity}
        onPress={props.onPress}
        style={[cstyle.w100, cstyle.flexJcC, cstyle.flexAiC, cstyle.flex1]}
      >
        <Image source={imageFilter} style={styles.headerLeftImage} />
      </TouchableOpacity>
    </View>
  );
}

function HeaderRight(props) {
  return (
    <View style={[cstyle.flexJcC, cstyle.flexAiC, cstyle.flex1]}>
      <TouchableOpacity
        activeOpacity={theme.activeOpacity}
        onPress={props.onPress}
      >
        <Image source={imageSetting} style={styles.headerRightImage} />
      </TouchableOpacity>
    </View>
  );
}

function MyContentLoading(props) {
  return Array.from({ length: 8 }).map((n, i) => (
    <View style={theme.skeletonBdB} key={i}>
      <ContentLoader
        height={80}
        width={px(700)}
        speed={2}
        viewBox={`0 0 ${px(700)} 80`}
        backgroundColor={theme.skeletonItemBgColor}
        foregroundColor={theme.skeletonItemForegroundColor}
        {...props}
      >
        <Rect x="15" y="15" rx="4" ry="4" width="130" height="10" />
        <Rect x="155" y="15" rx="3" ry="3" width="130" height="10" />
        <Rect x="295" y="15" rx="3" ry="3" width="90" height="10" />
        <Rect x="15" y="50" rx="3" ry="3" width="90" height="10" />
        <Rect x="115" y="50" rx="3" ry="3" width="60" height="10" />
        <Rect x="185" y="50" rx="3" ry="3" width="200" height="10" />
        <Rect x="15" y="90" rx="3" ry="3" width="130" height="10" />
        <Rect x="160" y="90" rx="3" ry="3" width="120" height="10" />
        <Rect x="290" y="90" rx="3" ry="3" width="95" height="10" />
      </ContentLoader>
    </View>
  ));
}

function CommonResult(props) {
  const {
    loading = true,
    noData = false,
    timeout,
    noDataMsg = '暂无相关比分',
    noDataType,
    networkErrStyle = styles.networkErr,
    onPress,
    noDataOnPress,
  } = props;
  if (loading) {
    return <MyContentLoading />;
  } else if (StatusTab.FAVOURITE != noDataType && noData) {
    return <NoDataPlaceHolder msg={noDataMsg} />;
  } else if (StatusTab.FAVOURITE === noDataType && noData) {
    return (
      <NoDataPlaceHolder msg="暂未关注 快去看您可能想看的比分">
        <View style={[cstyle.flexDirecR, cstyle.flexJcC]}>
          <Button
            type="primary"
            size="small"
            activeStyle={false}
            onPress={noDataOnPress}
            style={styles.noDataBtn}
          >
            <Text>去看看</Text>
          </Button>
        </View>
      </NoDataPlaceHolder>
    );
  } else if (timeout) {
    return <NetWorkError style={networkErrStyle} onPress={onPress} />;
  } else {
    return <></>;
  }
  // return (<>
  //   {loading && <MyContentLoading />}
  //   {StatusTab.FAVOURITE != noDataType && !loading && noData && <NoDataPlaceHolder msg={noDataMsg} />}
  //   {StatusTab.FAVOURITE === noDataType && !loading && noData && <NoDataPlaceHolder msg="暂未关注 快去看您可能想看的比分">
  //     <View style={[cstyle.flexDirecR, cstyle.flexJcC]}>
  //       <Button type="primary" size="small" activeStyle={false} onPress={noDataOnPress} style={styles.noDataBtn}>去看看</Button>
  //     </View>
  //   </NoDataPlaceHolder>}
  //   {!loading && timeout && <NetWorkError style={networkErrStyle} onPress={onPress} />}
  // </>)
}

function WrapperMatchFilter(props) {
  if (props.showFilter === false) return <></>;
  return <MatchFilter {...props} />;
}

const notiyEvtTypes = [
  CompetitionFootballEventTypes.RED_CARD,
  CompetitionFootballEventTypes.GOAL_IN,
];

class Competition extends React.Component {
  curTabContentEl;
  refContent;
  socket;
  matchListLoadingKey;
  updateFavLoadingKey;
  updateFavRsLoadingKey;
  showsVerticalScrollIndicator = false;
  INITIAL_NUM_TO_RENDER = 10;
  ROW_HEIGHT = px(142);
  LIST_WINDOW_SIZE = 50;
  removeClippedSubviews = true;
  tabRef = null;
  footballTabTypeMapping = [
    CompetitionListItemTypes.ALL,
    CompetitionListItemTypes.IN_PLAY,
    CompetitionListItemTypes.AGENDA,
    CompetitionListItemTypes.ENDS,
    CompetitionListItemTypes.FAVOURITE,
  ];
  today = getCurDate();
  constructor(props) {
    super(props);
    let commonTab = {
      data: [],
      page: 0,
      totalPage: 1,
      noData: false,
      loading: true,
      timeout: false,
      loadMore: true,
    };
    let date = this.today;
    let tabs = [
      Object.assign({ title: '全部', index: StatusTab.ALL }),
      Object.assign({ title: '进行中', index: StatusTab.IN_PLAY }),
      Object.assign({ title: '赛程', index: StatusTab.AGENDA, date }),
      Object.assign({ title: '赛果', index: StatusTab.ENDS, date }),
      Object.assign({ title: '关注', index: StatusTab.FAVOURITE }),
    ];
    let statusTabs = [
      Object.assign({ index: StatusTab.ALL }, commonTab),
      Object.assign({ index: StatusTab.IN_PLAY }, commonTab),
      Object.assign(
        { index: StatusTab.AGENDA, date, updateFlag: Date.now() },
        commonTab
      ),
      Object.assign(
        { index: StatusTab.ENDS, date, updateFlag: Date.now() },
        commonTab
      ),
      Object.assign({ index: StatusTab.FAVOURITE }, commonTab),
    ];
    this.state = {
      gameType: GameTypes.FOOTBALL,
      showFilter: false,
      unReadCount: 0,
      tabs,
      statusTabs,
      initialPage: 0,
      page: 0,
      tabsConfig: {
        swipeable: true,
        useOnPan: true,
        usePaged: true,
        // swipeable: false,
        // useOnPan: false,
        // usePaged: false
      },
      reminders: [],
      showBackTop: false,
      error: '',
      typesData: [],
      filterTabs: [],
      containerHeight: winHeight,
      matchFilterParams: [],
      showTabs: true,
      refreshing: false
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: (props) => <HeaderLeft onPress={this.navBarLeftHandler} />,
      headerTitle: (props) => (
        <Header onPress={this.navBarTabsHandler} canSwitch={true} {...props} />
      ),
      headerRight: (props) => <HeaderRight onPress={() => { }} />,
    });
    // this.getMatchList(false);
    // this.initSocket();
    setTimeout(() => {
      this.getTabsOfMatchFilter();
    });
    EventBus.addListenser('evtMatchIndexFromGoBack', ({ id, fav }) => {
      this.updateMatchItemFavouriteStatus(id, fav);
    });
    if (!EventBus.has('evtNofityToMatchListPage')) {
      EventBus.addListenser('evtNofityToMatchListPage', (data) => {
        this.socketMessageHandler(data);
      });
    }
    if (this.props.navigation.isFocused()) {
      this.props.navigation.addListener('focus', (e) => {
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.handleBackButtonPressAndroid
        );
        this.displayTabs();
      });
      this.props.navigation.addListener('blur', (e) => {
        Portal.remove(this.matchListLoadingKey);
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackButtonPressAndroid
        );
        this.hideTabs();
      });
    }
    AppState.addEventListener('change', this.handleAppStateChange);
    console.log('competition componentDidMount');
  }
  init() {
    let statusTabs = this.state.statusTabs;
    statusTabs = statusTabs.map((tab) => {
      tab.noData = false;
      tab.data = [];
      return tab;
    });
    let curTab = statusTabs[this.state.page];
    curTab.loading = true;
    curTab.timeout = false;
    curTab.page = 0;
    curTab.data = [];
    curTab = this.resetLoadMoreStatus(curTab);
    this.setState({ showBackTop: false, statusTabs }, () => {
      this.getMatchList(false);
    });
  }

  displayTabs() {
    this.init();
    this.setState({ showTabs: true });
  }

  hideTabs() {
    this.setState({ showTabs: false });
  }

  handleAppStateChange = (state) => {
    if (state === 'active' && this.props.navigation.isFocused()) {
      this.state.reminders.forEach((item) => {
        this.reminderShowEnd(item.matchId);
      });
      // if (this.state.page === StatusTab.IN_PLAY) {
      // this.getMatchList(true);
      // this.getAllInPlayMatchList().then(res => {
      //   // console.log('getAllInPlayMatchList =', res);
      //   if (res?.data?.length > 0) {
      //     this.socketMessageHandler(res.data);
      //   }
      // });
      this.displayTabs();
      // }
      
    } else if (state === 'inactive') {
      this.hideTabs();
    }
  };

  handleBackButtonPressAndroid = () => {
    if (this.props.navigation.isFocused()) {
      Modal.alert('确认', '您确定要退出吗？', [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: () => BackHandler.exitApp(),
        },
      ]);
    }
    return true;
  };

  // 赛事筛选完成
  filterHandler = () => {
    this.props.teleport('home', <WrapperMatchFilter showFilter={false} />);
    this.setState({ showFilter: false });
  };

  // 赛事筛选
  navBarLeftHandler = () => {
    if (!this.state.filterTabs || this.state.filterTabs.length < 1) return;
    this.props.teleport(
      'home',
      <WrapperMatchFilter
        close={this.filterHandler}
        typesData={this.state.typesData}
        tabsData={this.state.filterTabs}
        updateTypesData={this.updateTypesData}
      />
    );
    // console.log('navBarLeftHandler props ', this.props)
    this.setState({ showFilter: true });
  };

  updateTypesData = (ids) => {
    this.setState({ matchFilterParams: ids }, () => {
      this.refreshMatchList();
    });
  };

  // 足球、篮球切换
  navBarTabsHandler = (tab) => {
    // TODO 篮球功能未实现，暂时不进行切换
    // return;
    console.log('navBarTabsHandler = ', tab);
    this.setState({ gameType: tab.name }, () => {
      this.init();
    });
  };

  // tabs列表切换
  tabHandler = (tab, index) => {
    console.log('tabHandler -------------------', index, this.state.page);
    // let st = Date.now()
    // console.log('info tabHandler=', index, this.state.page, 'st=', st, ' clicktime=', Date.now());
    if (index === this.state.page) return;
    switch (index) {
    case StatusTab.IN_PLAY:
      break;
    case StatusTab.FAVOURITE:
      if (this.state.unReadCount > 0) {
        this.updateUnreadCount(0);
      }
      break;
    default:
      break;
    }
    let statusTabs = this.state.statusTabs;
    statusTabs = statusTabs.map((tab) => {
      tab.noData = false;
      tab.timeout = false;
      tab.data = [];
      if ([StatusTab.AGENDA, StatusTab.ENDS].includes(tab.index)) {
        tab.date = this.today;
        tab.updateFlag = Date.now();
      }
      return tab;
    });
    let curTab = statusTabs[this.state.page];
    curTab.noData = false;
    curTab.loading = true;
    curTab.timeout = false;
    curTab.page = 0;
    curTab.data = [];
    curTab = this.resetLoadMoreStatus(curTab);

    this.setState(
      { page: index, showBackTop: false, statusTabs, matchFilterParams: [] },
      () => {
        this.getMatchList(false);
      }
    );
  };

  /**
   * 获取赛事筛选菜单
   */
  getTabsOfMatchFilter() {
    APIs.getTabsOfMatchFilter().then((res) => {
      // console.log('getTabsOfMatchFilter res=', res)
      if (res) {
        res = res.map((item) => {
          item.title = item.name;
          return item;
        });
        res.unshift({
          category_name: '完整',
          id: 0,
          name: '完整',
          status: 1,
          title: '完整',
        });
        this.getTabTypesOfMatchFilter(res);
      }
    });
  }

  /**
   * 获取赛事筛选菜单下面的数据
   */
  getTabTypesOfMatchFilter(filterTabs) {
    APIs.getTabTypesOfMatchFilter().then((res) => {
      if (res) {
        res = res.map((item) => {
          item.checked = true;
          return item;
        });
        this.setState({ filterTabs: formatFilterData(filterTabs, res) });
      }
    });
  }

  // 进入赛事全部
  gotoAllCompetition = () => {
    if (this.tabRef) {
      this.tabRef.scrollTo(0);
    }
    this.tabHandler({}, StatusTab.ALL);
  };

  // 赛程日期
  weekHeaderHandler = (wd, i) => {
    let statusTabs = this.state.statusTabs;
    let curTab = statusTabs[this.state.page];
    curTab.noData = false;
    curTab.loading = true;
    curTab.timeout = false;
    curTab.page = 0;
    curTab.date = wd.date;
    curTab.loadMore = true;
    curTab.data = [];
    this.setState({ statusTabs }, this.getMatchList(false));
  };

  // 更新关注未读
  updateUnreadCount(unReadCount) {
    this.setState({ unReadCount }, () => {
      let tabs = this.state.tabs;
      tabs.map((tab) => {
        if (tab.index === StatusTab.FAVOURITE) {
          tab.title = (
            <Badge text={unReadCount}>
              <Text style={styles.badgeTabTxt}>关注</Text>
            </Badge>
          );
        }
        return tab;
      });
      this.setState({ tabs });
    });
  }

  /**
   * 更新收藏状态(添加、删除)
   * @param id 比赛ID
   * @param fav 当前收藏状态(收藏:y, 未收藏: n)
   */
  updateFavourite = (id, fav) => {
    // Portal.remove(this.updateFavRsLoadingKey);
    Portal.remove(this.updateFavLoadingKey);
    // this.updateFavLoadingKey = Toast.loading('处理中...', 0, enptyFn, false);
    let mId = store.getState().login.loginInfo.id
      ? store.getState().login.loginInfo.id
      : '';
    // console.log(`用户id===${mId}`)
    let obj = mId
      ? { matchId: id, memberId: mId, deviceId: devideId }
      : { matchId: id, deviceId: devideId };
    let pfav;
    if ('y' === fav) {
      APIs.cancelFavourite(obj)
        .then((res) => {
          if ('000' === res.statusCode) {
            pfav = 'n';
            // this.updateFavRsLoadingKey = Toast.success(pfav === 'y' ? '收藏成功!' : '已取消收藏', 3, enptyFn, false);
            let unReadCount = this.state.unReadCount;
            let statusTabs;
            let found = -1;
            --unReadCount;
            if (unReadCount < 0) unReadCount = 0;
            // 关注TAB页，取消则删除
            if (this.state.page === StatusTab.FAVOURITE) {
              unReadCount = 0;
              statusTabs = this.state.statusTabs.map((item) => {
                if (StatusTab.FAVOURITE === item.index) {
                  found = item.data.findIndex((d) => d.id === id);
                  if (found > -1) item.data.splice(found, 1);
                  if (item.data.length < 1) {
                    item.noData = true;
                    item.loading = false;
                  }
                }
                return item;
              });
              this.setState({ statusTabs });
            } else {
              this.updateMatchItemFavouriteStatus(id, pfav);
            }
            // console.log('updateFavourite res', res, pfav, fav, unReadCount, this.state.unReadCount, this.state.page, this.state.page === StatusTab.FAVOURITE)
            if (this.state.unReadCount !== unReadCount) {
              this.updateUnreadCount(unReadCount);
            }
          }
        })
        .finally(() => {
          Portal.remove(this.updateFavLoadingKey);
        });
    } else if ('n' === fav) {
      APIs.updateFavourite(obj)
        .then((res) => {
          // this.updateFavRsLoadingKey = Toast.success(pfav === 'y' ? '收藏成功!' : '已取消收藏', 3, enptyFn, false);
          if ('000' === res.statusCode) {
            pfav = 'y';
            // this.updateFavRsLoadingKey = Toast.success(pfav === 'y' ? '收藏成功!' : '已取消收藏', 3, enptyFn, false);
            let unReadCount = this.state.unReadCount;
            let statusTabs;
            let found = -1;
            ++unReadCount;
            if (unReadCount < 0) unReadCount = 0;
            // 关注TAB页，取消则删除
            if (this.state.page === StatusTab.FAVOURITE) {
              unReadCount = 0;
              statusTabs = this.state.statusTabs.map((item) => {
                if (StatusTab.FAVOURITE === item.index) {
                  found = item.data.findIndex((d) => d.id === id);
                  if (found > -1) item.data.splice(found, 1);
                  if (item.data.length < 1) {
                    item.noData = true;
                    item.loading = false;
                  }
                }
                return item;
              });
              this.setState({ statusTabs });
            } else {
              this.updateMatchItemFavouriteStatus(id, pfav);
            }
            // console.log('updateFavourite res', res, pfav, fav, unReadCount, this.state.unReadCount, this.state.page, this.state.page === StatusTab.FAVOURITE)
            if (this.state.unReadCount !== unReadCount) {
              this.updateUnreadCount(unReadCount);
            }
          }
        })
        .finally(() => {
          Portal.remove(this.updateFavLoadingKey);
        });
    }
  };


  
  backTop = () => {
    this.refContent?.scrollToIndex({ index: 0 });
  };

  parseDateStr(dstr = '') {
    let ds = dstr.split('-');
    if (ds.length === 1) return null;
    return new Date(ds[0], parseInt(ds[1]) - 1, ds[2], 0, 0, 0);
  }
  getMatchListSource = CancelToken.source();
  getMatchListTimer = null;
  /**
   * 获取比赛列表（全部、进行中、赛程、赛果、关注）
   */
  getMatchList = (isReset) => {
    let st = Date.now();
    const page = this.state.page;
    let statusTabs = this.state.statusTabs;
    let list = [];
    list = list.concat(statusTabs);
    let curTab = list[page];
    // if (isReset) {
    //   curTab = this.resetLoadMoreStatus(curTab);
    //   curTab.page--;
    // }
    if (this.getMatchListTimer !== null) clearTimeout(this.getMatchListTimer);
    console.log(
      '-----------begin req getMatchList ',
      st,
      axios.defaults.timeout,
      ' curTab.index=',
      curTab.page,
      ' page=',
      this.state.page,
      curTab.totalPage,
      curTab.loadMore,
      axios.defaults.timeout
    );
    if (curTab.loadMore === false || curTab.page >= curTab.totalPage) return;
    let params = {};
    Portal.remove(this.matchListLoadingKey);
    this.getMatchListSource.cancel('canceled');
    if(!isReset) {
      this.matchListLoadingKey = Toast.loading(
        '加载数据中...',
        0,
        enptyFn,
        false
      );
    }
    if (page === StatusTab.IN_PLAY) {
      params.from = 'foot_match_v_jinxinzhong';
    } else if (page === StatusTab.AGENDA) {
      params.from = 'foot_match_ex_saichen';
      params.dateTime = curTab.date;
    } else if (page === StatusTab.ENDS) {
      params.from = 'foot_match_ex_saiguo';
      params.dateTime = curTab.date;
    } else if (page === StatusTab.FAVOURITE) {
      params.from = 'mat_fav';
    }
    let id = store.getState().login.loginInfo.id;
    params.deviceId = devideId;
    // console.log('会员id=', id);
    if (undefined !== id) {
      params.memberId = id;
    }
    if (this.state.matchFilterParams.length > 0) {
      params.matchEventId$in = this.state.matchFilterParams.join(',');
    }
    params.page = curTab.page;
    if(!isReset) {
      curTab.page++;
    }else{
      params.page = curTab.page = 0;
    }
    this.getMatchListSource = CancelToken.source();
    params.cancelToken = this.getMatchListSource.token;
    // console.log('info getMatchList params =', JSON.stringify(params), JSON.stringify(query))

    APIs.getMatchList(params).then(
      (res) => {
        this.setState({ isRefreshing: false });
        console.log(`数据是res ===`, res);
        Portal.remove(this.matchListLoadingKey);
        clearTimeout(this.getMatchListTimer);
        // let mt = Date.now();
        // console.log('info getMatchList res: time=', mt - st, ' curTab.index=', curTab.index, ' page=', this.state.page);
        // clearTimeout(this.getMatchListTimer);
        // if (curTab.index !== this.state.page) return;
        if (res?.content?.length > 0) {
          if (curTab.page === 1) {
            curTab.data = [];
          }
          curTab.data.push(...res.content);
          // if (1 == this.state.page) {
          // for (let i = 0; i < curTab.data.length; i++) {
          // console.log('进行中的比赛id=', curTab.data[i].id);
          // }
          // }

          curTab.totalPage = res.totalPages;
          if (curTab.page >= res.totalPages) {
            curTab.loadMore = false;
          }
        } else if (curTab.page === 1 && res?.content?.length === 0) {
          curTab.data = [];
        }
        let mt2 = Date.now();
        curTab.loading = false;
        curTab.noData = curTab.data.length < 1;
        list[this.state.page] = curTab;
        // let mt3 = Date.now();
        // this.setState({ statusTabs });
        this.setState({ ...this.state, statusTab: list });
        // console.log('getMatchList res=', res, curTab.data.length, this.state.statusTabs[page].data == statusTabs.data);
        // let et = Date.now()
        // console.log('info finish getMatchList ', et, et - mt, 'et - st=', et - st, et - mt2, et - mt3)
      },
      (err) => {
        processNetworkException(err, () => {
          this.setState({ isRefreshing: false });
          Portal.remove(this.matchListLoadingKey);
          curTab.loading = false;
          curTab.timeout = true;
          curTab.page--;
          statusTabs[this.state.page] = curTab;
          this.setState({ statusTabs });
          showToast('网络异常，请稍后再试');
        });
      }
    );
    this.getMatchListTimer = setTimeout(() => {
      this.getMatchListSource.cancel('TIMEOUT');
    }, axios.defaults.timeout);
  };

  getAllInPlayMatchList() {
    let params = { from: 'foot_match_v_jinxinzhong' };
    return APIs.getMatchList(params, {});
  }

  resetLoadMoreStatus(curTab) {
    if (curTab.loadMore === false) {
      curTab.loadMore = true;
      if (curTab?.data?.length > 0) {
        let loadMoreItem = curTab.data[curTab.data.length - 1];
        if (loadMoreItem.loadMore === false) {
          curTab.data.splice(curTab.data.length - 1, 1);
        }
      }
    }
    return curTab;
  }

  /**
   * 刷新当前列表
   */
  refreshMatchList = () => {
    let statusTabs = this.state.statusTabs;
    let curTab = statusTabs[this.state.page];
    curTab.page = 0;
    curTab.data = [];
    curTab.loading = true;
    curTab.timeout = false;
    curTab = this.resetLoadMoreStatus(curTab);
    this.setState({ statusTabs }, this.getMatchList(false));
  };

  refreshList = () => {
    this.setState({ isRefreshing: true });
    this.getMatchList(true);
  };

  /**
   * 更新赛事收藏状态
   */
  updateMatchItemFavouriteStatus = (id, fav) => {
    let statusTabs = this.state.statusTabs.map((item) => {
      if (this.state.page === item.index) {
        let found = item.data.findIndex((d) => d.id === id);
        if (found > -1) {
          let matchItem = Object.assign({}, item.data[found]);
          matchItem.fav = fav;
          item.data[found] = matchItem;
        }
      }
      return item;
    });
    this.setState({ statusTabs });
  };

  endReachedHandler = () => {
    this.getMatchList(false);
  };

  weekHeaderOnLoad = (today, type) => {
    let statusTabs = this.state.statusTabs;
    statusTabs[type].date = today.date;
    this.setState({ statusTabs });
  };

  initSocket() {
    // console.log('info index initSocket this.socket=', this.socket, this.socket?.socket.readyState)
    if (
      this.socket?.socket &&
      [0, 1].includes(this.socket?.socket?.readyState)
    ) {
      return;
    }
    this.socket = new MyWebSocket({
      name: 'index',
      onmessage: (data) => {
        console.log(
          'info onmesson =',
          data,
          this.state.page,
          StatusTab.IN_PLAY,
          data.type,
          notiyEvtTypes.includes(data.type)
        );
        console.log('info onmesson =', data.type);
        this.socketMessageHandler(data);
      },
      onclose: () => {
        console.log(
          'info index websocket closed',
          this.socket?.socket?.readyState
        );
      },
    });
  }

  socketMessageHandler(data) {
    let obj = JSON.parse(data.msg);
    let type = data.msgType;
    switch (type) {
    case 'EVENTDATA':
      this.redCardNumber(data);
      this.yellowCardNumber(data);
      this.goalNumber(data);
      this.cornerNumber(data);
      this.harlNumber(data);
      this.eventdataUpdate(data);
      break;
    case 'REALTIMEDATA':
      this.realtimedataUpdate(data);
      break;
      // case 'REALMATCHSTATE':
    case 'ALLMATCHSTATE':
      this.realmatchstateOrAllMatchstateUpdate(data);
      break;
    case 'REALTIMEEVENT': // 增加赛事
      this.addMatch(data);
      break;
    }
  }

  addMatch(data) {
    let msgObj = JSON.parse(data.msg);
    let mlen = msgObj.length;
    console.log('服务端发过来的增加赛事的数据：', msgObj);
    for (let i = 0; i < mlen; i++) {
      let item = msgObj[i];
      let status = getMatchStatus(item.matchStatus);
      let tabIndex = this.state.statusTabs.findIndex((item) => item.index === this.state.page);
      if (this.state.page === StatusTab.IN_PLAY &&  status === MatchStaus.IN_PLAY) {
        let found = this.isExistMatch(item.id, tabIndex);
        if (!found && item.id) {
          this.addMatchToList(item, tabIndex, StatusTab.IN_PLAY);
        }
      } else if (this.state.page === StatusTab.ENDS && status === MatchStaus.ENDS) {
        let found = this.isExistMatch(item.id, tabIndex);
        if (!found && item.id) {
          this.addMatchToList(item, tabIndex, StatusTab.ENDS);
        }
      }
    }
  }

  harlNumber(data) {
    let list = [];
    list = list.concat(this.state.statusTabs);
    let statusTab = list[this.state.page].data;
    let msgObj = JSON.parse(data.msg);
    let mylen = statusTab.length;
    let mlen = msgObj.halfScore.length;
    let status = this.state.statusTabs[this.state.page].data;
    for (let i = 0; i < mylen; i++) {
      let tabsItem = status[i];
      for (let j = 0; j < mlen; j++) {
        let updateItem = msgObj.halfScore[j];
        if (updateItem.matchId === tabsItem.id) {
          tabsItem.halfHomeSoce = updateItem.halfHomeSoce;
          tabsItem.halfAwaySoce = updateItem.halfAwaySoce;
        }
      }
    }
    this.setState({ ...this.state, statusTabs: list });
  }

  getEnterInfo(item) {
    let obj = this.state.statusTabs[this.state.page].data;
    let len = obj.length;
    let newItem = {...item};
    for (let i = 0; i < len; i++) {
      let mObj = obj[i];
      if (mObj.id === item.matchId) {
        newItem.saishi = mObj.matchEventNameZh;
        newItem.time_api = item.time;
        newItem.zhudui = mObj.homeNameZh;
        newItem.kedui = mObj.awayNameZh;
        newItem.zhudiu_bifen = item.homeScore;
        newItem.kedui_bifen = item.awayScore;
        newItem.id = item.matchId;
        newItem.type = item.type;
        newItem.redHomeCount = mObj.redHomeCount;
        newItem.redAwayCount = mObj.redAwayCount;
        newItem.position = item.position;
        return newItem;
      }
    }
    return null;
  }

  getRedInfo(item) {
    let obj = this.state.statusTabs[this.state.page].data;
    let len = obj.length;
    let newItem = {...item};
    for (let i = 0; i < len; i++) {
      let mObj = obj[i];
      if (mObj.id === item.matchId) {
        newItem.saishi = mObj.matchEventNameZh;
        newItem.time_api = item.time;
        newItem.zhudui = mObj.homeNameZh;
        newItem.kedui = mObj.awayNameZh;
        newItem.zhudiu_bifen = mObj.homeScore;
        newItem.kedui_bifen = mObj.awayScore;
        newItem.redHomeCount = item.homeRedCount;
        newItem.redAwayCount = item.awayRedCount;
        newItem.id = item.matchId;
        newItem.type = item.type;
        newItem.position = item.position;
        return newItem;
      }
    }
    return null;
  }

  eventdataUpdate(data) {
    const getTabIndex = (tabType) => {
      return this.state.statusTabs.findIndex((item) => item.index === tabType);
    };
    // // 赛事结束处理
    const doEndMatch = (tabType) => {
      if (status === MatchStaus.ENDS) {
        let tabIndex = this.state.statusTabs.findIndex(
          (item) => item.index === tabType
        );
        this.deleteMatchItemById(data.id, tabIndex);
      }
    };
    // console.log('数据类型是：' + type)
    let tabIndex = getTabIndex(StatusTab.IN_PLAY);

    if (this.state.page === StatusTab.IN_PLAY) {
      let msgObj = JSON.parse(data.msg);
      let goalObj = msgObj.goal;
      // console.log('进球===', goalObj);
      let newArr = [];
      for (let key in goalObj) {
        goalObj[key].matchId = parseInt(key);
        newArr.push(goalObj[key]);
      }
      let len = newArr.length;
      // if (newArr.length) {
      //   console.log(`后端推送的弹框数量${newArr.length}`, '接收到消息', newArr);
      // }

      for (let i = 0; i < len; i++) {
        let item = newArr[i];
        let type = item.type;
        // 进球提醒
        if (type === CompetitionFootballEventTypes.GOAL_IN) {
          // console.log('info index jinqiuTonzhi onmesson =', data, this.state.page, StatusTab.IN_PLAY, data.type, notiyEvtTypes.includes(data.type))
          let reminders = this.state.reminders.slice();
          let newItem = this.getEnterInfo(item);
          if (null == newItem) {
            // console.log('continue two;');
            continue;
          }
          if (this.isInReminders(newItem)) {
            // console.log('continue;');
            continue;
          }
          reminders.unshift(newItem);
          if (reminders.length > 3) {
            let item = reminders.pop();
            this.updateHighLightById(item.matchId);
          }
          console.log('进球');
          this.updateHighLightById(item.matchId, this.who(item.position));
          // this.setState({ reminders });
          this.setState({...this.state, reminders:reminders});
        }
      }
      // 红牌提醒
      let redObj = msgObj.red;
      // console.log('红牌===', redObj);
      newArr = [];
      for (let key in redObj) {
        redObj[key].matchId = parseInt(key);
        newArr.push(redObj[key]);
      }
      let mlen = newArr.length;
      for (let i = 0; i < mlen; i++) {
        let item = newArr[i];
        let type = item.type;
        if (type === CompetitionFootballEventTypes.RED_CARD) {
          // console.log('info index jinqiuTonzhi onmesson =', data, this.state.page, StatusTab.IN_PLAY, data.type, notiyEvtTypes.includes(data.type))
          let reminders = this.state.reminders.slice();
         
          let newItem = this.getRedInfo(item);
          if (null == newItem) continue;
          if (this.isInReminders(newItem)) {
            continue;
          }
          reminders.unshift(newItem);
          if (reminders.length > 3) {
            let item = reminders.pop();
            this.updateHighLightById(item.matchId);
          }
          this.updateHighLightById(item.matchId, this.who(item.position));
          console.log('红牌');
          // this.setState({ reminders });
          this.setState({...this.state, reminders:reminders}); 
        }
      }
    }
  }

  cornerNumber(data) {
    let list = [];
    list = list.concat(this.state.statusTabs);
    let statusTab = list[this.state.page].data;
    // let statusTab = this.state.statusTabs[this.state.page].data;
    let msgObj = JSON.parse(data.msg);
    let mylen = statusTab.length;
    let mlen = msgObj.corner.length;
    for (let i = 0; i < mylen; i++) {
      let tabsItem = statusTab[i];
      for (let j = 0; j < mlen; j++) {
        let updateItem = msgObj.corner[j];
        // tabsItem.cornerHomeCount = 3;
        // tabsItem.cornerAwayCount = 6;
        // console.log('更新的数据的id=', updateItem.matchId, '总的数据id=', tabsItem.id)
        if (updateItem.matchId == tabsItem.id) {
          tabsItem.cornerHomeCount = updateItem.home;
          tabsItem.cornerAwayCount = updateItem.away;
        }
      }
    }
    this.setState({ ...this.state, statusTabs: list });
  }

  goalNumber(data) {
    let list = [];
    list = list.concat(this.state.statusTabs);
    let statusTab = list[this.state.page].data;
    let msgObj = JSON.parse(data.msg);
    let mylen = statusTab.length;
    let goalObj = msgObj.goal;
    let newArr = [];
    for (let key in goalObj) {
      goalObj[key].matchId = parseInt(key);
      newArr.push(goalObj[key]);
    }
    let mlen = newArr.length;
    for (let i = 0; i < mylen; i++) {
      let tabsItem = statusTab[i];
      for (let j = 0; j < mlen; j++) {
        let updateItem = newArr[j];
        if (updateItem.matchId === tabsItem.id) {
          tabsItem.homeScore = updateItem.homeScore;
          tabsItem.awayScore = updateItem.awayScore;
          tabsItem.position = updateItem.position;
        }
      }
    }
    this.setState({ ...this.state, statusTabs: list });
  }

  yellowCardNumber(data) {
    let list = [];
    list = list.concat(this.state.statusTabs);
    let statusTab = list[this.state.page].data;
    let msgObj = JSON.parse(data.msg);
    let mylen = statusTab.length;
    let mlen = msgObj.yellow.length;
    for (let i = 0; i < mylen; i++) {
      let tabsItem = statusTab[i];
      for (let j = 0; j < mlen; j++) {
        let updateItem = msgObj.yellow[j];
        if (updateItem.matchId === tabsItem.id) {
          tabsItem.yellowHomeCount = updateItem.home;
          tabsItem.yellowAwayCount = updateItem.away;
        }
      }
    }
    this.setState({ ...this.state, statusTabs: list });
  }

  redCardNumber(data) {
    let list = [];
    list = list.concat(this.state.statusTabs);
    let statusTab = list[this.state.page].data;
    let msgObj = JSON.parse(data.msg);
    let redObj = msgObj.red;
    let newArr = [];
    for (let key in redObj) {
      redObj[key].matchId = parseInt(key);
      newArr.push(redObj[key]);
    }
    let mylen = statusTab.length;
    let mlen = newArr.length;
    for (let i = 0; i < mylen; i++) {
      let tabsItem = statusTab[i];
      for (let j = 0; j < mlen; j++) {
        let updateItem = newArr[j];
        if (updateItem.matchId === tabsItem.id) {
          switch (updateItem.position) {
          case 1:
            tabsItem.redHomeCount = updateItem.homeRedCount;
            break;
          case 2:
            tabsItem.redAwayCount = updateItem.awayRedCount;
            break;
          }
        }
      }
    }
    this.setState({ ...this.state, statusTabs: list });
  }

  realtimedataUpdate(data) {
    let arr = JSON.parse(data.msg);
    let list = [];
    list = list.concat(this.state.statusTabs);
    let statusTab = list[this.state.page].data;
    let len = statusTab.length;
    let mlen = arr.length;
    for (let i = 0; i < len; i++) {
      let tabsItem = statusTab[i];
      for (let j = 0; j < mlen; j++) {
        let updateItem = arr[j];
        // console.log(`第${i}条总的数据id=${tabsItem.id}   第${j}条更新的数据的id='      ${updataItem.matchId}     updataItem.oddType=${updataItem.oddType}`)
        if (updateItem.matchId === tabsItem.id) {
          // console.log('更新前的=', tabsItem);
          // console.log('更新的数据=', updateItem);
          if ('asia' === updateItem.oddType) {
            // console.log(
            //   `更新了左边i=${i}id=${updateItem.matchId}homeodd=${updateItem.homeOdd},tieOdd${updateItem.tieOdd},awayOdd${updateItem.awayOdd},状态${updateItem.oddState}`
            // );
            tabsItem.asiaHomeEndOdds = updateItem.homeOdd;
            tabsItem.asiaTieEndOdds = updateItem.tieOdd;
            tabsItem.asiaAwayEndOdds = updateItem.awayOdd;
            // tabsItem.teeTime = updateItem.sendDate;
            tabsItem.matchStatus = updateItem.oddState;
            tabsItem.yapan_home_odds_up_down_flag = updateItem.homeChange;
            tabsItem.yapan_away_odds_updown_flag = updateItem.awayChange;
            // if (i === 0) {
            //    console.log(`第${i}个左边边边主队应该是${updateItem.homeChange}   客队应该是${updateItem.awayChange}   homeOdd${updateItem.homeOdd}  tieOdd${updateItem.tieOdd}    awayOdd${updateItem.awayOdd}`);
            // };

            // console.log('更新后的=', tabsItem);
            // console.log('刷新的数据=', list);
            setTimeout(() => {
              this.setState({ ...this.state, statusTab: list });
            }, 0);
          } else if ('bs' === updateItem.oddType) {
            // console.log('更新前的=', tabsItem);
            // console.log('更新的数据=', updateItem);
            // console.log(`更新了右边i=${i}id=${updateItem.matchId}homeodd=${updateItem.homeOdd},tieOdd${updateItem.tieOdd},awayOdd${updateItem.awayOdd},状态${updateItem.oddState}`);
            tabsItem.bsHomeEndOdds = updateItem.homeOdd;
            tabsItem.bsTieEndOdds = updateItem.tieOdd;
            tabsItem.bsAwayEndOdds = updateItem.awayOdd;
            // tabsItem.teeTime = updateItem.sendDate;
            tabsItem.matchStatus = updateItem.oddState;
            tabsItem.daxiaoqiu_home_odds_up_down_flag = updateItem.homeChange;
            tabsItem.daxiaoqiu_away_odds_updown_flag = updateItem.awayChange;
            // if (i === 0) {
            //   console.log(`第${i}个右边边主队应该是${updateItem.homeChange}   客队应该是${updateItem.awayChange}   homeOdd${updateItem.homeOdd}  tieOdd${updateItem.tieOdd}    awayOdd${updateItem.awayOdd}`);
            // };
            // console.log('更新后的=', tabsItem);
            // console.log('刷新的数据=', list);
            setTimeout(() => {
              this.setState({ ...this.state, statusTab: list });
            }, 0);
          }
        }
      }
    }
  }

  realmatchstateOrAllMatchstateUpdate(data) {
    let list = [];
    list = list.concat(this.state.statusTabs);
    let statusTab = list[this.state.page].data;
    let arr = JSON.parse(data.msg);
    if (undefined !== arr && null !== arr) {
      // 改变状态
      for (let i = 0, len = statusTab.length; i < len; i++) {
        let tabsItem = statusTab[i];
        for (let j = 0, mlen = arr.length; j < mlen; j++) {
          let updateItem = arr[j];
          // console.log(`发来更新的 第${i}个的状态由${tabsItem.matchStatus}改成${updateItem.matchStatus}`);
          if (updateItem.matchId === tabsItem.id) {
            // console.log(`实际更新的                id是${tabsItem.id}第${i}个的状态由${tabsItem.matchStatus}改成${updateItem.matchStatus}`);
            tabsItem.matchStatus = updateItem.matchStatus;
            tabsItem.teeTime = updateItem.teeTime;
            this.setState({ ...this.state, statusTabs: list });
          }
        }
      }
      // 删除比赛
      for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        let status = getMatchStatus(item.matchStatus);
        // console.log('删除id=', item.matchId, '状态码是=', item.matchStatus, '状态是=', status);
        if (this.state.page === StatusTab.IN_PLAY && status !== MatchStaus.IN_PLAY) {
          let tabIndex = this.state.statusTabs.findIndex((item) => item.index === StatusTab.IN_PLAY);
          this.deleteMatchItemById(item.matchId, tabIndex, StatusTab.IN_PLAY);
        } else if (this.state.page === StatusTab.AGENDA && (status === MatchStaus.IN_PLAY || status === MatchStaus.ENDS)) {
          let tabIndex = this.state.statusTabs.findIndex((item) => item.index === StatusTab.AGENDA);
          this.deleteMatchItemById(item.matchId, tabIndex, StatusTab.AGENDA);
        }
      }
    }

  }

  isInReminders(data) {
    return this.state.reminders.find((item) => {
      return JSON.stringify(item) == JSON.stringify(data);
    });
  }

  batchUpdateList(datas, tabIndex) {
    if (datas.length <= 0) return;
    let tab = this.state.statusTabs[tabIndex];
    if (tab) {
      let found;
      let c = 0;
      for (let i = 0; i < tab.data.length; i++) {
        found = datas.find((item) => item.id === tab.data[i].id);
        if (found) {
          tab.data[i] = Object.assign({}, tab.data[i], found);
          c++;
        }
      }
      // console.log('batchUpdateList 更新了 ', c)
      let statusTabs = this.state.statusTabs;
      statusTabs.splice(tabIndex, 1, tab);
      this.setState({ statusTabs });
    }
  }

  closeSocket() {
    // console.log('info index websocket close begin 0 =' , this.socket?.socket?.readyState)
    if (
      this.socket?.socket &&
      [0, 1].includes(this.socket?.socket?.readyState)
    ) {
      this.socket.close();
    }
  }

  isExistMatch(id, tabIndex) {
    let tab = this.state.statusTabs[tabIndex];
    if (tab) {
      return tab.data.findIndex((item) => item.id === id) >= 0;
    }
    return false;
  }

  /**
   * 更新z的升降状态（上升，下降）
   * @param {*} match
   */
  updateMatch(match = {}) {
    let index = this.state.statusTabs.findIndex(
      (item) => item.index === StatusTab.IN_PLAY
    );
    if (index >= 0) {
      let tab = this.state.statusTabs[index];
      let matches = tab.data;
      for (let i = 0, len = matches.length; i < len; i++) {
        if (matches[i].id === match.id) {
          // matches[i].home_odds = match.home_odds;
          // matches[i].home_odds2 = match.home_odds2;
          // matches[i].away_odds = match.away_odds;
          // matches[i].away_odds2 = match.away_odds2;
          matches[i] = Object.assign({}, matches[i], match);
          break;
        }
      }
      let statusTabs = this.state.statusTabs;
      statusTabs.splice(index, 1, tab);
      this.setState({ statusTabs });
    }
  }
  /**
   * 增加一个赛事
   * @param {*} data
   * @param {*} tabIndex
   */
  addMatchToList(data, tabIndex, type = StatusTab.IN_PLAY) {
    let index = this.state.statusTabs.findIndex((item) => item.index === type);
    let tab = this.state.statusTabs[tabIndex];
    if (tab && index >= 0) {
      tab.data.push(data);
      // console.log(`增加一场比赛id${data?.matchId}比赛名字 ${data?.id} 主队名字 ${data?.homeNameZh} 客队名字 ${data?.awayNameZh}比赛状态${data?.matchStatus}`);
      let statusTabs = this.state.statusTabs;
      if (tab.data.length) {
        tab.noData = false;
        tab.loading = false;
      }
      statusTabs.splice(index, 1, tab);
      this.setState({ statusTabs });
    }
  }
  /**
   * 删除一个赛事
   * @param {*} id
   * @param {*} tabIndex
   */
  deleteMatchItemById(id, tabIndex, type = StatusTab.IN_PLAY) {
    let index = this.state.statusTabs.findIndex((item) => item.index === type);
    let tab = this.state.statusTabs[tabIndex];
    if (tab && index >= 0) {
      for (let i = 0, len = tab.data.length; i < len; i++) {
        if (tab.data[i].id === id) {
          // console.log(`进行中删除一场比赛id${tab.data[i]?.id}比赛名字 ${tab.data[i]?.matchEventNameZh} 比赛主队名字  ${tab.data[i]?.homeNameZh} 客队名字 ${tab.data[i]?.awayNameZh}比赛状态${tab.data[i]?.matchStatus}`);
          tab.data.splice(i, 1);
          break;
        }
      }
      if (0 === tab.data.length) {
        tab.noData = true;
        tab.loading = false;
      }
      let statusTabs = this.state.statusTabs;
      statusTabs.splice(index, 1, tab);
      this.setState({ statusTabs });
    }
  }

  judgeChange(d1, d2) {
    return d1 > d2 ? 'up' : d1 < d2 ? 'down' : 'equal';
  }

  /**
   * 根据赛事列表ID更新赛事队名高亮标识(增加或取消队名高亮)
   * @param {*} id 赛事列表ID
   * @param {*} teamType 队类型（主队:home | 客队:away）， 为空则取消高亮
   */
  updateHighLightById(id, teamType = '') {
    let index = this.state.statusTabs.findIndex(
      (item) => item.index === StatusTab.IN_PLAY
    );
    // let index = this.state.statusTabs.findIndex((item) => item.index === StatusTab.ALL);//?tom test
    if (index >= 0) {
      let tab = this.state.statusTabs[index];
      let matches = tab.data;
      for (let i = 0, len = matches.length; i < len; i++) {
        if (matches[i].id === id) {
          matches[i].homeHasActiveEvent = teamType === 'home';
          matches[i].awayHasActiveEvent = teamType === 'away';
          matches[i] = Object.assign({}, matches[i]);
          break;
        }
      }
      tab.data = matches.slice(0);
      let statusTabs = this.state.statusTabs;
      statusTabs.splice(index, 1, tab);
      this.setState({ statusTabs });
    }
  }

  /**
   * 提示结束
   */
  reminderShowEnd = (id) => {
    let reminders = this.state.reminders.slice();
    let found = reminders.findIndex((item) => item.id === id);
    if (found >= 0) reminders.splice(found, 1);
    this.updateHighLightById(id);
    // this.setState({ reminders });
    this.setState({...this.state, reminders:reminders});
  };

  who(type) {
    // 事件发生方,0-中立 1,主队 2,客队
    return type === 1 ? 'home' : type === 2 ? 'away' : '';
  }

  componentWillUnmount() {
    EventBus.removeListenser('evtNofityToMatchListPage');
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.closeSocket();
  }

  renderlistItem = (item, index, len, needFav = true) => {
    return (
      <ListItem
        key={item.id}
        data={item}
        listType={this.state.gameType}
        itemType={this.footballTabTypeMapping[this.state.page]}
        isFirstItem={index === 0}
        isLastItem={index === len - 1}
        len={len}
        index={index}
        updateFavourite={this.updateFavourite}
        showsVerticalScrollIndicator={this.showsVerticalScrollIndicator}
        needFav={needFav}
      />
    );
  };

  renderListFooter = (len, loadMore, noData = false) => {
    let curTab = this.state.statusTabs[this.state.page];
    len = curTab?.data?.length;
    loadMore = curTab.loadMore;
    let listViewHeight = this.getListViewHeight();
    let itemCount = Math.floor(listViewHeight / px(142));
    // console.log('info renderListFooter', len, loadMore, noData, ' listViewHeight=', listViewHeight, itemCount)
    return (
      <>
        {len > 0 &&
          <ShadowBox
            // inner // <- enable inner shadow
            useSvg // <- set this prop to use svg on ios
            style={styles.shadowBoxStyle}
          >
          </ShadowBox>}
        {loadMore === false && noData === false && len > itemCount && <NoMoreData style={{ marginBottom: px(40) }} />}
        <View style={{ height: px(100) }}></View>
      </>
    );
  };

  getListViewHeight() {
    return this.state.containerHeight - px(74);
  }

  layoutHandler = (event) => {
    this.setState({
      containerHeight: event?.nativeEvent?.layout?.height || winHeight,
    });
  };

  scrollStart = (e) => {
    if (e?.nativeEvent) {
      if (e.nativeEvent?.velocity?.y >= 3 || e.nativeEvent?.velocity?.y <= -3) {
        this.setState({ showBackTop: false });
      }
    }
  };

  scrollEnd = (e) => {
    if (e?.nativeEvent) {
      let canShowBackTop =
        e.nativeEvent.contentOffset?.y +
        e.nativeEvent.layoutMeasurement?.height >=
        e.nativeEvent.layoutMeasurement?.height * 3;
      if (this.state.showBackTop && !canShowBackTop) {
        this.setState({ showBackTop: false });
      } else if (!this.state.showBackTop && canShowBackTop) {
        this.setState({ showBackTop: true });
      }
    }
  };

  render() {
    let curTab = this.state.statusTabs[this.state.page];
    // console.log('render =', Date.now(), curTab)
    return (
      <View style={styles.container} onLayout={this.layoutHandler}>
        {this.state.showTabs && (
          <Tabs
            tabs={this.state.tabs}
            tabBarBackgroundColor={theme.header.backgroundColor}
            tabBarInactiveTextColor={theme.text.color9}
            tabBarActiveTextColor={theme.background.color12}
            tabBarTextStyle={styles.tabBarTextStyle}
            tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
            swipeable={this.state.tabsConfig.swipeable}
            useOnPan={this.state.tabsConfig.useOnPan}
            usePaged={this.state.tabsConfig.usePaged}
            onChange={this.tabHandler}
            initialPage={this.state.page}
            // animated={false}
            ref={(ref) => (this.tabRef = ref)}
          >
            <View style={[styles.tabContent, cstyle.pdL20, cstyle.pdR20]}>
              {this.state.page === StatusTab.ALL && !curTab.loading && (
                <FlatList
                  ref={(ref) => (this.refContent = ref)}
                  data={curTab?.data}
                  keyExtractor={(item, index) => index + ''}
                  onEndReached={this.endReachedHandler}
                  onEndReachedThreshold={0.5}
                  renderItem={({ item, index }) =>
                    this.renderlistItem(item, index, curTab?.data?.length)
                  }
                  // ListFooterComponent={() => this.renderListFooter(curTab?.data?.length, curTab.loadMore)}
                  ListFooterComponent={this.renderListFooter}
                  showsVerticalScrollIndicator={
                    this.showsVerticalScrollIndicator
                  }
                  initialNumToRender={this.INITIAL_NUM_TO_RENDER}
                  removeClippedSubviews={this.removeClippedSubviews}
                  windowSize={this.LIST_WINDOW_SIZE}
                  onMomentumScrollBegin={this.scrollStart}
                  onMomentumScrollEnd={this.scrollEnd}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this.refreshList}
                    />
                  }
                />
              )}
              {this.state.page === StatusTab.ALL && (
                <CommonResult
                  loading={curTab.loading}
                  noData={curTab?.noData}
                  timeout={curTab?.timeout}
                  onPress={this.refreshMatchList}
                />
              )}
            </View>
            <View style={[styles.tabContent, cstyle.flex1]}>
              {this.state.page === StatusTab.IN_PLAY && (
                <View style={[cstyle.pdL20, cstyle.pdR20]}>
                  {!curTab.loading && (
                    <FlatList
                      ref={(ref) => (this.refContent = ref)}
                      data={curTab?.data}
                      keyExtractor={(item, index) => index + ''}
                      onEndReached={this.endReachedHandler}
                      renderItem={({ item, index }) =>
                        this.renderlistItem(item, index, curTab?.data?.length)
                      }
                      ListFooterComponent={() =>
                        this.renderListFooter(
                          curTab?.data?.length,
                          curTab.loadMore
                        )
                      }
                      showsVerticalScrollIndicator={
                        this.showsVerticalScrollIndicator
                      }
                      initialNumToRender={this.INITIAL_NUM_TO_RENDER}
                      removeClippedSubviews={this.removeClippedSubviews}
                      windowSize={this.LIST_WINDOW_SIZE}
                      onScroll={this.onScroll}
                      onMomentumScrollBegin={this.scrollStart}
                      onMomentumScrollEnd={this.scrollEnd}
                      refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this.refreshList}
                        />
                      }
                    />
                  )}
                </View>
              )}
              {this.state.page === StatusTab.IN_PLAY &&
                this.state.reminders &&
                this.state.reminders.length > 0 && (
                <View style={styles.reminderWp}>
                  {this.state.reminders.map((info, i) => (
                    <Reminder
                      type={this.state.gameType}
                      id={info.id}
                      matchName={info.saishi}
                      matchTime={info.time_api}
                      teamHomeName={info.zhudui}
                      teamAwayName={info.kedui}
                      homeScore={info.zhudiu_bifen}
                      awayScore={info.kedui_bifen}
                      remiderType={info.type}
                      homeRedCard={info.redHomeCount}
                      awayRedCard={info.redAwayCount}
                      eventTeamType={this.who(info.position)}
                      key={i}
                      showEnd={this.reminderShowEnd}
                    />
                  ))}
                </View>
              )}
              {this.state.page === StatusTab.IN_PLAY && (
                <CommonResult
                  loading={curTab.loading}
                  noData={curTab?.noData}
                  timeout={curTab?.timeout}
                  onPress={this.refreshMatchList}
                />
              )}
            </View>
            <View style={styles.tabContent}>
              {this.state.page === StatusTab.AGENDA && (
                <>
                  <WeekHeader
                    click={this.weekHeaderHandler}
                    onLoad={(d) => this.weekHeaderOnLoad(d, StatusTab.AGENDA)}
                    updateFlag={curTab.updateFlag}
                  />
                  <View style={[cstyle.pdL20, cstyle.pdR20]}>
                    {!curTab.loading && (
                      <FlatList
                        ref={(ref) => (this.refContent = ref)}
                        data={curTab?.data}
                        keyExtractor={(item, index) => index + ''}
                        onEndReached={this.endReachedHandler}
                        renderItem={({ item, index }) =>
                          this.renderlistItem(item, index, curTab?.data?.length)
                        }
                        ListFooterComponent={() =>
                          this.renderListFooter(
                            curTab?.data?.length,
                            curTab.loadMore
                          )
                        }
                        showsVerticalScrollIndicator={
                          this.showsVerticalScrollIndicator
                        }
                        initialNumToRender={this.INITIAL_NUM_TO_RENDER}
                        removeClippedSubviews={this.removeClippedSubviews}
                        windowSize={this.LIST_WINDOW_SIZE}
                        onEndReachedThreshold={0.5}
                        onMomentumScrollBegin={this.scrollStart}
                        onMomentumScrollEnd={this.scrollEnd}
                        refreshControl={
                          <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.refreshList}
                          />
                        }
                      />
                    )}
                  </View>
                </>
              )}
              {this.state.page === StatusTab.AGENDA && (
                <CommonResult
                  loading={curTab.loading}
                  noData={curTab?.noData}
                  timeout={curTab?.timeout}
                  onPress={this.refreshMatchList}
                  noDataMsg="暂无相关赛程"
                />
              )}
            </View>
            <View style={styles.tabContent}>
              {this.state.page === StatusTab.ENDS && (
                <>
                  <WeekHeader
                    click={this.weekHeaderHandler}
                    onLoad={(d) => this.weekHeaderOnLoad(d, StatusTab.ENDS)}
                    beforeWeek={true}
                    page={this.state.page}
                    updateFlag={curTab.updateFlag}
                  />
                  <View style={[cstyle.pdL20, cstyle.pdR20]}>
                    {!curTab.loading && (
                      <FlatList
                        ref={(ref) => (this.refContent = ref)}
                        data={curTab?.data}
                        keyExtractor={(item, index) => index + ''}
                        onEndReached={this.endReachedHandler}
                        renderItem={({ item, index }) =>
                          this.renderlistItem(
                            item,
                            index,
                            curTab?.data?.length,
                            false
                          )
                        }
                        ListFooterComponent={() =>
                          this.renderListFooter(
                            curTab?.data?.length,
                            curTab.loadMore
                          )
                        }
                        showsVerticalScrollIndicator={
                          this.showsVerticalScrollIndicator
                        }
                        initialNumToRender={this.INITIAL_NUM_TO_RENDER}
                        removeClippedSubviews={this.removeClippedSubviews}
                        windowSize={this.LIST_WINDOW_SIZE}
                        onEndReachedThreshold={0.5}
                        onScroll={this.onScroll}
                        onMomentumScrollBegin={this.scrollStart}
                        onMomentumScrollEnd={this.scrollEnd}
                        refreshControl={
                          <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.refreshList}
                          />
                        }
                      />
                    )}
                  </View>
                </>
              )}
              {this.state.page === StatusTab.ENDS && (
                <CommonResult
                  loading={curTab.loading}
                  noData={curTab?.noData}
                  timeout={curTab?.timeout}
                  onPress={this.refreshMatchList}
                  noDataMsg="暂无相关赛果"
                />
              )}
            </View>
            <View style={styles.tabContent}>
              <View style={[cstyle.pdL20, cstyle.pdR20]}>
                {this.state.page === StatusTab.FAVOURITE && !curTab.loading && (
                  <FlatList
                    ref={(ref) => (this.refContent = ref)}
                    data={curTab?.data}
                    keyExtractor={(item, index) => index + ''}
                    onEndReached={this.endReachedHandler}
                    renderItem={({ item, index }) => this.renderlistItem(item, index, curTab?.data?.length)}
                    ListFooterComponent={() => this.renderListFooter(curTab?.data?.length, curTab.loadMore)}
                    showsVerticalScrollIndicator={this.showsVerticalScrollIndicator}
                    initialNumToRender={this.INITIAL_NUM_TO_RENDER}
                    removeClippedSubviews={this.removeClippedSubviews}
                    windowSize={this.LIST_WINDOW_SIZE}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={this.scrollStart}
                    onMomentumScrollEnd={this.scrollEnd}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refreshList}
                      />
                    }
                  />
                )}
              </View>
              {this.state.page === StatusTab.FAVOURITE && (
                <CommonResult
                  loading={curTab.loading}
                  noData={curTab?.noData}
                  timeout={curTab?.timeout}
                  onPress={this.refreshMatchList}
                  noDataType={StatusTab.FAVOURITE}
                  noDataOnPress={this.gotoAllCompetition}
                />
              )}
            </View>
          </Tabs>
        )}
        <BackTop
          show={this.state.showBackTop}
          onPress={this.backTop}
          style={styles.backTop}
        />
      </View>
    );
  }
}

export default connect(mapState, mapDispatch)(withWrapTeleport(Competition));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
    paddingBottom: theme.screenPaddingBottom,
  },
  headerLeftImage: {
    width: px(36),
    height: px(36),
  },
  headerRightImage: {
    width: px(36),
    height: px(32),
  },
  tabBarTextStyle: {
    fontSize: px(26),
  },
  tabBarBackgroundColor: {
    backgroundColor: theme.header.backgroundColor,
  },
  tabBarUnderlineStyle: {
    borderColor: theme.background.color12,
    backgroundColor: theme.background.color12,
  },
  tabContent: {
    // padding: px(20)
  },
  badgeTabTxt: {
    backgroundColor: theme.header.backgroundColor,
    color: theme.text.color9,
    fontSize: px(26),
  },
  noDataBtn: {
    width: px(170),
    height: px(60),
    marginTop: px(30),
    backgroundColor: theme.button.color,
  },
  noDataBtnTxt: {
    fontSize: px(24),
  },
  networkErr: {
    marginTop: px(140),
  },
  listTip: {
    height: px(80),
    paddingTop: px(20),
    alignItems: 'center',
  },
  listTipTxt: {
    color: theme.text.color7,
  },
  reminderWp: {
    width: '100%',
    position: 'absolute',
    top: px(0),
    zIndex: 101,
  },
  backTop: {
    bottom: px(140),
  },
  shadowBoxStyle: {
    shadowOffset: { width: px(6), height: px(10) },
    shadowOpacity: theme.shadowOpacity,
    shadowColor: theme.shadowColor,
    shadowRadius: px(10),
    borderBottomLeftRadius: px(20),
    borderBottomRightRadius: px(20),
    backgroundColor: theme.background.colorWhite,
    width: px(710),
    height: px(10),
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.border.color16,
  },
});
