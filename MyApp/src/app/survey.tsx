import { View, Text, StyleSheet } from 'react-native';

export default function SurveyScreen() {
  return (
    <View style={styles.container}>
      <Text>Survey Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' } 
});
