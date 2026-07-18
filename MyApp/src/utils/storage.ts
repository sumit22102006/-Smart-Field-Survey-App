import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Survey {
  id: string;
  site: string;
  clientName: string;
  description: string;
  date: string;
  status: string;
  priority: string;
}

const STORAGE_KEY = '@surveys_history';

// Default mock data to show if the user hasn't created any surveys yet
const DEFAULT_HISTORY: Survey[] = [
  { id: 'SRV-8942', site: 'Downtown Commercial Plaza', clientName: 'City Council', description: 'Annual structural check.', date: '2026-07-18', status: 'Completed', priority: 'High' },
  { id: 'SRV-8941', site: 'Westside Residential Complex', clientName: 'Westside HOA', description: 'Plumbing inspection.', date: '2026-07-16', status: 'Completed', priority: 'Medium' },
];

export const getSurveys = async (): Promise<Survey[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    // If null, return default mock history
    return DEFAULT_HISTORY;
  } catch (e) {
    console.error('Error reading surveys', e);
    return [];
  }
};

export const addSurvey = async (newSurvey: Omit<Survey, 'id' | 'status'>) => {
  try {
    const currentSurveys = await getSurveys();
    const surveyWithId: Survey = {
      ...newSurvey,
      id: `SRV-${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'Pending Review', // Default status for new surveys
    };
    
    // Add to the beginning of the list
    const updatedSurveys = [surveyWithId, ...currentSurveys];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSurveys));
    return true;
  } catch (e) {
    console.error('Error saving survey', e);
    return false;
  }
};

export const clearSurveys = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing surveys', e);
  }
};
