import * as React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ScrollView,
  Animated,
  Easing,
  AppState,
} from 'react-native';
import { Tabs, Toast, Portal } from '@ant-design/react-native';
import { connect } from 'react-redux';
import AppActions from '../../store/actions';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
// import NoDataPlaceHolder from '../../components/no-data-placeholder';
import DetailLive from './DetailLive';
import Chat from './Chat';
import Team from './Team';
import Exponent from './Exponent';
import Infos from './Infos';
import Datas from './Datas';
import Video from 'react-native-video';
import Loading from '../../components/loading';
import NetWorkError from '../../components/network-error';
import APIs from '../../http/APIs';
import {
  getMatchStatus,
  MatchStaus,
  isHalftime,
} from '../../utils/matchCommon';
import { dateFormat, secondsToMinutes, fmtOverTime } from '../../utils/date';
import MyWebSocket from '../../socket';
import EventBus from '../../utils/eventBus';
import { enptyFn } from '../../utils/common';
import { getUniqueId } from 'react-native-device-info';

const IMAGE_BASE_DIR = '../../assets/images/';
const dashboardBgImage = require(IMAGE_BASE_DIR + 'stadium.png');
const iconFootball = require(IMAGE_BASE_DIR + 'icon-football.png');

const devideId = getUniqueId();

const mapState = (state) => ({
  state,
});

const mapDispatch = {
  updateFooterTabBar: AppActions.updateFooterTabBar,
};

const TabTypes = {
  LIVE: 0,
  CHAT: 1,
  TEAM: 2,
  INFOS: 3,
  EXPONENT: 4,
  DATA: 5,
};

const imageFavourite = require(IMAGE_BASE_DIR + 'icon-star3.png');
const imageOnFavourite = require(IMAGE_BASE_DIR + 'icon-star2.png');
const imageShare = require(IMAGE_BASE_DIR + 'icon-link.png');

function HeaderLeft(props) {
  return (
    <View style={[cstyle.flexJcC, cstyle.flexAiC, cstyle.flex1]}>
      <TouchableOpacity
        activeOpacity={theme.activeOpacity}
        onPress={props.onPress}
        style={[cstyle.w100, cstyle.flex1]}
      >
        <View style={theme.iconBack}></View>
      </TouchableOpacity>
    </View>
  );
}

function HeaderRight(props) {
  let { fav } = props;
  function updateFavourite() {
    props.updateFavourite && props.updateFavourite(fav);
  }
  function share() {}
  return (
    <View
      style={[cstyle.flexDirecR, cstyle.flexJcC, cstyle.flexAiC, cstyle.flex1]}
    >
      <TouchableOpacity
        activeOpacity={theme.activeOpacity}
        onPress={updateFavourite}
        style={cstyle.mgR20}
      >
        <Image
          source={fav === 'y' ? imageOnFavourite : imageFavourite}
          style={styles.headerRightIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={theme.activeOpacity}
        onPress={share}
        style={cstyle.mgR20}
      >
        <Image source={imageShare} style={styles.headerRightIcon} />
      </TouchableOpacity>
    </View>
  );
}

class CompetitionDetail extends React.Component {
  socket;
  state = {
    id: '',
    matchId: '',
    typeTabs: [
      { title: '现场', index: TabTypes.LIVE },
      { title: '聊天', index: TabTypes.CHAT },
      { title: '阵容', index: TabTypes.TEAM },
      { title: '情报', index: TabTypes.INFOS },
      { title: '指数', index: TabTypes.EXPONENT },
      { title: '往绩', index: TabTypes.DATA },
    ],
    initialPage: 0,
    page: 0,
    playingVideo: false,
    tabsConfig: {
      swipeable: true,
      useOnPan: true,
      usePaged: true,
    },
    showVideo: true,
    showVideoLoading: true,
    showNetworkError: false,
    video: {
      control: true,
      paused: false,
      uri: '',
    },
    detail: {},
    activeTab: 1,
    eventStatData: null,
    aniBlink: new Animated.Value(0),
    playingTime: 0,
  };
  componentDidMount() {
    this.props.updateFooterTabBar({ show: false });
    this.props.navigation.setOptions({
      headerLeft: (props) => <HeaderLeft onPress={this.backHandler} />,
    });
    this.setHeaderRight();
    this.init();
    // this.initSocket();
    if (!EventBus.has('evtNofityToMatchDetailPage')) {
      EventBus.addListenser('evtNofityToMatchDetailPage', (data) => {
        this.socketMessageHandler(data);
      });
    }
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  init() {
    this.getMatchDetail(this.props.route.params?.match_id).then((data) => {
      const status = getMatchStatus(data.match_status);
      if (status === MatchStaus.IN_PLAY) {
        this.startBlinkAni();
        this.setState({
          playingTime: secondsToMinutes(data.teeTime - data.matchTime),
        });
        this.startTimer();
      }
      // this.setState({playingTime: secondsToMinutes(1590469382308 - 1590469375908)});
      // this.startTimer();
    });
  }
  UNSAFE_componentWillMount() {
    // console.log('info componentWillMount route.params=', this.props.route.params)
    this.setState({
      matchId: this.props.route.params?.match_id,
      id: this.props.route.params?.id,
    });
  }
  setHeaderRight() {
    this.props.navigation.setOptions({
      headerRight: (props) => (
        <HeaderRight
          onPress={() => {}}
          fav={this.state.detail?.fav}
          updateFavourite={this.updateFavourite}
        />
      ),
    });
  }
  handleAppStateChange = (state = {}) => {
    if (state === 'active') {
      this.init();
      this.closeSocket();
      setTimeout(() => {
        this.initSocket();
      });
    }
  };
  goBackClickStartTime = Date.now();
  backHandler = () => {
    if (Date.now() - this.goBackClickStartTime < 300) return;
    this.goBackClickStartTime = Date.now();
    if (this.state.playingVideo) {
      let video = this.state.video;
      video.paused = true;
      this.setState({ video, playingVideo: false });
      return;
    }
    if (this.props.navigation.canGoBack()) {
      // this.props.navigation.goBack();
      this.props.navigation.navigate('CompetitionIndex');
    }
  };
  updateFavourite = (fav) => {
    let key = Toast.loading('处理中...', 5, enptyFn, false);
    fav = fav === 'y' ? 'n' : 'y';
    APIs.updateFavourite({ id: this.state.id, fav, devid: devideId })
      .then((res) => {
        Portal.remove(key);
        // Toast.success(fav === 'y' ? '收藏成功!' : '已取消收藏', 3, enptyFn, false);
        let detail = this.state.detail;
        detail.fav = fav;
        // console.log('updateFavourite res=', res)
        this.setHeaderRight();
      })
      .catch(() => {
        Portal.remove(key);
      });
  };
  tabHandler = (tab, index) => {
    this.setState({ page: index });
  };
  liveHandler = (type) => {
    let video = this.state.video;
    video.paused = false;
    this.setState({
      video,
      playingVideo: true,
      showVideoLoading: true,
      showNetworkError: false,
      showVideo: true,
    });
    setTimeout(() => {
      if (this.state.showVideoLoading) {
        this.setState({
          showVideoLoading: false,
          showNetworkError: true,
          showVideo: false,
        });
      }
    }, 5000);
  };
  onBuffer = () => {
    console.log('info onBuffer');
  };
  videoError = () => {
    console.log('info videoError');
  };
  videoOnLoad = () => {
    this.setState({ showVideoLoading: false, showVideo: true });
  };
  componentWillUnmount() {
    // this.closeSocket();
    EventBus.removeListenser('evtNofityToMatchDetailPage');
    this.setState = enptyFn;
    if (this.playingTimer !== undefined) clearInterval(this.playingTimer);
    if (this.aniBlink) this.aniBlink.stop();
    EventBus.emit('evtMatchIndexFromGoBack', {
      id: this.state.id,
      fav: this.state.detail?.fav,
    });
    this.props.updateFooterTabBar({ show: true });
  }
  getMatchDetail = (matchId) => {
    let key = Toast.loading('加载数据中...', 5, enptyFn, false);
    return APIs.getMatchDetailById({ where: `match_id=${matchId}` })
      .then(({ data }) => {
        // console.log('MatchDetail=', data);
        if (data && data.length > 0) {
          data = data[0];
          let video = this.state.video;
          video.uri = data.play_url;
          this.setState({ detail: data, video }, this.setHeaderRight);
        }
        return data;
      })
      .finally((data) => {
        Portal.remove(key);
      });
  };
  updateMatchDetail(match = {}) {
    if (this.state.detail.match_id === match.match_id) {
      this.setState({ detail: Object.assign({}, this.state.detail, match) });
    }
  }
  initSocket() {
    if (
      this.socket?.socket &&
      [0, 1].includes(this.socket?.socket?.readyState)
    ) {
      return;
    }
    this.socket = new MyWebSocket({
      onmessage: (data) => {
        this.socketMessageHandler(data);
      },
    });
  }
  socketMessageHandler = (data) => {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].match_id === this.state.detail.match_id) {
          this.updateMatchDetail(data[i]);
          break;
        }
      }
    } else {
      this.setState({ eventStatData: data });
    }
  };
  closeSocket() {
    if (
      this.socket?.socket &&
      [0, 1].includes(this.socket?.socket?.readyState)
    ) {
      this.socket.close();
    }
  }
  startBlinkAni() {
    this.aniBlink = Animated.loop(
      Animated.timing(this.state.aniBlink, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: true,
      })
    ).start();
  }
  startTimer() {
    this.playingTimer = setInterval(() => {
      this.setState({ playingTime: this.state.playingTime + 1 });
    }, 60000);
  }
  render() {
    let detail = this.state.detail;
    // detail.video = 1
    // detail.animation = 1
    // detail.match_status = 3;
    const matchTime =
      (detail.matchTime &&
        dateFormat(new Date(detail.matchTime * 1000), 'MM.dd hh : mm')) ||
      '';
    const status = getMatchStatus(detail.match_status);
    const statusHalftime = isHalftime(detail.match_status);
    return (
      <View style={styles.container}>
        <View style={[cstyle.pd20, this.state.playingVideo ? cstyle.hide : {}]}>
          <ImageBackground
            source={dashboardBgImage}
            style={(styles.bgImage, styles.header)}
          >
            <View style={[cstyle.flexAiC, styles.mgT16]}>
              <Text style={[cstyle.txtColorWhite, cstyle.fz24]}>
                {detail.event_saishi}
              </Text>
            </View>
            <View style={cstyle.flexAiC}>
              <Text style={[cstyle.txtColorWhite, cstyle.fz18]}>
                {matchTime}
              </Text>
            </View>
            <View style={[cstyle.flexDirecR, styles.headerTeamWp]}>
              <View style={[cstyle.flex1, cstyle.flexAiC]}>
                <Image source={{ uri: detail.logo }} style={styles.teamLogin} />
                <View style={[cstyle.mgT4, styles.teamName]}>
                  <Text
                    style={[cstyle.txtColorWhite, cstyle.fz24, cstyle.txtC]}
                  >
                    {detail.teamname_zhudui}
                  </Text>
                </View>
              </View>
              <View style={[styles.headerMid, cstyle.flexAiC]}>
                <View
                  style={[
                    cstyle.flexDirecR,
                    cstyle.flexAiC,
                    cstyle.flexJcC,
                    styles.matchStatus,
                    cstyle.mgT10,
                  ]}
                >
                  {/* <Text style={[cstyle.txtColorWhite, cstyle.fz20]}>{fmtOverTime(this.state.playingTime)}</Text> */}
                  {status === MatchStaus.DELAY && (
                    <Text style={[cstyle.txtColorWhite, cstyle.fz20]}>推</Text>
                  )}
                  {status === MatchStaus.WAITING_BEGIN && (
                    <Text style={[cstyle.txtColorWhite, cstyle.fz20]}>未</Text>
                  )}
                  {status === MatchStaus.ENDS && (
                    <Text style={[cstyle.txtColorWhite, cstyle.fz20]}>完</Text>
                  )}
                  {status === MatchStaus.IN_PLAY && (
                    <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                      {statusHalftime ? (
                        <Text style={[cstyle.txtColorWhite, cstyle.fz20]}>
                          中
                        </Text>
                      ) : (
                        <>
                          <Text style={[cstyle.txtColorWhite, cstyle.fz20]}>
                            {fmtOverTime(this.state.playingTime)}
                          </Text>
                          <Animated.Text
                            style={{
                              height: px(30),
                              color: theme.text.colorWhite,
                              opacity: this.state.aniBlink.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0, 0, 1],
                              }),
                            }}
                          >
                            <Text>&0apos;</Text>
                          </Animated.Text>
                          <Image
                            source={iconFootball}
                            style={styles.iconFootball}
                          />
                        </>
                      )}
                    </View>
                  )}
                </View>
                <View style={[cstyle.flexDirecR, cstyle.flexJcC]}>
                  <Text style={styles.scoreTxt}>{detail.homeScore}</Text>
                  <Text style={[styles.pdlr10, styles.scoreTxt]}>-</Text>
                  <Text style={styles.scoreTxt}>{detail.kedui_bifen}</Text>
                </View>
                <View style={[cstyle.flexDirecR, cstyle.flexJcC]}>
                  <Text style={styles.halfScoreTxt}>
                    ({detail.halfHomeSoce}
                  </Text>
                  <Text style={[styles.pdlr10, styles.halfScoreTxt]}>-</Text>
                  <Text style={styles.halfScoreTxt}>
                    {detail.halfAwaySoce})
                  </Text>
                </View>
              </View>
              <View style={[cstyle.flex1, cstyle.flexAiC]}>
                <Image
                  source={{ uri: detail.logo_kedui }}
                  style={styles.teamLogin}
                />
                <View style={[cstyle.mgT4, styles.teamName]}>
                  <Text
                    style={[cstyle.txtColorWhite, cstyle.fz24, cstyle.txtC]}
                  >
                    {detail.kedui}
                  </Text>
                </View>
              </View>
            </View>
            <View style={cstyle.flexAiC}>
              <View style={[cstyle.flexDirecR, styles.videoBtnWp]}>
                {detail.video > 0 && (
                  <View
                    style={[
                      styles.videoType,
                      styles.bdRidsL,
                      detail.animation === 0 ? styles.bdRidsR : {},
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={theme.clickOpacity}
                      onPress={() => this.liveHandler('video')}
                    >
                      <Text style={styles.videoTxt}>视频直播</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {detail.video > 0 && detail.animation > 0 && (
                  <View
                    style={[cstyle.flexAiC, cstyle.flexJcC, styles.midLineWp]}
                  >
                    <Text style={styles.midLine}>|</Text>
                  </View>
                )}
                {detail.animation > 0 && (
                  <View
                    style={[
                      styles.videoType,
                      styles.bdRidsR,
                      detail.video === 0 ? styles.bdRidsL : {},
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={theme.clickOpacity}
                      onPress={() => this.liveHandler('animation')}
                    >
                      <Text style={styles.videoTxt}>动画直播</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <View
              style={[
                cstyle.flexDirecR,
                cstyle.flexJcSb,
                styles.weatherWp,
                cstyle.mgT12,
              ]}
            >
              <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                <Image
                  source={require(IMAGE_BASE_DIR + 'weather-1.png')}
                  style={[styles.weatherIcon, { width: px(30) }]}
                />
                <Text style={styles.weatherTxt}>天气:{detail.weather}</Text>
              </View>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                <Image
                  source={require(IMAGE_BASE_DIR + 'weather-humidity.png')}
                  style={[styles.weatherIcon, { width: px(10) }]}
                />
                <Text style={styles.weatherTxt}>湿度:{detail.humidity}</Text>
              </View>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                <Image
                  source={require(IMAGE_BASE_DIR + 'weather-thermometer.png')}
                  style={[styles.weatherIcon, { width: px(10) }]}
                />
                <Text style={styles.weatherTxt}>
                  温度: {detail.temperature}
                </Text>
              </View>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                <Image
                  source={require(IMAGE_BASE_DIR + 'weather-wind.png')}
                  style={[styles.weatherIcon, { width: px(34) }]}
                />
                <Text style={styles.weatherTxt}>风速:{detail.wind}</Text>
              </View>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                <Image
                  source={require(IMAGE_BASE_DIR + 'weather-barometric.png')}
                  style={[styles.weatherIcon, { width: px(24) }]}
                />
                <Text style={styles.weatherTxt}>气压:{detail.pressure}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
        {this.state.playingVideo && (
          <View style={styles.videoW}>
            {this.state.showVideo && (
              <Video
                source={{ uri: this.state.video.uri }} // Can be a URL or a local file.
                ref={(ref) => {
                  this.player = ref;
                }} // Store reference
                controls={this.state.video.control}
                resizeMode={'contain'}
                paused={this.state.video.paused}
                onLoad={this.videoOnLoad}
                onBuffer={this.onBuffer} // Callback when remote video is buffering
                onError={this.videoError} // Callback when video cannot be loaded
                style={styles.backgroundVideo}
              />
            )}
            {this.state.showVideoLoading && (
              <View style={styles.videoLoadingWp}>
                <Loading content="视频加载中..." />
              </View>
            )}
            {this.state.showNetworkError && (
              <View>
                <NetWorkError onPress={this.liveHandler} />
              </View>
            )}
          </View>
        )}

        <View style={cstyle.flex1}>
          <Tabs
            tabs={this.state.typeTabs}
            tabBarBackgroundColor={theme.header.backgroundColor}
            tabBarInactiveTextColor={theme.text.color9}
            tabBarActiveTextColor={theme.background.color12}
            tabBarTextStyle={styles.tabBarTextStyle}
            tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
            // page={this.state.page}
            swipeable={this.state.tabsConfig.swipeable}
            useOnPan={this.state.tabsConfig.useOnPan}
            usePaged={this.state.tabsConfig.usePaged}
            onChange={this.tabHandler}
          >
            <View style={styles.tabContent}>
              {this.state.page === TabTypes.LIVE && (
                <DetailLive
                  homeTeam={{ name: detail.teamname_zhudui }}
                  awayTeam={{ name: detail.kedui }}
                  matchId={this.state.matchId}
                  eventStatData={this.state.eventStatData}
                />
              )}
            </View>
            <View style={styles.tabContent}>
              {this.state.page === TabTypes.CHAT && (
                <Chat matchId={this.state.matchId} />
              )}
            </View>
            <View style={styles.tabContent}>
              {this.state.page === TabTypes.TEAM && (
                <Team matchId={this.state.matchId} />
              )}
            </View>
            <View style={styles.tabContent}>
              {this.state.page === TabTypes.INFOS && (
                <Infos matchId={this.state.matchId} />
              )}
            </View>
            <View style={styles.tabContent}>
              {this.state.page === TabTypes.EXPONENT && (
                <Exponent matchId={this.state.matchId} />
              )}
            </View>
            <View style={styles.tabContent}>
              {this.state.page === TabTypes.DATA && (
                <Datas matchId={this.state.matchId} />
              )}
            </View>
          </Tabs>
        </View>
      </View>
    );
  }
}

export default connect(mapState, mapDispatch)(CompetitionDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  },
  header: {
    height: px(300),
  },
  headerTeamWp: {
    minHeight: px(152),
    paddingLeft: px(20),
    paddingRight: px(20),
  },
  headerRightIcon: {
    width: px(40),
    height: px(40),
  },
  headerMid: {
    width: px(144),
  },
  scoreWp: {
    height: px(60),
  },
  scoreTxt: {
    fontSize: px(50),
    fontWeight: 'bold',
    color: theme.text.colorWhite,
  },
  halfScoreTxt: {
    fontSize: px(20),
    color: theme.text.colorWhite,
  },
  pdlr10: {
    paddingLeft: px(10),
    paddingRight: px(10),
  },
  bgImage: {
    flex: 1,
  },
  teamLogin: {
    width: px(80),
    height: px(80),
  },
  teamName: {
    width: px(154),
  },
  mgT16: {
    marginTop: px(16),
  },
  videoBtnWp: {
    height: px(40),
    marginTop: px(-10),
  },
  bdRidsL: {
    borderTopLeftRadius: px(20),
    borderBottomLeftRadius: px(20),
  },
  bdRidsR: {
    borderTopRightRadius: px(20),
    borderBottomRightRadius: px(20),
  },
  midLineWp: {
    width: px(2),
    height: px(40),
    backgroundColor: theme.competition.detail.videoTypeBgColor,
  },
  midLine: {
    height: px(34),
    borderRightWidth: px(2),
    borderColor: theme.competition.detail.midLineColor,
  },
  videoTxt: {
    color: theme.text.colorWhite,
    fontSize: theme.text.size20,
  },
  videoType: {
    width: px(110),
    height: px(40),
    backgroundColor: theme.competition.detail.videoTypeBgColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherWp: {
    paddingLeft: px(22),
    paddingRight: px(22),
    // marginTop: px(4)
  },
  weatherIcon: {
    height: px(20),
    marginRight: px(4),
  },
  weatherTxt: {
    color: theme.text.colorWhite,
    fontSize: theme.text.size18,
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
  videoWp: {
    padding: px(20),
    height: px(340),
  },
  backgroundVideo: {
    flex: 1,
    backgroundColor: theme.background.colorBlack,
    // backgroundColor: theme.background.colorWhite,
    borderRadius: px(20),
  },
  tabContent: {
    flex: 1,
  },
  containerStyle: {
    flex: 1,
  },
  videoLoadingWp: {
    position: 'absolute',
    padding: px(20),
    width: '100%',
    height: px(340),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: px(20),
  },
  iconFootball: {
    width: px(14),
    height: px(14),
    marginLeft: px(4),
  },
  mgT12: {
    marginTop: px(12),
  },
  matchStatus: {
    width: '100%',
    height: px(22),
  },
  bd: {
    borderWidth: 1,
  },
});
