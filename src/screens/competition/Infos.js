import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, ScrollView } from 'react-native';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import APIs from '../../http/APIs';
import CardView from 'react-native-cardview';

function Infos(props) {
  let [infos, setInfos] = React.useState([]);

  React.useEffect(() => {
    getInfosData();
  }, []);
  // {match_id: props.matchId}
  function getInfosData() {
    APIs.getInfosDataOfDetail().then((res) => {
      if (res?.data) {
        setInfos(res.data);
      }
    });
  }

  function render(type) {
    return infos && infos.map((item, i) => {
      if (item.type === type) {
        return (
          <View key={item.type + i}>
            <View><Text style={styles.infoTitleTxt}>{item.title}</Text></View>
            <View><Text style={styles.infoContentTxt}>{item.context}</Text></View>
          </View>
        );
      } else {
        return <React.Fragment key={item.type + i}></React.Fragment>;
      }
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView style={cstyle.pd20} showsVerticalScrollIndicator={false}>
        <CardView
          cardElevation={px(6)}
          cardMaxElevation={px(6)}
          cornerRadius={px(8)}
          style={styles.shadowBox}
        >
          <View style={styles.typeSec}>
            <View><Text style={[styles.txtRed, styles.bdRed, styles.typeTitle]}>有利情报</Text></View>
            <View style={styles.typeSecContent}>
              {render('有利情报')}
            </View>
          </View>
        </CardView>
        <CardView
          cardElevation={px(6)}
          cardMaxElevation={px(6)}
          cornerRadius={px(8)}
          style={styles.shadowBox}
        >
          <View style={styles.typeSec}>
            <View><Text style={[styles.txtGreen, styles.bdGreen, styles.typeTitle]}>不利情报</Text></View>
            <View style={styles.typeSecContent}>
              {render('不利情报')}
            </View>
          </View>
        </CardView>
        <CardView
          cardElevation={px(6)}
          cardMaxElevation={px(6)}
          cornerRadius={px(8)}
          style={styles.shadowBox}
        >
          <View style={styles.typeSec}>
            <View><Text style={[styles.txtLeafGreen, styles.bdLeafGreen, styles.typeTitle]}>中立情报</Text></View>
            <View style={styles.typeSecContent}>
              {render('中立情报')}
            </View>
          </View>
        </CardView>
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
  bdRed: {
    borderColor: theme.border.color10
  },
  bdGreen: {
    borderColor: theme.border.color11
  },
  bdLeafGreen: {
    borderColor: theme.border.color12
  },
  typeTitle: {
    borderLeftWidth: px(6),
    paddingLeft: px(20)
  },
  infoTitleTxt: {
    color: theme.text.color18,
    fontSize: px(24),
    marginTop: px(20),
  },
  infoContentTxt: {
    color: theme.text.color21,
    fontSize: px(24),
    marginTop: px(10)
  },
  typeSec: {
    borderWidth: px(2),
    borderColor: theme.border.color8,
    // marginBottom: px(20),
    // paddingTop: px(20),
    // paddingBottom: px(20),
    // paddingLeft: px(10),
    // paddingRight: px(10),
    borderRadius: px(8),
    paddingTop: px(20),
    paddingBottom: px(20),
    paddingLeft: px(20),
    paddingRight: px(20),
  },
  typeSecContent: {
    minHeight: px(100)
  },
  shadowBox: {
    // paddingTop: px(20),
    // paddingBottom: px(20),
    // paddingLeft: px(20),
    // paddingRight: px(20),

    borderRadius: px(8),
    marginBottom: px(30),
  }
});
