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
import { localizacaoService } from '../../services/localizacao';
import { Localizacao } from '../../models';
import { LocalizacaoStackParamList } from '../../types/navigation';

type LocalizacaoListagemNavigationProp = StackNavigationProp<
  LocalizacaoStackParamList
>;

export const LocalizacaoListagem: React.FC = () => {
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<LocalizacaoListagemNavigationProp>();

  const carregarLocalizacoes = async () => {
    try {
      const response = await localizacaoService.listarTodos();
      setLocalizacoes(response.data);
    } catch (error) {
      console.error(error);
      // Toast will show error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLocalizacoes();
  }, []);

  const renderItem = ({ item }: { item: Localizacao }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.id) {
          navigation.navigate('LocalizacaoDetalhes', { id: item.id });
        }
      }}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="location" size={24} color="#009b29" />
        <Text style={styles.logradouro}>{item.nmLogradouro}</Text>
      </View>
      <Text style={styles.bairro}>{item.nmBairro}</Text>
      <Text style={styles.cidade}>
        {item.nmCidade} - {item.nmEstado}
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
        data={localizacoes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('LocalizacaoFormulario', {})}
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
  logradouro: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  bairro: {
    fontSize: 16,
    color: '#009b29',
    marginBottom: 4,
  },
  cidade: {
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