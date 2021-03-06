/* eslint-disable import/prefer-default-export */
import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import { THEME } from '../theme';

export const Directory = ({ directory, onForward, company }) => (
  <TouchableOpacity activeOpacity={0.5} onPress={() => onForward(directory)}>
    <View style={styles.container}>
      <Text style={{
        fontFamily: 'poppins-regular',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: company.mainColor,
        paddingVertical: 20,
        marginVertical: 1,
        width: '90%',
        borderWidth: 1,
        color: THEME.MAIN_FONT_COLOR,
        borderRadius: 10,
      }}
      >
        {directory.title}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
