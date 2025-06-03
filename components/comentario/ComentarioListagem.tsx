import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { comentarioService } from '../../services/comentario';
import { Comentario } from '../../models';
import { ComentarioStackParamList } from '../../types/navigation';

type ComentarioListagemNavigationProp = StackNavigationProp<
  ComentarioStackParamList
>;

export const ComentarioListagem: React.FC = () => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<ComentarioListagemNavigationProp>();

  const carregarComentarios = async () => {
    try {
      const response = await comentarioService.listarTodos();
      setComentarios(response.data);
    } catch (error) {
      console.error(error);
      // Toast will show error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarComentarios();
  }, []);

  const renderItem = ({ item }: { item: Comentario }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.id) {
          navigation.navigate('ComentarioDetalhes', { id: item.id });
        }
      }}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="chatbubble" size={24} color="#009b29" />
        <Text style={styles.conteudo}>{item.nmConteudo}</Text>
      </View>
      <Text style={styles.data}>
        {new Date(item.dtCriacao!).toLocaleDateString('pt-BR')}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009b29" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={comentarios}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ComentarioFormulario')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  conteudo: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  data: {
    fontSize: 12,
    color: '#009b29',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#009b29',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
}); 