# Cuerpo de Banderas - Liceo de Costa Rica Website

## Overview

A modern institutional website for the Cuerpo de Banderas (Flag Corps) of Liceo de Costa Rica, showcasing 73 years of tradition since 1951. The application presents the organization's history, leadership records, ceremonial shields, and photo gallery with a formal yet accessible design approach inspired by military academies and honor guard organizations.

The website serves as both a public showcase and includes administrative functionality for content management, with a focus on dignity, tradition, and patriotic pride aligned with Costa Rican cultural values.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**React 18 + TypeScript SPA**: Built with functional components and hooks pattern, utilizing Vite as the build tool for optimal development experience and performance.

**Component-Based Design**: Implements shadcn/ui component library with Radix UI primitives for accessible, consistent UI elements. Components are organized by feature (history, leadership, gallery, shields) with shared UI components.

**Client-Side Routing**: Uses Wouter for lightweight routing with smooth page transitions via Framer Motion, supporting both direct navigation and smooth scrolling for single-page sections.

**State Management Strategy**: 
- React Query for server state management and caching
- React Context for theme management (light/dark mode)
- React Hook Form with Zod validation for form handling

**Styling System**: TailwindCSS with custom design tokens following institutional color palette (Costa Rican Red #eb1a4e, Deep Navy, Pure White) and Poppins typography system.

### Backend Architecture

**Express.js + TypeScript**: RESTful API server with clean architecture pattern separating controllers, services, and repositories for maintainable code organization.

**Database Layer**: Drizzle ORM with PostgreSQL (via Neon serverless) providing type-safe database operations with schema-first approach.

**Authentication System**: Prepared for AWS Cognito integration with JWT token management, currently using mock authentication for development.

**API Structure**: 
- Health check endpoints
- User management routes (profile, registration)
- Configuration management for institutional settings
- Structured for future content management endpoints

### Data Storage Solutions

**PostgreSQL Database**: Neon serverless database with Drizzle ORM providing:
- Users table for admin account management
- Prepared schema structure for content management
- Connection pooling for optimal performance

**AWS S3 Object Storage**: Image upload system using presigned URLs with two-phase workflow:
- Phase 1: Client requests presigned URL from `/api/uploads/presigned-url` endpoint
- Phase 2: Client uploads directly to S3, then submits public URL to backend
- Security: Centralized URL validation enforces HTTPS, bucket verification, and path traversal protection
- Upload expiration: 5 minutes for uploads, 1 hour for download URLs
- Folder structure: `gallery/`, `shields/`, `leadership/`, `site-config/`

**Static Asset Management**: Build-time assets served through Vite's asset pipeline with proper optimization and caching strategies.

### Authentication and Authorization

**AWS API Gateway**: Authentication and authorization handled at the infrastructure level:
- API Gateway validates credentials before requests reach the application
- Admin endpoints are protected by gateway-level authentication
- Application assumes all incoming requests are pre-authenticated

**AWS Cognito Integration**: Designed for enterprise-grade authentication with:
- Multi-step user registration with email verification
- JWT token-based session management
- Role-based access control for administrative features
- Secure password policies and user management

**Protected Route Pattern**: AuthGuard component wrapper ensuring secure access to administrative functionality on the frontend.

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives for dialogs, dropdowns, navigation
- **TailwindCSS**: Utility-first CSS framework with custom design system
- **shadcn/ui**: Pre-built component library following design system principles
- **Framer Motion**: Animation library for page transitions and micro-interactions

### Development and Build Tools
- **Vite**: Build tool with HMR and optimized production builds
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundling for production

### Database and Backend Services
- **Neon Database**: Serverless PostgreSQL with automatic scaling
- **Drizzle ORM**: Type-safe database toolkit with schema management
- **AWS Cognito**: Authentication and user management service (planned)

### State Management and Data Fetching
- **TanStack Query (React Query)**: Server state management with caching
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation for forms and API responses

### Fonts and Assets
- **Google Fonts**: Poppins font family via CDN for consistent typography
- **Custom Assets**: Generated placeholder images and institutional logos

### Development Environment
- **Replit**: Cloud development environment with integrated database provisioning
- **Node.js**: Runtime environment for server-side JavaScript execution