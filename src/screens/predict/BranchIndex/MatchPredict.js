import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';

import { px, winWidth } from '../../../utils/adapter';
import theme from '../../../styles/theme';

const horizontalMargin = px(16);

const slideImage = require('../../../assets/images/article.png');
const readRowImage = require('../../../assets/images/icon_moer1.png');
const itemWidth = px(580) + horizontalMargin * 2;
const sliderWidth = winWidth;
const sliderData = [slideImage,slideImage,slideImage,slideImage];
const readRowImages = [readRowImage,readRowImage,readRowImage,readRowImage];

class MatchPredict extends React.PureComponent {

  _renderItem = ({item}) => {
    return (
      <>
        {/* <LinearGradient style={styles.linearGradient}
          colors={['#F6F6F7', '#FFFFFF', '#EDEDED']}
          locations={[0.1, 0.25, 1]}
        > */}
        <View style={styles.score}>
          <View style={styles.name}>
            <Text style={styles.nameTit}>球会友谊</Text>
            <Text style={styles.nameTime}>07-26 星期五</Text>
          </View>
          <View style={styles.match}>
            <View style={styles.matchFront}>
              <View style={styles.frontSign}>
                <Image
                  source={item}
                  style={styles.frontSignImage}
                />
                <Text style={styles.frontSignTit}>曼彻斯特城</Text>
              </View>
              <Text style={styles.frontSignDescribe}>WWWLLDLLWW</Text>
            </View>
            <Text style={styles.confrontationTime}>18:00</Text>
            <View style={styles.matchFront}>
              <View style={styles.frontSign}>
                <Text style={styles.frontSignTitRight}>曼彻斯特城</Text>
                <Image
                  source={item}
                  style={styles.frontSignImage}
                />
              </View>
              <Text style={styles.frontSignDescribeRight}>WWWLLDLLWW</Text>
            </View>
          </View>
          <View style={styles.than}>
            <View style={[styles.thanAsia, styles.thanRow]}>
              <Text style={[styles.thanRowCol, styles.thanTitle]}>亚指</Text>
              <Text style={styles.thanRowCol}>1.25</Text>
              <Text style={styles.thanRowCol}>*半/一</Text>
              <Text style={styles.thanRowCol}>0.62</Text>
            </View>
            <View style={[styles.thanEurope, styles.thanRow]}>
              <Text style={[styles.thanRowCol, styles.thanTitle]}>欧指</Text>
              <Text style={styles.thanRowCol}>0.88</Text>
              <Text style={styles.thanRowCol}>2/2.5</Text>
              <Text style={styles.thanRowCol}>1.02</Text>
            </View>
            <View style={[styles.thanSize, styles.thanRow]}>
              <Text style={[styles.thanRowCol, styles.thanTitle]}>大小</Text>
              <Text style={styles.thanRowCol}>0.81</Text>
              <Text style={styles.thanRowCol}>2</Text>
              <Text style={styles.thanRowCol}>1.02</Text>
            </View>
          </View>
          <View style={styles.read}>
            <Text style={styles.readTotalTit}>共
              <Text style={styles.readTotalNumber}>212</Text>位专家爆料
            </Text>
            <View style={styles.readRow}>
              {readRowImages.map((item, index) => {
                return(
                  <Image key={index} source={item} 
                    style={[styles.readRowImage, styles[`renadRowImage${index}`]]}
                  />
                );
              })}
              <Text style={styles.readRowTit}>阅读中</Text>
            </View>
          </View>
        </View>
        {/* </LinearGradient> */}
        <View style={styles.itemTitle}>
          <Text numberOfLines={1} style={styles.itemTitleTit}>大神带你操单，连红专家推荐机不可失</Text>
        </View>
      </>
    );
  }

  render() {
    const { jumpMatchRe } = this.props ;
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <View style={styles.titleLeft}>
            <Image
              source={require('../../../assets/images/title-comet.png')}
              style={styles.leftImage}
            />
            <ImageBackground
              source={require('../../../assets/images/title-bg2.png')}
              style={styles.leftTitBackg}
            >
              <Text style={styles.leftTit}>热门赛事</Text>
            </ImageBackground>
          </View>
          <View style={styles.titleRight}>
            <Image
              source={require('../../../assets/images/feather-grid.png')}
              style={styles.rightImages}
            />
            <TouchableOpacity onPress ={ () =>{jumpMatchRe()}}>
            <Text style={styles.rightTit}>去看篮球</Text>
            </TouchableOpacity>
           
            <Image
              source={require('../../../assets/images/arrow-right.png')}
              style={styles.rightIcon}
            />
          </View>
        </View>
        <Carousel
          itemWidth={itemWidth}
          sliderWidth={sliderWidth}
          data={sliderData}
          renderItem={this._renderItem}
          slideStyle={styles.slideStyle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: theme.background.color18,
    borderBottomWidth: px(10),
    paddingTop: px(12),
    paddingBottom: px(20),
  },
  title: {
    paddingBottom: px(20),
    paddingHorizontal: px(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slideImg: {
    width: itemWidth,
    height: px(300),
    borderRadius: 8
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftImage: {
    width: px(40),
    height: px(40),
  },
  leftTitBackg: {
    marginLeft: px(10),
    height: px(38),
  },
  leftTit: {
    fontSize: px(26),
    lineHeight: px(38),
    color: theme.text.color37,
  },
  titleRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightImages: {
    width: px(24),
    height: px(24),
  },
  rightTit: {
    marginLeft: px(6),
    fontSize: px(18),
    color: theme.text.color25,
  },
  rightIcon: {
    width: px(10),
    height: px(16),
    marginLeft: px(10),
  },
  slideStyle: {
    paddingVertical: px(5)
  },
  score: {
    backgroundColor: theme.background.colorWhite,
    shadowColor: theme.shadowColorSecond,
    shadowOffset:{width:0,height:0},
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
    flex: 1,
    borderRadius: px(10),
    paddingHorizontal: px(18),
    paddingVertical: px(18),
    position: 'relative'
  },
  itemTitle: {
    flex: 1,
    marginTop: px(12),
    alignItems: 'center'
  },
  itemTitleTit: {
    fontSize: px(22),
    color: theme.text.color38
  },
  name: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: px(24),
    marginBottom: px(2)
  },
  nameTit: {
    fontSize: px(16),
    color: theme.text.color13,
  },
  nameTime: {
    marginLeft: px(10),
    fontSize: px(16),
    color: theme.text.color13
  },
  match: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  frontSign: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  frontSignImage: {
    width: px(60),
    height: px(60),
    borderRadius: px(30)
  },
  frontSignTit: {
    marginLeft: px(10),
    fontSize: px(22),
    color: theme.text.color37
  },
  frontSignDescribe: {
    fontSize: px(20)
  },
  confrontationTime: {
    fontSize: px(40),
    color: theme.text.color18,
    fontWeight: 'bold'
  },
  frontSignTitRight: {
    fontSize: px(22),
    color: theme.text.color37,
    marginRight: px(10)
  },
  frontSignDescribeRight: {
    fontSize: px(20),
    textAlign: 'right'
  },
  than: {
    marginLeft: px(18),
    marginRight: px(58),
    borderBottomWidth: px(2),
    borderColor: theme.border.colorGray3,
    paddingTop: px(20),
    paddingBottom: px(4)
  },
  thanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: px(2),
    height: px(29)
  },
  thanRowCol: {
    width: px(58),
    fontSize: px(20),
    textAlign: 'center'
  },
  thanTitle: {
    color: theme.text.color27
  },
  read: {
    marginHorizontal: px(18),
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: px(40),
    alignItems: 'center',
    marginTop: px(10)
  },
  readTotalTit: {
    fontSize: px(20),
    color: theme.text.color17,
  },
  readTotalNumber: {
    color: theme.text.color38
  },
  readRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative'
  },
  readRowImage: {
    width: px(36),
    height: px(36),
    borderRadius: px(18),
    position: 'absolute',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.colorWhite
  },
  readRowTit: {
    fontSize: px(24),
    color: theme.text.color39
  },
  renadRowImage0: {
    left: -px(130),
    zIndex: 4
  },
  renadRowImage1: {
    left: -px(105),
    zIndex: 3
  },
  renadRowImage2: {
    left: -px(80),
    zIndex: 2
  },
  renadRowImage3: {
    left: -px(55),
    zIndex: 1
  },
  linearGradient: {
    width: itemWidth,
    borderRadius: px(10)
  }
});

export default MatchPredict;
