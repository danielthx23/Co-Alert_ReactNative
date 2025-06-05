import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../components/usuario/Login';
import { UsuarioFormulario } from '../components/usuario/UsuarioFormulario';
import { UsuarioDetalhes } from '../components/usuario/UsuarioDetalhes';
import { UsuarioStackParamList } from '../types/navigation';
import { Usuario } from '../models/usuario';

const Stack = createStackNavigator<UsuarioStackParamList>();

type UsuarioScreenProps = {
  setUsuarioLogado: React.Dispatch<React.SetStateAction<Usuario | undefined>>;
};

export const UsuarioScreen: React.FC<UsuarioScreenProps> = ({ setUsuarioLogado }) => {
  return (
    <Stack.Navigator initialRouteName="UsuarioLogin" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UsuarioLogin">
        {props => <Login {...props} setUsuarioLogado={setUsuarioLogado} />}
      </Stack.Screen>
      <Stack.Screen name="UsuarioCadastro" component={UsuarioFormulario} />
      <Stack.Screen name="UsuarioDetalhes" component={UsuarioDetalhes} />
      <Stack.Screen name="UsuarioFormulario" component={UsuarioFormulario} />
    </Stack.Navigator>
  );
};