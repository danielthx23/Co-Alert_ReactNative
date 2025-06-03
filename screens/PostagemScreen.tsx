import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PostagemListagem } from '../components/postagem/PostagemListagem';
import { PostagemFormulario } from '../components/postagem/PostagemFormulario';
import { PostagemDetalhes } from '../components/postagem/PostagemDetalhes';
import { PostagemStackParamList } from '../types/navigation';

const Stack = createStackNavigator<PostagemStackParamList>();

export const PostagemScreen: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="PostagemListagem" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PostagemListagem" component={PostagemListagem} />
      <Stack.Screen name="PostagemFormulario" component={PostagemFormulario} />
      <Stack.Screen name="PostagemDetalhes" component={PostagemDetalhes} />
    </Stack.Navigator>
  );
}; 