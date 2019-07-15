import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Platform,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  Easing,
} from 'react-native'
import isEqual from 'react-fast-compare'

const numPerRow = 3;
const aspectRatio = 1;
const gapWidth = 16;
const paddingVertical = 16;
const paddingHorizontal = 16;
const sensitivity = 150;
const selectAnimation = 'scale'; // scale, shake
const selectStyle = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  elevation: 5,
}

export default class SortableGridview extends Component {
  state = {
    containerOnMount: false,
    contentStyle: {},
    selectIndex: null,

    perWidth: 0,
    perHeight: 0,
    layoutWidth: 0,

    data: this.props.data || [],
    lockData: this.props.lockData || [],
    numPerRow: this.props.numPerRow || numPerRow,
    aspectRatio: this.props.aspectRatio || aspectRatio, // (height / width)
    gapWidth: this.props.gapWidth || gapWidth,
    // paddingVertical: this.props.paddingVertical || paddingVertical,
    // paddingHorizontal: this.props.paddingHorizontal || paddingHorizontal,
    paddingTop: this.props.paddingTop || paddingVertical,
    paddingBottom: this.props.paddingBottom || paddingVertical,
    paddingLeft: this.props.paddingLeft || paddingHorizontal,
    paddingRight: this.props.paddingRight || paddingHorizontal,
    selectStyle: this.props.selectStyle || selectStyle,
    sensitivity: this.props.sensitivity || sensitivity,
    selectAnimation: this.props.selectAnimation || selectAnimation, // scale/shake
    customAnimation: this.props.customAnimation ? {
      startTimingOption: {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
      },
      endTimingOption: {
        toValue: 0,
        duration: 150,
        // useNativeDriver: true,
      },
      ...this.props.customAnimation,
    } : {
      startTimingOption: {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        // useNativeDriver: true,
      },
      endTimingOption: {
        toValue: 0,
        duration: 150,
        // useNativeDriver: true,
      },
    }
  }
  componentWillMount() {
    this.data = [...this.state.data];
    this.currentAnchor;
    this.currentAnchorAnimation;
    this.positions = [];
    this.animateArray = [];
    this.panCapture = false;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => this.panCapture,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        this.panCapture,
      onShouldBlockNativeResponder: (evt, gestureState) => false,
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderGrant: this.onActiveBlockIsSet(this.onStartDrag),
      onPanResponderMove: this.onActiveBlockIsSet(this.onMoveBlock),
      onPanResponderRelease: this.onActiveBlockIsSet(this.onReleaseBlock)
      // onPanResponderGrant: this.onStartDrag,
      // onPanResponderMove: this.onMoveBlock,
      // onPanResponderRelease: this.onReleaseBlock,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      !isEqual(this.props.data, nextProps.data) ||
      nextProps.numPerRow !== this.props.numPerRow ||
      nextProps.aspectRatio !== this.props.aspectRatio ||
      nextProps.gapWidth !== this.props.gapWidth ||
      nextProps.paddingTop !== this.props.paddingTop ||
      nextProps.paddingBottom !== this.props.paddingBottom ||
      nextProps.paddingLeft !== this.props.paddingLeft ||
      nextProps.paddingRight !== this.props.paddingRight ||
      nextProps.selectStyle !== this.props.selectStyle ||
      nextProps.sensitivity !== this.props.sensitivity
    ) {
      const preDataLength = this.props.data.length;
      const nextData = [...nextProps.data];
      let data = []
      if (preDataLength > nextData.length) {
        this.moveAnimate = true;
        data = nextData;
      } else {
        nextData.splice(0, preDataLength);
        data = [...this.state.data, ...nextData];
      }

      this.data = data;
      
      this.setState({
        ...this.state,
        data,
        lockData: nextProps.lockData || this.state.lockData,
        numPerRow: nextProps.numPerRow || this.state.numPerRow,
        aspectRatio: nextProps.aspectRatio || this.state.aspectRatio,
        gapWidth: nextProps.gapWidth || this.state.gapWidth,
        paddingTop: nextProps.paddingTop || this.state.paddingTop,
        paddingBottom: nextProps.paddingBottom || this.state.paddingBottom,
        paddingLeft: nextProps.paddingLeft || this.state.paddingLeft,
        paddingRight: nextProps.paddingRight || this.state.paddingRight,
        selectStyle: nextProps.selectStyle || this.state.selectStyle,
        sensitivity: nextProps.sensitivity || this.state.sensitivity,
      }, () => {
        this._setContentStyle(this.state.layoutWidth);
      });
    }
    
  }

  setTimer = (dx, dy) => {
    this.timer = setTimeout(() => {
      this._caluIndex(dx, dy);
    }, this.state.sensitivity);
      
  }

  clearTimer = () => {
    clearTimeout(this.timer);
  }

  onActiveBlockIsSet = fn => (evt, gestureState) => {
    this.currentAnchor && fn(evt, gestureState);
  };

  onStartDrag = (evt, gestureState) => {
    // if (!this.currentAnchor) {
    //   return;
    // }
    this.tempX = this.positions[this.positionIndex].x
    this.tempY = this.positions[this.positionIndex].y
  };

  onMoveBlock = (evt, gestureState) => {
    this.clearTimer();
    const { dx, dy } = gestureState;
    this[this.currentAnchor].setValue({ x: dx + this.tempX, y: dy + this.tempY})
    
    this.setTimer(dx + this.tempX, dy + this.tempY);
  }

  onReleaseBlock = (evt, gestureState) => {
    this.clearTimer();
    // const { dx, dy, moveX, moveY, vx, vy , x0, y0 } = gestureState;

    

    Animated.parallel([
      Animated.timing(
        this[this.currentAnchor], // The value to drive
        {
          toValue: {
            x: this.positions[this.positionIndex].x,
            y: this.positions[this.positionIndex].y,
          },
          duration: 150,
        },
      ),
      Animated.timing(
        this[`selectAnimation${this.currentAnchorKey}`], // The value to drive
        this.state.customAnimation.endTimingOption,
      ),
    ]).start((data) => {
      this.setState({
        data: this.data,
        selectIndex: null,
      }, () => {
        this.props.onDragRelease && this.props.onDragRelease(this.data);
        this.positionIndex = null;
        this.currentAnchor = null;
        this.caluing = false;
        this.panCapture = false;
      });
      
    });
  };

  _caluIndex = (x, y) => {
    if (this.caluing) {
      return;
    }
    this.data = this.data || [...this.state.data];
    let centerX = (x + this.state.perWidth / 2);
    let centerY = (y + this.state.perHeight / 2);
    let columNum = Math.floor(centerX / (this.state.perWidth + this.state.gapWidth));
    let rowNum = Math.floor(centerY / (this.state.perHeight + this.state.gapWidth));
    if (rowNum > this.state.rowCount) {
      rowNum = this.state.rowCount
    } else if (rowNum < 0) {
      rowNum = 0;
    }
    if (columNum > this.state.numPerRow) {
      columNum = this.state.numPerRow;
    } else if (columNum < 0) {
      columNum = 0;
    }
    let index = columNum + rowNum * this.state.numPerRow;
    index = (index > this.state.data.length - 1) ? this.state.data.length - 1 : index
    if (this.positionIndex === index) {
      this.caluing = false;
      return;
    }
    let newIndex;
    if (index === this.positionIndex) {
      newIndex = index;
    } else  if (index > this.positionIndex) {
      const moveItem = this.data.splice(this.positionIndex, 1);
      const animate = this.animateArray.splice(this.positionIndex, 1)[0];
      this.data.splice(index, 0, moveItem[0]);
      this.animateArray.splice(index, 0, animate);
      newIndex = index;
      
    } else if (index < this.positionIndex) {
      const moveItem = this.data.splice(this.positionIndex, 1);
      const animate = this.animateArray.splice(this.positionIndex, 1)[0];
      this.data.splice(index, 0, moveItem[0]);
      this.animateArray.splice(index, 0, animate);
      newIndex = index ;
    }
    const parallel = [];
    this.animateArray.map((item, index) => {
      if (newIndex === index) {
        return;
      }
      parallel.push(
        Animated.timing(
          item, // The value to drive
          {
            toValue: {
              x: this.positions[index].x,
              y: this.positions[index].y,
            },
            duration: 150,
          },
        )
      )
      
    })
    this.positionIndex = index;

    Animated.parallel(parallel).start(() => {
      this.caluing = false;
    });
    
  }

  _setContentStyle = (width) => {
    const { data = [], lockData =[], numPerRow, gapWidth, aspectRatio, paddingLeft, paddingRight, paddingTop, paddingBottom } = this.state
    const allData = [...data, ...lockData];
    const rowCount  = Math.ceil(allData.length / numPerRow);
    const perWidth = (width - ((numPerRow - 1) * gapWidth) - (paddingLeft + paddingRight)) / numPerRow;
    const perHeight = perWidth * aspectRatio;
    const contentHeight = (perHeight * rowCount) + (rowCount - 1) * gapWidth;
    if (this.positions.length !== allData.length) {
      this.positions = [];
      allData.map((item, index) => {
        const row = Math.floor(index / numPerRow);
        const column = index % numPerRow;
        this.positions[index] = {
          x: paddingLeft + perWidth * column + column * gapWidth,
          y: paddingTop+ perHeight * row + row * gapWidth,
        }
      });
    }

    this.setState({
      containerOnMount: true,
      perWidth,
      perHeight,
      layoutWidth: width,
      rowCount: rowCount - 1,
      contentStyle: {
        height: contentHeight + (paddingTop + paddingBottom),
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
      },
    });
  }

  _getAnimation = (key) => {
    if (this.state.selectAnimation === 'none') {
      return {};
    }
    
    if (!this[`selectAnimation${key}`]) {
      this[`selectAnimation${key}`] = new Animated.Value(0);
    }
    if (this.state.customAnimation && this.state.customAnimation.style) {
      return this.state.customAnimation.style(this[`selectAnimation${key}`]);
    }
    if (this.state.selectAnimation === 'scale') {
      let onSelectScaleAnimation = {}
      let scale = this[`selectAnimation${key}`].interpolate({
        inputRange: [0, .6, 1],
        outputRange: [1, 1.1, 1.07],
      });
      onSelectScaleAnimation = {
        transform: [{
          scale: scale,
        }],
      }
      return onSelectScaleAnimation;
    }
    if (this.state.selectAnimation === 'shake') {
      let onSelectShakeAnimation = {}
      let rotate = this[`selectAnimation${key}`].interpolate({
        inputRange: [0, .25, .5, .75, 1],
        outputRange: ['0deg', '-5deg', '5deg', '-5deg', '0deg'],
      });
      onSelectShakeAnimation = {
        transform: [{
          rotateZ: rotate,
        }],
      }
      return onSelectShakeAnimation;
    }
  }

  _onLongPressItems = (key, index) => {
    return () => {
      this.setState({
        selectIndex: index,
      })
      this.positionIndex = index;
      this.currentAnchor = `moveAnimate${key}`;
      this.currentAnchorKey = key
      this.props.onDragStart && this.props.onDragStart(false);
      this.panCapture = true;
      Animated.timing(
        this[`selectAnimation${this.currentAnchorKey}`],
        this.state.customAnimation.startTimingOption,
      ).start();
    }
    
  }

  _containerOnLayout = ({nativeEvent}) => {
    this._setContentStyle(nativeEvent.layout.width);
  }

  render() {
    const { paddingTop, paddingBottom, paddingLeft, paddingRight } = this.state;
    const { contentStyle = {}, style = {}, itemCoverStyle = {}, lockItemCoverStyle = {} } = this.props;
    const allData = [...this.state.data, ...this.state.lockData];
    return (
      <View style={[styles.fullWidth, style]} onLayout={this._containerOnLayout}>
        <View style={[{paddingTop, paddingBottom, paddingLeft, paddingRight}, this.state.contentStyle, contentStyle]}>
          {this.positions && this.positions.length === allData.length &&
            this.state.data.map((item, index) => {
              const selectStyle = this.state.selectIndex === index ? {
                ...this.state.selectStyle,
              } : {}
              const content = this.props.renderItem(item, index);
              const customTap = content.props.onTap ? content.props.onTap : () => {};
              const key = content.props.uniqueKey || index;
              
              if (!this[`moveAnimate${key}`] || this.moveAnimate) {
                this[`moveAnimate${key}`] = new Animated.ValueXY(this.positions[index]);
                this.animateArray[index] = this[`moveAnimate${key}`]
                if (this.state.data.length - 1 === index) {
                  this.moveAnimate = false;
                }
              }
              return [
                <Animated.View
                  {...this.panResponder.panHandlers}
                  key={`sortableView${key}`}
                  style={[
                    styles.absolute,
                    {height: this.state.perHeight, width: this.state.perWidth, zIndex: this.state.selectIndex === index ? 10 : 1, ...selectStyle, ...this._getAnimation(key)},
                    // {left: this[`moveAnimate${key}`].x, top: this[`moveAnimate${key}`].y}
                    this[`moveAnimate${key}`].getLayout(),
                  ]}
                >
                  <TouchableWithoutFeedback style={styles.flex}
                    // delayLongPress={200}
                    onLongPress={this._onLongPressItems(key, index)}
                    onPress={() => {
                      customTap(item, index);
                    }}
                  >
                    <View style={styles.fullScreen}>
                      {content}
                    </View>
                  </TouchableWithoutFeedback>
                </Animated.View>,
                this.props.renderItemCover && (
                  <Animated.View
                    key={`sortableViewItemCover${key}`}
                    style={[
                      styles.absolute,
                      {zIndex: this.state.selectIndex === index ? 10 : 1, ...itemCoverStyle, ...selectStyle, ...this._getAnimation(key)},
                      // {left: this[`moveAnimate${key}`].x, top: this[`moveAnimate${key}`].y}
                      this[`moveAnimate${key}`].getLayout(),
                    ]}
                  >
                    {this.props.renderItemCover(item, index)}
                  </Animated.View>
                ),
              ]
            })
          }
          {this.state.lockData.length > 0 && this.positions && this.positions.length === allData.length &&
            this.state.lockData.map((item, index) => {
              if (!this.props.renderLockItem) {
                return null;
              }
              const content = this.props.renderLockItem(item, index);
              const customTap = content.props.onTap ? content.props.onTap : () => {};
              const key = content.props.uniqueKey || index;
              const x = this.positions[this.state.data.length + index].x;
              const y = this.positions[this.state.data.length + index].y;
              return [
                <Animated.View
                  key={`sortableView${key}`}
                  style={[
                    styles.absolute,
                    {height: this.state.perHeight, width: this.state.perWidth},
                    {left: x, top: y}
                  ]}
                >
                  <TouchableWithoutFeedback
                    style={styles.flex}
                    onPress={() => {
                      customTap(item, index);
                    }}
                  >
                    <View style={styles.fullScreen}>
                      {content}
                    </View>
                  </TouchableWithoutFeedback>
                </Animated.View>,
                this.props.renderLockItemCover && (
                  <Animated.View
                    key={`sortableViewItemCover${key}`}
                    style={[
                      styles.absolute,
                      {zIndex: this.state.selectIndex === index ? 10 : 1, ...lockItemCoverStyle},
                      {left: x, top: y}
                    ]}
                  >
                    {this.props.renderLockItemCover(item, index)}
                  </Animated.View>
                ),
              ]
            })
          }
        </View>
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  absolute: {
    position: 'absolute',
  },
  flex: {
    flex: 1,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
})
