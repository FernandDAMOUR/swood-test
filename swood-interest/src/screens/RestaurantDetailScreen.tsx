import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Restaurant } from '../types/restaurant';
import { RestaurantHeader } from '../components/restaurant/RestaurantHeader';
import { QuickActions } from '../components/restaurant/QuickActions';
import { InfoSection } from '../components/restaurant/InfoSection';
import { AboutSection } from '../components/restaurant/AboutSection';
import { FeaturesSection } from '../components/restaurant/FeaturesSection';

type RootStackParamList = {
  Map: undefined;
  List: undefined;
  RestaurantDetail: { restaurant: Restaurant };
};

type RestaurantDetailRouteProp = RouteProp<RootStackParamList, 'RestaurantDetail'>;

export const RestaurantDetailScreen = () => {
  const route = useRoute<RestaurantDetailRouteProp>();
  const { restaurant } = route.params;

  return (
    <ScrollView style={styles.container}>
      <RestaurantHeader restaurant={restaurant} />
      <View style={styles.content}>
        <InfoSection restaurant={restaurant} />
        <AboutSection restaurant={restaurant} />
        <FeaturesSection  />
      <QuickActions restaurant={restaurant} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? '#F2F2F7' : '#F5F5F5',
  },
  content: {
    padding: 16,
    ...(Platform.OS === 'android' && {
      marginTop: -50,
    }),
  },
});