import React from 'react';
import { View, PanResponder } from 'react-native';

class DetailOnPress extends React.PureComponent {
  presentState = true;
  constructor(props) {
    super(props);
    this._panResponder = PanResponder.create({
      // 开启点击手势响应
      onStartShouldSetPanResponder: () => true,
      // 开启点击手势响应是否劫持 true: 不传递给子view false：传递给子view
      onStartShouldSetPanResponderCapture: () => false,
      // 开启移动手势响应
      onMoveShouldSetPanResponder: () => true,
      // 开启移动手势响应是否劫持 true：不传递给子view false：传递给子view
      onMoveShouldSetPanResponderCapture: () => true,
      // 手指触碰屏幕那一刻触发 成为激活状态。
      onPanResponderGrant: () => {
        this.presentState = false;
      },
      // 手指在屏幕上移动触发
      onPanResponderMove: (_, gestureState) => {  
        if (gestureState.dx < 5 && gestureState.dx > -5 && gestureState.dy < 5 && gestureState.dy > -5) {
          this.presentState = false;
        } else {
          this.presentState = true;
        }
      },
      // 当有其他不同手势出现，响应是否中止当前的手势
      onPanResponderTerminationRequest: () => true,
      // 手指离开屏幕触发
      onPanResponderRelease: () => {
        if (!this.presentState) {
          const { returnParam, onPress } = this.props;
          onPress(returnParam);
          this.presentState = true;
        }
      },
      onShouldBlockNativeResponder: () => false
    });
  }

  render() {
    const { children } = this.props;
    return (
      <View {...this._panResponder.panHandlers}>
        {children}
      </View>
    );
  }
}

export default DetailOnPress;
