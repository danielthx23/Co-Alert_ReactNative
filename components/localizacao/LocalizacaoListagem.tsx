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
import { LocalizacaoStackParamList } from '../../types/navigation';
import { Localizacao } from '../../models/localizacao';
import { useToast } from '../../contexts/ToastContext';

type LocalizacaoListagemNavigationProp = StackNavigationProp<
  LocalizacaoStackParamList
>;

export const LocalizacaoListagem: React.FC = () => {
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<LocalizacaoListagemNavigationProp>();
  const { showToast } = useToast();

  const carregarLocalizacoes = async () => {
    try {
      const response = await localizacaoService.listarTodos();
      setLocalizacoes(response.data);
    } catch (error) {
      console.error(error);
      showToast('Erro', 'Não foi possível carregar as localizações.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLocalizacoes();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarLocalizacoes();
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Localizacao }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.idLocalizacao) {
          navigation.navigate('LocalizacaoDetalhes', { id: item.idLocalizacao });
        }
      }}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="location" size={24} color="#ff4c4c" />
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
        <ActivityIndicator size="large" color="#ff4c4c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={localizacoes}
        renderItem={renderItem}
        keyExtractor={(item) => item.idLocalizacao?.toString() || ''}
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
  logradouro: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  bairro: {
    fontSize: 16,
    color: '#ff4c4c',
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
    backgroundColor: '#ff4c4c',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
}); 