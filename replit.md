# BuildCorp Website

## Overview

BuildCorp is a static website for a construction and real estate company built entirely with frontend technologies. The website features both public-facing pages showcasing services, projects, and properties, as well as a complete admin panel for content management. All data is stored locally using browser localStorage, eliminating the need for a backend server or database.

## System Architecture

### Frontend-Only Architecture
- **Technology Stack**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage Solution**: Browser localStorage for all dynamic content and admin data
- **Component System**: Modular header/footer components loaded dynamically
- **Admin Panel**: Client-side content management system with authentication

### File Structure
```
/
├── HTML Pages (index, about, services, projects, properties, contact)
├── /admin/ - Complete admin panel with CRUD operations
├── /components/ - Reusable header/footer components
├── /css/ - Unified stylesheet
├── /js/ - JavaScript modules (main.js, admin.js)
└── /attached_assets/ - Documentation
```

## Key Components

### Public Website
- **Home Page**: Hero section, about preview, services overview
- **About Page**: Company information with editable content
- **Services Page**: Dynamic service listings managed via admin
- **Projects Page**: Construction project portfolio
- **Properties Page**: Real estate listings
- **Contact Page**: Contact information and forms

### Admin Panel
- **Authentication**: Session-based login (default: admin123)
- **Dashboard**: Statistics overview and navigation
- **Content Management**: CRUD operations for services, projects, properties
- **About Content Editor**: Rich text editing for company information
- **Message Management**: Contact form submission handling

### Data Management
- **localStorage Schema**: Structured data storage for all content types
- **Session Management**: Admin authentication using sessionStorage
- **Data Persistence**: All changes persist across browser sessions

## Data Flow

### Content Loading Process
1. **Component Loading**: Header/footer loaded via fetch from `/components/`
2. **Content Initialization**: Dynamic content loaded from localStorage
3. **Fallback Handling**: Static fallbacks if component loading fails
4. **Mobile Responsiveness**: Mobile menu setup after component loading

### Admin Data Flow
1. **Authentication Check**: Session validation on admin page load
2. **CRUD Operations**: Create, read, update, delete operations on localStorage
3. **Real-time Updates**: Immediate content updates without page refresh
4. **Data Validation**: Form validation before localStorage commits

## External Dependencies

### CDN Resources
- **Font Awesome 6.0.0**: Icon library for UI elements
- **No Other External Dependencies**: Self-contained application

### Browser Requirements
- **Modern Browser**: ES6+ support required
- **localStorage Support**: Essential for data persistence
- **Fetch API**: Used for component loading

## Deployment Strategy

### Static Hosting
- **Hosting Platform**: Any static web host (Netlify, Vercel, GitHub Pages)
- **No Server Requirements**: Pure client-side application
- **HTTPS Recommended**: For secure admin panel access
- **No Build Process**: Deploy files directly as-is

### Configuration
- **Admin Password**: Configurable via localStorage (adminPassword key)
- **Default Content**: Fallback content embedded in HTML
- **Mobile-First**: Responsive design for all devices

## Changelog

- July 02, 2025. Initial setup
- July 02, 2025. Removed admin link from main navigation for security; admin accessible via /admin URL
- July 02, 2025. Enhanced image upload system with automatic compression, validation, and drag-and-drop functionality
- July 03, 2025. Added site settings management: logo upload, contact info editing, and social media handles management

## User Preferences

Preferred communication style: Simple, everyday language.