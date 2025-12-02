import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../contexts/CartContext';
import { useOrders } from '../../contexts/OrderContext';
import { useUser } from '../../contexts/UserContext';
import { useState, useRef, useEffect } from 'react';
import { Dimensions } from 'react-native';
import ProductModal from '../../components/ProductModal';
import { ApiService, Product, Establishment } from '../../services/api';
import { useLocalSearchParams } from 'expo-router';

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

// Função para obter imagem do produto (API ou fallback)
const getProductImage = (product: Product) => {
  // Se tem photo_url da API, usa ela
  if (product.photo_url) {
    return { uri: product.photo_url };
  }
  
  // Fallback para imagens locais baseado no nome
  const imageMap = {
    'Red Velvet Cookie': restaurantProducts.redVeltetCookie,
    'Capuccino Cookie': restaurantProducts.capuccinoCookie,
    'Chocolate e Nozes Cookie': restaurantProducts.chocolateNozesCookie,
    'Coffee Cup': restaurantProducts.coffeeCup,
    'Cold Brew': restaurantProducts.coldBrew,
    'Soda Italiana': restaurantProducts.sodaItaliana,
    'Brownie': restaurantProducts.brownie,
  };
  return imageMap[product.name] || restaurantProducts.coffeeCup;
};

// Função para obter imagem do estabelecimento
const getEstablishmentImages = (establishment: Establishment | null) => {
  return {
    logo: establishment?.logo_url ? { uri: establishment.logo_url } : restaurantImages.diade.diade_logo,
    cover: establishment?.cover_url ? { uri: establishment.cover_url } : restaurantImages.diade.diade_header,
  };
};



function ProductCard({ id, name, price, image, description, onPress, quantity = 0 }) {
  return (
    <TouchableOpacity style={styles.productCard} onPress={() => onPress({ id, name, price, image, description, quantity })}>
      <Image source={image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{name}</Text>
        {description && (
          <Text style={styles.productDescription}>{description}</Text>
        )}
        <Text style={styles.productPrice}>{price}</Text>
      </View>
      {quantity > 0 && (
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>{quantity}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function LojaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const [activeTab, setActiveTab] = useState('destaque');
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  const { items, getTotalPrice, clearCart, itemCount } = useCart();
  const { orders } = useOrders();
  const { getStorePoints, setLastStore } = useUser();
  const [storePoints, setStorePoints] = useState(0);

  useEffect(() => {
    const loadStorePoints = async () => {
      if (id) {
        const points = await getStorePoints(id);
        setStorePoints(points);
      }
    };
    loadStorePoints();
  }, [id, getStorePoints]);
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);
  
  // Estados da API
  const [products, setProducts] = useState<Product[]>([]);
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Carregar dados da API
  useEffect(() => {
    loadStoreData();
    // Registrar visita à loja
    if (id) {
      setLastStore(id);
    }
  }, [id]);

  const loadStoreData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando dados para loja ID:', id);
      
      // Tentar carregar da API, se falhar usar dados locais
      try {
        console.log('Tentando carregar da API...');
        const [establishmentData, productsData] = await Promise.all([
          ApiService.getEstablishment(id),
          ApiService.getProducts(id)
        ]);
        
        console.log('Dados da API carregados:', { establishmentData, productsData });
        setEstablishment(establishmentData);
        setProducts(productsData);
      } catch (apiError) {
        console.log('Erro na API, usando dados locais:', apiError);
        // Fallback para dados locais
        const fallbackProducts = ApiService.getFallbackProducts(id);
        const fallbackEstablishments = ApiService.getFallbackEstablishments();
        const fallbackEstablishment = fallbackEstablishments.find(e => e.id === id);
        
        console.log('Dados locais:', { fallbackEstablishment, fallbackProducts });
        setEstablishment(fallbackEstablishment || null);
        setProducts(fallbackProducts);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados da loja');
    } finally {
      setLoading(false);
    }
  };

  // Usuários fake do ranking
  const fakeUsers = [
    { name: 'Edécio Fernando', points: 1850 },
    { name: 'Angelo Luz', points: 1620 },
    { name: 'Bruna', points: 1450 },
    { name: 'Pablo Chiaro', points: 1280 },
    { name: 'Arthur Ortiz', points: 980 },
  ];
  
  // Criar ranking completo
  const getRanking = () => {
    const userPoints = calcularPontosDiaDe();
    const allUsers = [...fakeUsers];
    
    // Se o usuário tem pontos, adiciona ele no ranking
    if (userPoints > 0) {
      allUsers.push({ name: 'Eric Bauer', points: userPoints });
    }
    
    // Ordena por pontos (maior para menor)
    return allUsers.sort((a, b) => b.points - a.points);
  };
  
  // Usar pontos do contexto de usuário
  const calcularPontosDiaDe = () => {
    return storePoints;
  };
  
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    if (currentScrollY > 280) {
      setIsHeaderVisible(true);
    } else {
      setIsHeaderVisible(false);
    }
  };



  const handleBackPress = () => {
    if (items.length > 0) {
      setShowExitAlert(true);
    } else {
      router.replace('/(tabs)');
    }
  };

  const confirmExit = () => {
    clearCart();
    router.replace('/(tabs)');
  };

  const getProductQuantity = (productId) => {
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handleProductPress = (product) => {
    const currentQuantity = getProductQuantity(product.id);
    setSelectedProduct({ ...product, quantity: currentQuantity });
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  // Converter produtos da API para formato do componente
  const formatProductsForDisplay = (apiProducts: Product[], isPointsTab: boolean) => {
    return apiProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: isPointsTab ? `${product.points_price} pts` : `R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')}`,
      image: getProductImage(product),
      description: product.description,
    }));
  };

  if (!fontsLoaded) {
    return null;
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Carregando loja...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={48} color={PRIMARY_COLOR} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadStoreData}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const displayProducts = formatProductsForDisplay(products, activeTab === 'pontos');

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
            <Text style={styles.floatingStoreName}>{establishment?.name || ''}</Text>
            <Image 
              source={getEstablishmentImages(establishment).logo}
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
          <Image source={getEstablishmentImages(establishment).cover} style={styles.storeHeaderImage} />
          <View style={styles.logoContainer}>
            <Image 
              source={getEstablishmentImages(establishment).logo}
              style={styles.storeLogo}
              resizeMode="cover"
            />
          </View>
        </View>
        <View>
          <Text style={styles.storeName}>{establishment?.name || 'Carregando...'}</Text>
          <View style={styles.storeInfoRow}>
            <View style={styles.ratingSection}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.storeRating}>{(4.2 + Math.random() * 0.7).toFixed(1)}</Text>
            </View>
            <Text style={styles.storePipe}>|</Text>
            <Text style={styles.storeDescription}>{establishment?.description || establishment?.category || 'Carregando...'}</Text>
          </View>
        </View>

        <View style={styles.pointsSection}>
          <View style={styles.pointsRow}>
            <Ionicons name="sparkles" size={16} color="#E94057" />
            <Text style={styles.pointsText}>Você tem <Text style={styles.pointsValue}>{storePoints} pontos</Text></Text>
            <TouchableOpacity style={styles.trophyButton} onPress={() => setShowRankingModal(true)}>
              <Ionicons name="trophy" size={20} color="#E94057" />
            </TouchableOpacity>
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
          

          
          <View style={styles.categoriesContainer}>
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Produtos</Text>
              <View style={styles.productsGrid}>
                {displayProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    description={product.description}
                    quantity={getProductQuantity(product.id)}
                    onPress={handleProductPress} 
                  />
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
            <Text style={styles.cartItemCount}>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</Text>
            <View style={styles.cartItems}>
              {items.slice(0, 2).map((item, index) => (
                <Text key={index} style={styles.cartItemText}>
                  {item.quantity}x {item.name}
                </Text>
              ))}
              {items.length > 2 && (
                <Text style={styles.moreItemsText}>+{items.length - 2} itens</Text>
              )}
            </View>
            <Text style={styles.cartTotal}>Total: {getTotalPrice()}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push(`/finalizacao-pedido?storeId=${id}`)}>
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
      
      {/* Ranking Modal */}
      {showRankingModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.rankingModalContainer}>
            <View style={styles.rankingModal}>
            <View style={styles.rankingHeader}>
              <Text style={styles.rankingTitle}>Ranking {establishment?.name || 'Loja'}</Text>
              <TouchableOpacity onPress={() => setShowRankingModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.rankingList}>
              {getRanking().map((user, index) => (
                <View key={index} style={styles.rankingItem}>
                  <View style={styles.rankingPosition}>
                    <Text style={styles.positionText}>{index + 1}º</Text>
                  </View>
                  <View style={[styles.userAvatar, user.name === 'Eric Bauer' && styles.currentUserAvatar]}>
                    <Ionicons 
                      name="person" 
                      size={20} 
                      color={user.name === 'Eric Bauer' ? '#E94057' : '#999'} 
                    />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, user.name === 'Eric Bauer' && styles.currentUserName]}>
                      {user.name}
                    </Text>
                    <Text style={styles.userPoints}>{user.points} pontos</Text>
                  </View>
                  {index === 0 && (
                    <Ionicons name="trophy" size={20} color="#FFD700" />
                  )}
                </View>
              ))}
            </ScrollView>
            </View>
          </View>
        </View>
      )}
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
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 6,
    lineHeight: 16,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: PRIMARY_COLOR,
  },
  quantityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  quantityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
    marginBottom: 4,
  },
  cartItems: {
    marginBottom: 4,
  },
  cartItemText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },
  moreItemsText: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#999',
    fontStyle: 'italic',
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
  trophyButton: {
    marginLeft: 10,
    padding: 5,
  },
  rankingModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  rankingModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    maxHeight: '70%',
    width: '100%',
    maxWidth: 350,
  },
  rankingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rankingTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  rankingList: {
    flex: 1,
    padding: 20,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  rankingPosition: {
    width: 30,
    alignItems: 'center',
  },
  positionText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#E94057',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  currentUserAvatar: {
    backgroundColor: 'rgba(233, 64, 87, 0.1)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  currentUserName: {
    color: '#E94057',
  },
  userPoints: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
});