
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../styles/colors';

export function Loading() {
  return (
    <View style={styles.loading}>
      <Text style={styles.text}>Loading the Jobs...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grayDark,
  },
});
