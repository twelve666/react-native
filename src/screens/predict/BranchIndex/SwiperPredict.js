import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import { px, winWidth } from '../../../utils/adapter';
import theme from '../../../styles/theme';
import Item from '@ant-design/react-native/lib/list/ListItem';

const slideImage = require('../../../assets/images/article.png');
const slideData = [slideImage,slideImage,slideImage];
const sliderWidth = winWidth;
const itemWidth = px(710);

class SwiperPredict extends React.PureComponent {
  _renderItem = ({item}) => {
    return (
      <Image
        source={item}
        style={styles.slideImg}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Carousel
          style={styles.wrapper}
          data={slideData}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          autoplay
          autoplayDelay={500}
          autoplayInterval={3000}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: px(300),
    marginTop: px(20),
    marginBottom: px(25)
  },
  wrapper: {},
  slideImg: {
    width: itemWidth,
    height: px(300),
    borderRadius: 8
  },
  dot: {
    width: px(8),
    height: px(8),
    backgroundColor: theme.background.color20,
    borderRadius: px(4),
    opacity: 0.4,
    marginHorizontal: px(12)
  },
  activeDot: {
    width: px(8),
    height: px(8),
    borderRadius: px(4),
    backgroundColor: theme.background.color20
  },
  paginationStyle: {
    bottom: px(22)
  }
});

export default SwiperPredict;
