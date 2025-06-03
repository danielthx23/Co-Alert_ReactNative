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
import { comentarioService } from '../../services/comentario';
import { Comentario } from '../../models';
import { ComentarioStackParamList } from '../../types/navigation';

type ComentarioFormularioNavigationProp = StackNavigationProp<
  ComentarioStackParamList
>;

export const ComentarioFormulario: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [comentario, setComentario] = useState<Omit<Comentario, 'id' | 'dtCriacao'>>({
    nmConteudo: '',
    usuarioId: 1, // TODO: Get from auth context
    postagemId: 1, // TODO: Add postagem selector
  });
  const navigation = useNavigation<ComentarioFormularioNavigationProp>();

  const handleSubmit = async () => {
    if (!comentario.nmConteudo) {
      // Toast will show validation error
      return;
    }

    try {
      setLoading(true);
      await comentarioService.criar(comentario);
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
        <Text style={styles.label}>Comentário</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={comentario.nmConteudo}
          onChangeText={(text) => setComentario({ ...comentario, nmConteudo: text })}
          placeholder="Digite seu comentário"
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* TODO: Add postagem selector */}

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