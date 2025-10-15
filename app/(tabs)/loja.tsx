import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useCart } from '../../contexts/CartContext';

const restaurantImages = {
  diade: require('@/assets/images/logo-restaurantes/diade.jpg'),
  ampm: require('@/assets/images/logo-restaurantes/ampm.png'),
  differ: require('@/assets/images/logo-restaurantes/differ.jpg'),
  versa: require('@/assets/images/logo-restaurantes/versa.jpg'),
};

const products = [
  { id: 1, name: 'Hambúrguer Clássico', price: 'R$ 15,90', image:'' },
  { id: 2, name: 'Pizza Margherita', price: 'R$ 28,50', image: '' },
  { id: 3, name: 'Café Expresso', price: 'R$ 4,50', image: '' },
  { id: 4, name: 'Açaí 500ml', price: 'R$ 12,90', image: '' },
  { id: 5, name: 'Sanduíche Natural', price: 'R$ 8,90', image: '' },
  { id: 6, name: 'Suco Natural', price: 'R$ 6,50', image: '' },
];

function ProductCard({ id, name, price, image }) {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem({ id, name, price });
  };

  return (
    <TouchableOpacity style={styles.productCard}>
      <Text style={styles.productImage}>{image}</Text>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>{price}</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function LojaScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#E94057" />
      </TouchableOpacity>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Store Header */}
        <View style={styles.storeHeader}>
          <Image 
            source={restaurantImages.diade}
            style={styles.storeLogo}
            resizeMode="cover"
          />
        </View>
        <View>
          <Text style={styles.storeName}>DiaDe</Text>
          <Text style={styles.storeDescription}>Cafeteria • Aberto até 22h</Text>
        </View>

        {/* Products Section */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Em Destaque</Text>
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            ))}
          </View>
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  storeLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  storeName: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    color: '#E94057',
    marginBottom: 5,
  },
  storeDescription: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 20,
  },
  productsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#E94057',
    textAlign: 'center',
    marginBottom: 25,
  },
  productsGrid: {
    gap: 15,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    fontSize: 40,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#E94057',
  },
  addButton: {
    backgroundColor: '#E94057',
    width: 35,
    height: 35,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
});