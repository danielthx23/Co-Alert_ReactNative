import { useEffect } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usuarioService } from '../services/usuario';
import { RootStackParamList } from '../types/navigation';
import { useToast } from '../contexts/ToastContext';

export const useAuth = (navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList>>) => {
  const { showToast } = useToast();

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (!token) {
        navigationRef.current?.navigate('UsuarioScreen', { screen: 'UsuarioLogin' });
        return false;
      }

      const tokenParts = token.split(',');
      if (tokenParts.length !== 2) {
        await AsyncStorage.removeItem('user_token');
        navigationRef.current?.navigate('UsuarioScreen', { screen: 'UsuarioLogin' });
        return false;
      }

      const [nmEmail, nrSenha] = tokenParts;
      const response = await usuarioService.autenticar({ nmEmail, nrSenha });
      if (response.data) {
        // Se estiver na tela de login ou detalhes do usuário, redireciona para o MainApp
        const currentRoute = navigationRef.current?.getCurrentRoute();
        if (currentRoute?.name === 'UsuarioScreen') {
          navigationRef.current?.navigate('MainApp', { screen: 'HomeScreen' });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      await AsyncStorage.removeItem('user_token');
      showToast('Erro', 'Sessão expirada. Por favor, faça login novamente.', 'danger');
      navigationRef.current?.navigate('UsuarioScreen', { screen: 'UsuarioLogin' });
      return false;
    }
  };

  const redirectIfAuthenticated = async () => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (token) {
        const tokenParts = token.split(',');
        if (tokenParts.length === 2) {
          const [nmEmail, nrSenha] = tokenParts;
          const response = await usuarioService.autenticar({ nmEmail, nrSenha });
          if (response.data) {
            navigationRef.current?.navigate('MainApp', { screen: 'HomeScreen' });
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  };

  return {
    checkAuth,
    redirectIfAuthenticated
  };
}; 