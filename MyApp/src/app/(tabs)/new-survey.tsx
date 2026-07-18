import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NewSurveyScreen() {
  const router = useRouter();
  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(''); // 'Low', 'Medium', 'High'
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    let newErrors: { [key: string]: string } = {};
    if (!siteName.trim()) newErrors.siteName = 'Site Name is required';
    if (!clientName.trim()) newErrors.clientName = 'Client Name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!priority) newErrors.priority = 'Priority must be selected';
    if (!date.trim()) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      Alert.alert(
        'Success',
        'Survey created successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Reset form
              setSiteName('');
              setClientName('');
              setDescription('');
              setPriority('');
              setErrors({});
              router.push('/(tabs)');
            } 
          }
        ]
      );
    } else {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create New Survey</Text>
          <Text style={styles.headerSubtitle}>Fill out the details for the new site inspection.</Text>
        </View>

        {/* Site Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Site Name *</Text>
          <View style={[styles.inputContainer, errors.siteName && styles.inputError]}>
            <MaterialIcons name="place" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter site name"
              value={siteName}
              onChangeText={(text) => {
                setSiteName(text);
                if (errors.siteName) setErrors({ ...errors, siteName: '' });
              }}
            />
          </View>
          {errors.siteName && <Text style={styles.errorText}>{errors.siteName}</Text>}
        </View>

        {/* Client Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client Name *</Text>
          <View style={[styles.inputContainer, errors.clientName && styles.inputError]}>
            <MaterialIcons name="person" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter client name"
              value={clientName}
              onChangeText={(text) => {
                setClientName(text);
                if (errors.clientName) setErrors({ ...errors, clientName: '' });
              }}
            />
          </View>
          {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}
        </View>

        {/* Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date *</Text>
          <View style={[styles.inputContainer, errors.date && styles.inputError]}>
            <MaterialIcons name="event" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={(text) => {
                setDate(text);
                if (errors.date) setErrors({ ...errors, date: '' });
              }}
            />
          </View>
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        </View>

        {/* Priority */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority *</Text>
          <View style={styles.priorityContainer}>
            {['Low', 'Medium', 'High'].map((p) => (
              <Pressable
                key={p}
                style={[
                  styles.priorityButton,
                  priority === p && styles.priorityButtonActive,
                  priority === p && p === 'Low' && { backgroundColor: '#10B981', borderColor: '#10B981' },
                  priority === p && p === 'Medium' && { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
                  priority === p && p === 'High' && { backgroundColor: '#EF4444', borderColor: '#EF4444' },
                ]}
                onPress={() => {
                  setPriority(p);
                  if (errors.priority) setErrors({ ...errors, priority: '' });
                }}
              >
                <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>{p}</Text>
              </Pressable>
            ))}
          </View>
          {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer, errors.description && styles.inputError]}>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the survey purpose or initial findings..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
            />
          </View>
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Submit Button */}
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Survey</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    height: '100%',
  },
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    width: '100%',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderWidth: 0,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  priorityTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
