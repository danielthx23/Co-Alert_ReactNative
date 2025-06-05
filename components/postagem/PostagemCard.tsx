import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Postagem } from '../../models/postagem';

interface PostagemCardProps {
  postagem: Postagem;
  onPress: () => void;
  horizontal?: boolean;
}

export const PostagemCard: React.FC<PostagemCardProps> = ({
  postagem,
  onPress,
  horizontal = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, horizontal ? styles.cardHorizontal : styles.cardVertical]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="warning" size={24} color="#ff4c4c" />
        <Text style={styles.cardTitle}>{postagem.nmTitulo}</Text>
      </View>

      <View style={styles.metaInfo}>
        <View style={styles.metaItem}>
          <Ionicons name="person-outline" size={14} color="#d3d3d3" />
          <Text style={styles.metaText}>{postagem.usuario?.nmUsuario}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="alert-circle-outline" size={14} color="#d3d3d3" />
          <Text style={styles.metaText}>{postagem.categoriaDesastre?.nmTitulo}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color="#d3d3d3" />
          <Text style={styles.metaText}>
            {new Date(postagem.dtEnvio!).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>
      <View style={styles.location}>
        <Ionicons name="location-outline" size={16} color="#ff4c4c" />
        <Text style={styles.locationText}>
          {postagem.localizacao?.nmCidade}, {postagem.localizacao?.nmEstado}
        </Text>
      </View>

      <Text style={styles.cardContent}>{postagem.nmConteudo}</Text>
      
      <View style={styles.separator} />
      
      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          <View style={styles.footerItem}>
            <Ionicons name="chatbubble-outline" size={16} color="#ff4c4c" />
            <Text style={styles.footerText}>
              {postagem.comentarios?.length || 0} comentários
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="heart-outline" size={16} color="#ff4c4c" />
            <Text style={styles.footerText}>{postagem.nrLikes || 0} curtidas</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 16,
    flex: 1,
  },
  cardHorizontal: {
    width: '100%',
  },
  cardVertical: {
    width: '100%',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#d3d3d3',
  },
  cardContent: {
    fontSize: 14,
    color: '#d3d3d3',
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#363636',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    gap: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#d3d3d3',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#d3d3d3',
  },
}); 