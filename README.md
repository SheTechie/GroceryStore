# 🛒 Grocery App - React & TypeScript

A fully responsive grocery shopping web application built with React and TypeScript, covering all essential React and TypeScript concepts.

## ✨ Features

### Core Features
- ✅ **Product Listing** - Browse products with categories
- ✅ **Product Search** - Real-time search with debouncing
- ✅ **Category Filtering** - Filter products by category
- ✅ **Shopping Cart** - Add, remove, and update quantities
- ✅ **Checkout Process** - Complete checkout with form validation
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Local Storage** - Cart persists across sessions

### Technical Features
- ✅ **TypeScript** - Full type safety throughout
- ✅ **React Hooks** - useState, useEffect, useContext, custom hooks
- ✅ **Context API** - Global state management for cart
- ✅ **React Router** - Client-side routing
- ✅ **Custom Hooks** - useCart, useProducts, useLocalStorage, useDebounce
- ✅ **Responsive CSS** - Mobile, tablet, and desktop layouts
- ✅ **Component Architecture** - Reusable, modular components

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ProductCard.tsx
│   ├── ProductList.tsx
│   ├── Navbar.tsx
│   └── CartItem.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   └── OrderSuccess.tsx
├── context/            # React Context providers
│   └── CartContext.tsx
├── hooks/              # Custom React hooks
│   ├── useCart.ts
│   ├── useProducts.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── data/               # Mock data
│   └── mockProducts.ts
└── App.tsx            # Main app component
```

## 🎯 Concepts Covered

### TypeScript
- ✅ Types and Interfaces
- ✅ Union Types
- ✅ Generics
- ✅ Type Guards
- ✅ Utility Types

### React Fundamentals
- ✅ Functional Components
- ✅ Props and State
- ✅ JSX
- ✅ Event Handling
- ✅ Conditional Rendering
- ✅ Lists and Keys

### React Hooks
- ✅ useState
- ✅ useEffect
- ✅ useContext
- ✅ Custom Hooks
- ✅ useRef (implicit in debounce)

### Advanced React
- ✅ Context API
- ✅ Component Composition
- ✅ Prop Drilling vs Context
- ✅ Performance Considerations

### Routing
- ✅ React Router
- ✅ Route Configuration
- ✅ Navigation
- ✅ URL Parameters

### Styling
- ✅ CSS Modules
- ✅ Responsive Design
- ✅ Mobile-First Approach
- ✅ Flexbox and Grid
- ✅ Media Queries

## 🎨 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 968px
- **Desktop**: > 968px

## 📱 Pages

1. **Home** (`/`) - Hero section with product listing and filters
2. **Products** (`/products`) - All products with search and filters
3. **Cart** (`/cart`) - Shopping cart with order summary
4. **Checkout** (`/checkout`) - Checkout form with validation
5. **Order Success** (`/order-success`) - Confirmation page

## 🛠️ Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 📚 Learning Path

This app demonstrates:
1. TypeScript fundamentals with real-world types
2. React component architecture
3. State management patterns
4. Custom hooks for reusable logic
5. Context API for global state
6. Routing and navigation
7. Form handling and validation
8. Responsive design principles
9. API integration patterns
10. Local storage persistence

## 🔧 Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router** - Routing
- **CSS3** - Styling with responsive design

## 📝 Notes

- Cart data is persisted in localStorage
- Mock API service simulates network delays
- All images use Unsplash placeholder URLs
- Form validation includes email format checking

## 🚀 Deployment

### Deploy to Vercel

This app is configured for easy deployment on Vercel.

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
6. Click "Deploy"

#### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

The `vercel.json` configuration file handles:
- SPA routing (all routes redirect to `index.html` for React Router)
- Cache headers for static assets
- Build settings

## 🚀 Future Enhancements

- [ ] User authentication
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Order history
- [ ] Dark mode
- [ ] Product detail pages
- [ ] Payment integration
- [ ] Backend API integration

