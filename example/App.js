/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import SortableGridview from 'react-native-sortable-gridview';

import Default from './src/Default';
import CustomLayout from './src/CustomLayout';
import CustomSensitivity from './src/CustomSensitivity';
import ChangeSelectAnimationSelectStyle from './src/ChangeSelectAnimationSelectStyle';
import CustomAnimation from './src/CustomAnimation';
import ItemCoverLayout from './src/ItemCoverLayout';
import LockItemLayout from './src/LockItemLayout';
import LockItemCoverLayout from './src/LockItemCoverLayout';
import FinalExample from './src/FinalExample';

const App = () => {
  return (
    <Fragment >
      <View style={{paddingTop: 84}}>
        {/* <Default /> */}
        {/* <CustomLayout /> */}
        {/* <CustomSensitivity /> */}
        {/* <ChangeSelectAnimationSelectStyle /> */}
        {/* <CustomAnimation /> */}
        {/* <ItemCoverLayout /> */}
        {/* <LockItemLayout /> */}
        {/* <LockItemCoverLayout /> */}
        <FinalExample />
      </View>
    </Fragment>
  );
};

export default App;
