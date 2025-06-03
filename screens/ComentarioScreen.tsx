import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ComentarioListagem } from '../components/comentario/ComentarioListagem';
import { ComentarioFormulario } from '../components/comentario/ComentarioFormulario';
import { ComentarioDetalhes } from '../components/comentario/ComentarioDetalhes';
import { ComentarioStackParamList } from '../types/navigation';

const Stack = createStackNavigator<ComentarioStackParamList>();

export const ComentarioScreen: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="ComentarioListagem" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ComentarioListagem" component={ComentarioListagem} />
      <Stack.Screen name="ComentarioFormulario" component={ComentarioFormulario} />
      <Stack.Screen name="ComentarioDetalhes" component={ComentarioDetalhes} />
    </Stack.Navigator>
  );
}; 