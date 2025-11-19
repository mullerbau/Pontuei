# 📋 PLANO DE INTEGRAÇÃO COM BACK-END - PONTUEI

## 🎯 VISÃO GERAL
Este documento mapeia todos os pontos onde o front-end atual (dados estáticos) deve ser integrado com APIs do back-end.

---

## 🔐 1. AUTENTICAÇÃO E USUÁRIOS

### 1.1 Login (`app/auth/login.tsx`)
**ATUAL:** AsyncStorage + validação local
**NECESSÁRIO:**
- **POST** `/auth/login`
- **Body:** `{ email, password }`
- **Response:** `{ token, user: { id, name, email, points, avatar } }`
- **Headers:** Authorization Bearer token para requests subsequentes

### 1.2 Cadastro (`app/auth/Cadastro.tsx`)
**ATUAL:** AsyncStorage local
**NECESSÁRIO:**
- **POST** `/auth/register`
- **Body:** `{ name, cpf, email, password }`
- **Response:** `{ message, user: { id, name, email } }`

### 1.3 Perfil do Usuário (`app/(tabs)/perfil.tsx`)
**ATUAL:** Dados fixos "Eric Bauer"
**NECESSÁRIO:**
- **GET** `/user/profile`
- **Response:** `{ id, name, email, avatar, totalPoints, favoriteStores }`
- **PUT** `/user/profile` (para atualizações)

---

## 🏪 2. ESTABELECIMENTOS E LOJAS

### 2.1 Lista de Estabelecimentos (`app/(tabs)/home.tsx`)
**ATUAL:** Array estático `establishments`
**NECESSÁRIO:**
- **GET** `/establishments`
- **GET** `/establishments/nearby?lat={lat}&lng={lng}&radius={radius}`
- **Response:** `[{ id, name, image, rating, distance, category }]`

### 2.2 Detalhes da Loja (`app/loja.tsx`)
**ATUAL:** Dados fixos "DiaDe"
**NECESSÁRIO:**
- **GET** `/establishments/{id}`
- **Response:** `{ id, name, description, image, rating, hours, products, categories }`

### 2.3 Produtos da Loja (`app/loja.tsx`)
**ATUAL:** Arrays estáticos `products` e `pointsProducts`
**NECESSÁRIO:**
- **GET** `/establishments/{id}/products`
- **GET** `/establishments/{id}/products?category={category}`
- **Response:** `[{ id, name, price, pointsPrice, image, category, description }]`

---

## 💎 3. SISTEMA DE PONTOS

### 3.1 Pontos do Usuário
**ATUAL:** Valor fixo "1.200 pontos"
**NECESSÁRIO:**
- **GET** `/user/points`
- **Response:** `{ totalPoints, pointsHistory, pointsByStore }`

### 3.2 Histórico de Pontos
**ATUAL:** Não implementado
**NECESSÁRIO:**
- **GET** `/user/points/history`
- **Response:** `[{ date, points, type, description, storeId }]`

### 3.3 Lojas Favoritas com Pontos (`app/(tabs)/perfil.tsx`)
**ATUAL:** Array estático `pontosLojas`
**NECESSÁRIO:**
- **GET** `/user/favorite-stores`
- **Response:** `[{ storeId, storeName, points, icon }]`

---

## 🛒 4. CARRINHO E PEDIDOS

### 4.1 Gerenciamento do Carrinho
**ATUAL:** Context local `CartContext`
**NECESSÁRIO:**
- **POST** `/cart/add` - `{ productId, quantity }`
- **PUT** `/cart/update` - `{ productId, quantity }`
- **DELETE** `/cart/remove/{productId}`
- **GET** `/cart`
- **DELETE** `/cart/clear`

### 4.2 Finalização de Pedido (`app/finalizacao-pedido.tsx`)
**ATUAL:** Context local
**NECESSÁRIO:**
- **POST** `/orders`
- **Body:** `{ items, paymentMethod, deliveryMethod, total }`
- **Response:** `{ orderId, status, estimatedTime }`

### 4.3 Histórico de Pedidos (`app/(tabs)/pedidos.tsx`)
**ATUAL:** Context local `OrderContext`
**NECESSÁRIO:**
- **GET** `/user/orders`
- **Response:** `[{ id, items, total, status, createdAt, storeId }]`

### 4.4 Status do Pedido
**ATUAL:** Estados fixos
**NECESSÁRIO:**
- **GET** `/orders/{id}/status`
- **WebSocket** para updates em tempo real
- **Response:** `{ status: 'em_preparo' | 'pronto' | 'entregue' }`

---

## 🔍 5. BUSCA E FILTROS

### 5.1 Busca Geral (`app/(tabs)/buscar.tsx`)
**ATUAL:** Não implementado
**NECESSÁRIO:**
- **GET** `/search?q={query}&type={establishments|products}`
- **Response:** `{ establishments: [], products: [] }`

### 5.2 Filtros de Categoria (`app/loja.tsx`)
**ATUAL:** Filtro local por categoria
**NECESSÁRIO:**
- **GET** `/establishments/{id}/products?category={category}`

---

## 📱 6. NOTIFICAÇÕES E AVALIAÇÕES

### 6.1 Avaliação de Pedidos (`app/pedido-sucesso.tsx`)
**ATUAL:** Apenas UI local
**NECESSÁRIO:**
- **POST** `/orders/{id}/rating`
- **Body:** `{ rating, comment }`

### 6.2 Notificações
**ATUAL:** Não implementado
**NECESSÁRIO:**
- **GET** `/user/notifications`
- **PUT** `/notifications/{id}/read`
- **Push Notifications** para status de pedidos

---

## 🗂️ 7. ESTRUTURA DE ARQUIVOS PARA INTEGRAÇÃO

### 7.1 Criar Camada de Serviços
```
services/
├── api.ts              # Configuração base do Axios
├── auth.service.ts     # Serviços de autenticação
├── user.service.ts     # Serviços do usuário
├── establishment.service.ts # Serviços de estabelecimentos
├── order.service.ts    # Serviços de pedidos
├── points.service.ts   # Serviços de pontos
└── notification.service.ts # Serviços de notificações
```

### 7.2 Gerenciamento de Estado Global
```
contexts/
├── AuthContext.tsx     # Estado de autenticação
├── UserContext.tsx     # Dados do usuário
├── CartContext.tsx     # Carrinho (já existe, adaptar)
├── OrderContext.tsx    # Pedidos (já existe, adaptar)
└── NotificationContext.tsx # Notificações
```

### 7.3 Utilitários
```
utils/
├── storage.ts          # AsyncStorage helpers
├── api-client.ts       # Cliente HTTP configurado
├── error-handler.ts    # Tratamento de erros
└── validators.ts       # Validações
```

---

## 🔧 8. CONFIGURAÇÕES NECESSÁRIAS

### 8.1 Variáveis de Ambiente
```env
API_BASE_URL=https://api.pontuei.com
API_TIMEOUT=10000
WEBSOCKET_URL=wss://ws.pontuei.com
```

### 8.2 Dependências Adicionais
```json
{
  "axios": "^1.6.0",
  "react-query": "^3.39.0",
  "@react-native-async-storage/async-storage": "já instalado",
  "react-native-push-notification": "^8.1.1"
}
```

---

## 🚀 9. FASES DE IMPLEMENTAÇÃO

### FASE 1: Autenticação
- [ ] Configurar API client
- [ ] Implementar AuthContext
- [ ] Integrar login/cadastro
- [ ] Gerenciar tokens

### FASE 2: Dados do Usuário
- [ ] Perfil do usuário
- [ ] Sistema de pontos
- [ ] Lojas favoritas

### FASE 3: Estabelecimentos
- [ ] Lista de estabelecimentos
- [ ] Detalhes da loja
- [ ] Produtos e categorias

### FASE 4: Carrinho e Pedidos
- [ ] Carrinho sincronizado
- [ ] Finalização de pedidos
- [ ] Histórico de pedidos
- [ ] Status em tempo real

### FASE 5: Funcionalidades Avançadas
- [ ] Busca e filtros
- [ ] Notificações push
- [ ] Avaliações
- [ ] Analytics

---

## ⚠️ 10. PONTOS DE ATENÇÃO

### 10.1 Tratamento de Erros
- Conexão offline
- Timeout de requests
- Erros de validação
- Tokens expirados

### 10.2 Performance
- Cache de dados
- Lazy loading
- Otimização de imagens
- Paginação

### 10.3 Segurança
- Validação de tokens
- Sanitização de dados
- HTTPS obrigatório
- Rate limiting

---

## 📊 11. MÉTRICAS E MONITORAMENTO

### 11.1 Analytics
- Eventos de usuário
- Conversão de pedidos
- Tempo de resposta das APIs
- Erros de integração

### 11.2 Logs
- Requests/responses
- Erros de autenticação
- Falhas de sincronização

---

**📝 PRÓXIMOS PASSOS:**
1. Criar branch `integracao`
2. Implementar estrutura base de serviços
3. Configurar API client
4. Começar pela Fase 1 (Autenticação)