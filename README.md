# MasakYuk - Recipe Spin Wheel Application

A full-stack web application featuring an interactive recipe spin wheel with advanced filtering capabilities. Built with Go backend (Gin + MySQL + sqlc) and React TypeScript frontend.

## 🎯 Features

- **Interactive Spin Wheel**: CSS transform-based animation that smoothly rotates to selected recipe
- **Advanced Filtering**: Search, skill level, variant, category, and cooking time filters
- **Clean Architecture**: Backend follows handler → service → repository pattern
- **Type-Safe Queries**: Using sqlc for compile-time SQL validation
- **Modern UI**: Gradient designs, smooth animations, and responsive layout
- **Pagination**: Efficient data loading with metadata

## 📁 Project Structure

```
masakyuk/
├── backend/
│   ├── cmd/
│   │   └── api/
│   │       └── main.go              # Application entry point
│   ├── db/
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql
│   │   └── queries/
│   │       └── query.sql            # sqlc queries
│   ├── internal/
│   │   ├── config/
│   │   │   └── config.go            # Configuration management
│   │   ├── db/                      # Generated sqlc code
│   │   ├── handler/
│   │   │   └── recipes_handler.go   # HTTP handlers
│   │   ├── repository/
│   │   │   └── recipes_repository.go # Data access layer
│   │   └── service/
│   │       ├── recipes_service.go   # Business logic
│   │       └── recipes_service_test.go
│   ├── .env.example
│   ├── go.mod
│   └── sqlc.yaml
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── client.ts            # Axios instance
    │   │   └── recipes.ts           # API functions
    │   ├── components/
    │   │   ├── Wheel.tsx            # Animated wheel
    │   │   ├── Wheel.module.css
    │   │   ├── ResultModal.tsx      # Recipe result display
    │   │   └── ResultModal.module.css
    │   ├── pages/
    │   │   ├── SpinPage.tsx         # Main page
    │   │   └── SpinPage.module.css
    │   ├── types/
    │   │   └── recipe.ts            # TypeScript interfaces
    │   ├── App.tsx
    │   ├── App.css
    │   └── main.tsx
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Go 1.21+
- MySQL 8.0+
- Node.js 18+
- npm or yarn
- sqlc (for regenerating queries)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   go mod download
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Create database**
   ```bash
   mysql -u root -p
   ```
   
   ```sql
   CREATE DATABASE masakyuk;
   EXIT;
   ```

5. **Run migrations**
   ```bash
   mysql -u root -p masakyuk < db/migrations/001_initial_schema.sql
   ```

6. **Generate sqlc code** (if you modify queries)
   ```bash
   sqlc generate
   ```

7. **Run the server**
   ```bash
   go run cmd/api/main.go
   ```

   Server will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will start on `http://localhost:5173`

## 🔌 API Endpoints

### GET /api/recipes
List recipes with filters and pagination

**Query Parameters:**
- `search` (string): Search in recipe titles
- `skill_level` (string): beginner | intermediate | advanced
- `variant_id` (integer): Filter by variant
- `category_id` (integer): Filter by category
- `max_cooking_time` (integer): Maximum cooking time in minutes
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page (default: 10, max: 100)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Nasi Goreng",
      "description": "Classic Indonesian fried rice",
      "ingredients": "Rice, eggs, vegetables...",
      "instructions": "1. Heat oil...",
      "cooking_time": 20,
      "skill_level": "beginner",
      "category_id": 1,
      "category_name": "Indonesian",
      "variant_id": 1,
      "variant_name": "Regular",
      "servings": 2
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "per_page": 10,
    "total_pages": 3
  }
}
```

### POST /api/spin
Get a random recipe based on filters

**Request Body:**
```json
{
  "search": "nasi",
  "skill_level": "beginner",
  "variant_id": 1,
  "category_id": 1,
  "max_cooking_time": 30
}
```

**Response:**
```json
{
  "recipe": {
    "id": 1,
    "title": "Nasi Goreng",
    ...
  }
}
```

### GET /api/recipes/:id
Get a single recipe by ID

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
go test ./internal/service/... -v
```

## 🎨 Frontend Animation Logic

The wheel animation uses CSS transforms with the following approach:

1. **Initial State**: Wheel displays 8 recipes in segments
2. **Spin Trigger**: User clicks "SPIN THE WHEEL" button
3. **API Call**: POST to `/api/spin` with current filters
4. **Calculate Rotation**: 
   - Find selected recipe index in current wheel
   - Calculate segment angle (360° / number of recipes)
   - Add 5 full rotations (1800°) for visual effect
   - Rotate to selected segment position
5. **CSS Animation**: 4-second cubic-bezier easing
6. **Result Display**: Modal shows recipe details after animation completes

## 🏗️ Architecture

### Backend Flow
```
HTTP Request → Handler → Service → Repository → Database
                  ↓
            Validation & Business Logic
                  ↓
            JSON Response
```

### Frontend Flow
```
User Action → React Query → API Client → Backend
                ↓
          State Update → Component Re-render
                ↓
          Wheel Animation → Result Modal
```

## 🔧 Technology Stack

**Backend:**
- Go 1.21
- Gin Web Framework
- MySQL 8.0+
- sqlc (type-safe SQL)
- database/sql (MySQL driver)

**Frontend:**
- React 18
- TypeScript 5
- Vite 5
- React Query (TanStack Query)
- Axios
- CSS Modules

## 📝 Development Notes

- **No ORM**: Using sqlc for type-safe SQL queries
- **No SELECT ***: All queries explicitly list columns
- **Clean Architecture**: Clear separation of concerns
- **No External Wheel Library**: Custom CSS transform animation
- **Predictable State**: React Query handles caching and loading states
- **Error Handling**: Comprehensive error states in UI and API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

MIT License
# masakyuk
