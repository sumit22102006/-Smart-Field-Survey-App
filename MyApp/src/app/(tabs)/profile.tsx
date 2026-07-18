import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Platform } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) setProfileImage(savedImage);
    } catch (e) {
      console.log('Error loading image', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileImage();
    }, [])
  );

  const handleLogout = () => {
    alert("Logged out successfully");
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem('profileImage', uri);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <Pressable onPress={pickImage} style={styles.avatarContainer}>
          <Image 
            source={profileImage ? { uri: profileImage } : require('../../../assets/images/profile.jpg')} 
            style={styles.avatarImage} 
          />
          <View style={styles.editIconContainer}>
            <MaterialIcons name="edit" size={16} color="#FFFFFF" />
          </View>
        </Pressable>
        <Text style={styles.userName}>Sumit Kumar</Text>
        <Text style={styles.userRole}>Lead Field Inspector</Text>
        <View style={styles.badgeContainer}>
          <MaterialIcons name="verified" size={16} color="#4F46E5" />
          <Text style={styles.badgeText}>Verified Account</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>124</Text>
          <Text style={styles.statLabel}>Surveys</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>4.9</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.menuHeader}>Account Settings</Text>
        
        <Pressable style={styles.menuItem}>
          <View style={[styles.menuIconBox, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="person" size={20} color="#4F46E5" />
          </View>
          <Text style={styles.menuText}>Personal Information</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <View style={[styles.menuIconBox, { backgroundColor: '#ECFDF5' }]}>
            <MaterialIcons name="notifications" size={20} color="#10B981" />
          </View>
          <Text style={styles.menuText}>Notifications</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <View style={[styles.menuIconBox, { backgroundColor: '#FEF2F2' }]}>
            <FontAwesome5 name="shield-alt" size={16} color="#EF4444" />
          </View>
          <Text style={styles.menuText}>Security & Privacy</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </Pressable>
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.menuHeader}>Support</Text>
        
        <Pressable style={styles.menuItem}>
          <View style={[styles.menuIconBox, { backgroundColor: '#F3F4F6' }]}>
            <MaterialIcons name="help-center" size={20} color="#4B5563" />
          </View>
          <Text style={styles.menuText}>Help Center</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={handleLogout}>
          <View style={[styles.menuIconBox, { backgroundColor: '#FEF2F2' }]}>
            <MaterialIcons name="logout" size={20} color="#EF4444" />
          </View>
          <Text style={[styles.menuText, { color: '#EF4444' }]}>Log Out</Text>
        </Pressable>
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4F46E5',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginVertical: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  menuHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
});
