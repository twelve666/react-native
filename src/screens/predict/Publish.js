import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { cstyle, theme, px } from '../../styles';
import { getinit, savenewscontent, getMatchByMatchId } from '../../http/APIs';
import showToast from '../../components/toast/index';
const mapState = (state) => {
  return {
    getLogin: state.login.loginInfo,
  };
};

const mapDispatch = {
};

/**
 * 发布猛料（足球、篮球）
 */
class Publish extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mathcInfo: {} //赛事信息
    };
  }

  componentDidMount() {
    this.getMatch(2700133)
  }
  // app:猛料赛事查询
  getMatch = (matchId) => {
    let query = {
      // AuthUserId: this.props.getLogin.id,
      // AuthToken: this.props.getLogin.token,
      matchId,
    }
    getinit([getMatchByMatchId, query]).then(res => {
      console.log('app:猛料赛事查询', res.data);
      this.setState({
        mathcInfo:res.data
      })
    },
      err => {
        console.log('err', err);
        showToast('网络异常，请稍后再试');
      }
    );
  }
  // 发布猛料
  doPublish = () => {
    let params = {
      sportId:1,
      matchId:2700133,
      evenId:this.state.mathcInfo.eventId,
      expertId:12,
      newsRemark:'我是测试数据',
      marketType:'eu',
      companyId:11,
      oddsValues:'1陪2',
      forecastResult:1,
    }
    
    // let query = Object.assign(...this.state.mathcInfo,{newsRemark:'fsfdfsfd'})
    
    getinit([savenewscontent, params]).then(res => {

      console.log('发布猛料', res);
    },
      err => {
        console.log('err', err);
        showToast('网络异常，请稍后再试');
      }
    );
  }
  render() {
    return (<View style={styles.container}>
      <TouchableOpacity onPress={() => { this.doPublish(); }}>
        <Text>  测试发布接口</Text>
      </TouchableOpacity>
    </View>);
  }
}

export default connect(mapState, mapDispatch)(Publish);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  }
});
