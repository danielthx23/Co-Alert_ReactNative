import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { localizacaoService } from '../../services/localizacao';
import { Localizacao } from '../../models/localizacao';
import { LocalizacaoStackParamList } from '../../types/navigation';
import { useToast } from '../../contexts/ToastContext';
import { Ionicons } from '@expo/vector-icons';

type LocalizacaoFormularioNavigationProp = StackNavigationProp<
  LocalizacaoStackParamList,
  'LocalizacaoFormulario'
>;

type LocalizacaoFormularioRouteProp = RouteProp<
  LocalizacaoStackParamList,
  'LocalizacaoFormulario'
>;

export const LocalizacaoFormulario: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [localizacao, setLocalizacao] = useState<Omit<Localizacao, 'idLocalizacao'>>({
    nmLogradouro: '',
    nmBairro: '',
    nmCidade: '',
    nmEstado: '',
    nrNumero: 0,
    nrCep: '',
    nmPais: 'Brasil'
  });

  const navigation = useNavigation<LocalizacaoFormularioNavigationProp>();
  const route = useRoute<LocalizacaoFormularioRouteProp>();
  const { showToast } = useToast();
  const isEditing = Boolean(route.params?.id);

  useEffect(() => {
    const carregarLocalizacao = async () => {
      if (isEditing && route.params?.id) {
        try {
          const response = await localizacaoService.buscarPorId(route.params.id);
          setLocalizacao({
            nmLogradouro: response.data.nmLogradouro || '',
            nmBairro: response.data.nmBairro || '',
            nmCidade: response.data.nmCidade || '',
            nmEstado: response.data.nmEstado || '',
            nrNumero: response.data.nrNumero || 0,
            nrCep: response.data.nrCep || '',
            nmPais: response.data.nmPais || 'Brasil',
            dsComplemento: response.data.dsComplemento,
          });
        } catch (error) {
          console.error(error);
          showToast('Erro', 'Não foi possível carregar os dados da localização.', 'danger');
          navigation.goBack();
        }
      }
    };

    carregarLocalizacao();
  }, [route.params?.id]);

  const logradouroInputRef = useRef<TextInput>(null);
  const numeroInputRef = useRef<TextInput>(null);
  const bairroInputRef = useRef<TextInput>(null);
  const cidadeInputRef = useRef<TextInput>(null);
  const estadoInputRef = useRef<TextInput>(null);
  const cepInputRef = useRef<TextInput>(null);
  const complementoInputRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    if (!localizacao.nmLogradouro?.trim()) {
      showToast('Erro', 'O logradouro é obrigatório.', 'danger');
      logradouroInputRef.current?.focus();
      return;
    }

    if (!localizacao.nrNumero) {
      showToast('Erro', 'O número é obrigatório.', 'danger');
      numeroInputRef.current?.focus();
      return;
    }

    if (!localizacao.nmBairro?.trim()) {
      showToast('Erro', 'O bairro é obrigatório.', 'danger');
      bairroInputRef.current?.focus();
      return;
    }

    if (!localizacao.nmCidade?.trim()) {
      showToast('Erro', 'A cidade é obrigatória.', 'danger');
      cidadeInputRef.current?.focus();
      return;
    }

    if (!localizacao.nmEstado?.trim()) {
      showToast('Erro', 'O estado é obrigatório.', 'danger');
      estadoInputRef.current?.focus();
      return;
    }

    if (!localizacao.nrCep?.trim()) {
      showToast('Erro', 'O CEP é obrigatório.', 'danger');
      cepInputRef.current?.focus();
      return;
    }

    try {
      setLoading(true);
      if (isEditing && route.params?.id) {
        await localizacaoService.atualizar(route.params.id, localizacao);
        showToast('Sucesso', 'Localização atualizada com sucesso!', 'success');
        navigation.goBack();
        navigation.reset({
          index: 0,
          routes: [{ name: 'LocalizacaoListagem' }],
        });
      } else {
        await localizacaoService.criar(localizacao);
        showToast('Sucesso', 'Localização criada com sucesso!', 'success');
        navigation.goBack();
        navigation.reset({
          index: 0,
          routes: [{ name: 'LocalizacaoListagem' }],
        });
      }
    } catch (error) {
      console.error(error);
      showToast('Erro', `Não foi possível ${isEditing ? 'atualizar' : 'criar'} a localização.`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.titulo}>{isEditing ? 'Editar Localização' : 'Nova Localização'}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Logradouro</Text>
            <TextInput
              ref={logradouroInputRef}
              style={styles.input}
              value={localizacao.nmLogradouro}
              onChangeText={(text) => setLocalizacao({ ...localizacao, nmLogradouro: text })}
              placeholder="Digite o logradouro"
              placeholderTextColor="#666"
              returnKeyType="next"
              onSubmitEditing={() => numeroInputRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Número</Text>
              <TextInput
                ref={numeroInputRef}
                style={styles.input}
                value={localizacao.nrNumero.toString()}
                onChangeText={(text) => setLocalizacao({ ...localizacao, nrNumero: parseInt(text) || 0 })}
                placeholder="Nº"
                placeholderTextColor="#666"
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => bairroInputRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 2 }]}>
              <Text style={styles.label}>Bairro</Text>
              <TextInput
                ref={bairroInputRef}
                style={styles.input}
                value={localizacao.nmBairro}
                onChangeText={(text) => setLocalizacao({ ...localizacao, nmBairro: text })}
                placeholder="Digite o bairro"
                placeholderTextColor="#666"
                returnKeyType="next"
                onSubmitEditing={() => cidadeInputRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 2, marginRight: 8 }]}>
              <Text style={styles.label}>Cidade</Text>
              <TextInput
                ref={cidadeInputRef}
                style={styles.input}
                value={localizacao.nmCidade}
                onChangeText={(text) => setLocalizacao({ ...localizacao, nmCidade: text })}
                placeholder="Digite a cidade"
                placeholderTextColor="#666"
                returnKeyType="next"
                onSubmitEditing={() => estadoInputRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Estado</Text>
              <TextInput
                ref={estadoInputRef}
                style={styles.input}
                value={localizacao.nmEstado}
                onChangeText={(text) => setLocalizacao({ ...localizacao, nmEstado: text })}
                placeholder="UF"
                placeholderTextColor="#666"
                returnKeyType="next"
                onSubmitEditing={() => cepInputRef.current?.focus()}
                blurOnSubmit={false}
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CEP</Text>
            <TextInput
              ref={cepInputRef}
              style={styles.input}
              value={localizacao.nrCep}
              onChangeText={(text) => setLocalizacao({ ...localizacao, nrCep: text.replace(/\D/g, '') })}
              placeholder="Digite o CEP"
              placeholderTextColor="#666"
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => complementoInputRef.current?.focus()}
              blurOnSubmit={false}
              maxLength={8}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Complemento</Text>
            <TextInput
              ref={complementoInputRef}
              style={styles.input}
              value={localizacao.dsComplemento}
              onChangeText={(text) => setLocalizacao({ ...localizacao, dsComplemento: text })}
              placeholder="Digite o complemento (opcional)"
              placeholderTextColor="#666"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="save" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>{isEditing ? 'Atualizar' : 'Salvar'}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131315',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1c',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    minHeight: 50,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2d2d2d',
  },
  button: {
    backgroundColor: '#ff4c4c',
    minHeight: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    flexDirection: 'row',
  },
  buttonDisabled: {
    backgroundColor: '#2d2d2d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
}); 