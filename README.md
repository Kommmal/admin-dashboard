# Admin Dashboard

This repository contains the admin dashboard for Shop.co, built using Next.js 14.2 and Tailwind CSS. The dashboard includes authentication, user profile management, and a clean UI for managing the store.

## Features

- **Authentication**: Email/password-based login system.
- **Dashboard Overview**: Displays user profile image and settings button.
- **Tech Stack**:
  - Next.js 14.2
  - Tailwind CSS
  - TypeScript
  - Chart.js/Recharts (For data visualization, if applicable)

## Folder Structure

```
admin-dashboard/

│-- app/
│   │-- admin/
│   │   │-- addproducts/  
|   │   │   │-- page.tsx  # Add Product page
│   │   │-- dashboard/    
|   │   │   │-- page.tsx  # Dashboard main page
│   │   │-- orders/       
|   │   │   │-- page.tsx  # order main page
|   │   │   │-- [orderId]/   # detail order page for every order 
|   |   │   │   │-- page.tsx   # detail order page for every order 
│   │   │-- products/       
|   │   │   │-- page.tsx  # product main page
|   │   │   │-- [slug]/  
|   |   │   │   │-- page.tsx    # detail product page for every product 
│   │   │-- user/   
|   │   │   │-- page.tsx  # user main page
│   │-- api/   
|   │   │-- deleteDocuments/  
|   │   │   │-- route.ts  # for deleting document in sanity 
|   │   │-- delete/Product 
|   │   │   │-- route.ts  # for deleting product 
|   │   │-- get-user/  
|   │   │   │-- route.ts  # for getting users from clerk 
|   │-- Loader/  
|   │   │-- page.tsx  # customize loader page 
│   │-- layout.tsx       # Layout file
│   │-- page.tsx       
│-- components/         # Reusable UI components
│   │-- AuthProvider.tsx       
│   │-- delete.tsx       
│   │-- LoginForm.tsx       
│   │-- LogoutButton.tsx       
│   │-- OrderBarChart.tsx       
│   │-- OrderStatusPisChart.tsx       
│   │-- Sidebar.tsx       
│   │-- SuccessFailure.tsx       
│-- lib/                # Utility functions
│-- public/         
│-- lib/                # Utility functions
│-- sanity/              
│-- pages/              # Next.js routing (if using pages directory)
│-- eslintrc.json
│-- gitattributes
│-- gitignore
│-- components.json
│-- next.config.mjs
│-- package-lock.json
│-- package.json
│-- README.md
│-- sanity.cli.ts
│-- sanity.config.ts
│-- tailwind.config.js
│-- tsconfig.json
```

## Setup Instructions

1. **Clone the Repository**
   ```sh
   git clone https://github.com/Kommmal/admin-dashboard.git
   cd admin-dashboard
   ```

2. **Install Dependencies**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Run the Development Server**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. **Environment Variables**
   Create a `.env.local` file in the root directory and add required variables (example below):
   ```env
   NEXT_PUBLIC_API_URL=<your_api_url>
   DATABASE_URL=<your_database_url>
   ```

5. **Build for Production**
   ```sh
   npm run build
   npm start
   ```

## Authentication

- The system supports email/password login.
- Users will be redirected to `/admin/dashboard` upon successful login.
- Logout will clear the session and return to the login page.

## Contribution

Feel free to fork this repository and submit pull requests. For major changes, open an issue first to discuss proposed updates.

## License

This project is licensed under the MIT License.
