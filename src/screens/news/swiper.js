import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { px, winWidth } from '../../utils/adapter';
import theme from '../../styles/theme';
import DetailOnPress from './detailOnPress';

const sliderWidth = winWidth;
const itemWidth = px(710);
const SLIDER_FIRST_ITEM = 0;

class Swiper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sliderActiveSlide: SLIDER_FIRST_ITEM
    };
  }

  onSnapToItem = (index) => {
    this.setState({ sliderActiveSlide: index });
  }

  _renderItem = ({ item }) => {
    const { gotoDetail } = this.props;
    return (
      <DetailOnPress
        returnParam={item}
        onPress={gotoDetail}
        key={item.coverNrl}
      >
        <Image style={styles.image} source={{ uri: item.coverNrl }} />
        <View style={styles.title}>
          <Text style={styles.bg}></Text>
          <Text style={styles.titleText} numberOfLines={1}>
            {item.articleTitle}
          </Text>
        </View>
      </DetailOnPress>
    );
  };

  render() {
    const { data } = this.props;
    const { sliderActiveSlide } = this.state;
    return (
      <View style={styles.container}>
        <Carousel
          ref={(c) => (this._sliderRef = c)}
          data={data}
          firstItem={SLIDER_FIRST_ITEM}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          autoplay
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={this.onSnapToItem}
        />
        <Pagination
          dotsLength={data.length}
          activeDotIndex={sliderActiveSlide}
          containerStyle={styles.paginationContainer}
          dotColor={theme.background.color20}
          dotStyle={styles.paginationDot}
          inactiveDotColor={theme.background.color20}
          inactiveDotScale={1}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: px(10),
  },
  image: {
    height: px(330),
    borderRadius: px(20),
  },
  title: {
    position: 'absolute',
    bottom: px(0),
    width: px(710),
    height: px(47),
    paddingLeft: px(18),
  },
  bg: {
    position: 'absolute',
    top: px(0),
    left: px(0),
    width: px(710),
    height: px(47),
    backgroundColor: theme.background.color20,
    opacity: 0.5,
    borderBottomRightRadius: px(20),
    borderBottomLeftRadius: px(20),
  },
  titleText: {
    lineHeight: px(47),
    textAlign: 'left',
    color: theme.text.colorWhite,
    fontSize: px(26),
  },
  paginationContainer: {
    position: 'absolute',
    bottom: px(20),
    width: '100%',
    alignItems: 'center'
  },
  paginationDot: {
    width: px(8),
    height: px(8)
  }
});

export default Swiper;
