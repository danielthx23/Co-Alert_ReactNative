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
import { categoriaDesastreService } from '../../services/categoriaDesastre';
import { CategoriaDesastreStackParamList } from '../../types/navigation';
import { CategoriaDesastre } from '../../models/categoriaDesastre';
import { useToast } from '../../contexts/ToastContext';

type CategoriaDesastreDetalhesNavigationProp = StackNavigationProp<
  CategoriaDesastreStackParamList
>;

type CategoriaDesastreDetalhesRouteProp = RouteProp<
  CategoriaDesastreStackParamList,
  'CategoriaDesastreDetalhes'
>;

export const CategoriaDesastreDetalhes: React.FC = () => {
  const [categoria, setCategoria] = useState<CategoriaDesastre>();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<CategoriaDesastreDetalhesNavigationProp>();
  const route = useRoute<CategoriaDesastreDetalhesRouteProp>();
  const { id } = route.params;
  const { showToast } = useToast();

  const carregarCategoria = async () => {
    try {
      const response = await categoriaDesastreService.obterPorId(id);
      setCategoria(response.data);
    } catch (error) {
      console.error(error);
      showToast('Erro', 'Não foi possível carregar a categoria.', 'danger');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategoria();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta categoria?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await categoriaDesastreService.deletar(id);
              showToast('Sucesso', 'Categoria excluída com sucesso!', 'success');
              navigation.goBack();
              navigation.reset({
                index: 0,
                routes: [{ name: 'CategoriaDesastreListagem' }],
              });
            } catch (error) {
              console.error(error);
              showToast('Erro', 'Não foi possível excluir a categoria.', 'danger');
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

  if (!categoria) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
              navigation.goBack();
              navigation.reset({
                index: 0,
                routes: [{ name: 'CategoriaDesastreListagem' }],
              });
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.titulo}>{categoria.nmTitulo}</Text>
        </View>

      <View style={styles.header}>
        <Ionicons name="list" size={64} color="#ff4c4c" />
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Título:</Text>
          <Text style={styles.value}>{categoria.nmTitulo}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>{categoria.nmTipo}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.value}>{categoria.dsCategoria}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('CategoriaDesastreFormulario', { id })}
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
    backgroundColor: '#131315',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#131315',
  },
  header: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBlock: 10,
    paddingInline: 10,
    width: '100%',
  },
  backButton: {
    padding: 8,
  },
  titulo: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  infoRow: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
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
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#ff4c4c',
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