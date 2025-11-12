import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';
import { useState, useRef } from 'react';
import { Dimensions } from 'react-native';
import ProductModal from '../components/ProductModal';

const PRIMARY_COLOR = '#E94057';

const restaurantImages = 
  {
    diade: { diade_logo: require('@/assets/images/logo-restaurantes/diade.jpg'),
      diade_header: require('@/assets/images/diade-images/capa.jpg'),
    },
    ampm: { ampm_logo: require('@/assets/images/logo-restaurantes/ampm.png'),
    },
    differ: { differ_logo: require('@/assets/images/logo-restaurantes/differ.jpg'),
  },
    versa: { versa_logo: require('@/assets/images/logo-restaurantes/versa.jpg'),
  },
    cannabis: { cannabis_logo: require('@/assets/images/logo-restaurantes/cannabis store.jpg'),
  }
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
  { id: 1, name: 'Red Velvet Cookie', price: 'R$ 7,95', image: restaurantProducts.redVeltetCookie, category: 'cookies' },
  { id: 2, name: 'Capuccino Cookie', price: 'R$ 7,95', image: restaurantProducts.capuccinoCookie, category: 'cookies' },
  { id: 3, name: 'Chcolate e Nozes Cookie', price: 'R$ 6,95', image: restaurantProducts.chocolateNozesCookie, category: 'cookies' },
  { id: 4, name: 'Coffee Cup', price: 'R$ 8,90', image: restaurantProducts.coffeeCup, category: 'bebidas' },
  { id: 5, name: 'Cold Brew', price: 'R$ 12,80', image: restaurantProducts.coldBrew, category: 'bebidas' },
  { id: 6, name: 'Soda Italiana', price: 'R$ 15,50', image: restaurantProducts.sodaItaliana, category: 'bebidas' },
  { id: 7, name: 'Brownie', price: 'R$ 7,90', image: restaurantProducts.brownie, category: 'brownies' },
];

const pointsProducts = [
  { id: 1, name: 'Red Velvet Cookie', price: '150 pts', image: restaurantProducts.redVeltetCookie, category: 'cookies' },
  { id: 2, name: 'Capuccino Cookie', price: '150 pts', image: restaurantProducts.capuccinoCookie, category: 'cookies' },
  { id: 3, name: 'Chcolate e Nozes Cookie', price: '130 pts', image: restaurantProducts.chocolateNozesCookie, category: 'cookies' },
  { id: 4, name: 'Coffee Cup', price: '170 pts', image: restaurantProducts.coffeeCup, category: 'bebidas' },
  { id: 5, name: 'Cold Brew', price: '240 pts', image: restaurantProducts.coldBrew, category: 'bebidas' },
  { id: 6, name: 'Soda Italiana', price: '290 pts', image: restaurantProducts.sodaItaliana, category: 'bebidas' },
  { id: 7, name: 'Brownie', price: '150 pts', image: restaurantProducts.brownie, category: 'brownies' },
];

function ProductCard({ id, name, price, image, onPress }) {
  return (
    <TouchableOpacity style={styles.productCard} onPress={() => onPress({ id, name, price, image })}>
      <Image source={image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function LojaScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const [activeTab, setActiveTab] = useState('destaque');
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('cookies');
  const { items, getTotalPrice, clearCart } = useCart();
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const scrollViewRef = useRef(null);
  const cookiesRef = useRef(null);
  const bebidasRef = useRef(null);
  const browniesRef = useRef(null);

  const filters = [
    { id: 'cookies', name: 'Cookies' },
    { id: 'bebidas', name: 'Bebidas' },
    { id: 'brownies', name: 'Brownies' },
  ];

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    if (currentScrollY > 280) {
      setIsHeaderVisible(true);
    } else {
      setIsHeaderVisible(false);
    }
  };

  const scrollToSection = (filterId) => {
    setActiveFilter(filterId);
    
    const positions = {
      cookies: 500,
      bebidas: 800,
      brownies: 1100
    };
    
    scrollViewRef.current?.scrollTo({ 
      y: positions[filterId], 
      animated: true 
    });
  };

  const handleBackPress = () => {
    if (items.length > 0) {
      setShowExitAlert(true);
    } else {
      router.back();
    }
  };

  const confirmExit = () => {
    clearCart();
    router.back();
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButton}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>
      
      {isHeaderVisible && (
        <View style={styles.floatingHeader}>
          <View style={styles.floatingHeaderContent}>
            <TouchableOpacity onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
            </TouchableOpacity>
            <Text style={styles.floatingStoreName}>DiaDe</Text>
            <Image 
              source={restaurantImages.diade.diade_logo}
              style={styles.floatingLogo}
              resizeMode="cover"
            />
          </View>
        </View>
      )}
      
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.storeHeader}>
          <Image source={restaurantImages.diade.diade_header} style={styles.storeHeaderImage} />
          <View style={styles.logoContainer}>
            <Image 
              source={restaurantImages.diade.diade_logo}
              style={styles.storeLogo}
              resizeMode="cover"
            />
          </View>
        </View>
        <View>
          <Text style={styles.storeName}>DiaDe</Text>
          <View style={styles.storeInfoRow}>
            <View style={styles.ratingSection}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.storeRating}>4.8</Text>
            </View>
            <Text style={styles.storePipe}>|</Text>
            <Text style={styles.storeDescription}>Cafeteria | Aberto até 22h</Text>
          </View>
        </View>

        <View style={styles.pointsSection}>
          <View style={styles.pointsRow}>
            <Ionicons name="diamond" size={16} color="#E94057" />
            <Text style={styles.pointsText}>Você tem <Text style={styles.pointsValue}>1.250 pontos</Text></Text>
          </View>
          <TouchableOpacity style={styles.pointsLinkContainer}>
            <Text style={styles.pointsLink}>Ver histórico</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productsSection}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.separateTab, activeTab === 'destaque' && styles.activeSeparateTab]}
              onPress={() => setActiveTab('destaque')}
            >
              <Text style={[styles.separateTabText, activeTab === 'destaque' && styles.activeSeparateTabText]}>Em Destaque</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.separateTab, activeTab === 'pontos' && styles.activeSeparateTab]}
              onPress={() => setActiveTab('pontos')}
            >
              <Text style={[styles.separateTabText, activeTab === 'pontos' && styles.activeSeparateTabText]}>Cardápio de Pontos</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.filtersScroll}
            contentContainerStyle={styles.filtersContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterButton, activeFilter === filter.id && styles.activeFilterButton]}
                onPress={() => scrollToSection(filter.id)}
              >
                <Text style={[styles.filterText, activeFilter === filter.id && styles.activeFilterText]}>
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.categoriesContainer}>
            <View ref={cookiesRef} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Cookies</Text>
              <View style={styles.productsGrid}>
                {(activeTab === 'destaque' ? products : pointsProducts)
                  .filter(product => product.category === 'cookies')
                  .map((product) => (
                    <ProductCard key={product.id} {...product} onPress={handleProductPress} />
                  ))}
              </View>
            </View>
            
            <View ref={bebidasRef} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Bebidas</Text>
              <View style={styles.productsGrid}>
                {(activeTab === 'destaque' ? products : pointsProducts)
                  .filter(product => product.category === 'bebidas')
                  .map((product) => (
                    <ProductCard key={product.id} {...product} onPress={handleProductPress} />
                  ))}
              </View>
            </View>
            
            <View ref={browniesRef} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Brownies</Text>
              <View style={styles.productsGrid}>
                {(activeTab === 'destaque' ? products : pointsProducts)
                  .filter(product => product.category === 'brownies')
                  .map((product) => (
                    <ProductCard key={product.id} {...product} onPress={handleProductPress} />
                  ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Cart Bottom Menu */}
      {items.length > 0 && (
        <View style={styles.cartBottomMenu}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartItemCount}>{items.length} {items.length === 1 ? 'item' : 'itens'}</Text>
            <Text style={styles.cartTotal}>Total: {getTotalPrice()}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/finalizacao-pedido')}>
            <Text style={styles.checkoutButtonText}>Finalizar Pedido</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Exit Confirmation Modal */}
      {showExitAlert && (
        <View style={styles.modalOverlay}>
          <View style={styles.alertModal}>
            <Text style={styles.alertTitle}>Sair da compra?</Text>
            <Text style={styles.alertMessage}>Certeza que quer sair da sua compra atual? Se voltar ao menu sua compra será desfeita.</Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowExitAlert(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmExit}>
                <Text style={styles.confirmButtonText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      <ProductModal 
        visible={showProductModal}
        product={selectedProduct}
        onClose={closeProductModal}
      />
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const isLargeScreen = width > 425;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingStoreName: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  floatingLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  storeHeader: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  storeHeaderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoContainer: {
    position: 'absolute',
    bottom: -30,
    left: '50%',
    marginLeft: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  storeName: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginTop: 40,
    marginBottom: 5,
    textAlign: 'center',
  },
  storeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storeRating: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  storePipe: {
    fontSize: 14,
    color: '#ccc',
    fontFamily: 'Poppins_400Regular',
  },
  storeDescription: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  pointsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
    alignItems: 'center',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  pointsText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  pointsValue: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
  },
  pointsLinkContainer: {
    marginTop: 4,
  },
  pointsLink: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: PRIMARY_COLOR,
    textDecorationLine: 'underline',
  },
  productsSection: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
    gap: 15,
  },
  separateTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeSeparateTab: {
    backgroundColor: '#fff',
    borderColor: PRIMARY_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  separateTabText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
  },
  activeSeparateTabText: {
    color: PRIMARY_COLOR,
  },
  filtersScroll: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  activeFilterButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginBottom: 15,
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

  cartBottomMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  cartInfo: {
    flex: 1,
  },
  cartItemCount: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  cartTotal: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  checkoutButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 20,
    maxWidth: 300,
  },
  alertTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  alertMessage: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  alertButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
});