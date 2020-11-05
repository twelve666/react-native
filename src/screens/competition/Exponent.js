import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, ScrollView } from 'react-native';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import CheckedNav from '../../components/checked-nav';
import { Row, Col } from '../../components/grid';
import APIs from '../../http/APIs';
import { ShadowBox } from 'react-native-neomorph-shadows';
// import NoDataPlaceHolder from '../../components/no-data-placeholder';

const TAB_TYPE_CONCEDE_POINTS = 1; // 让球
const TAB_TYPE_EXPONENT = 3; // 指数
const TAB_TYPE_SIZE_BALL = 2; // 大小球

function Exponent(props) {
  let [tabs, setTabs] = React.useState([
    {name: '', type: 1, title: '让球', active: true},
    {name: '', type: 3, title: '指数', active: false},
    {name: '', type: 2, title: '大小球', active: false}
  ]);
  let [activeIndex, setActiveIndex] = React.useState(0);
  let [type, setType] = React.useState(1);
  let [tabContent, setTabContent] = React.useState({
    data1: [],
    data2: [],
    data3: []
  });
  let [tab2ExtData, setTab2ExtData] = React.useState([]);
  React.useEffect(() => {
    getExponentData(type, activeIndex);
  }, []);
  function getExponentData(type, activeIndex) {
    // console.log('getExponentData type=', type, ' activeIndex=', activeIndex);
    // match_id: props.matchId
    APIs.getExponentData({}, {
      odds_type: type
    }).then((res) => {
      if (res.data && res.data.length > 0) {
        let temp = Object.assign({}, tabContent);
        temp['data' + (activeIndex + 1)] = res.data;
        setTabContent(temp);
      }
      if (type === TAB_TYPE_EXPONENT && res?.extData?.odds_tongji) {
        setTab2ExtData(res.extData.odds_tongji);
      }
      // console.log('getExponentData res ', res)
    });
  }
  function onPress(tab, i) {
    // console.log('tab=', tab, i);
    setType(tab.type);
    setActiveIndex(i);
    getExponentData(tab.type, i);
  }
  function typeTxt(v) {
    return (v === 'max' ? '最高' : v === 'avg' ? '平均' : '最低') + '值';
  }
  return (
    <View style={styles.container}>
      <View style={[cstyle.flexAiC, styles.tabWp]}>
        <CheckedNav navBarTabsConfig={tabs} onPress={onPress} />
      </View>
      <View style={styles.tabContent}>
        {(type === TAB_TYPE_CONCEDE_POINTS || type === TAB_TYPE_SIZE_BALL) && 
        <View style={styles.tabContentInner}>
          {tabContent['data' + (activeIndex + 1)] && tabContent['data' + (activeIndex + 1)].length > 0 && <>
            <Row style={[cstyle.flexDirecR, styles.tbHeader]}>
              <Col span={4} style={[cstyle.flexAiC, cstyle.flexJcC]}><Text style={styles.tbHeaderTxt}>公司</Text></Col>
              <Col span={10} style={[cstyle.flexAiC, cstyle.flexJcC]}><Text style={styles.tbHeaderTxt}>初盘</Text></Col>
              <Col span={10} style={[cstyle.flexAiC, cstyle.flexJcC]}><Text style={styles.tbHeaderTxt}>即时盘</Text></Col>
            </Row>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {tabContent['data' + (activeIndex + 1)] && tabContent['data' + (activeIndex + 1)].map((item, i) => (
                <Row key={i} style={styles.dataRow}>
                  <Col span={4}><Text style={[styles.txtBlack, cstyle.txtC]}>{item.company}</Text><View style={styles.line}></View></Col>
                  <Col span={10} style={cstyle.flexDirecR}>
                    <Text style={[styles.mw80, cstyle.txtC, styles.txtGray]}>{item.home_odds_chupan}</Text>
                    <Text style={[styles.mw80, cstyle.txtC, styles.txtGray]}>{item.tie_odds_chupan}</Text>
                    <Text style={[styles.mw80, cstyle.txtC, styles.txtGray]}>{item.away_odds_chupan}</Text>
                    <View style={[styles.line, {right: px(20)}]}></View>
                  </Col>
                  <Col span={10} style={cstyle.flexDirecR}>
                    <Text style={[styles.mw80, cstyle.txtC, styles.txtGray]}>{item.home_odds}</Text>
                    <Text style={[styles.mw80, cstyle.txtC, styles.txtGray]}>{item.tie_odds}</Text>
                    <Text style={[styles.mw80, cstyle.txtC, styles.txtGray]}>{item.away_odds}</Text>
                    <View style={[cstyle.flexAiC, cstyle.flexJcC, cstyle.posAbs, styles.rowArrow]}>
                      <View style={styles.arrowR}></View>
                    </View>
                  </Col>
                </Row>
              ))}
            </ScrollView></>}
          {/* {(!tabContent['data' + (activeIndex + 1)] || tabContent['data' + (activeIndex + 1)].length < 1) && <NoDataPlaceHolder msg="暂无相关指数信息" />} */}
        </View>}
        {type === TAB_TYPE_EXPONENT && 
        <View style={styles.tabContentInner}>
          <ScrollView style={styles.scrollView}>
            {tab2ExtData && tab2ExtData.length > 0 &&
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
                height: px(400),
              }}
            >
              <View>
                {tab2ExtData && tab2ExtData.map((item, i) => (
                  <View style={[cstyle.flexDirecR, cstyle.flexAiC, styles.tb2TopDataRow]} key={i}>
                    <View style={[styles.mw140, cstyle.flexJcC]}><Text style={[styles.txtBlack, cstyle.fz24, cstyle.txtC]}>{typeTxt(item.type)}</Text><View style={[styles.line, {height: px(82)}]}></View></View>
                    <View >
                      <View style={cstyle.flexDirecR}>
                        <Text style={[styles.mw120, cstyle.fz22, styles.txtGray, cstyle.txtC]}>初盘</Text>
                        <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]}>{item.home_odds_chupan}</Text>
                        <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]} >{item.tie_odds_chupan}</Text>
                        <Text style={[styles.txtGray, cstyle.fz22]}>{item.away_odds_chupan}</Text>
                      </View>
                      <View style={cstyle.flexDirecR}>
                        <Text style={[styles.mw120, cstyle.fz22, styles.txtGray, cstyle.txtC]}>即盘</Text>
                        <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]}>{item.home_odds}</Text>
                        <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]} >{item.tie_odds}</Text>
                        <Text style={[styles.txtGray, cstyle.fz22]}>{item.away_odds}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ShadowBox>}    
            {tabContent['data' + (activeIndex + 1)] && tabContent['data' + (activeIndex + 1)].length > 0 && 
            <View>
              <View style={[cstyle.flexDirecR, styles.tb2Header, cstyle.flexAiC]}>
                <View><Text style={[styles.tbHeaderTxt, cstyle.txtC, styles.mw140]}>公司</Text></View>
                <View style={[cstyle.flexDirecR, styles.tbHeaderR]}>
                  <View style={styles.mw110}><Text style={styles.tbHeaderTxt}>主胜</Text></View>
                  <View style={styles.mw110}><Text style={styles.tbHeaderTxt}>平局</Text></View>
                  <View style={styles.mw110}><Text style={styles.tbHeaderTxt}>客胜</Text></View>
                </View>
              </View>
              {tabContent['data' + (activeIndex + 1)].map((item, i) => (
                <View style={[cstyle.flexDirecR, cstyle.flexAiC, styles.tb2DataRow]} key={i}>
                  <View style={[styles.mw140, cstyle.flexJcC]}><Text style={[styles.txtBlack, cstyle.fz24, cstyle.txtC]}>{item.company}</Text><View style={[styles.line, {height: px(82)}]}></View></View>
                  <View>
                    <View style={cstyle.flexDirecR}>
                      <Text style={[styles.mw120, cstyle.fz22, styles.txtGray, cstyle.txtC]}>初盘</Text>
                      <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]}>{item.home_odds_chupan}</Text>
                      <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]} >{item.tie_odds_chupan}</Text>
                      <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]}>{item.away_odds_chupan}</Text>
                    </View>
                    <View style={cstyle.flexDirecR}>
                      <Text style={[styles.mw120, cstyle.fz22, styles.txtGray, cstyle.txtC]}>即盘</Text>
                      <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]}>{item.home_odds}</Text>
                      <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]} >{item.tie_odds}</Text>
                      <Text style={[styles.mw110, cstyle.fz22, styles.txtGray]}>{item.away_odds}</Text>
                    </View>
                  </View>
                  <View>
                    <View style={styles.arrowR}></View>
                  </View>
                </View>
              ))}
            </View>}
            {/* {((!tab2ExtData || tab2ExtData.length < 1) && (!tabContent['data' + (activeIndex + 1)] || tabContent['data' + (activeIndex + 1)].length < 1)) && <NoDataPlaceHolder msg="暂无相关指数信息" /> } */}
          </ScrollView>  
        </View>}
      </View>
    </View>
  );
}

export default Exponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.screenBgColor,
  },
  tabWp: {
    paddingTop: px(20),
    paddingBottom: px(18)
  },
  scrollView: {
    paddingBottom: px(80),
  },
  tabContent: {
    flex: 1,
  },
  tabContentInner: {
    paddingLeft: px(20),
    paddingRight: px(20)
  },
  tbHeaderTxt: {
    fontSize: px(20),
    color: theme.text.color17,
  },
  tbHeader: {
    backgroundColor: theme.background.colorWhite
  },
  dataRow: {
    height: px(74),
    backgroundColor: theme.background.colorWhite,
    marginBottom: px(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  tb2TopDataRow: {
    height: px(130),
    backgroundColor: theme.background.colorWhite,
  },
  tb2DataRow: {
    height: px(130),
    backgroundColor: theme.background.colorWhite,
    borderRadius: px(10),
    marginBottom: px(10),
    borderWidth: px(2),
    borderColor: theme.border.color8
  },
  mw80: {
    minWidth: px(80)
  },
  mw140: {
    minWidth: px(140)
  },
  mw120: {
    minWidth: px(120)
  },
  mw110: {
    minWidth: px(110)
  },
  tb2Header: {
    height: px(60),
    marginBottom: px(10),
    marginTop: px(20)
  },
  tbHeaderR: {
    paddingLeft: px(120)
  },
  txtBlack: {
    color: theme.text.color18
  },
  txtGray: {
    color: theme.text.color13
  },
  txtGreen: {
    color: theme.text.color19
  },
  txtDualRed: {
    color: theme.text.color20
  },
  arrowR: {
    width: px(12),
    height: px(12),
    borderTopWidth: px(2),
    borderRightWidth: px(2),
    borderColor: theme.border.color9,
    transform: [
      {rotate: '45deg'}
    ]
  },
  rowArrow: {
    height: px(36),
    right: px(20)
  },
  line: {
    height: px(42),
    borderLeftWidth: px(2),
    borderColor: theme.border.color8,
    position: 'absolute',
    right: 0
  }
});
