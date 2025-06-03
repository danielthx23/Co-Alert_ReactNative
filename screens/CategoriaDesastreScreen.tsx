import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CategoriaDesastreListagem } from '../components/categoriaDesastre/CategoriaDesastreListagem';
import { CategoriaDesastreFormulario } from '../components/categoriaDesastre/CategoriaDesastreFormulario';
import { CategoriaDesastreDetalhes } from '../components/categoriaDesastre/CategoriaDesastreDetalhes';
import { CategoriaDesastreStackParamList } from '../types/navigation';

const Stack = createStackNavigator<CategoriaDesastreStackParamList>();

export const CategoriaDesastreScreen: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="CategoriaDesastreListagem" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoriaDesastreListagem" component={CategoriaDesastreListagem} />
      <Stack.Screen name="CategoriaDesastreFormulario" component={CategoriaDesastreFormulario} />
      <Stack.Screen name="CategoriaDesastreDetalhes" component={CategoriaDesastreDetalhes} />
    </Stack.Navigator>
  );
}; 