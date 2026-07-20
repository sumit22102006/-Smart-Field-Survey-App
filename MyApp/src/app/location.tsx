import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Platform, Linking, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapView, { Marker } from '../components/Map';

export default function LocationScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchLocation = async () => {
    setIsFetching(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied.');
        setIsFetching(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
    } catch (error) {
      setErrorMsg('Failed to fetch location. Please ensure location services are enabled.');
    } finally {
      setIsFetching(false);
    }
  };

  const openInMaps = () => {
    if (!location) return;
    const { latitude, longitude } = location.coords;
    const label = 'Survey Site';
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`
    });
    
    if (url) {
      Linking.openURL(url).catch(() => {
        setErrorMsg('Could not open the maps application.');
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Site Location</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {!location ? (
          <>
            <View style={styles.mapIllustrationContainer}>
              <View style={styles.mapCircle}>
                <FontAwesome5 name="map-marker-alt" size={48} color="#EF4444" />
              </View>
            </View>
            <Text style={styles.description}>
              Fetch the exact GPS coordinates for this survey site to ensure accurate tracking and reporting.
            </Text>
          </>
        ) : (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Survey Site"
                description="Current Location"
              />
            </MapView>
          </View>
        )}

        {errorMsg ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {location && (
          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Latitude:</Text>
              <Text style={styles.locationValue}>{location.coords.latitude.toFixed(6)}°</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Longitude:</Text>
              <Text style={styles.locationValue}>{location.coords.longitude.toFixed(6)}°</Text>
            </View>
          </View>
        )}

        <View style={styles.actionContainer}>
          <Pressable 
            style={[styles.primaryButton, isFetching && styles.disabledButton]} 
            onPress={fetchLocation}
            disabled={isFetching}
          >
            {isFetching ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="my-location" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>
                  {location ? 'Refresh Location' : 'Get Current Location'}
                </Text>
              </>
            )}
          </Pressable>

          {location && (
            <Pressable style={styles.secondaryButton} onPress={openInMaps}>
              <FontAwesome5 name="map" size={18} color="#4F46E5" style={styles.buttonIcon} />
              <Text style={styles.secondaryButtonText}>Open in Google/Apple Maps</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 10,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  mapIllustrationContainer: {
    marginVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  mapContainer: {
    width: Dimensions.get('window').width - 48,
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    color: '#EF4444',
    marginLeft: 8,
    flex: 1,
  },
  locationCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  locationLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  locationValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  actionContainer: {
    width: '100%',
    marginTop: 'auto',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
