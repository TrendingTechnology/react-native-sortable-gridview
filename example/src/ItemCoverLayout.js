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


const ItemCoverLayout = () => {
  return (
    <View>
      <Text style={styles.title}>Item cover layout</Text>
      <SortableGridview
        data={[
          {name: 'box1', backgroundColor: '#09f', color: '#fff'},
          {name: 'box2', backgroundColor: '#f60', color: '#fff'},
          {name: 'box3', backgroundColor: '#333', color: '#fff'},
          {name: 'box4', backgroundColor: '#rgba(255, 216, 58, 1)', color: '#333'},
          {name: 'box5', backgroundColor: '#rgba(0, 222, 144, 1)', color: '#fff'},
        ]}
        onDragStart={() => {
          console.log('ItemCoverLayout onDragStart');
        }}
        onDragRelease={(data) => {
          console.log('ItemCoverLayout onDragRelease', data);
        }}
        renderItem={(item, index) => {
          return (
            <View uniqueKey={item.name} style={[styles.item, {backgroundColor: item.backgroundColor}]}>
              <Text style={[styles.text, {color: item.color}]}>{item.name}</Text>
            </View>
          )
        }}
        itemCoverStyle={{marginTop: -8, marginLeft: -8}}
        renderItemCover={(item, index) => {
          return (
            <TouchableOpacity
              style={styles.cover}
              onPress={() => {
                Alert.alert(`On Press ${item.name} Cover!`);
              }}
            >
              <Text style={{color: item.backgroundColor}}>{item.name} cover</Text>
            </TouchableOpacity>
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
  text: {
    fontSize: 20,
    color: '#09f',
  },
  cover: {
    backgroundColor: '#666',
    padding: 4,
  }
});

export default ItemCoverLayout;
