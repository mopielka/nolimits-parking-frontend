# No Limits Parking Frontend

A React-based frontend application for managing parking ticket validation in kiosk mode. This application is designed to provide a user-friendly interface for parking ticket verification and management.

## 🚀 Features

- **Kiosk Mode Support**: Full-screen operation with automatic refresh and interaction controls
- **Virtual Keyboard**: Touch-friendly input interface for ticket ID entry
- **Secure Authentication**: Token-based authentication system
- **Responsive Design**: Built with Material-UI components for a consistent user experience
- **TypeScript Support**: Full type safety throughout the application
- **Barcode Scanning**: Support for both physical and camera-based barcode scanning
- **Auto-refresh**: Automatic page refresh after inactivity for maintenance

## 🛠️ Technology Stack

- React + TypeScript
- Vite (Build Tool)
- Material-UI
- react-simple-keyboard
- Barcode Detection API
- ESLint for code quality

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Modern browser with Barcode Detection API support

## 🔧 Installation

1. Clone the repository:
```shell
git clone https://github.com/mopielka/nolimits-parking-frontend.git
cd nolimits-parking-frontend
```
2. Install dependencies:
```shell
yarn install
```
3. Start the development server:
```shell
yarn dev
```
💻 Usage
========

The application is designed to run in kiosk mode and provides:

-   A login interface for secure access
-   A virtual keyboard for ticket ID input
-   Real-time validation of parking tickets
-   Automatic refresh on inactivity
-   Prevention of unwanted user interactions (right-clicks, multi-touch gestures)

Kiosk Mode Features
===================

-   Auto-refresh after 5 minutes of inactivity
-   Disabled context menu and middle-click
-   Prevented multi-touch gestures
-   Full-screen mode support

🔒 Security Features
====================

-   Token-based authentication
-   Automatic token expiration handling
-   Secure storage of authentication data
-   Secret press zone for maintenance access

🎨 UI Components
================

-   Virtual Keyboard: Custom-styled numpad for ticket input
-   Clock Display: Real-time clock display
-   Barcode Scanners:
    -   Physical scanner support
    -   Camera-based scanner with live preview
-   Responsive Layout: Grid-based layout for optimal viewing
-   Material-UI Integration: Consistent styling and components

🤝 Contributing
===============

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

📝 Development Guidelines
=========================

-   Follow the existing TypeScript configurations
-   Use Material-UI components for consistency
-   Maintain type safety throughout the codebase
-   Write clear component documentation
-   Follow the established project structure

🔧 Configuration
================

The application supports various configuration options:

-   Kiosk mode settings
-   Scanner preferences
-   Authentication endpoints
-   Auto-refresh timing
-   UI customization

📄 License
==========

This project is licensed under the MIT License - see the LICENSE file for details.

🤔 Support
==========

For support, please open an issue in the GitHub repository.

* * * * *

Built with ❤️ for No Limits
