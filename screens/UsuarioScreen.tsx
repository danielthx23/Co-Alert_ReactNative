import React, { useEffect } from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { Login } from '../components/usuario/Login';
import { UsuarioFormulario } from '../components/usuario/UsuarioFormulario';
import { UsuarioDetalhes } from '../components/usuario/UsuarioDetalhes';
import { UsuarioStackParamList, RootStackParamList } from '../types/navigation';
import { Usuario } from '../models/usuario';

interface UsuarioScreenProps extends StackScreenProps<RootStackParamList, 'UsuarioScreen'> {
  setUsuarioLogado: (usuario: Usuario) => void;
  onLoginSuccess?: () => Promise<boolean>;
}

export const UsuarioScreen: React.FC<UsuarioScreenProps> = ({ navigation, setUsuarioLogado, onLoginSuccess }) => {
  const Stack = createStackNavigator<UsuarioStackParamList>();

  useEffect(() => {
    const checkAuth = async () => {
      if (onLoginSuccess) {
        await onLoginSuccess();
      }
    };
    checkAuth();
  }, []);

  return (
    <Stack.Navigator initialRouteName="UsuarioLogin" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UsuarioLogin">
        {props => (
          <Login
            {...props}
            setUsuarioLogado={setUsuarioLogado}
            onLoginSuccess={onLoginSuccess}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="UsuarioCadastro" component={UsuarioFormulario} />
      <Stack.Screen name="UsuarioDetalhes" component={UsuarioDetalhes} />
    </Stack.Navigator>
  );
};