const fs = require('fs');
const path = require('path');

const src = 'src/app';
const tabs = path.join(src, '(tabs)');

fs.mkdirSync(tabs, { recursive: true });

const createScreen = (filepath, name) => {
  const content = `import { View, Text, StyleSheet } from 'react-native';

export default function ${name.replace(/[^a-zA-Z0-9]/g, '')}Screen() {
  return (
    <View style={styles.container}>
      <Text>${name} Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' } 
});
`;
  fs.writeFileSync(filepath, content);
};

// Drawer screens
createScreen(path.join(src, 'survey.tsx'), 'Survey');
createScreen(path.join(src, 'camera.tsx'), 'Camera');
createScreen(path.join(src, 'contacts.tsx'), 'Contacts');
createScreen(path.join(src, 'location.tsx'), 'Location');
createScreen(path.join(src, 'clipboard.tsx'), 'Clipboard');
createScreen(path.join(src, 'settings.tsx'), 'Settings');

// Tabs screens
createScreen(path.join(tabs, 'index.tsx'), 'Dashboard');
createScreen(path.join(tabs, 'new-survey.tsx'), 'New Survey');
createScreen(path.join(tabs, 'history.tsx'), 'History');
createScreen(path.join(tabs, 'profile.tsx'), 'Profile');
