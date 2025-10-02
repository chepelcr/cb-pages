# Cuerpo de Banderas - Liceo de Costa Rica Website

## Overview

A modern institutional website for the Cuerpo de Banderas (Flag Corps) of Liceo de Costa Rica, showcasing 73 years of tradition since 1951. The application presents the organization's history, leadership records, ceremonial shields, and photo gallery with a formal yet accessible design approach inspired by military academies and honor guard organizations.

The website serves as both a public showcase and includes administrative functionality for content management, with a focus on dignity, tradition, and patriotic pride aligned with Costa Rican cultural values.

## Recent Changes

**October 2, 2025**: Completed full admin panel for all website content:
- Added Proceso de Ingreso (admission requirements) editor in General Settings
- Created Historical Images admin page with S3 upload and CRUD operations
- Created Shield Values admin page with full CRUD and Lucide icon selection
- Updated all public components (History, Shields, Contact) to load from API
- Fixed AdminSidebar hook order violation and added accessibility improvements
- Implemented proper S3 key persistence for safe cleanup on delete/replace operations

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

**Database Layer**: Drizzle ORM with PostgreSQL (via Neon serverless) providing type-safe database operations with schema-first approach. Database includes:
- Site configuration (homepage sections, contact info, admission requirements)
- Leadership periods (jefaturas) with S3 images
- Historical images with S3 storage
- Shield values with Lucide icon references
- User management for admin authentication

**Authentication System**: Prepared for AWS Cognito integration with JWT token management, currently using mock authentication for development.

**API Structure**: 
- Health check endpoints
- User management routes (profile, registration)
- Site configuration management (homepage, contact, admission requirements)
- Historical images CRUD with S3 integration
- Shield values CRUD operations
- Leadership periods (jefaturas) management
- S3 presigned URL generation for secure uploads

### Data Storage Solutions

**PostgreSQL Database**: Neon serverless database with Drizzle ORM providing:
- Users table for admin account management
- Site config table for homepage and institutional settings
- Leadership periods table with S3 image references
- Historical images table with S3 storage
- Shield values table with Lucide icon names
- Connection pooling for optimal performance
- Full CRUD operations for all content types

**AWS S3 + CloudFront Object Storage**: Image upload system using presigned URLs with CloudFront CDN distribution:
- **Bucket**: `banderas-data-jcampos-dev` (us-east-1)
- **CloudFront Domain**: `banderas-data.jcampos.dev`
- **Two-phase workflow**:
  - Phase 1: Client requests presigned URL from `/api/uploads/presigned-url` endpoint
  - Phase 2: Client uploads directly to S3 with ACL=public-read, then submits CloudFront URL to backend
- **URL Strategy**: All stored image URLs use CloudFront domain for CDN performance and caching
- **Security**: Centralized URL validation supports both CloudFront and direct S3 URLs with HTTPS enforcement
- **Upload expiration**: 5 minutes for uploads, 1 hour for download URLs
- **Folder structure**: `gallery/`, `shields/`, `leadership/`, `site-config/`
- **S3 Key Storage**: All image tables store S3 keys (imageS3Key, logoS3Key, faviconS3Key) for lifecycle management
- **Automatic Cleanup**: Controllers delete old S3 objects when images are replaced or records deleted
- **Safe Update Pattern**: Controllers update database first, verify success, then delete old S3 objects to prevent broken references
- **Orphaned Upload Detection**: `cleanupOrphanedS3Files.ts` script identifies and removes abandoned uploads
- **Migration Support**: `migrateLocalImagesToS3.ts` script available for migrating existing local images to S3

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