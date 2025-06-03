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
import { categoriaDesastreService } from '../../services/categoriaDesastre';
import { CategoriaDesastre } from '../../models';
import { CategoriaDesastreStackParamList } from '../../types/navigation';

type CategoriaDesastreFormularioNavigationProp = StackNavigationProp<
  CategoriaDesastreStackParamList
>;

export const CategoriaDesastreFormulario: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [categoria, setCategoria] = useState<Omit<CategoriaDesastre, 'id'>>({
    nmTitulo: '',
    dsCategoria: '',
    nmTipo: '',
  });
  const navigation = useNavigation<CategoriaDesastreFormularioNavigationProp>();

  const handleSubmit = async () => {
    if (!categoria.nmTitulo || !categoria.dsCategoria || !categoria.nmTipo) {
      // Toast will show validation error
      return;
    }

    try {
      setLoading(true);
      await categoriaDesastreService.criar(categoria);
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
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={categoria.nmTitulo}
          onChangeText={(text) => setCategoria({ ...categoria, nmTitulo: text })}
          placeholder="Digite o título da categoria"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Tipo</Text>
        <TextInput
          style={styles.input}
          value={categoria.nmTipo}
          onChangeText={(text) => setCategoria({ ...categoria, nmTipo: text })}
          placeholder="Digite o tipo da categoria"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={categoria.dsCategoria}
          onChangeText={(text) => setCategoria({ ...categoria, dsCategoria: text })}
          placeholder="Digite a descrição da categoria"
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
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
  textArea: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
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