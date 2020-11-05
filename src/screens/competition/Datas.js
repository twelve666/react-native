import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, ScrollView } from 'react-native';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import APIs from '../../http/APIs';
import { ShadowBox } from 'react-native-neomorph-shadows';
import CardView from 'react-native-cardview';
import { dateFormat } from '../../utils/date';

function Infos(props) {
  let [historyDatas, setHistoryDatas] = React.useState([]);
  let [recentDatas, setRecentDatas] = React.useState([]);

  React.useEffect((props) => {
    getDatas();
  }, []);

  function getDatas() {
    getHistoryData();
    getRecentData();
  }
  // {}, {match_id: props.matchId}
  function getHistoryData() {
    APIs.getHistoryDataOfDetail().then((res) => {
      console.log('getHistoryData=', res);
      if (res?.data) {
        setHistoryDatas(res.data);
      }
    });
  }

  function getRecentData() {
    APIs.getRecentDataOfDetail().then((res) => {
      console.log('getRecentDataOfDetail=', res);
      if (res?.data) {
        setRecentDatas(res.data);
      }
    });
  }

  function sameHomeAndAway() {

  }

  function competetionRsStatus(v) {
    return v > 0 ? '赢' : v === 0 ? '走' : '输';
  }

  function isWin(v) {
    return v > 0;
  }

  function rsStatusTxtColor(v) {
    return (v > 0 ? styles.txtRed : v === 0 ? styles.txtBlue : styles.txtGreen);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={cstyle.pd20} showsVerticalScrollIndicator={false}>
        <View>
          <View style={cstyle.flexDirecR}>
            <View style={styles.typeTitleWp}><Text style={[styles.txtGreen, styles.bdGreen, styles.typeTitle]}>历史交锋</Text></View>
            <View style={[cstyle.flex1, cstyle.flexDirecR, cstyle.flexJcFe]}>
              <TouchableOpacity activeOpacity={theme.clickOpacity} style={[styles.btn, styles.bgGreen]} onPress={sameHomeAndAway}><Text style={[styles.btnTxt, styles.txtGreen]}>主客相同</Text></TouchableOpacity>
            </View>
          </View>
          <View style={[cstyle.flexDirecR, styles.tbHeader]}>
            <View style={[styles.td1, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>日期/赛事</Text></View>
            <View style={[styles.td2, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>主队</Text></View>
            <View style={[styles.td3, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>比分</Text></View>
            <View style={[styles.td4, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>客队</Text></View>
            <View style={[styles.td5, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>盘路</Text></View>
          </View>
          <CardView
            cardElevation={px(8)}
            cardMaxElevation={px(8)}
            cornerRadius={px(8)}
            style={styles.shadowBox}
          >
            <View style={styles.listWp}>
              {historyDatas && historyDatas.map((item, i) => (
                <View style={[cstyle.flexDirecR, styles.tbRow]} key={i}>
                  <View style={[cstyle.flexDirecR, cstyle.flex1, cstyle.flexAiC, styles.tbRowInner, historyDatas.length - 1 !== i ? styles.bdb : {}]}>
                    <View style={styles.td1}>
                      <Text style={[styles.txtGray, cstyle.fz22]}>{item.matchTime && dateFormat(item.matchTime * 1000)}</Text>
                      <Text style={[styles.txtGray, cstyle.fz22]}>{item.saishiName}</Text>
                    </View>
                    <View style={[styles.td2, cstyle.flexAiC]}><Text style={[cstyle.fz22, isWin(item.panlu) ? styles.txtRed : {}]}>{item.zhudui}</Text></View>
                    <View style={[styles.td3, cstyle.flexAiC]}>
                      <View style={[styles.td3, cstyle.flexAiC, cstyle.flexJcC, cstyle.flexDirecR, styles.other]}>
                        <Text style={[cstyle.fz22, isWin(item.panlu) ? styles.txtRed : {}]}>{item.zhudui_score}</Text>
                        <Text style={cstyle.fz22}>-</Text>
                        <Text style={cstyle.fz22}>{item.kedui_score}</Text>
                      </View>
                      <View style={[styles.td3, cstyle.flexAiC, cstyle.flexJcC, cstyle.flexDirecR, styles.other]}>
                        <Text style={[styles.txtGray, cstyle.fz20]}>({item.half_court_score_zhudui}-{item.halfAwaySoce})</Text>
                      </View>
                    </View>
                    <View style={[styles.td4, cstyle.flexAiC]}><Text style={cstyle.fz22}>{item.kedui}</Text></View>
                    <View style={[styles.td5, cstyle.flexAiC]}>
                      <Text style={[cstyle.fz22, rsStatusTxtColor(item.panlu)]}>{item.panlu}</Text>
                      <Text style={[cstyle.fz22, rsStatusTxtColor(item.panlu)]}>{competetionRsStatus(item.panlu)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </CardView>
        </View>

        <View style={{ marginTop: px(30) }}>
          <View style={cstyle.flexDirecR}>
            <View style={styles.typeTitleWp}><Text style={[styles.txtGreen, styles.bdGreen, styles.typeTitle]}>近期战绩</Text></View>
            <View style={[cstyle.flex1, cstyle.flexDirecR, cstyle.flexJcFe]}>
              <TouchableOpacity activeOpacity={theme.clickOpacity} style={[styles.btn, styles.bgRed, cstyle.mgR20]}><Text style={[styles.btnTxt, styles.txtRed]}>同主客</Text></TouchableOpacity>
              <TouchableOpacity activeOpacity={theme.clickOpacity} style={[styles.btn, styles.bgLeafGreen]}><Text style={[styles.btnTxt, styles.txtLeafGreen]}>同赛事</Text></TouchableOpacity>
            </View>
          </View>
          <View style={[cstyle.flexDirecR, styles.tbHeader]}>
            <View style={[styles.td1, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>日期/赛事</Text></View>
            <View style={[styles.td2, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>主队</Text></View>
            <View style={[styles.td3, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>比分</Text></View>
            <View style={[styles.td4, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>客队</Text></View>
            <View style={[styles.td5, cstyle.flexAiC]}><Text style={styles.tbHeaderTxt}>盘路</Text></View>
          </View>
          <CardView
            cardElevation={px(8)}
            cardMaxElevation={px(8)}
            cornerRadius={px(8)}
            style={styles.shadowBox}
          >
            <View style={styles.listWp}>
              {recentDatas && recentDatas.map((item, i) => (
                <View style={[cstyle.flexDirecR, styles.tbRow]} key={i}>
                  <View style={[cstyle.flexDirecR, cstyle.flex1, cstyle.flexAiC, styles.tbRowInner, recentDatas.length - 1 !== i ? styles.bdb : {}]}>
                    <View style={styles.td1}>
                      <Text style={[styles.txtGray, cstyle.fz22]}>{item.matchTime && dateFormat(item.matchTime * 1000)}</Text>
                      <Text style={[styles.txtGray, cstyle.fz22]}>{item.saishiName}</Text>
                    </View>
                    <View style={[styles.td2, cstyle.flexAiC]}><Text style={[cstyle.fz22, isWin(item.panlu) ? styles.txtRed : {}]}>{item.zhudui}</Text></View>
                    <View style={[styles.td3, cstyle.flexAiC]}>
                      <View style={[styles.td3, cstyle.flexAiC, cstyle.flexJcC, cstyle.flexDirecR, styles.other]}>
                        <Text style={[cstyle.fz22, isWin(item.panlu) ? styles.txtRed : {}]}>{item.zhudui_score}</Text>
                        <Text style={cstyle.fz22}>-</Text>
                        <Text style={cstyle.fz22}>{item.kedui_score}</Text>
                      </View>
                      <View style={[styles.td3, cstyle.flexAiC, cstyle.flexJcC, cstyle.flexDirecR, styles.other]}>
                        <Text style={[styles.txtGray, cstyle.fz20]}>({item.half_court_score_zhudui}-{item.halfAwaySoce})</Text>
                      </View>
                    </View>
                    <View style={[styles.td4, cstyle.flexAiC]}><Text style={cstyle.fz22}>{item.kedui}</Text></View>
                    <View style={[styles.td5, cstyle.flexAiC]}>
                      <Text style={[cstyle.fz22, rsStatusTxtColor(item.panlu)]}>{item.panlu}</Text>
                      <Text style={[cstyle.fz22, rsStatusTxtColor(item.panlu)]}>{competetionRsStatus(item.panlu)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </CardView>
        </View>
      </ScrollView>
    </View>
  );
}

export default Infos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  },
  txtRed: {
    color: theme.text.color22
  },
  txtGreen: {
    color: theme.text.color24
  },
  txtLeafGreen: {
    color: theme.text.color23
  },
  txtDeepGreen: {
    color: theme.text.color19
  },
  txtGray: {
    color: theme.text.color25
  },
  txtBlue: {
    color: theme.text.color6
  },
  bdRed: {
    borderColor: theme.border.color10
  },
  bdGreen: {
    borderColor: theme.border.color11
  },
  bdLeafGreen: {
    borderColor: theme.border.color12
  },
  bgRed: {
    backgroundColor: theme.background.color16
  },
  bgGreen: {
    backgroundColor: theme.background.color15
  },
  bgLeafGreen: {
    backgroundColor: theme.background.color17
  },
  typeTitleWp: {
    width: '50%'
  },
  typeTitle: {
    borderLeftWidth: px(6),
    paddingLeft: px(20)
  },
  btn: {
    minWidth: px(90),
    height: px(30),
    borderRadius: px(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnTxt: {
    fontSize: px(18),
  },
  tbHeaderTxt: {
    fontSize: px(20),
    color: theme.text.color17,
  },
  tbHeader: {
    // backgroundColor: theme.background.colorWhite
    marginTop: px(10)
  },
  td1: {
    width: '25%'
  },
  td2: {
    width: '20%'
  },
  td3: {
    width: '15%'
  },
  td4: {
    width: '22%'
  },
  td5: {
    width: '18%'
  },
  listWp: {
    minHeight: px(120),
    // borderWidth: px(2),
    // borderColor: theme.border.color8,
    // borderColor: 'red',
    borderLeftWidth: px(2),
    borderRightWidth: px(2),
    borderColor: theme.border.color8,
    marginTop: px(10)
  },
  tbRow: {
    height: px(140),
    alignItems: 'center',
    backgroundColor: theme.background.colorWhite,
    paddingLeft: px(20),
    paddingRight: px(20),
  },
  tbRowInner: {
    height: '100%'
  },
  bdb: {
    borderBottomWidth: px(2),
    borderColor: theme.border.color3
  },
  shadowBox: {
    // paddingTop: px(20),
    // paddingBottom: px(20),
    // paddingLeft: px(20),
    // paddingRight: px(20),

    borderRadius: px(8),
    marginBottom: px(30),
    marginTop: px(10)
  },
  other: {
    width: '100%'
  }
});

