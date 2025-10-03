# WebBuilder - Next.js Visual Web Builder

A modern, full-stack web builder application built with Next.js 15, TypeScript, and Tailwind CSS. This project allows users to create, edit, and manage web projects through a visual editor interface.

## 🚀 Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with PostCSS
- **Authentication**: Clerk (6.20.2)
- **State Management**: TanStack React Query (5.80.2)
- **UI Components**: Shadcn/ui components
- **Icons**: Lucide React
- **Runtime**: Bun (package manager)
- **Fonts**: Geist Sans & Geist Mono

## 📁 Project Structure

```
webbuilder/
├── public/                      # Static assets (icons, images)
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/             # Authentication routes
│   │   │   ├── sign-in/        # Login page with Clerk
│   │   │   └── sign-up/        # Registration page with Clerk
│   │   ├── (routes)/           # Main application routes
│   │   │   ├── (protected)/    # Protected routes (requires auth)
│   │   │   │   ├── dashboard/  # User dashboard & projects
│   │   │   │   ├── editor/     # Visual editor interface
│   │   │   │   └── pricing/    # Pricing page
│   │   │   └── (public)/       # Public routes
│   │   │       ├── (main)/     # Home page
│   │   │       └── preview/    # Project preview pages
│   │   ├── api/                # API routes
│   │   │   ├── elements/       # Element management endpoints
│   │   │   └── gettoken/       # Authentication token endpoint-
│   │   ├── globals.css         # Global styles & Tailwind config
│   │   └── layout.tsx          # Root layout with providers
│   ├── client/                 # React Query client configuration
│   ├── components/             # Reusable UI components
│   ├── globalstore/            # Global state management
│   ├── hooks/                  # Custom React hooks
│   ├── interfaces/             # TypeScript interfaces
│   ├── lib/                    # Utility libraries
│   ├── prisma/                 # Database schema & migrations
│   ├── providers/              # React context providers
│   ├── services/               # API service layers
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   └── middleware.ts           # Clerk authentication middleware
├── components.json             # Shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies & scripts
├── postcss.config.mjs          # PostCSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🏗️ Architecture Overview

### 🛡️ Authentication & Authorization

- **Clerk Integration**: Complete authentication system with sign-in/sign-up
- **Route Protection**: Middleware-based protection for sensitive routes
- **JWT Tokens**: Custom token service for API authentication
- **Session Management**: Cached token system for performance

### 🎨 Editor System

The visual editor supports multiple element types:

- **Base Elements**: Basic containers and frames
- **Form Elements**: Inputs, selects, buttons, forms
- **Data Elements**: Charts, data tables, lists
- **Layout Elements**: Frames with nested element support

### 📊 Element Types

```typescript
- BaseElement: Basic container elements
- FrameElement: Container with nested elements
- ButtonElement: Interactive buttons with actions
- InputElement: Form input fields
- SelectElement: Dropdown selects with options
- ListElement: Dynamic list containers
- ChartElement: Data visualizations (bar, line, pie, etc.)
- DataTableElement: Tabular data with sorting/filtering
- FormElement: Form containers with validation
- DataLoaderElement: API data binding and fetching
```

### 🔗 Databinding

The DataLoaderElement enables dynamic data binding by fetching data from APIs and binding it to child elements:

#### Basic Usage

1. **Add a DataLoaderElement** to your canvas
2. **Configure API settings** in the sidebar:
   - API URL (e.g., `https://jsonplaceholder.typicode.com/posts`)
   - HTTP Method (GET, POST, PUT, DELETE)
   - Authorization token (optional)
   - Request headers and body (optional)
3. **Add child elements** like Text, List, or Frame elements
4. **Bind data** by placing elements that can consume data (Text elements display data values, List elements iterate over arrays)

#### Data Binding Examples

**Simple Text Binding:**
- Add a Text element inside DataLoader
- The Text element will display the fetched data as a string

**List Binding:**
- Add a List element inside DataLoader
- If API returns an array, each item becomes a list item
- Add Text elements inside the List to display item properties

**Complex Binding:**
```json
// API Response: { "title": "Hello World", "items": ["item1", "item2"] }
{
  "DataLoader": {
    "settings": { "apiUrl": "https://api.example.com/data" },
    "elements": [
      { "type": "Text", "content": "" }, // Displays: Hello World
      {
        "type": "List",
        "elements": [
          { "type": "Text", "content": "" } // Displays: item1, item2
        ]
      }
    ]
  }
}
```

### 🔄 Data Flow

1. **Client-Side**: React Query manages server state and caching
2. **API Layer**: Custom services handle data fetching and mutations
3. **Backend Integration**: Go server API for data persistence
4. **Authentication**: Clerk tokens for secure API communication

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Go server running on port 8080 (backend)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd webbuilder
```

2. **Install dependencies**

```bash
bun install
# or
npm install
```

3. **Environment Setup**
   Create a `.env.local` file with:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Backend API
GO_SERVER_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_GO_SERVER_URL=http://localhost:8080/api/v1
```

4. **Run the development server**

```bash
bun dev
# or
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Key Features

### 🏠 Dashboard

- Project management interface
- User project listing
- Quick access to editor

### ✏️ Visual Editor

- Drag-and-drop element creation
- Real-time element positioning
- Style customization (CSS + Tailwind)
- Nested element support

### 🔍 Preview System

- Public project previews
- Responsive design testing
- Share functionality

### 🔐 Authentication

- Secure user registration/login
- Protected routes
- Session management
- Token-based API access

## 🛠️ Development

### Available Scripts

```bash
bun dev          # Start development server with Turbopack
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
```

### Code Organization

- **Route Groups**: Organized by (auth), (protected), (public)
- **Service Layer**: Abstracted API calls with TypeScript interfaces
- **Component Structure**: Modular, reusable components
- **Type Safety**: Comprehensive TypeScript coverage

## 🎯 Future Enhancements

- Database integration with Prisma
- Real-time collaboration
- Template marketplace
- Advanced styling options
- Mobile editor support

## 📄 License

This project is private and not licensed for public use.

## 🤝 Contributing

This is a private project. Contact the maintainer for contribution guidelines.
