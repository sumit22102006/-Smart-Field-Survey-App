import React from 'react';
import { View, Text } from 'react-native';

export const Marker = (props: any) => null;

export const MapView = (props: any) => (
  <View style={[{ backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }, props.style]}>
    <Text style={{ color: '#6B7280', textAlign: 'center' }}>
      Interactive maps are not supported on the Web preview.
    </Text>
  </View>
);

export default MapView;
