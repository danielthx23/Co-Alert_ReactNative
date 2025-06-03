import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { comentarioService } from '../../services/comentario';
import { Comentario } from '../../models';
import { ComentarioStackParamList } from '../../types/navigation';

type ComentarioDetalhesNavigationProp = StackNavigationProp<
  ComentarioStackParamList
>;

type ComentarioDetalhesRouteProp = RouteProp<
  ComentarioStackParamList,
  'ComentarioDetalhes'
>;

export const ComentarioDetalhes: React.FC = () => {
  const [comentario, setComentario] = useState<Comentario>();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<ComentarioDetalhesNavigationProp>();
  const route = useRoute<ComentarioDetalhesRouteProp>();
  const { id } = route.params;

  const carregarComentario = async () => {
    try {
      const response = await comentarioService.obterPorId(id);
      setComentario(response.data);
    } catch (error) {
      console.error(error);
      // Toast will show error message
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarComentario();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este comentário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await comentarioService.deletar(id);
              // Toast will show success message
              navigation.goBack();
            } catch (error) {
              console.error(error);
              // Toast will show error message
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009b29" />
      </View>
    );
  }

  if (!comentario) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chatbubble" size={64} color="#009b29" />
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Comentário:</Text>
          <Text style={styles.value}>{comentario.nmConteudo}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Data de Criação:</Text>
          <Text style={styles.value}>
            {new Date(comentario.dtCriacao!).toLocaleDateString('pt-BR')}
          </Text>
        </View>

        {/* TODO: Add user info */}
        {/* TODO: Add post info */}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('ComentarioFormulario', { id })}
        >
          <Ionicons name="create" size={20} color="#fff" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#1c1c1c',
  },
  content: {
    padding: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#009b29',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 