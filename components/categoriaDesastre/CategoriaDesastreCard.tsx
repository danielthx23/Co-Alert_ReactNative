import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CategoriaDesastre } from '../../models/categoriaDesastre';

interface Props {
  categoria: CategoriaDesastre;
  onPress?: () => void;
}

export const CategoriaDesastreCard: React.FC<Props> = ({ categoria, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{categoria.nmTitulo}</Text>
        <Text style={styles.tipo}>{categoria.nmTipo}</Text>
      </View>
      <Text style={styles.descricao}>{categoria.dsCategoria}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tipo: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  descricao: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 