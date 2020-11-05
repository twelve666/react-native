/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, ScrollView } from 'react-native';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import APIs from '../../http/APIs';
import { ShadowBox } from 'react-native-neomorph-shadows';
import CardView from 'react-native-cardview';

const bg = require('../../assets/images/shop-site.png');

const TEAM_HOME = 'home';
const TEAM_AWAY = 'away';

export default function Team(props) {
  let [teamInfo, setTeamInfo] = React.useState({});
  let [members, setMembers] = React.useState([]);
  let [curTab, setCurTab] = React.useState(TEAM_HOME);

  React.useEffect(() => {
    getData();
  }, []);

  function tabHandler(type) {
    setCurTab(type);
    setMembers(curTab === TEAM_HOME ? teamInfo.members.zhudui : teamInfo.members.kedui);
  }
  // {}, {match_id: props.matchId}
  function getData() {
    APIs.getTeamOfDetail().then((res) => {
      if (res.data && res.data.length > 0) {
        let data = res.data[0];
        setTeamInfo(data);
        setMembers([...data.members.zhudui]);
      }
      // console.log('Team res=', JSON.stringify(res))
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView style={cstyle.pd20} showsVerticalScrollIndicator={false}>
        <View style={[cstyle.flex1, cstyle.flexAiC]}>
          <View style={[cstyle.flexDirecR, styles.tab]}>
            <ShadowBox
              // inner // <- enable inner shadow
              useSvg // <- set this prop to use svg on ios styles.shadowLeft
              style={Object.assign({}, styles.shadow, curTab === TEAM_HOME ? styles.shadowLeft : styles.noShadow)}
            >
              <TouchableOpacity activeOpacity={theme.clickOpacity} onPress={() => tabHandler(TEAM_HOME)} style={cstyle.flex1, { borderWidth: 0 }}>
                <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, styles.tabItem, styles.tabLeft, curTab === TEAM_HOME ? styles.active : styles.unactive]}>
                  <Image source={{ uri: teamInfo.zhudui_logo }} style={styles.icon} />
                  <Text style={[cstyle.mgL10, curTab === TEAM_HOME ? styles.activeTxt : styles.unactiveTxt]}>{teamInfo.zhudui}</Text>
                </View>
              </TouchableOpacity>
            </ShadowBox>
            <ShadowBox
              // inner // <- enable inner shadow
              useSvg // <- set this prop to use svg on ios styles.shadowLeft
              style={Object.assign({}, styles.shadow, curTab === TEAM_AWAY ? styles.shadowRight : styles.noShadow)}
            >
              <TouchableOpacity activeOpacity={theme.clickOpacity} onPress={() => tabHandler(TEAM_AWAY)} style={cstyle.flex1}>
                <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, styles.tabItem, styles.tabRight, curTab === TEAM_AWAY ? styles.active : styles.unactive]}>
                  <Text style={[cstyle.mgR10, curTab === TEAM_AWAY ? styles.activeTxt : styles.unactiveTxt]}>{teamInfo.kedui}</Text>
                  <Image source={{ uri: teamInfo.kedui_logo }} style={styles.icon} />
                </View>
              </TouchableOpacity>
            </ShadowBox>
          </View>
          <View style={[cstyle.flexDirecR, cstyle.flexJcC, styles.membersWp]}>
            <ImageBackground source={bg} style={styles.bg}>
              {members && members.map((item, i) => (
                <View key={curTab + i} style={[styles.member, { position: 'absolute', left: item.x - px(10) + '%', top: item.y - px(10) + '%' }]}>
                  <View style={styles.shirtNumWp}><Text style={[cstyle.fz16, { fontWeight: 'bold' }]}>{item.shirt_number}</Text></View>
                  <View style={styles.avatorWp}>
                    <View style={styles.avatorBg}></View>
                    <Image source={{ uri: item.logo }} style={styles.avator} />
                  </View>
                  <View style={[styles.nameWp, cstyle.flexAiC, cstyle.flexJcC]}><Text style={cstyle.fz16}>{item.name_zh}</Text></View>
                </View>
              ))}
            </ImageBackground>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  },
  tab: {
    width: px(560),
    height: px(76),
    marginTop: px(6)
  },
  tabItem: {
    width: px(280)
  },
  unactive: {
    backgroundColor: theme.background.color18,
    borderColor: '#edecec'
  },
  tabLeft: {
    height: '100%',
    borderTopLeftRadius: px(10),
    borderBottomLeftRadius: px(10),
    borderTopWidth: px(2),
    borderLeftWidth: px(2),
    borderBottomWidth: px(2),
  },
  tabRight: {
    height: '100%',
    borderTopRightRadius: px(10),
    borderBottomRightRadius: px(10),
    borderTopWidth: px(2),
    borderRightWidth: px(2),
    borderBottomWidth: px(2),
  },
  unactiveTxt: {
    color: theme.text.color16
  },
  active: {
    backgroundColor: theme.background.colorWhite,
    borderColor: theme.border.colorWhite
    // borderTopLeftRadius: px(10),
    // borderBottomLeftRadius: px(10)
  },
  activeTxt: {
    color: theme.text.color9
  },
  icon: {
    width: px(40),
    height: px(40)
  },
  bg: {
    width: px(640),
    height: px(948)
  },
  membersWp: {
    marginTop: px(26),
    backgroundColor: theme.background.colorWhite
  },
  member: {
    alignItems: 'center'
  },
  shirtNumWp: {
    width: px(40),
    height: px(40),
    backgroundColor: theme.background.colorWhite,
    position: 'absolute',
    top: px(-6),
    left: px(-6),
    borderRadius: px(25),
    opacity: 0.7,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatorWp: {
    width: px(60),
    height: px(60),
    // padding: px(5),
    // backgroundColor: theme.background.colorWhite,
    // opacity: 0.5,
    // borderRadius: px(30)
  },
  avatorBg: {
    width: px(60),
    height: px(60),
    padding: px(5),
    backgroundColor: theme.background.colorWhite,
    opacity: 0.5,
    borderRadius: px(30),
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 0
  },
  avator: {
    width: px(50),
    height: px(50),
    backgroundColor: theme.background.colorWhite,
    // backgroundColor: 'red',
    borderRadius: px(25),
    opacity: 1,
    position: 'absolute',
    zIndex: 2,
    left: px(5),
    top: px(5)
  },
  nameWp: {
    minWidth: px(92),
    height: px(24),
    backgroundColor: theme.background.color19,
    borderRadius: px(6)
  },
  shadow: {
    width: px(280),
    height: px(75),
    justifyContent: 'center'
  },
  shadowLeft: {
    shadowOffset: { width: px(5), height: px(10) },
    shadowOpacity: theme.shadowOpacity,
    shadowColor: theme.shadowColor,
    shadowRadius: px(5),
    borderTopLeftRadius: px(10),
    borderBottomLeftRadius: px(10),
    backgroundColor: theme.background.colorWhite,
    borderWidth: 0
  },
  shadowRight: {
    shadowOffset: { width: px(5), height: px(10) },
    shadowOpacity: theme.shadowOpacity,
    shadowColor: theme.shadowColor,
    shadowRadius: px(5),
    borderTopRightRadius: px(10),
    borderBottomRightRadius: px(10),
    backgroundColor: theme.background.colorWhite,

  },
  noShadow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowColor: theme.background.colorWhite,
    shadowRadius: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: theme.background.color18,
  }
});
