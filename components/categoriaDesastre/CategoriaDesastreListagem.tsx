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
import { CategoriaDesastreStackParamList } from '../../types/navigation';
import { CategoriaDesastre } from '../../models/categoriaDesastre';

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarCategorias();
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: CategoriaDesastre }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.idCategoriaDesastre) {
          navigation.navigate('CategoriaDesastreDetalhes', { id: item.idCategoriaDesastre });
        }
      }}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="list" size={24} color="#ff4c4c" />
        <Text style={styles.title}>{item.nmTitulo}</Text>
      </View>
      <Text style={styles.tipo}>{item.nmTipo}</Text>
      <Text style={styles.descricao}>{item.dsCategoria}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4c4c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categorias}
        renderItem={renderItem}
        keyExtractor={(item) => item.idCategoriaDesastre?.toString() || ''}
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
    backgroundColor: '#131315',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#131315',
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
    color: '#ff4c4c',
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
    backgroundColor: '#ff4c4c',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
}); 