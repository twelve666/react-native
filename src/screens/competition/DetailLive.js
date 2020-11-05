import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, ScrollView } from 'react-native';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import CheckedNav from '../../components/checked-nav';
import { ShadowBox } from 'react-native-neomorph-shadows';
import TextLiveInfoFlow from '../../components/text-live-info-flow';
import APIs from '../../http/APIs';
import { secondsToMinutes } from '../../utils/date';
import { Toast, Portal } from '@ant-design/react-native';
import { enptyFn } from '../../utils/common';

const NavTabTypes = {
  TEXT_LIVE: 'textLive',
  IMPORTANT_EVENT: 'importantEvent'
};

const navBarTabsConfig = [
  {name: NavTabTypes.TEXT_LIVE, title: '文字直播', active: true},
  {name: NavTabTypes.IMPORTANT_EVENT, title: '重要事件', active: false},
];

function EventBar(props) {
  let { name = '', leftRateNum = 0, rightRateNum = 0 } = props;
  const rateUnit = (leftRateNum + rightRateNum) / 100;
  const leftRateWidth = rateUnit > 0 ? leftRateNum / rateUnit : 0;
  const rightRateWidth = rateUnit > 0 ? rightRateNum / rateUnit : 0;
  return (
    <View style={styles.eventItemRow}>
      <View style={cstyle.flexDirecR}>
        <View style={styles.rateNumWp}><Text style={[styles.rateNum, cstyle.pdR20, cstyle.txtR]}>{leftRateNum}</Text></View>
        <View style={[cstyle.flexDirecR, cstyle.flex1, cstyle.flexAiC]}>
          <View style={[styles.rateBar, cstyle.flexDirecR, cstyle.flexJcFe]}><View style={[{width: `${leftRateWidth}%`}, styles.progressBar, styles.bgGreen]}></View></View>
          <View style={[cstyle.flexAiC, styles.eventNameWp]}><Text style={styles.eventName}>{name}</Text></View>
          <View style={styles.rateBar}><View style={[{width: `${rightRateWidth}%`}, styles.progressBar, styles.bgOrange]}></View></View>
        </View>
        <View style={styles.rateNumWp}><Text style={[styles.rateNum, cstyle.pdL20, cstyle.txtL]}>{rightRateNum}</Text></View>
      </View>
    </View>
  );
}

const DISTANCE_BOTTOM = 100;

// const initialState = {
//   textInfoCurPage: 1,
//   importantEventCurPage: 1
// };

// function reducer(state, action) {
//   console.log('info reducer', state, action)
//   switch (action.type) {
//       case 'updateTextInfoCurPage':
//         state.textInfoCurPage = action.payload
//       return state;
//       default:
//       throw new Error();
//   }
// }

const defaultEventsData = [
  {name: '控球率', home: 0, away: 0},
  {name: '射门', home: 0, away: 0},
  {name: '射正', home: 0, away: 0},
  {name: '进攻', home: 0, away: 0},
  {name: '危险进攻', home: 0, away: 0},
  {name: '角球', home: 0, away: 0},
  {name: '黄牌', home: 0, away: 0},
  {name: '红牌', home: 0, away: 0}
];

/**
 * 直播
 * @param {*} props 
 */
function DetailLive(props) {
  let [textLiveInfos, setTextLiveInfos] = React.useState([]);
  let [importantEventInfos, setImportantEventInfos] = React.useState([]);
  let [curLiveTab, setCurLiveTab] = React.useState(NavTabTypes.TEXT_LIVE);
  let [eventStat, setEventStat] = React.useState(defaultEventsData);
  let [textInfoCurPage, setTextInfoCurPage] = React.useState(1);
  let [importantEventCurPage, setImportantEventCurPage] = React.useState(1);
  let [textInfoTotalPage, setTextInfoTotalPage] = React.useState(1);
  let [importantEventTotalPage, setImportantEventTotalPage] = React.useState(1);
  let textInfoPageSize = 20;
  let importantEventPageSize = 20;
  let { homeTeam = {}, awayTeam = {} } = props;

  /**
   * 文字直播
   */
  function getTextInfosForLive(page = 1) {
    // console.log('info getTextInfosForLive=', props)
    let key;
    if (page > 1) {
      key = Toast.loading('加载数据中...', 5, enptyFn, false);
    }
    APIs.getTextInfosForLive({match_id: props.matchId, 
      pagesize: textInfoPageSize, 
      page}).then((res) => {
      // console.log('info getTextInfosForLive =', res.data, textLiveInfos, textLiveInfos.push);
      if (res?.data?.length > 0) {
        setTextInfoTotalPage(res.pageCount);
        setTextLiveInfos(textLiveInfos.concat(res.data));
      }
    }).finally(() => {
      Portal.remove(key);
    });
  }

  /**
   * 重要事件
   */
  function getImportantEventsForLive(page = 1) {
    let key;
    if (page > 1) {
      key = Toast.loading('加载数据中...', 5, enptyFn, false);
    }
    APIs.getImportantEventsForLive({
      match_id: props.matchId, 
      pagesize: importantEventPageSize, 
      page}).then((res) => {
      // console.log('info getImportantEventsForLive =', res);
      if (res?.data?.length > 0) {
        setImportantEventTotalPage(res.pageCount);
        setImportantEventInfos(importantEventInfos.concat(res.data));
      }
    }).finally(() => {
      Portal.remove(key);
    });
  }

  /**
   * 对战数据
   */
  function getCompetitionEventStat() {
    APIs.getCompetitionEventStat({}, {match_id: props.matchId}).then((res) => {
      // console.log('info getCompetitionEventStat =', res);
      if (res?.data?.length > 0) {
        updateCompetitionEventStat(res.data[0]);
      }
    });
  }
  function updateCompetitionEventStat(data) {
    let events = [];
    if (data) {
      events.push({name: '控球率', home: data.zhudui_kongqiulv, away: data.kedui_kongqiulv});
      events.push({name: '射门', home: data.zhudui_shemen, away: data.kedui_shemen});
      events.push({name: '射正', home: data.zhudui_shezhen, away: data.kedui_shezhen});
      events.push({name: '进攻', home: data.zhudui_jingong, away: data.kedui_jingong});
      events.push({name: '危险进攻', home: data.zhudui_weixianjingon, away: data.kedui_weixianjingon});
      events.push({name: '角球', home: data.corner_kick, away: data.corner_kick_kedui});
      events.push({name: '黄牌', home: data.yellow_card, away: data.yellow_card_kedui});
      events.push({name: '红牌', home: data.red_card, away: data.red_card_kedui});
      setEventStat(events);
    }
  }
  function liveTabHanlder(tab) {
    // console.log('info liveTabHanlder tab=', tab, curLiveTab)
    if (tab.name === curLiveTab) return;
    switch(tab.name) {
    case NavTabTypes.TEXT_LIVE:
      setTextInfoCurPage(1);
      getTextInfosForLive(1);
      break;
    case NavTabTypes.IMPORTANT_EVENT:
      setImportantEventCurPage(1);
      getImportantEventsForLive(1);
      break;
    default:
      break;
    }
    setCurLiveTab(tab.name);
  }
  function onScrollHandler(e) {
    // console.log('onScrollHandler=', e.nativeEvent)
    if (e?.nativeEvent) {
      // console.log('info == ', e.nativeEvent.contentOffset, e.nativeEvent.layoutMeasurement.height, DISTANCE_BOTTOM, (e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height + DISTANCE_BOTTOM), e.nativeEvent.contentSize.height, textInfoCurPage, textInfoTotalPage, curLiveTab)
      if (e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height + DISTANCE_BOTTOM > e.nativeEvent.contentSize.height) {
        switch(curLiveTab) {
        case NavTabTypes.TEXT_LIVE:
          if (textInfoCurPage < textInfoTotalPage) {
            let page = textInfoCurPage + 1;
            setTextInfoCurPage(page);
            console.log('info TEXT_LIVE page ', page);
            getTextInfosForLive(page);
          }
          break;
        case NavTabTypes.IMPORTANT_EVENT:
          if (importantEventCurPage < importantEventTotalPage) {
            let page = importantEventCurPage + 1;
            setImportantEventCurPage(page);
            getImportantEventsForLive(page);
          }
          break;
        default:
          break;
        }
      }
    }
  }
  React.useEffect(() => {
    getCompetitionEventStat(1);
    getTextInfosForLive(1);
    return () => {
      setTextLiveInfos([]);
      setImportantEventInfos([]);
      console.log('info unmount ', textLiveInfos.length);
    };
  }, []);
  React.useEffect(() => {
    if (props.eventStatData) {
      updateCompetitionEventStat(props.eventStatData);
      textLiveInfos.unshift(props.eventStatData);
      if (textLiveInfos > 1000) {
        textLiveInfos.pop();
      }
      setTextLiveInfos(textLiveInfos);
    }
  }, [props.eventStatData]);
  // React.useEffect(() => {
  //   console.log('info DetailLive 2')
  // });
  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={15}
        onScroll={onScrollHandler}
      >
        <View>
          <View style={[cstyle.flexDirecR, cstyle.flexJcSb, cstyle.flexAiC, cstyle.pd20]}>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
              <View style={[styles.iconDot, styles.bgGreen]}></View>
              <View><Text style={[cstyle.fz20, cstyle.mgL10]}>{homeTeam.name}</Text></View>
            </View>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
              <View><Text style={[cstyle.fz20, cstyle.mgR10]}>{awayTeam.name}</Text></View>
              <View style={[styles.iconDot, styles.bgOrange]}></View>
            </View>  
          </View>
          <View style={styles.eventsWpBg}>
            <ShadowBox
              // inner // <- enable inner shadow
              useSvg // <- set this prop to use svg on ios
              style={{
                shadowOffset: {width: px(5), height: px(10)},
                shadowOpacity: theme.shadowOpacity,
                shadowColor: theme.shadowColor,
                shadowRadius: px(10),
                borderRadius: px(20),
                backgroundColor: theme.background.colorWhite,
                width: px(710),
                height: px(460),
              }}
            >
              <View style={styles.eventsWp}>
                {eventStat && eventStat.map((item, i) => (
                  <EventBar name={item.name} leftRateNum={item.home} rightRateNum={item.away} key={i} />
                ))}
              </View>
            </ShadowBox>
          </View>
          <View style={styles.dynamicEvent} >
            <View style={[cstyle.flexAiC, cstyle.mgT20]}>
              <CheckedNav {...props} navBarTabsConfig={navBarTabsConfig} itemStyle={{width: px(150)}} onPress={liveTabHanlder} />
            </View>
            <View style={styles.textLive}>
              {curLiveTab === NavTabTypes.TEXT_LIVE && textLiveInfos && textLiveInfos.map((item, i) => (
                <TextLiveInfoFlow key={i} type={item.type} time={secondsToMinutes(item.time, 90, true)} isFirst={i === 0} text={item.data} i={i} />
              ))}
              {curLiveTab === NavTabTypes.IMPORTANT_EVENT && importantEventInfos && importantEventInfos.map((item, i) => (
                <TextLiveInfoFlow key={i} type={item.type} time={secondsToMinutes(item.time, 90, true)} isFirst={i === 0} text={item.data}/>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default React.memo(DetailLive);

const styles = StyleSheet.create({
  container: {
    // padding: px(20),
  },
  iconDot: {
    width: px(20),
    height: px(20),
    borderRadius: px(10)
  },
  bgGreen: {
    backgroundColor: theme.competition.detail.iconDotBgColorGreen
  },
  bgOrange: {
    backgroundColor: theme.competition.detail.iconDotBgColorOrange
  },
  teamNameRow: {
  },
  eventsWpBg: {
    width: '100%',
    paddingLeft: px(20),
    paddingRight: px(20)
  },
  eventsWp: {
    backgroundColor: theme.background.colorWhite,
    borderRadius: px(20),
    paddingTop: px(30),
    // paddingBottom: px(30),
  },
  eventItemRow: {
    width: '100%',
    height: px(54),
    paddingLeft: px(20),
    paddingRight: px(20),
  },
  eventNameWp: {
    flex: 1
  },
  eventName: {
    color: theme.competition.detail.eventNameTxtColor,
    fontSize: px(22)
  },
  eventRowL: {
    width: px(80)
  },
  eventRowR: {
    width: px(80)
  },
  rateBar: {
    width: px(210),
    height: px(12),
    borderRadius: px(6),
    backgroundColor: theme.competition.background.color1
  },
  rateNumWp: {
    width: px(56),
  },
  progressBar: {
    height:'100%',
    borderRadius: px(6),
  },
  rateNum: {
    color: theme.competition.detail.eventNameTxtColor,
    fontSize: px(20)
  },
  dynamicEvent: {
    backgroundColor: theme.background.colorWhite,
    marginTop: px(20),
    minHeight: px(400)
  },
  textLive: {
    padding: px(20)
  },
});
