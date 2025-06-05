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
import { localizacaoService } from '../../services/localizacao';
import { LocalizacaoStackParamList } from '../../types/navigation';
import { Localizacao } from '../../models/localizacao';
import { useToast } from '../../contexts/ToastContext';

type LocalizacaoDetalhesNavigationProp = StackNavigationProp<
  LocalizacaoStackParamList
>;

type LocalizacaoDetalhesRouteProp = RouteProp<
  LocalizacaoStackParamList,
  'LocalizacaoDetalhes'
>;

export const LocalizacaoDetalhes: React.FC = () => {
  const [localizacao, setLocalizacao] = useState<Localizacao>();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<LocalizacaoDetalhesNavigationProp>();
  const route = useRoute<LocalizacaoDetalhesRouteProp>();
  const { id } = route.params;
  const { showToast } = useToast();

  const carregarLocalizacao = async () => {
    try {
      const response = await localizacaoService.buscarPorId(id);
      setLocalizacao(response.data);
    } catch (error) {
      console.error(error);
      showToast('Erro', 'Não foi possível carregar a localização.', 'danger');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLocalizacao();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta localização?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await localizacaoService.deletar(id);
              showToast('Sucesso', 'Localização excluída com sucesso!', 'success');
              navigation.goBack();
              navigation.reset({
                index: 0,
                routes: [{ name: 'LocalizacaoListagem' }],
              });
            } catch (error) {
              console.error(error);
              showToast('Erro', 'Não foi possível excluir a localização.', 'danger');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4c4c" />
      </View>
    );
  }

  if (!localizacao) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
              navigation.goBack();
              navigation.reset({
                index: 0,
                routes: [{ name: 'LocalizacaoListagem' }],
              });
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.titulo}>{localizacao?.nmLogradouro}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Logradouro:</Text>
          <Text style={styles.value}>{localizacao?.nmLogradouro}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Bairro:</Text>
          <Text style={styles.value}>{localizacao?.nmBairro}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Cidade:</Text>
          <Text style={styles.value}>{localizacao?.nmCidade}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.value}>{localizacao?.nmEstado}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>CEP:</Text>
          <Text style={styles.value}>{localizacao?.nrCep}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('LocalizacaoFormulario', { id })}
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
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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