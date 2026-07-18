import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Dashboard',
            title: 'Dashboard',
            headerShown: false, // Tabs will have their own header
          }}
        />
        <Drawer.Screen
          name="survey"
          options={{
            drawerLabel: 'Survey',
            title: 'Survey Preview',
          }}
        />
        <Drawer.Screen
          name="camera"
          options={{
            drawerLabel: 'Camera',
            title: 'Camera',
          }}
        />
        <Drawer.Screen
          name="contacts"
          options={{
            drawerLabel: 'Contacts',
            title: 'Contacts',
          }}
        />
        <Drawer.Screen
          name="location"
          options={{
            drawerLabel: 'Location',
            title: 'Location',
          }}
        />
        <Drawer.Screen
          name="clipboard"
          options={{
            drawerLabel: 'Clipboard',
            title: 'Clipboard',
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Settings',
            title: 'Settings',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
