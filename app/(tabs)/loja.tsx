import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../contexts/CartContext';
import { store } from 'expo-router/build/global-state/router-store';

const PRIMARY_COLOR = '#E94057';

const restaurantImages = {
  diade: require('@/assets/images/logo-restaurantes/diade.jpg'),
  ampm: require('@/assets/images/logo-restaurantes/ampm.png'),
  differ: require('@/assets/images/logo-restaurantes/differ.jpg'),
  versa: require('@/assets/images/logo-restaurantes/versa.jpg'),
  cannabis: require('@/assets/images/logo-restaurantes/cannabis store.jpg'),
};

const restaurantProducts = {
  redVeltetCookie: require('@/assets/images/diade-images/red velvet cookie.jpeg'),
  capuccinoCookie: require('@/assets/images/diade-images/capuccino cookie.jpeg'),
  brownie: require('@/assets/images/diade-images/brownie.png'),
  coffeeCup: require('@/assets/images/diade-images/coffee cup.png'),
  sodaItaliana: require('@/assets/images/diade-images/soda italiana.jpg'),
  coldBrew: require('@/assets/images/diade-images/cold brew.jpeg'),
  chocolateNozesCookie: require('@/assets/images/diade-images/chocolate e nozes cookie.jpeg'),
}; 

const products = [
  { id: 1, name: 'Red Velvet Cookie', price: 'R$ 7,95', image: restaurantProducts.redVeltetCookie },
  { id: 2, name: 'Capuccino Cookie', price: 'R$ 7,95', image: restaurantProducts.capuccinoCookie },
  { id: 3, name: 'Chcolate e Nozes Cookie', price: 'R$ 6,95', image: restaurantProducts.chocolateNozesCookie },
  { id: 4, name: 'Coffee Cup', price: 'R$ 8,90', image: restaurantProducts.coffeeCup },
  { id: 5, name: 'Cold Brew', price: 'R$ 12,80', image: restaurantProducts.coldBrew },
  { id: 6, name: 'Soda Italiana', price: 'R$ 15,50', image: restaurantProducts.sodaItaliana },
  { id: 6, name: 'Brownie', price: 'R$ 7,90', image: restaurantProducts.brownie },
];

function ProductCard({ id, name, price, image }) {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem({ id, name, price });
  };

  return (
    <TouchableOpacity style={styles.productCard}>
      <Image source={image} style={styles.productImage} />
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
        <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
      </TouchableOpacity>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Store Header */}
        <View style={styles.storeHeader}>
          <View style={styles.logoContainer}>
            <Image 
              source={restaurantImages.diade}
              style={styles.storeLogo}
              resizeMode="cover"
            />
          </View>
        </View>
        <View>
          <Text style={styles.storeName}>DiaDe</Text>
          <Text style={styles.storeDescription}>Cafeteria | Aberto até 22h</Text>
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
    width: '100%',
    height: 150,
    backgroundColor: PRIMARY_COLOR,
    marginBottom: 20,
  },
  logoContainer: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 75,
    marginBottom: 25,
  },
  storeLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  storeName: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    color: PRIMARY_COLOR,
    marginBottom: 5,
    marginTop: 40,
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
    color: PRIMARY_COLOR,
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
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
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
    color: PRIMARY_COLOR,
  },
  addButton: {
    backgroundColor: PRIMARY_COLOR,
    width: 35,
    height: 35,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
});