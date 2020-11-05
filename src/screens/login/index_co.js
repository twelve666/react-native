import * as React from 'react';
import { Tabs, Toast } from '@ant-design/react-native';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView, Picker } from 'react-native';
import { connect } from 'react-redux';
import { cstyle, theme, px } from '../../styles';
import { apprecord, appstraightwins,getinit } from '../../http/APIs';
import Header from '../predict/professorHeader';
function showToast(text) {
  Toast.info(text, 1, false);
}
const mapState = (state) => ({
});

const mapDispatch = {
};

// 头部标题
function ExpertHead(props) {
  return (<View style={styles.pepLayout}>
    {props.isRecommend ? null : <Text>排名</Text>}
    <Text style={styles.expertW}>专家</Text>
    <Text style={styles.border}>总</Text>
    <Text style={styles.border}>胜</Text>
    <Text style={styles.border}>走</Text>
    <Text style={styles.border}>负</Text>
    <Text style={styles.border}>命中率</Text>
  </View>);
}
// 专家列表
function DataList(props) {
  return (
    props.data && props.data.map((item, index) => {
      return (
        <View style={styles.pepLayout} key={index}>
          {props.isRecommend ? null : <View>
            {item.order == 0 ? <Text>0</Text> : <Text>1</Text>}
          </View>}
          <View style={styles.expert}>
            <Image
              style={styles.timg}
              source={item.picUrl}
            />
            <View style={styles.peoInfo}>
              <Text>{item.expertName}</Text>
              <View>
                <Text>{item.record}</Text>
                <Text>{item.straightWins}</Text>
              </View>

            </View>

          </View>
          <Text >{item.newsSize}</Text>
          <Text>{item.winSize}</Text>
          <Text>{item.walkSize}</Text>
          <Text>{item.loseSize}</Text>
          <Text>{item.hitRate}</Text>
        </View>
      );

    })
  );

}
/**
 * 专家排名（足球、篮球）
 */
class ProfessorRank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navs: [
        { title: '推荐' },
        { title: '红单榜' },
      ],
      isRecommend: true,
      data: [],// 推荐专家数据
      dataRed: [],// 推荐红单榜数据
      page: 0,
      quarter: 1,
      sportType:'1',
    };
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      headerTitle: (props) => (
        <Header onPress={this.navBarTabsHandler.bind(this)} {...props} />
      ),
    });
    console.log(1111);
    this.navBarTabsHandler({ name: 'football' });
  }
  // 足球 篮球切换
  navBarTabsHandler(props) {
    this.setState({
      sportType: props.name == 'football' ? 1 : 2
    },()=>{
      this.handleNav(apprecord, { sportType: this.state.sportType, page: 0, size: 15 });
    });
    
  }
  // 推荐 红单榜切换
  tabHandler = (tabs, index) => {
    console.log(tabs, index);
    let query = {
      sportType: this.state.sportType,
      page: 0,
      size: 15,
      quarter: this.state.quarter
    };  
    this.handleNav(tabs.title === '推荐' ? apprecord : appstraightwins, query);
  }
  // 请求数据
  /**
   @param {string} portInfo 接口地址
   @param {object}  query   参数     
   **/
  handleNav(portInfo, query) {
    getinit([portInfo, query]).then(res => {
      if(portInfo == apprecord) {
        this.setState({
          data: res
        });
      }else{
        this.setState({
          dataRed: res
        });
      }    
      console.log('推荐',this.state.data,'红单',this.state.dataRed);
    },
    err => {
      console.log('猛料推荐err', err);
      showToast('网络异常，请稍后再试');
    }
    );
  }
  // 切换 周榜 月榜
  handleQuarter(lang) {
    this.setState({ quarter: lang },()=>{
      let query = {
        sportType: 1,
        page: 0,
        size: 15,
        quarter: this.state.quarter
      };
      this.handleNav(appstraightwins, query);
    });
   
  }
  render() {
    return (
      <View style={styles.container}>
        <Tabs tabs={this.state.navs}
          page={this.state.page}
          tabBarBackgroundColor={theme.header.backgroundColor}
          tabBarInactiveTextColor={theme.text.color9}
          tabBarActiveTextColor={theme.text.color36}
          tabBarUnderlineStyle={theme.text.color36}
          onChange={this.tabHandler}
        >     
          {/* 推荐 */}
          <View>
            <ExpertHead isRecommend={this.state.isRecommend}></ExpertHead>
            <DataList data={this.state.data} isRecommend={this.state.isRecommend}></DataList>
          </View>
          {/* 红单 */}
          <View>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={this.state.quarter}
                mode='dropdown'
                prompt='Picker'
                style={styles.picker}
                onValueChange={(lang)=>{this.handleQuarter(lang);}}>
                <Picker.Item label='周榜' value='1' style={styles.pickerItem} />
                <Picker.Item label='月榜' value='2' />
                <Picker.Item label='季榜' value='3' />
              </Picker>
            </View>
            <ExpertHead isRecommend={false}></ExpertHead>
            <DataList data={this.state.dataRed} isRecommend={false}></DataList>
          </View>
        </Tabs>
      </View>);
  }
}

export default connect(mapState, mapDispatch)(ProfessorRank);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boderSize: {
    // borderColor: 'red',
    borderWidth: px(1),
    borderStyle: 'solid',
    marginTop: px(50),
  },
  pepLayout: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',

  },
  expertW: {
    width: px(300),
  },
  expert: {
    width: px(300),
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row'
  },
  timg: {
    width: px(100),
    height: px(100),
    borderRadius: px(50),
    // borderColor: 'red',
    // borderWidth: px(1),
    // borderStyle: 'solid',
  },
  peoInfo: {
    // display: 'flex',
    // justifyContent: 'space-around',
    // alignItems: 'center',
    // flexDirection: 'row'
  },
  border: {
    borderColor: theme.border.colorGray,
    borderStyle: 'solid',
    borderWidth: px(2),
  },
  pickerWrap: {
    width: '100%',
    height: 50,
    position: 'relative',
  },
  picker: {
    color: theme.text.colorGray,
    width: 100,
    height: 50,
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: px(100)
  },
  pickerItem: {
    marginTop: px(1000)
  },
  wrapper: { flexDirection: 'row' },
  title: { width: px(500), flex: 1, backgroundColor: theme.backgroundColor.sky },
  row: { height: 28 },
  text: { textAlign: 'center' }

});
