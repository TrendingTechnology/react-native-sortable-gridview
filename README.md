<h3 align="center" style="margin-bottom: 21px;">
  React sortable grid view
</h3>

<p align="center">
  <img alt="Issue Stats" src="">
</p>

# react-native-sortable-gridview

## Installation

```
npm i react-native-sortable-gridview --save
or
yarn add react-native-sortable-gridview
```

## Usage

```
import SortableGridView from 'react-native-sortable-gridview'

...

<SortableGridview
  data={[1, 2, 3, 4, 5]}
  lockData={[6]}
  numPerRow={3}
  aspectRatio={1.2}
  gapWidth={16}
  paddingVertical={16}
  paddingHorizontal={16}
  sensitivity={150}
  selectStyle={{}}
  selectAnimation="shake"
  customAnimation = {
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
    style: (animation) => {
      let onSelectScaleAnimation = {}
      let scale = animation.interpolate({
        inputRange: [0, .6, 1], // only 0 to 1
        outputRange: [1, 1.07, 1.04],
      });
      onSelectScaleAnimation = {
        transform: [{
          scale: scale,
        }],
      }
      return onSelectScaleAnimation;
    }
  }
  onDragStart={() => {
    console.log('onDragStart')
  }}
  onDragRelease={(data) => {
    console.log('onDragRelease')
  }}

  renderItem={(item, index) => {
    return (
      <View uniqueKey={item.id} onTap={(item, index) => {
        console.log(item, index);
      }}>
        <Text>{item.id}</Text>
      </View>
    )
  }}

  itemCoverStyle={{marginTop: -8, marginLeft: -8}}

  renderItemCover={(item, index) => {
    return (
      <TouchableOpacity style={{backgroundColor: 'blue'}}>
        <Text>{item.id}</Text>
      </TouchableOpacity>
    )
  }}

  renderLockItem={(item, index) => {
    return (
      <View uniqueKey={`${item.id}`} onTap={() => {
        console.log(index);
      }}>
        <Text>{item.id}</Text>
      </View>
    )
  }}

  lockItemCoverStyle={{marginTop: -8, marginLeft: -8}}

  renderLockItemCover={(item, index) => {
    return (
      <TouchableOpacity style={{backgroundColor: 'blue'}}>
        <Text>{item.id}</Text>
      </TouchableOpacity>
    )
  }}
/>

```

## Properties
*Note: Other properties will be passed down to underlying component.*

| Props | Type | Description | Default |
|---|---|---|---|
|**`data`**|Array|Data's item will be param in renderItem function.|*None*|
|**`lockData`**|Array|Lock Data's item will be param in renderLockItem function. Lock item can't be drag and drog |*None*|
|**`numPerRow`**|Number|How many items should be render on one row |`3`|
|**`aspectRatio`**|Number|The aspect ratio. If aspectRatio value is 1.2, it means that height = width * 1.2. |`1`|
|**`gapWidth`**|Number|The gap between each item. |`16`|
|**`paddingVertical`**|Number|Container's paddingVertical. |`16`|
|**`paddingHorizontal`**|Number|Container's paddingHorizontal. |`16`|
|**`sensitivity`**|Number|Detection time, while user moving the item.  |`150 (milisecond)`|
|**`selectAnimation`**|String|The animation when user begin to drag. Valid values: `none`, `scale`, `shake`.  |`scale`|
|**`selectStyle`**|Object|Add some style to dragging item. |```{
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  elevation: 5,
}```|
|**`customAnimation`**|Object|The way to custom select animation. There have three flag in customAnimation, startTimingOption, endTimingOption and style (function). startTimingOption and endTimingOption can set Animated.timing's option, and style is the function that you can set animation interpolate and return animated style. |*None*|
|**`onDragStart`**|Function|When user start to drag item, this function will be trigger. |*None*|
|**`onDragRelease`**|Function|When user drog item, this function will be trigger. The has two params can be use in callback, current item's info and item's index in data array. |*None*|
|**`renderItem`**|Function|Item's layout. The has two params can be use in callback, current item's info and item's index in data array. |*None*|
|**`itemCoverStyle`**|Object|Add custom style to item's cover component. |*None*|
|**`renderItemCover`**|Function|Item's cover layout. This props that user can't create an layout over item's layout, it means item's cover layout won't be hidden while it overflow the item's layout. |*None*|
|**`renderLockItem`**|Function|Lock item's layout. The Lock item can't be sortable (can't drag and drog) and can't drag normal items to lock items's sequence. The has two params can be use in callback, current item's info and item's index in data array. |*None*|
|**`lockItemCoverStyle`**|Object|Add custom style to lock item's cover component. |*None*|
|**`renderLockItemCover`**|Function|Lock item's cover layout. This props that user can't create an layout over lock item's layout, it means lock item's cover layout won't be hidden while it overflow the lock item's layout.  |*None*|
