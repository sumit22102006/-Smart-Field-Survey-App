import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator, TextInput, Platform } from 'react-native';
import * as Contacts from 'expo-contacts';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ContactsScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contacts.Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchContacts = async () => {
    setIsFetching(true);
    setErrorMsg(null);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access contacts was denied.');
        setIsFetching(false);
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        sort: Contacts.SortTypes.FirstName,
      });

      if (data.length > 0) {
        setContacts(data);
        setFilteredContacts(data);
        setHasFetched(true);
      } else {
        setErrorMsg('No contacts found on this device.');
      }
    } catch (error) {
      setErrorMsg('Failed to fetch contacts.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredContacts(contacts);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = contacts.filter(c => {
      const nameMatch = c.name?.toLowerCase().includes(lowerQuery);
      const phoneMatch = c.phoneNumbers?.some(p => p.number?.includes(lowerQuery));
      return nameMatch || phoneMatch;
    });
    setFilteredContacts(filtered);
  };

  const selectContact = (contact: Contacts.Contact) => {
    // In a real application, you might pass this back to a form or save it
    alert(`Selected: ${contact.name}`);
  };

  const renderContactItem = ({ item }: { item: Contacts.Contact }) => {
    const phoneNumber = item.phoneNumbers?.[0]?.number || 'No phone number';
    const initials = item.name ? item.name.substring(0, 2).toUpperCase() : '?';

    return (
      <Pressable style={styles.contactCard} onPress={() => selectContact(item)}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name || 'Unknown Contact'}</Text>
          <Text style={styles.contactPhone}>{phoneNumber}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Select Contact</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {!hasFetched && !isFetching && (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIconContainer}>
              <Ionicons name="people" size={64} color="#6366F1" />
            </View>
            <Text style={styles.emptyStateTitle}>Access Your Contacts</Text>
            <Text style={styles.emptyStateDesc}>
              Sync your device contacts to quickly add site managers, clients, or team members to your surveys.
            </Text>
            <Pressable style={styles.primaryButton} onPress={fetchContacts}>
              <Text style={styles.primaryButtonText}>Sync Contacts</Text>
            </Pressable>
            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
          </View>
        )}

        {isFetching && (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Fetching contacts...</Text>
          </View>
        )}

        {hasFetched && (
          <>
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or number..."
                value={searchQuery}
                onChangeText={handleSearch}
                clearButtonMode="while-editing"
              />
            </View>
            
            <FlatList
              data={filteredContacts}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderContactItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No contacts found matching "{searchQuery}"</Text>
                </View>
              }
            />
          </>
        )}
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
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  emptyStateDesc: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#111827',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  separator: {
    height: 8,
  },
  noResultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 15,
    color: '#6B7280',
  },
});
