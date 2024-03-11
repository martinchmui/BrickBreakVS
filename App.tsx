import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import SquareContainer from './SquareContainer';
import KeepAwake from 'react-native-keep-awake';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.flexContainer}>
      <View style={styles.gameContainer}>
        <SquareContainer />
        <KeepAwake />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
