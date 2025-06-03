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
import { postagemService } from '../../services/postagem';
import { PostagemStackParamList } from '../../types/navigation';
import { Postagem } from '../../models/postagem';

type PostagemFormularioNavigationProp = StackNavigationProp<
  PostagemStackParamList
>;

export const PostagemFormulario: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [postagem, setPostagem] = useState<Omit<Postagem, 'id' | 'dtCriacao'>>({
    nmTitulo: '',
    nmConteudo: '',
    idCategoriaDesastre: 1, // TODO: Add category selector
    idLocalizacao: 1, // TODO: Add location selector
    dtEnvio: new Date(),
  });
  const navigation = useNavigation<PostagemFormularioNavigationProp>();

  const handleSubmit = async () => {
    if (!postagem.nmTitulo || !postagem.nmConteudo) {
      // Toast will show validation error
      return;
    }

    try {
      setLoading(true);
      await postagemService.criar(postagem);
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
          value={postagem.nmTitulo}
          onChangeText={(text) => setPostagem({ ...postagem, nmTitulo: text })}
          placeholder="Digite o título do alerta"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Conteúdo</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={postagem.nmConteudo}
          onChangeText={(text) => setPostagem({ ...postagem, nmConteudo: text })}
          placeholder="Digite o conteúdo do alerta"
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* TODO: Add category selector */}
        {/* TODO: Add location selector */}

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