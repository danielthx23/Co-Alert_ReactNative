import React, { useRef, useState, useEffect, MutableRefObject, RefObject } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ToastMessage, { ToastMessageRef } from './components/Toast';
import { Usuario } from './models/usuario';
import { UsuarioScreen } from './screens/UsuarioScreen';
import { HomeScreen } from './screens/HomeScreen';
import { PostagemScreen } from './screens/PostagemScreen';
import { LocalizacaoScreen } from './screens/LocalizacaoScreen';
import { CategoriaDesastreScreen } from './screens/CategoriaDesastreScreen';
import { ComentarioScreen } from './screens/ComentarioScreen';
import { RootStackParamList, DrawerParamList } from './types/navigation';
import { usuarioService } from './services/usuario';

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNavigator({ usuarioLogado, toastRef, navigationRef }: { 
  usuarioLogado?: Usuario, 
  toastRef: RefObject<ToastMessageRef | null>, 
  navigationRef: RefObject<NavigationContainerRef<RootStackParamList> | null>
}) {
  const [menuVisible, setMenuVisible] = useState(false);

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user_token');
      toastRef.current?.show("Sessão encerrada", "Você foi deslogado com sucesso.", "info");
    } catch (error) {
      console.error("Erro ao remover token de usuário:", error);
      toastRef.current?.show("Erro", "Não foi possível encerrar a sessão.", "danger");
    } finally {
      setMenuVisible(false);
      setTimeout(() => {
        navigationRef.current?.navigate('UsuarioScreen');
      }, 1000);
    }
  };

  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#0c0c0c',
          },
          drawerLabelStyle: {
            fontSize: 16,
          },
          drawerItemStyle: {
            borderRadius: 0,
          },
          drawerActiveBackgroundColor: '#1b1b1b',
          drawerActiveTintColor: '#009b29',
          drawerInactiveTintColor: '#383838',
          headerStyle: {
            backgroundColor: '#0c0c0c',
            height: 100,
          },
          headerTitleStyle: {
            fontSize: 18,
          },
          headerTintColor: '#fff',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
              <TouchableOpacity
                style={styles.userButton}
                onPress={() => setMenuVisible(!menuVisible)}
              >
                <Text style={styles.userName}>
                  {usuarioLogado?.nmUsuario ?? ''}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#fff" />
              </TouchableOpacity>
              <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
              >
                <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={signOut}
                    >
                      <Text style={[styles.dropdownText, styles.dropdownTextSignOut]}>Sair</Text>
                    </TouchableOpacity>
                  </View>
                </Pressable>
              </Modal>
            </View>
          ),
        }}
      >
        <Drawer.Screen 
          name="HomeScreen" 
          component={HomeScreen}
          options={{ title: 'Início' }}
        />
        <Drawer.Screen 
          name="PostagemScreen" 
          component={PostagemScreen}
          options={{ title: 'Feed de Alertas' }}
        />
        <Drawer.Screen 
          name="CategoriaDesastreScreen" 
          component={CategoriaDesastreScreen}
          options={{ title: 'Categorias' }}
        />
        <Drawer.Screen 
          name="LocalizacaoScreen" 
          component={LocalizacaoScreen}
          options={{ title: 'Localizações' }}
        />
        <Drawer.Screen 
          name="ComentarioScreen" 
          component={ComentarioScreen}
          options={{ title: 'Comentários' }}
        />
      </Drawer.Navigator>
    </>
  );
}

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario>();
  const toastRef = useRef<ToastMessageRef>(null);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList> | null>(null);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        if (token) {
          const tokenParts = token.split(',');
          if (tokenParts.length === 2) {
            const [nmEmail, nrSenha] = tokenParts;
            const usuario = await usuarioService.autenticar({ nmEmail, nrSenha });
            setUsuarioLogado(usuario.data);
            navigationRef.current?.navigate('MainApp');
            toastRef.current?.show("Login efetuado!", "Bem-vindo(a) de volta.", "success");
          } else {
            console.error("Formato de token inválido.");
            toastRef.current?.show("Erro", "Token inválido.", "danger");
            navigationRef.current?.navigate('UsuarioScreen');
          }
        } else {
          navigationRef.current?.navigate('UsuarioScreen');
        }
      } catch (error) {
        console.error("Erro ao verificar token de sessão:", error);
        toastRef.current?.show("Erro", "Falha ao restaurar a sessão.", "danger");
        navigationRef.current?.navigate('UsuarioScreen');
      }
    };

    verificarToken();
  }, []);

  return (
    <View style={styles.container}>
      <ToastMessage
        ref={toastRef}
      />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="UsuarioScreen">
        <Stack.Screen name="UsuarioScreen">
          {props => <UsuarioScreen {...props} setUsuarioLogado={setUsuarioLogado} />}
        </Stack.Screen>
          <Stack.Screen name="MainApp">
            {(props) => (
              <DrawerNavigator
                {...props}
                usuarioLogado={usuarioLogado}
                toastRef={toastRef}
                navigationRef={navigationRef}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1b1b',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 55,
    right: 20,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    paddingVertical: 8,
    width: 160,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownTextSignOut: {
    color: '#dc3545',
  },
});
