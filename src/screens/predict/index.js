/* eslint-disable react-native/no-color-literals */
import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import showToast from '../../components/toast/index';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import SwiperPredict from './BranchIndex/SwiperPredict';
import PopularityPredict from './BranchIndex/PopularityPredict';
import MatchPredict from './BranchIndex/MatchPredict';
import { getinit, checkisexpert, handleMatch, newsList, onlineMemebers, getLink } from '../../http/APIs';
const mapState = (state) => {
  return {
    getLogin: state.login.loginInfo,
  };
};

const mapDispatch = {
};

const slideImage = require('../../assets/images/article.png');
const plus = require('../../assets/images/plus.png');
const list = [slideImage];

class Predict extends React.PureComponent {
  state;
  constructor(props) {
    super(props);
    this.state = {
      newsList: [],// 猛料列表
      uesrImg: []// 用户头像
    };
  }
  componentDidMount() {
    this.getUserImg();
  }
  // 跳转到推荐赛事页面
  jumpMatchRe = () => {
    this.props.navigation.navigate('MatchRecommend');
  }
   // 跳转到猛料详情 测试接口用 页面并无此功能
  jumpPredict = () =>{
    this.props.navigation.navigate('PredictDetail');
  }
  // 获取用户头像
  getUserImg = () => {
    let query = {
      AuthUserId: this.props.getLogin.id,
      AuthToken: this.props.getLogin.token
    }
    getLink([onlineMemebers, query]).then(res => {
      console.log('专家头像', res);
      this.setState({
        uesrImg: res
      })
    }, err => {
      console.log('err', err);
      showToast('网络异常，请稍后再试');
    })
  }
  // 点击发布猛料小加号,验证是否专家
  doPublish = () => {
    if (this.props.getLogin.id == undefined) {
      // 没有登陆的情况下跳转到登陆页
      this.props.navigation.navigate('My');
    } else {
      getinit([checkisexpert, { memberId: this.props.getLogin.id }]).then(res => {
        // console.log('res', res);
        if (res == true) {
          // 登陆情况下 已经授权 就进入赛事详情
          this.props.navigation.navigate('MatchList');
        }
      },
        err => {
          console.log('err', err);
          showToast('网络异常，请稍后再试');
        }
      );
    }

  }
  // 足球 篮球 对应猛料列表
  doNewList = (type) => {
    // console.log(this.props.getLogin);
    let query = {
      token: this.props.getLogin.token,
      userId: this.props.getLogin.id,
      sportID: type,
    };
    handleMatch(newsList, type, query).then(res => {
      console.log('res', res);
      this.setState({
        newsList: res
      });
    }, err => {
      console.log('err', err);
      showToast('网络异常，请稍后再试');
    });
  }
  get ListHeaderComponent() {
    return (
      <>
        <View style={cstyle.flex1}>
          <SwiperPredict />
          <PopularityPredict />
          <MatchPredict jumpMatchRe={() => { this.jumpMatchRe(); }} />
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image style={styles.leftImage}
                source={require('../../assets/images/title-Salesman.png')}
              />
              <TouchableOpacity onPress={
                () => { this.jumpPredict(); }
              }>
                <ImageBackground
                  source={require('../../assets/images/title-bg3.png')}
                  style={styles.leftTitBackground}
                >
                  <Text style={styles.leftTit}>爆料专区</Text>
                </ImageBackground>
              </TouchableOpacity>

            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={
                () => { this.doNewList(1); }
              }>
                <View style={styles.rightTabs}>
                  <Image style={styles.rightTabsImage}
                    source={require('../../assets/images/feather-soccer2.png')}
                  />
                  <Text style={styles.rightTabsTit}>足球</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={
                () => { this.doNewList(2); }
              }>
                <View style={styles.rightTabs}>
                  <Image style={styles.rightTabsImage}
                    source={require('../../assets/images/feather-basketball2.png')}
                  />
                  <Text style={styles.rightTabsTit}>篮球</Text>
                </View>
              </TouchableOpacity>

            </View>
          </View>
          {/* 发布按钮 */}
          <TouchableOpacity style={styles.plusView} onPress={() => { this.doPublish(); }} >
            <Image source={plus} style={styles.plus}></Image>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.slideContainer}>
        <View style={styles.itemTitle}>
          <View style={styles.itemTitleLeft}>
            <Image source={item} style={styles.titleLeftImage} />
            <View style={styles.titleLeftText}>
              <Text style={styles.textName}>泰乐尼欧</Text>
              <View style={styles.textLabel}>
                <Text style={styles.textLabelB}>近10中7</Text>
                <Text style={styles.textLabelR}>红连3</Text>
              </View>
            </View>
          </View>
          <View style={styles.chart}></View>
        </View>
        <Text style={styles.slogan}>最高8倍稳中求胜，一路红单大神出彩完善大家相信就一起加入！</Text>
        <View style={styles.score}>
          <View style={styles.scoreFlast}>
            <View style={styles.flastText}>
              <Text style={styles.flastTextTit}>澳南超</Text>
              <Text style={styles.flastTextTime}>03-28 12:30</Text>
            </View>
            <Text style={styles.flastTit}>TA推荐</Text>
          </View>
          <View style={styles.scoreLast}>
            <Text style={styles.lastConfr}>罗宾市蓝 VS 冲浪者天堂</Text>
            <Text style={styles.lastTit}>大小球-大1.79</Text>
          </View>
        </View>
        <Text style={styles.times}>20分钟前</Text>
      </View>
    );
  }

  render() {
    return (
      <FlatList
        data={list}
        renderItem={this.renderItem}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={this.ListHeaderComponent}
        contentContainerStyle={styles.container}
      // 添加爆料专区 下拉 上拉 无数据即可
      />
    );
  }
}

export default connect(mapState, mapDispatch)(Predict);

const styles = StyleSheet.create({
  page: {
    position: 'relative'
  },
  container: {
    backgroundColor: theme.background.colorWhite,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.color3,
    paddingBottom: px(100)
  },
  header: {
    paddingHorizontal: px(20),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.color3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: px(20),
    paddingBottom: px(10)
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  leftImage: {
    width: px(40),
    height: px(40)
  },
  leftTitBackground: {
    height: px(38),
    justifyContent: 'center',
    marginLeft: px(10)
  },
  leftTit: {
    fontSize: px(26),
    color: theme.text.color37
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightTabs: {
    marginLeft: px(20),
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightTabsImage: {
    width: px(20),
    height: px(20)
  },
  rightTabsTit: {
    marginLeft: px(6),
    fontSize: px(18),
    color: theme.text.color25
  },
  slideContainer: {
    paddingHorizontal: px(20),
    paddingVertical: px(20)
  },
  itemTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleLeftImage: {
    width: px(70),
    height: px(70),
    borderRadius: px(35)
  },
  titleLeftText: {
    marginLeft: px(10)
  },
  textName: {
    fontSize: px(20),
    color: theme.text.color15
  },
  textLabel: {
    flexDirection: 'row',
    marginTop: px(6)
  },
  textLabelB: {
    fontSize: px(18),
    color: theme.text.color7,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.text.color7,
    height: px(30),
    lineHeight: px(30),
    borderRadius: px(15),
    paddingHorizontal: px(8)
  },
  textLabelR: {
    fontSize: px(18),
    borderWidth: StyleSheet.hairlineWidth,
    height: px(30),
    lineHeight: px(30),
    borderRadius: px(15),
    paddingHorizontal: px(8),
    color: theme.text.color11,
    borderColor: theme.text.color11,
    marginLeft: px(10)
  },
  slogan: {
    fontSize: px(22),
    color: theme.background.color22,
    paddingVertical: px(10)
  },
  score: {
    backgroundColor: 'rgba(237, 237, 237, 0.4)',
    borderRadius: px(10),
    paddingHorizontal: px(20),
    paddingVertical: px(20)
  },
  scoreFlast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: px(34)
  },
  flastText: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flastTextTit: {
    fontSize: px(22),
    color: theme.text.color15
  },
  flastTextTime: {
    fontSize: px(18),
    color: theme.text.color27,
    marginLeft: px(10)
  },
  flastTit: {
    fontSize: px(22),
    color: theme.text.color15
  },
  scoreLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: px(34),
    marginTop: px(6)
  },
  lastConfr: {
    fontSize: px(22),
    color: theme.text.color37
  },
  lastTit: {
    fontSize: px(22),
    color: theme.text.color39
  },
  times: {
    fontSize: px(18),
    color: theme.text.color30,
    paddingVertical: px(10)
  },
  plusView: {
    width: px(59),
    height: px(59),
    position: 'absolute',
    bottom: px(154),
    right: px(24)
  },
  plus: {
    opacity: 0.9,
    backgroundColor: theme.text.color14,
    borderColor: theme.text.color14,
    borderWidth: px(2),
    borderStyle: 'solid',
    width: px(59),
    height: px(59),
    borderRadius: px(59)
  }
});
