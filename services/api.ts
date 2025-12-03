// Configuração da API
const API_BASE_URL = 'https://pontuei-back-end.vercel.app'; // URL do backend NestJS

// Tipos baseados no schema Prisma
export interface Establishment {
  id: string;
  name: string;
  category: string;
  description?: string;
  address: string;
  logo_url?: string;
  cover_url?: string;
  rating?: string;
  distance?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  establishment_id: string;
  name: string;
  description?: string;
  price: string; // Decimal como string
  points_price: number;
  photo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
}

export interface Order {
  id: string;
  client_id: string;
  establishment_id: string;
  status: string;
  total_amount: string;
  points_generated: number;
  pickup_type: string;
  pickup_qr_code?: string;
  created_at: string;
  updated_at: string;
  order_items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    unit_price: string;
    product: Product;
  }>;
  establishment: Establishment;
}

// Serviço de API
export class ApiService {
  private static async getAuthToken(): Promise<string | null> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem('auth_token');
    } catch {
      return null;
    }
  }

  private static async request(endpoint: string, options: RequestInit = {}) {
    try {
      console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
      
      const token = await this.getAuthToken();
      const headers: any = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
        ...options,
      });

      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Establishments
  static async getEstablishments(category?: string, search?: string): Promise<Establishment[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    const query = params.toString();
    return this.request(`/establishments${query ? `?${query}` : ''}`);
  }

  static async getEstablishment(id: string): Promise<Establishment> {
    return this.request(`/establishments/${id}`);
  }

  // Products (público - sem auth)
  static async getProducts(establishmentId: string): Promise<Product[]> {
    return this.request(`/establishments/${establishmentId}/products`);
  }

  // Orders (sem autenticação para demo)
  static async createOrder(orderData: { establishment_id: string; items: OrderItem[] }): Promise<Order> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  static async getMyOrders(): Promise<Order[]> {
    return this.request('/orders/me');
  }

  static async createPayment(orderId: string, paymentData: { amount: string; method: string }) {
    return this.request(`/orders/${orderId}/payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Autenticação
  static async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(userData: {
    name: string;
    email: string;
    cpf: string;
    password: string;
    date_of_birth: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Pontos baseados em pedidos
  static async getClientPointsFromOrders(clientId: string, establishmentId: string) {
    return this.request(`/clients/points-from-orders/${clientId}/${establishmentId}`);
  }

  static async getAllUserPoints(clientId: string) {
    return this.request(`/clients/all-points/${clientId}`);
  }

  static async getEstablishmentRanking(establishmentId: string) {
    return this.request(`/clients/establishment-ranking/${establishmentId}`);
  }

  // Testar conexão com a API
  static async testConnection(): Promise<boolean> {
    try {
      console.log('Testando conexão com API...');
      const response = await fetch(`${API_BASE_URL}/establishments`);
      console.log('Status da conexão:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Erro na conexão:', error);
      return false;
    }
  }

  // Testar autenticação JWT
  static async testAuth(): Promise<any> {
    try {
      return this.request('/establishments/debug-user');
    } catch (error) {
      console.error('Erro na autenticação:', error);
      throw error;
    }
  }

  // Fallback data para desenvolvimento
  static getFallbackEstablishments(): Establishment[] {
    return [
      {
        id: 'diade',
        name: 'DiaDe',
        category: 'Restaurante',
        description: 'Lanches e Bebidas',
        address: 'Rua das Flores, 123',
        logo_url: null,
        cover_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'ampm',
        name: 'AM/PM',
        category: 'Conveniência',
        description: 'Conveniência 24h',
        address: 'Av. Principal, 456',
        logo_url: null,
        cover_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  static getFallbackProducts(establishmentId: string): Product[] {
    const productsMap = {
      'diade': [
        {
          id: '1',
          establishment_id: 'diade',
          name: 'Red Velvet Cookie',
          description: 'Cookie de veludo vermelho',
          price: '7.95',
          points_price: 795,
          photo_url: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          establishment_id: 'diade',
          name: 'Coffee Cup',
          description: 'Café especial da casa',
          price: '8.90',
          points_price: 890,
          photo_url: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      'ampm': [
        {
          id: '3',
          establishment_id: 'ampm',
          name: 'Sanduíche Natural',
          description: 'Sanduíche com ingredientes frescos',
          price: '12.50',
          points_price: 1250,
          photo_url: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    };
    
    return productsMap[establishmentId] || [];
  }


}