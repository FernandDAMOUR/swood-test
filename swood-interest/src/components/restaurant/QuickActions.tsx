import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import { Restaurant } from '../../types/restaurant';

interface QuickActionsProps {
  restaurant: Restaurant;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ restaurant }) => {
  const openMaps = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${restaurant.latitude},${restaurant.longitude}`,
      android: `geo:0,0?q=${restaurant.latitude},${restaurant.longitude}(${encodeURIComponent(restaurant.name)})`,
    });
    if (url) {
      Linking.openURL(url);
    }
  };

  const callPhone = () => {
    if (restaurant.phone) {
      Linking.openURL(`tel:${restaurant.phone}`);
    }
  };

  const openWebsite = () => {
    if (restaurant.website) {
      Linking.openURL(restaurant.website);
    }
  };

  if (Platform.OS === 'ios') {
    return (
      <View style={styles.actionsContainerIOS}>
        {restaurant.phone && (
          <TouchableOpacity style={styles.actionButtonIOS} onPress={callPhone}>
            <View style={styles.actionIconContainerIOS}>
              <Text style={styles.actionIconIOS}>📞</Text>
            </View>
            <Text style={styles.actionLabelIOS}>Appeler</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionButtonIOS} onPress={openMaps}>
          <View style={styles.actionIconContainerIOS}>
            <Text style={styles.actionIconIOS}>🧭</Text>
          </View>
          <Text style={styles.actionLabelIOS}>Itinéraire</Text>
        </TouchableOpacity>
        {restaurant.website && (
          <TouchableOpacity style={styles.actionButtonIOS} onPress={openWebsite}>
            <View style={styles.actionIconContainerIOS}>
              <Text style={styles.actionIconIOS}>🌐</Text>
            </View>
            <Text style={styles.actionLabelIOS}>Site web</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.actionsContainerAndroid}>
      {restaurant.phone && (
        <TouchableOpacity style={styles.actionCardAndroid} onPress={callPhone}>
          <Text style={styles.actionIconAndroid}>📞</Text>
          <Text style={styles.actionLabelAndroid}>Appeler</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.actionCardAndroid} onPress={openMaps}>
        <Text style={styles.actionIconAndroid}>🧭</Text>
        <Text style={styles.actionLabelAndroid}>Itinéraire</Text>
      </TouchableOpacity>
      {restaurant.website && (
        <TouchableOpacity style={styles.actionCardAndroid} onPress={openWebsite}>
          <Text style={styles.actionIconAndroid}>🌐</Text>
          <Text style={styles.actionLabelAndroid}>Site web</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // iOS Styles
  actionsContainerIOS: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#C6C6C8',
  },
  actionButtonIOS: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainerIOS: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconIOS: {
    fontSize: 24,
  },
  actionLabelIOS: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },

  // Android Styles
  actionsContainerAndroid: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    elevation: 2,
    marginHorizontal: 16,
    marginTop: -40,
    borderRadius: 8,
    zIndex: 10,
  },
  actionCardAndroid: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  actionIconAndroid: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionLabelAndroid: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
