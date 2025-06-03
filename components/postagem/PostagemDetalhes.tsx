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
import { postagemService } from '../../services/postagem';
import { PostagemStackParamList } from '../../types/navigation';
import { Postagem } from '../../models/postagem';

type PostagemDetalhesNavigationProp = StackNavigationProp<
  PostagemStackParamList
>;

type PostagemDetalhesRouteProp = RouteProp<
  PostagemStackParamList,
  'PostagemDetalhes'
>;

export const PostagemDetalhes: React.FC = () => {
  const [postagem, setPostagem] = useState<Postagem>();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<PostagemDetalhesNavigationProp>();
  const route = useRoute<PostagemDetalhesRouteProp>();
  const { id } = route.params;

  const carregarPostagem = async () => {
    try {
      const response = await postagemService.obterPorId(id);
      setPostagem(response.data);
    } catch (error) {
      console.error(error);
      // Toast will show error message
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPostagem();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este alerta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await postagemService.deletar(id);
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

  if (!postagem) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Título:</Text>
          <Text style={styles.value}>{postagem.nmTitulo}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Conteúdo:</Text>
          <Text style={styles.value}>{postagem.nmConteudo}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Data de Criação:</Text>
          <Text style={styles.value}>
            {postagem.dtEnvio
              ? new Date(postagem.dtEnvio).toLocaleDateString('pt-BR')
              : 'Data indisponível'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Usuário:</Text>
          <Text style={styles.value}>
            {postagem.usuario?.nmUsuario ?? 'Usuário não disponível'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Categoria:</Text>
          <Text style={styles.value}>
            {postagem.categoriaDesastre?.nmTitulo ?? 'Categoria não disponível'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Localização:</Text>
          <Text style={styles.value}>
            {postagem.localizacao
              ? `${postagem.localizacao.nmCidade}, ${postagem.localizacao.nmEstado}`
              : 'Localização não disponível'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('PostagemFormulario', { id })}
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