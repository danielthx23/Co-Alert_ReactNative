import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Usuario } from '../models/usuario';

interface CustomDrawerProps extends DrawerContentComponentProps {
  usuarioLogado: Usuario | null;
}

export const CustomDrawer: React.FC<CustomDrawerProps> = (props) => {
  const { usuarioLogado, ...drawerProps } = props;

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...drawerProps}>
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {usuarioLogado?.nmUsuario?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{usuarioLogado?.nmUsuario}</Text>
          <Text style={styles.userEmail}>{usuarioLogado?.nmEmail}</Text>
        </View>
        <DrawerItemList {...drawerProps} />
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  userSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d2d',
    marginBottom: 8,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff4c4c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#666',
    fontSize: 14,
  },
}); 