import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { cstyle, theme, px } from '../../styles';
import countPeople from './count'
const mapState = (state) => {
  return {
    getLogin: state.login.loginInfo,
  };
};

const mapDispatch = {
};

/**
 * 相关猛料
 */
class RelativePredict extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    countPeople({
      AuthUserId: this.props.getLogin.id,
      AuthToken: this.props.getLogin.token, 
      userId: this.props.getLogin.id, 
      type: 1, 
      matchId: 3369908
    });
  }
  render() {
    return (<View style={styles.container}>

    </View>);
  }
}

export default connect(mapState, mapDispatch)(RelativePredict);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  }
});
