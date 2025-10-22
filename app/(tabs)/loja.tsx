import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../contexts/CartContext';
import { useState, useRef } from 'react';
import { Dimensions } from 'react-native';

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

  const [activeTab, setActiveTab] = useState('destaque');
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('cookies');
  
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
    
    // Mostrar header compacto quando ultrapassar o nome do restaurante (280px)
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Always Visible Back Button */}
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>
      
      {/* Floating Header */}
      {isHeaderVisible && (
        <View style={styles.floatingHeader}>
          <View style={styles.floatingHeaderContent}>
            <TouchableOpacity onPress={() => router.back()}>
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
        {/* Store Header */}
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
          <Text style={styles.storeDescription}>Cafeteria | Aberto até 22h</Text>
        </View>

        {/* User Points Section */}
        <View style={styles.pointsSection}>
          <View style={styles.pointsCard}>
            <View style={styles.pointsIcon}>
              <Ionicons name="star" size={20} color="#FFD700" />
            </View>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Seus Pontos</Text>
              <Text style={styles.pointsValue}>1.250 pts</Text>
            </View>
            <TouchableOpacity style={styles.pointsButton}>
              <Text style={styles.pointsButtonText}>Ver Histórico</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Products Section */}
        <View style={styles.productsSection}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'destaque' && styles.activeTab]}
              onPress={() => setActiveTab('destaque')}
            >
              <Text style={[styles.tabText, activeTab === 'destaque' && styles.activeTabText]}>Em Destaque</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'pontos' && styles.activeTab]}
              onPress={() => setActiveTab('pontos')}
            >
              <Text style={[styles.tabText, activeTab === 'pontos' && styles.activeTabText]}>Cardápio de Pontos</Text>
            </TouchableOpacity>
          </View>
          
          {/* Filters */}
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
          
          {/* Products by Category */}
          <View style={styles.categoriesContainer}>
            {/* Cookies Section */}
            <View ref={cookiesRef} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Cookies</Text>
              <View style={styles.productsGrid}>
                {(activeTab === 'destaque' ? products : pointsProducts)
                  .filter(product => product.category === 'cookies')
                  .map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
              </View>
            </View>
            
            {/* Bebidas Section */}
            <View ref={bebidasRef} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Bebidas</Text>
              <View style={styles.productsGrid}>
                {(activeTab === 'destaque' ? products : pointsProducts)
                  .filter(product => product.category === 'bebidas')
                  .map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
              </View>
            </View>
            
            {/* Brownies Section */}
            <View ref={browniesRef} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Brownies</Text>
              <View style={styles.productsGrid}>
                {(activeTab === 'destaque' ? products : pointsProducts)
                  .filter(product => product.category === 'brownies')
                  .map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
              </View>
            </View>
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
    zIndex: 3,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
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
  storeDescription: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  pointsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_COLOR,
  },
  pointsIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF8E1',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
  },
  pointsButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pointsButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: PRIMARY_COLOR,
  },
  productsSection: {
    paddingHorizontal: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 4,
    marginBottom: 25,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: PRIMARY_COLOR,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  filtersScroll: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 5,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  activeFilterButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  categoriesContainer: {
    paddingHorizontal: 0,
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
  addButton: {
    backgroundColor: PRIMARY_COLOR,
    width: 35,
    height: 35,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
});