import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation, hasUnreadNotifications }) => {
  const tabWidth = width / state.routes.length;
  const activeIndex = state.index;
  const curveCenter = tabWidth * activeIndex + tabWidth / 2;

  const getPath = () => {
    const height = 80;
    const curveRadius = 40;
    const curveWidth = 70;
    const curveDepth = 35;

    return `
      M0 0
      H${curveCenter - curveWidth / 1}
      C${curveCenter - curveWidth / 2} 0, ${curveCenter - curveRadius} ${curveDepth}, ${curveCenter} ${curveDepth}
      C${curveCenter + curveRadius} ${curveDepth}, ${curveCenter + curveWidth / 2} 0, ${curveCenter + curveWidth / 1} 0
      H${width}
      V${height}
      H0
      Z
    `;
  };

  return (
    <View style={styles.container}>
      <Svg width={width} height={80} style={StyleSheet.absoluteFill}>
        <Path d={getPath()} fill="#1E2C3A" />
      </Svg>

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        let iconName = 'home';
        switch (route.name) {
          case 'Community':
            iconName = 'people';
            break;
          case 'Emergency':
            iconName = 'call';
            break;
          case 'Notifications':
            iconName = 'notifications';
            break;
          case 'Profile':
            iconName = 'person';
            break;
        }

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        const tabPosition = tabWidth * index + tabWidth / 2 - 30;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabButton,
              { left: tabPosition },
              isFocused && styles.activeTabButton,
            ]}
          >
            <View style={[styles.iconContainer, isFocused && styles.activeIcon]}>
              <Ionicons
                name={iconName}
                size={26}
                color="#fff"
              />
                  {route.name === 'Notifications' && hasUnreadNotifications && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: -4,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'red',
                }}
              />
            )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width,
    height: 80,
  },
  tabButton: {
    position: 'absolute',
    top: 10,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    top: -20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIcon: {
    backgroundColor: '#567C8D',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
});

export default CustomTabBar;


