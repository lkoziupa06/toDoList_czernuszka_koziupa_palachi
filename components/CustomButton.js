// CustomButton.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#7B7263',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#C4C5C7',
    fontSize: 16,
  },
});

export default CustomButton;
