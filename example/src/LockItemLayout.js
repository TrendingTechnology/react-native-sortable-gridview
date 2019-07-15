import React, {Fragment} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import SortableGridview from 'react-native-sortable-gridview';


const LockItemLayout = () => {
  return (
    <View>
      <Text style={styles.title}>Lock item layout</Text>
      <SortableGridview
        data={[
          {name: 'box1', backgroundColor: '#09f', color: '#fff'},
          {name: 'box2', backgroundColor: '#f60', color: '#fff'},
          {name: 'box3', backgroundColor: '#333', color: '#fff'},
          {name: 'box4', backgroundColor: '#rgba(255, 216, 58, 1)', color: '#333'},
          {name: 'box5', backgroundColor: '#rgba(0, 222, 144, 1)', color: '#fff'},
        ]}
        lockData={[
          {name: 'lock box1'},
          {name: 'lock box2'},
          {name: 'lock box3'},
          {name: 'lock box4'},
        ]}
        onDragStart={() => {
          console.log('LockItemLayout onDragStart');
        }}
        onDragRelease={(data) => {
          console.log('LockItemLayout onDragRelease', data);
        }}
        renderItem={(item, index) => {
          return (
            <View
              uniqueKey={item.name}
              style={[styles.item, {backgroundColor: item.backgroundColor}]}
              onTap={() => {
                Alert.alert(`On Tap ${item.name}!`);
              }}
            >
              <Text style={[styles.text, {color: item.color}]}>{item.name}</Text>
            </View>
          )
        }}
        renderLockItem={(item, index) => {
          return (
            <View
              uniqueKey={`${item.name}`}
              style={styles.lockItem}
              onTap={() => {
                Alert.alert(`On Tap ${item.name}!`);
              }}
            >
              <Text>{item.name}</Text>
            </View>
          )
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  item: {
    borderRadius: 4,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lockItem: {
    borderRadius: 4,
    backgroundColor: '#aaa',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    color: '#09f',
  },
  cover: {
    backgroundColor: '#666',
    padding: 4,
  }
});

export default LockItemLayout;
