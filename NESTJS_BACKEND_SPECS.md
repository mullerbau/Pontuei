# 🚀 ESPECIFICAÇÕES BACK-END - NESTJS + POSTGRESQL

## 🛠️ STACK TECNOLÓGICA
- **Framework:** NestJS (Node.js + TypeScript)
- **Banco de Dados:** Neon PostgreSQL
- **ORM:** Prisma (recomendado para Neon)
- **Autenticação:** JWT + Passport
- **Validação:** class-validator + class-transformer
- **Upload:** Multer + AWS S3/Cloudinary

---

## 📊 ESTRUTURA DO BANCO (PostgreSQL)

### Tabelas Principais
```sql
-- Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Estabelecimentos
CREATE TABLE establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  rating DECIMAL(2,1) DEFAULT 0,
  address JSONB,
  hours JSONB,
  category VARCHAR(100),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID REFERENCES establishments(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  points_price INTEGER,
  image_url VARCHAR(500),
  category VARCHAR(100),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  establishment_id UUID REFERENCES establishments(id),
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  delivery_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'em_preparo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pontos por estabelecimento
CREATE TABLE user_establishment_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  establishment_id UUID REFERENCES establishments(id),
  points INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Histórico de pontos
CREATE TABLE points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  establishment_id UUID REFERENCES establishments(id),
  points INTEGER NOT NULL,
  type VARCHAR(50), -- 'earned', 'spent', 'expired'
  description TEXT,
  order_id UUID REFERENCES orders(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🏗️ ESTRUTURA NESTJS

### Módulos Principais
```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   └── strategies/
│       └── jwt.strategy.ts
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── dto/
│       ├── user-profile.dto.ts
│       └── update-user.dto.ts
├── establishments/
│   ├── establishments.controller.ts
│   ├── establishments.service.ts
│   ├── establishments.module.ts
│   └── dto/
│       └── establishment.dto.ts
├── products/
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── products.module.ts
│   └── dto/
│       └── product.dto.ts
├── orders/
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   ├── orders.module.ts
│   └── dto/
│       ├── create-order.dto.ts
│       └── order.dto.ts
└── points/
    ├── points.controller.ts
    ├── points.service.ts
    ├── points.module.ts
    └── dto/
        └── points.dto.ts
```

---

## 📝 DTOs PRINCIPAIS

### Auth DTOs
```typescript
// auth/dto/login.dto.ts
export class LoginDto {
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(6)
  password: string;
}

// auth/dto/register.dto.ts
export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;
  
  @IsString()
  @Length(11, 11)
  cpf: string;
  
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  password: string;
}
```

### User DTOs
```typescript
// users/dto/user-profile.dto.ts
export class UserProfileDto {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalPoints: number;
  favoriteStores: FavoriteStoreDto[];
  createdAt: Date;
}

export class FavoriteStoreDto {
  storeId: string;
  storeName: string;
  points: number;
  icon: string;
}
```

### Establishment DTOs
```typescript
// establishments/dto/establishment.dto.ts
export class EstablishmentDto {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  distance?: string;
  category: string;
  hours: {
    open: string;
    close: string;
    isOpen: boolean;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}
```

---

## 🔐 ENDPOINTS PRINCIPAIS

### Autenticação
```typescript
POST /auth/login
POST /auth/register
POST /auth/refresh
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
```

### Usuários
```typescript
GET /users/profile          // Perfil do usuário logado
PUT /users/profile          // Atualizar perfil
GET /users/points           // Pontos totais
GET /users/points/history   // Histórico de pontos
GET /users/favorite-stores  // Lojas favoritas
POST /users/favorite-stores/:id  // Adicionar favorito
DELETE /users/favorite-stores/:id // Remover favorito
```

### Estabelecimentos
```typescript
GET /establishments                    // Listar todos
GET /establishments/nearby            // Próximos (lat, lng, radius)
GET /establishments/:id               // Detalhes
GET /establishments/:id/products      // Produtos
GET /establishments/:id/categories    // Categorias
GET /establishments/search            // Buscar por nome
```

### Pedidos
```typescript
POST /orders                 // Criar pedido
GET /orders                  // Histórico do usuário
GET /orders/:id              // Detalhes do pedido
GET /orders/:id/status       // Status atual
PUT /orders/:id/rating       // Avaliar pedido
```

---

## 🔧 CONFIGURAÇÕES

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/pontuei?sslmode=require"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# API
PORT=3000
NODE_ENV="development"

# Upload (opcional)
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_BUCKET_NAME="pontuei-uploads"
```

### Package.json Dependencies
```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/jwt": "^10.0.0",
  "@nestjs/passport": "^10.0.0",
  "@nestjs/platform-express": "^10.0.0",
  "@prisma/client": "^5.0.0",
  "bcrypt": "^5.1.0",
  "class-transformer": "^0.5.1",
  "class-validator": "^0.14.0",
  "passport": "^0.6.0",
  "passport-jwt": "^4.0.1",
  "prisma": "^5.0.0"
}
```

---

## 🚀 COMANDOS DE SETUP

```bash
# Criar projeto NestJS
npm i -g @nestjs/cli
nest new pontuei-backend

# Instalar dependências
npm install @nestjs/jwt @nestjs/passport @prisma/client bcrypt class-transformer class-validator passport passport-jwt

# Setup Prisma
npm install prisma --save-dev
npx prisma init
npx prisma generate
npx prisma db push

# Executar
npm run start:dev
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### ✅ Fase 1: Setup Base
- [ ] Criar projeto NestJS
- [ ] Configurar Prisma + Neon
- [ ] Setup JWT + Passport
- [ ] Criar estrutura de módulos

### ✅ Fase 2: Autenticação
- [ ] AuthModule completo
- [ ] Registro de usuários
- [ ] Login com JWT
- [ ] Guards de proteção

### ✅ Fase 3: Usuários e Pontos
- [ ] UserModule
- [ ] PointsModule
- [ ] Sistema de pontos por loja

### ✅ Fase 4: Estabelecimentos
- [ ] EstablishmentModule
- [ ] ProductModule
- [ ] Sistema de busca

### ✅ Fase 5: Pedidos
- [ ] OrderModule
- [ ] Status em tempo real
- [ ] Sistema de avaliações

---

**🎯 OBJETIVO:** Back-end NestJS completo e otimizado para integração com o front-end React Native.