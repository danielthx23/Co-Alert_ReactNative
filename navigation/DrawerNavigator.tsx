import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainerRef } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { Usuario } from '../models/usuario';
import { CustomDrawer } from '../components/CustomDrawer';

const Drawer = createDrawerNavigator();

interface DrawerNavigatorProps {
  usuarioLogado: Usuario | null;
  navigationRef: React.RefObject<NavigationContainerRef<any>>;
}

const DrawerNavigator: React.FC<DrawerNavigatorProps> = ({ usuarioLogado, navigationRef }) => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} usuarioLogado={usuarioLogado} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#1c1c1c',
        },
        drawerLabelStyle: {
          color: '#fff',
        },
        drawerActiveBackgroundColor: '#ff4c4c',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#666',
        sceneContainerStyle: { backgroundColor: '#131315' },
      }}
    >
      <Drawer.Screen
        name="HomeScreen"
        component={() => <HomeScreen navigationRef={navigationRef} />}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
          drawerLabel: 'Início',
        }}
      />
      // ... rest of the code ...
    </Drawer.Navigator>
  );
};

export default DrawerNavigator; 