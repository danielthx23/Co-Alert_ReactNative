import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LocalizacaoListagem } from '../components/localizacao/LocalizacaoListagem';
import { LocalizacaoFormulario } from '../components/localizacao/LocalizacaoFormulario';
import { LocalizacaoDetalhes } from '../components/localizacao/LocalizacaoDetalhes';
import { LocalizacaoStackParamList } from '../types/navigation';

const Stack = createStackNavigator<LocalizacaoStackParamList>();

export const LocalizacaoScreen: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="LocalizacaoListagem" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LocalizacaoListagem" component={LocalizacaoListagem} />
      <Stack.Screen name="LocalizacaoFormulario" component={LocalizacaoFormulario} />
      <Stack.Screen name="LocalizacaoDetalhes" component={LocalizacaoDetalhes} />
    </Stack.Navigator>
  );
}; 