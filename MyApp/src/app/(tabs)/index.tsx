import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSurveys, Survey } from '../../utils/storage';

export default function DashboardScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [recentSurveys, setRecentSurveys] = useState<Survey[]>([]);
  const [todaysCount, setTodaysCount] = useState(0);

  const loadData = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) setProfileImage(savedImage);
      
      const allSurveys = await getSurveys();
      setRecentSurveys(allSurveys.slice(0, 3));
      
      const today = new Date().toISOString().split('T')[0];
      const todaySurveys = allSurveys.filter(s => s.date === today);
      setTodaysCount(todaySurveys.length);
    } catch (e) {
      console.log('Error loading data', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const navigateTo = (route: any) => {
    router.push(route);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Screen & Student Details */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.studentName}>Sumit Kumar</Text>
          <Text style={styles.studentDetails}>ID: SFS-2026 • Computer Science</Text>
        </View>
        <Pressable onPress={() => navigateTo('/(tabs)/profile')} style={styles.avatarContainer}>
          <Image 
            source={profileImage ? { uri: profileImage } : require('../../../assets/images/profile.jpg')} 
            style={styles.avatarImage} 
          />
        </Pressable>
      </View>

      {/* Today's Survey Count */}
      <View style={styles.statsCard}>
        <View style={styles.statInfo}>
          <Text style={styles.statLabel}>Today's Surveys</Text>
          <Text style={styles.statValue}>{todaysCount}</Text>
        </View>
        <View style={styles.statIconContainer}>
          <FontAwesome name="check-circle" size={32} color="#10B981" />
        </View>
      </View>

      {/* Quick Action Cards */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <Pressable style={styles.actionCard} onPress={() => navigateTo('/new-survey')}>
          <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
            <MaterialIcons name="add-task" size={24} color="#4F46E5" />
          </View>
          <Text style={styles.actionText}>New Survey</Text>
        </Pressable>
        
        <Pressable style={styles.actionCard} onPress={() => navigateTo('/camera')}>
          <View style={[styles.iconBox, { backgroundColor: '#FCE7F3' }]}>
            <Ionicons name="camera" size={24} color="#DB2777" />
          </View>
          <Text style={styles.actionText}>Take Photo</Text>
        </Pressable>

        <Pressable style={styles.actionCard} onPress={() => navigateTo('/location')}>
          <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}>
            <MaterialIcons name="location-pin" size={24} color="#059669" />
          </View>
          <Text style={styles.actionText}>Location</Text>
        </Pressable>

        <Pressable style={styles.actionCard} onPress={() => navigateTo('/contacts')}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="people" size={24} color="#D97706" />
          </View>
          <Text style={styles.actionText}>Contacts</Text>
        </Pressable>
      </View>

      {/* Recent Survey Summary */}
      <Text style={styles.sectionTitle}>Recent Surveys</Text>
      <View style={styles.recentList}>
        {recentSurveys.length > 0 ? recentSurveys.map((item) => (
          <View key={item.id} style={styles.recentItem}>
            <View style={styles.recentIcon}>
              <MaterialIcons name="assignment" size={20} color="#6B7280" />
            </View>
            <View style={styles.recentDetails}>
              <Text style={styles.recentTitle}>{item.id}</Text>
              <Text style={styles.recentSubtitle}>Client: {item.clientName}</Text>
            </View>
            <Text style={styles.recentDate}>{item.date}</Text>
          </View>
        )) : (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#6B7280' }}>No recent surveys.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 14,
    color: '#4B5563',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
  },
  statIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  recentList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentDetails: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  recentSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  recentDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
