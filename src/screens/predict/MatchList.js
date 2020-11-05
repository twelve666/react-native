import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import showToast from '../../components/toast/index';
import { cstyle, theme, px } from '../../styles';
import { getinit, competitionstarted, handleMatch, newsTotal, findSoccer, findBasketball, getFootball, getBasketball } from '../../http/APIs';
const mapState = (state) => {
  return {
    getLogin: state.login.loginInfo,
  };
};

const mapDispatch = {
};

/**
 * 赛事列表，赛事选择
 */
class MatchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newsNum:'' ,// 猛料数量
      matchList:[], // 赛事列表
    };
  }
  componentDidMount() {

  }
  // 选择赛事 足球 篮球切换
  doMatch = (sportId) => {
    let query = {
      page: 1,
      size: 15,
      AuthUserId: this.props.getLogin.id,
      AuthToken:this.props.getLogin.token
    };
    getinit([sportId == 1 ? findSoccer : findBasketball, query]).then(res => {
      this.setState({
        matchList:res
      })
      console.log('赛事', res);
    },
    err => {
      console.log('赛事err', err);
    }
    );
  }
  // 发布猛料-校验是否已开赛
  doPublishVerify = () => {
    let query = {
      sportType: 1,
      matchId: 2700133,
      memberId: this.props.getLogin.id,
    };
    getinit([competitionstarted, query]).then(res => {
      console.log('校验是否已开赛', res);
      this.props.navigation.navigate('Publish');
    },
    err => {
      console.log('err', err);
      showToast('网络异常，请稍后再试');
    }
    );
  }
  test = ()=>{
    console.log(1111);
  }
  render() {
    return (<View style={styles.container}>
      <TouchableOpacity onPress={() => { this.doPublishVerify(); }}>
        <Text>校验是否已开赛</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { this.doMatch(1); }}>
        <Text>选择赛事 足球 </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { this.doMatch(2); }}>
        <Text>选择赛事 篮球</Text>
      </TouchableOpacity>
    </View>);
  }
}

export default connect(mapState, mapDispatch)(MatchList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  }
});
