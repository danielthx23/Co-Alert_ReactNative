import React, { useRef, useState, useEffect, RefObject } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ToastProvider, useToast } from './contexts/ToastContext';
import { Usuario } from './models/usuario';
import { UsuarioScreen } from './screens/UsuarioScreen';
import { HomeScreen } from './screens/HomeScreen';
import { PostagemScreen } from './screens/PostagemScreen';
import { LocalizacaoScreen } from './screens/LocalizacaoScreen';
import { CategoriaDesastreScreen } from './screens/CategoriaDesastreScreen';
import { RootStackParamList, DrawerParamList } from './types/navigation';
import { usuarioService } from './services/usuario';
import { useAuth } from './hooks/useAuth';

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNavigator({ usuarioLogado, navigationRef }: { 
  usuarioLogado?: Usuario, 
  navigationRef: RefObject<NavigationContainerRef<RootStackParamList>>
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { showToast } = useToast();
  const { checkAuth } = useAuth(navigationRef);

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        navigationRef.current?.navigate('UsuarioScreen', {
          screen: 'UsuarioLogin'
        });
      }
    };
    checkAuthentication();
  }, []);

  const handleNavigateToProfile = () => {
    setMenuVisible(false);
    if (usuarioLogado?.idUsuario) {
      navigationRef.current?.navigate('UsuarioScreen', {
        screen: 'UsuarioDetalhes',
        params: {
          id: usuarioLogado.idUsuario
        }
      });
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user_token');
      showToast("Sessão encerrada", "Você foi deslogado com sucesso.", "info");
    } catch (error) {
      console.error("Erro ao remover token de usuário:", error);
      showToast("Erro", "Não foi possível encerrar a sessão.", "danger");
    } finally {
      setMenuVisible(false);
      navigationRef.current?.navigate('UsuarioScreen', {
        screen: 'UsuarioLogin'
      });
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
            borderRadius: 4,
            paddingInline: 8
          },
          drawerActiveBackgroundColor: '#1b1b1b',
          drawerActiveTintColor: '#ff3838',
          drawerInactiveTintColor: '#383838',
          headerStyle: {
            backgroundColor: '#0c0c0c',
            height: 100,
          },
          headerTitleStyle: {
            fontSize: 18,
          },
          headerTintColor: '#fff',
          sceneContainerStyle: {
            backgroundColor: '#131315'
          },
          overlayColor: 'rgba(0, 0, 0, 0.0)',
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
                      onPress={handleNavigateToProfile}
                    >
                      <Ionicons name="person-outline" size={20} color="#fff" />
                      <Text style={styles.dropdownText}>Meu Perfil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.dropdownItem, styles.dropdownItemSignOut]}
                      onPress={signOut}
                    >
                      <Ionicons name="log-out-outline" size={20} color="#ff4c4c" />
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
          options={{ title: 'Início' }}
          listeners={{
            focus: async () => {
              await checkAuth();
            },
          }}
        >
          {props => <HomeScreen {...props} navigationRef={navigationRef} />}
        </Drawer.Screen>
        <Drawer.Screen 
          name="PostagemScreen" 
          component={PostagemScreen}
          options={{ title: 'Feed' }}
          listeners={{
            focus: async () => {
              await checkAuth();
            },
          }}
        />
        <Drawer.Screen 
          name="CategoriaDesastreScreen" 
          component={CategoriaDesastreScreen}
          options={{ title: 'Categorias' }}
          listeners={{
            focus: async () => {
              await checkAuth();
            },
          }}
        />
        <Drawer.Screen 
          name="LocalizacaoScreen" 
          component={LocalizacaoScreen}
          options={{ title: 'Localizações' }}
          listeners={{
            focus: async () => {
              await checkAuth();
            },
          }}
        />
      </Drawer.Navigator>
    </>
  );
}

function AppContent() {
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | undefined>(undefined);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null!);
  const { showToast } = useToast();
  const { redirectIfAuthenticated } = useAuth(navigationRef as RefObject<NavigationContainerRef<RootStackParamList>>);

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
            navigationRef.current?.navigate('MainApp', {
              screen: 'HomeScreen'
            });
            showToast("Login efetuado!", "Bem-vindo(a) de volta.", "success");
          } else {
            console.error("Formato de token inválido.");
            showToast("Erro", "Token inválido.", "danger");
            navigationRef.current?.navigate('UsuarioScreen', {
              screen: 'UsuarioLogin'
            });
          }
        } else {
          navigationRef.current?.navigate('UsuarioScreen', {
            screen: 'UsuarioLogin'
          });
        }
      } catch (error) {
        console.error("Erro ao verificar token de sessão:", error);
        showToast("Erro", "Falha ao restaurar a sessão.", "danger");
        navigationRef.current?.navigate('UsuarioScreen', {
          screen: 'UsuarioLogin'
        });
      }
    };

    verificarToken();
  }, []);

  return (
    <View style={styles.container}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator 
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#131315' },
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                opacity: progress,
              },
            }),
          }}
          initialRouteName="UsuarioScreen"
        >
          <Stack.Screen name="UsuarioScreen">
            {props => (
              <UsuarioScreen 
                {...props} 
                setUsuarioLogado={setUsuarioLogado}
                onLoginSuccess={redirectIfAuthenticated}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="MainApp">
            {(props) => (
              <DrawerNavigator
                {...props}
                usuarioLogado={usuarioLogado}
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

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
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
    marginRight: 8,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  dropdownMenu: {
    position: 'absolute',
    right: 16,
    top: 60,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 4,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  dropdownItemSignOut: {
    borderTopWidth: 1,
    borderTopColor: '#2d2d2d',
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownTextSignOut: {
    color: '#ff4c4c',
  },
});