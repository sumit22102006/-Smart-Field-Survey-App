import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ClipboardScreen() {
  const router = useRouter();
  const [textToCopy, setTextToCopy] = useState('');
  const [pastedText, setPastedText] = useState('');

  const copyToClipboard = async () => {
    if (!textToCopy.trim()) {
      Alert.alert('Empty Input', 'Please enter some text to copy.');
      return;
    }
    await Clipboard.setStringAsync(textToCopy);
    Alert.alert('Success', 'Text copied to clipboard!');
  };

  const pasteFromClipboard = async () => {
    const hasString = await Clipboard.hasStringAsync();
    if (hasString) {
      const text = await Clipboard.getStringAsync();
      setPastedText(text);
    } else {
      Alert.alert('Clipboard Empty', 'There is no text in your clipboard to paste.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Clipboard Tool</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Use this tool to quickly copy standard survey templates or paste data from other apps.
        </Text>

        {/* Copy Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="copy" size={16} color="#4F46E5" />
            <Text style={styles.cardTitle}>Copy Text</Text>
          </View>
          <TextInput
            style={styles.inputArea}
            placeholder="Type or paste text here to copy..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={textToCopy}
            onChangeText={setTextToCopy}
          />
          <Pressable style={styles.primaryButton} onPress={copyToClipboard}>
            <MaterialIcons name="content-copy" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Copy to Clipboard</Text>
          </Pressable>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerIconContainer}>
            <MaterialIcons name="swap-vert" size={20} color="#9CA3AF" />
          </View>
          <View style={styles.dividerLine} />
        </View>

        {/* Paste Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="paste" size={16} color="#059669" />
            <Text style={styles.cardTitle}>Paste Text</Text>
          </View>
          <Pressable style={styles.secondaryButton} onPress={pasteFromClipboard}>
            <MaterialIcons name="content-paste" size={20} color="#059669" style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Paste from Clipboard</Text>
          </Pressable>
          
          <View style={styles.pastedAreaContainer}>
            {pastedText ? (
              <Text style={styles.pastedText}>{pastedText}</Text>
            ) : (
              <Text style={styles.pastedPlaceholder}>Pasted text will appear here...</Text>
            )}
          </View>
          
          {pastedText ? (
            <Pressable style={styles.clearButton} onPress={() => setPastedText('')}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
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
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  inputArea: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    minHeight: 100,
    marginBottom: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: '#059669',
    fontSize: 15,
    fontWeight: '600',
  },
  pastedAreaContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    minHeight: 100,
  },
  pastedText: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
  },
  pastedPlaceholder: {
    fontSize: 15,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  clearButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    padding: 8,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
});
