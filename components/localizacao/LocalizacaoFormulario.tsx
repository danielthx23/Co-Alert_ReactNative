import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { localizacaoService } from '../../services/localizacao';
import { Localizacao } from '../../models';
import { LocalizacaoStackParamList } from '../../types/navigation';

type LocalizacaoFormularioNavigationProp = StackNavigationProp<
  LocalizacaoStackParamList,
  'LocalizacaoFormulario'
>;

export const LocalizacaoFormulario: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [localizacao, setLocalizacao] = useState<Omit<Localizacao, 'id'>>({
    nmLogradouro: '',
    nmBairro: '',
    nmCidade: '',
    nmEstado: '',
    nrLatitude: 0,
    nrLongitude: 0,
    nrNumero: 0,
    nrCep: '',
    nmPais: 'Brasil',
    dsComplemento: '',
  });
  const navigation = useNavigation<LocalizacaoFormularioNavigationProp>();

  const handleSubmit = async () => {
    if (!localizacao.nmLogradouro || !localizacao.nmBairro || !localizacao.nmCidade || !localizacao.nmEstado) {
      // Toast will show validation error
      return;
    }

    try {
      setLoading(true);
      await localizacaoService.criar(localizacao);
      // Toast will show success message
      navigation.goBack();
    } catch (error) {
      console.error(error);
      // Toast will show error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Logradouro</Text>
        <TextInput
          style={styles.input}
          value={localizacao.nmLogradouro}
          onChangeText={(text) => setLocalizacao({ ...localizacao, nmLogradouro: text })}
          placeholder="Digite o logradouro"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={styles.input}
          value={localizacao.nmBairro}
          onChangeText={(text) => setLocalizacao({ ...localizacao, nmBairro: text })}
          placeholder="Digite o bairro"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Cidade</Text>
        <TextInput
          style={styles.input}
          value={localizacao.nmCidade}
          onChangeText={(text) => setLocalizacao({ ...localizacao, nmCidade: text })}
          placeholder="Digite a cidade"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Estado</Text>
        <TextInput
          style={styles.input}
          value={localizacao.nmEstado}
          onChangeText={(text) => setLocalizacao({ ...localizacao, nmEstado: text })}
          placeholder="Digite o estado"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Latitude</Text>
        <TextInput
          style={styles.input}
          value={localizacao.nrLatitude.toString()}
          onChangeText={(text) => setLocalizacao({ ...localizacao, nrLatitude: parseFloat(text) || 0 })}
          placeholder="Digite a latitude"
          placeholderTextColor="#666"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Longitude</Text>
        <TextInput
          style={styles.input}
          value={localizacao.nrLongitude.toString()}
          onChangeText={(text) => setLocalizacao({ ...localizacao, nrLongitude: parseFloat(text) || 0 })}
          placeholder="Digite a longitude"
          placeholderTextColor="#666"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1c1c1c',
    borderRadius: 4,
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#009b29',
    height: 50,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#004d14',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 