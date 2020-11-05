import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { cstyle, theme, px } from '../../styles';
import { handleMatch, newsContent, getinit, readOnline } from '../../http/APIs';
import countPeople from './count'
const mapState = (state) => {
  return {
    getLogin: state.login.loginInfo,
  };
};

const mapDispatch = {
};

/**
 * 爆料详情
 */
class PredictDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentList: []
    };
  }
  componentDidMount() {
    countPeople({
      AuthUserId: this.props.getLogin.id,
      AuthToken: this.props.getLogin.token, userId: this.props.getLogin.id, type: 1, matchId: 3369908
    });
  }

  // 统计阅读在线人数
  // count = (type,matchId) => {
  //   let query = {
  //     AuthUserId: this.props.getLogin.id,
  //     AuthToken:this.props.getLogin.token,
  //     userId:this.props.getLogin.id,
  //     type,
  //     matchId   
  //   };
  //   countPeople()
  // }
  // 根据比赛ID查询所有推荐
  doContentList = (matchId) => {
    console.log(this.props.getLogin);
    let query = {
      token: this.props.getLogin.token,
      userId: this.props.getLogin.id,
      matchId,
    };
    handleMatch(newsContent, matchId, query).then(res => {
      console.log(res);
      this.setState({
        contentList: res
      });
    }, err => {
      console.log('err', err);
      // showToast('网络异常，请稍后再试');
    });
  }
  render() {
    return (<View style={styles.container}>
      <TouchableOpacity onPress={() => { this.doContentList(3369908); }}>
        <Text>  测试根据比赛ID查询所有推荐接口</Text>
      </TouchableOpacity>
    </View>);
  }
}

export default connect(mapState, mapDispatch)(PredictDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  }
});
