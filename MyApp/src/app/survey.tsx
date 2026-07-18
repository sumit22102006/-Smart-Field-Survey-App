import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SurveyPreviewScreen() {
  const router = useRouter();

  // Mock Data for the preview
  const mockSurvey = {
    id: 'SRV-8942',
    siteName: 'Downtown Commercial Plaza',
    clientName: 'Acme Corp',
    date: '2026-07-18',
    priority: 'High',
    description: 'Initial structural inspection of the main lobby and eastern facade. Minor water damage observed near the entrance.',
    location: { lat: '40.7128', lng: '-74.0060' },
    inspector: 'Sumit Kumar',
  };

  const handleSubmit = () => {
    Alert.alert(
      'Survey Submitted',
      'The survey report has been successfully submitted to the server.',
      [
        { text: 'OK', onPress: () => router.push('/(tabs)') }
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Survey Preview</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.statusBanner}>
          <MaterialIcons name="info-outline" size={20} color="#3B82F6" style={{marginRight: 8}} />
          <Text style={styles.statusText}>Please review the survey details before final submission.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.surveyId}>{mockSurvey.id}</Text>
              <Text style={styles.siteName}>{mockSurvey.siteName}</Text>
            </View>
            <View style={[styles.priorityPill, { backgroundColor: getPriorityColor(mockSurvey.priority) }]}>
              <Text style={styles.priorityText}>{mockSurvey.priority}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="person" size={16} color="#6B7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Client</Text>
              <Text style={styles.detailValue}>{mockSurvey.clientName}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <MaterialIcons name="event" size={16} color="#6B7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{mockSurvey.date}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <FontAwesome5 name="map-marker-alt" size={16} color="#6B7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{mockSurvey.location.lat}, {mockSurvey.location.lng}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <MaterialIcons name="engineering" size={16} color="#6B7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Inspector</Text>
              <Text style={styles.detailValue}>{mockSurvey.inspector}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.descriptionLabel}>Description / Notes</Text>
          <Text style={styles.descriptionText}>{mockSurvey.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.descriptionLabel}>Attachments</Text>
          <View style={styles.attachmentsContainer}>
            <View style={styles.attachmentThumb}>
              <Ionicons name="image" size={24} color="#9CA3AF" />
              <Text style={styles.attachmentCount}>1 Photo</Text>
            </View>
          </View>

        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <MaterialIcons name="cloud-upload" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.submitButtonText}>Submit Final Survey</Text>
        </Pressable>
        
        <Pressable style={styles.editButton} onPress={() => router.back()}>
          <Text style={styles.editButtonText}>Edit Details</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    padding: 20,
    paddingBottom: 40,
  },
  statusBanner: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    color: '#1E3A8A',
    fontSize: 14,
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  surveyId: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  siteName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    maxWidth: '80%',
  },
  priorityPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  attachmentThumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  attachmentCount: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  editButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
});
