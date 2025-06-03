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
import { categoriaDesastreService } from '../../services/categoriaDesastre';
import { CategoriaDesastre } from '../../models';
import { CategoriaDesastreStackParamList } from '../../types/navigation';

type CategoriaDesastreListagemNavigationProp = StackNavigationProp<
  CategoriaDesastreStackParamList
>;

export const CategoriaDesastreListagem: React.FC = () => {
  const [categorias, setCategorias] = useState<CategoriaDesastre[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<CategoriaDesastreListagemNavigationProp>();

  const carregarCategorias = async () => {
    try {
      const response = await categoriaDesastreService.listarTodos();
      setCategorias(response.data);
    } catch (error) {
      console.error(error);
      // Toast will show error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const renderItem = ({ item }: { item: CategoriaDesastre }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.id) {
          navigation.navigate('CategoriaDesastreDetalhes', { id: item.id });
        }
      }}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="list" size={24} color="#009b29" />
        <Text style={styles.title}>{item.nmTitulo}</Text>
      </View>
      <Text style={styles.tipo}>{item.nmTipo}</Text>
      <Text style={styles.descricao}>{item.dsCategoria}</Text>
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
        data={categorias}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CategoriaDesastreFormulario')}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  tipo: {
    fontSize: 16,
    color: '#009b29',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    color: '#666',
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