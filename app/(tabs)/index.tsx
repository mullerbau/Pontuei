import React from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pencil, Search, Star } from 'lucide-react-native';
import { MapPin, Heart, ShoppingBag } from 'lucide-react-native';

const establishments = [
  { id: 1, name: 'Pizzaria Bella', category: 'Pizza', rating: 4.5, image: '🍕' },
  { id: 2, name: 'Burger House', category: 'Hambúrguer', rating: 4.3, image: '🍔' },
  { id: 3, name: 'Café Central', category: 'Café', rating: 4.7, image: '☕' },
  { id: 4, name: 'Açaí da Praia', category: 'Açaí', rating: 4.4, image: '🍧' },
  { id: 5, name: 'Sushi Zen', category: 'Japonês', rating: 4.6, image: '🍣' },
  { id: 6, name: 'Padaria do Bairro', category: 'Padaria', rating: 4.2, image: '🥖' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá! </Text>
          

          <Text style={styles.subtitle}>Acumule pontos nos seus estabelecimentos favoritos</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar estabelecimentos..."
            placeholderTextColor="#999"
          />
          <Search size={20} color="#999" />
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categorias</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {['🍕 Pizza', '🍔 Burger', '☕ Café', '🍧 Açaí', '🍣 Japonês', '🥖 Padaria'].map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard}>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Establishments */}
        <View style={styles.establishmentsContainer}>
          <Text style={styles.sectionTitle}>Estabelecimentos Próximos</Text>
          {establishments.map((establishment) => (
            <TouchableOpacity key={establishment.id} style={styles.establishmentCard}>
              <View style={styles.establishmentImage}>
                <Text style={styles.establishmentEmoji}>{establishment.image}</Text>
              </View>
              <View style={styles.establishmentInfo}>
                <Text style={styles.establishmentName}>{establishment.name}</Text>
                <Text style={styles.establishmentCategory}>{establishment.category}</Text>
                <View style={styles.ratingContainer}>
                  <View style={styles.ratingRow}>
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.rating}>{establishment.rating}</Text>
                  </View>
                  <Text style={styles.points}>+10 pontos por compra</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },

  categoriesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  categoryCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  establishmentsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  establishmentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  establishmentImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  establishmentEmoji: {
    fontSize: 30,
  },
  establishmentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  establishmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  establishmentCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#333',
  },
  points: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
});