import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { cstyle, theme, px } from '../../styles';
import { getinit, competitionstarted, getFootball, getBasketball } from '../../http/APIs';
const mapState = (state) => {
  return {
    getLogin: state.login.loginInfo,
  };
};

const mapDispatch = {
};

/**
 * 赛事推荐
 */
class MatchRecommend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchData:[] // 赛事数据
    };
  }
  componentDidMount() {

  }
  // 推荐赛事全部 足球 篮球
  doMatchRe = (sportId) => {
    let query = {
      page: 1,
      size: 15,
      AuthUserId: this.props.getLogin.id,
      AuthToken:this.props.getLogin.token
    };
    getinit([sportId == 1 ? getFootball : getBasketball, query]).then(res => {
     this.setState({
      matchData:res
     })
      console.log('赛事', res);
    },
    err => {
      console.log('赛事err', err);
    }
    );
  }
  render() {
    return (<View style={styles.container}>
      <TouchableOpacity onPress={() => { this.doMatchRe(1); }}>
        <Text>选择赛事 足球 篮球切换</Text>
      </TouchableOpacity>
    </View>);
  }
}

export default connect(mapState, mapDispatch)(MatchRecommend);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  }
});
