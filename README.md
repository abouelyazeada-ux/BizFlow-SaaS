# BizFlow SaaS

BizFlow is a modern, premium SaaS application designed for streamlined business operations. It provides an intuitive dashboard, customer management, inventory/product tracking, and invoice generation, all wrapped in a sleek, dark-themed responsive interface.

## Main Features
- **Dashboard & Analytics:** Real-time data visualization of revenue, invoices, and active customers.
- **Customer Management:** Comprehensive CRUD functionality for business clients.
- **Product & Inventory Management:** Stock tracking and product catalog maintenance.
- **Invoice Generation & Reporting:** Generate professional PDF reports using QuestPDF.
- **Multi-Tenancy:** Secure tenant isolation per company.
- **Authentication:** Robust JWT-based authentication with Refresh Token rotation.
- **Premium UI:** Custom dark theme, glassmorphism elements, and modern interactive charts.

## Architecture

BizFlow follows Clean Architecture principles, ensuring separation of concerns and highly maintainable code.

### Backend Stack
- **Framework:** ASP.NET Core (.NET 10)
- **Database:** Entity Framework Core (SQL Server / LocalDB)
- **Pattern:** CQRS with MediatR
- **Security:** JWT Authentication, TenantResolverMiddleware
- **Reporting:** QuestPDF

### Frontend Stack
- **Library:** React (with Vite)
- **Language:** TypeScript
- **State Management:** Zustand (for Auth), React Query (for API states)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (Custom Dark Theme Tokens)
- **Icons:** Lucide React

## Authentication Flow
The system utilizes robust, state-of-the-art authentication:
1. User logs in, receiving a short-lived `Token` and a long-lived `RefreshToken`.
2. The frontend automatically intercepts `401 Unauthorized` responses.
3. The `apiClient` requests a new token set from `/api/auth/refresh` behind the scenes.
4. The original request is retried seamlessly without user disruption.

## Multi-Tenancy
The platform separates data seamlessly via a `CurrentTenantService` interceptor. All primary entities implement `IMustHaveTenant`, and EF Core applies global query filters to guarantee isolated workspace operations without data bleed.

## Installation Steps

### Prerequisites
- .NET 10 SDK
- Node.js & npm
- SQL Server LocalDB (or modify connection string)

### Setup Backend
1. Navigate to the API folder:
   ```bash
   cd src/BizFlow.API
   ```
2. Restore packages:
   ```bash
   dotnet restore
   ```
3. Ensure secrets are configured (see `appsettings.Development.json`).
4. Run EF Core Migrations (if applicable):
   ```bash
   dotnet ef database update
   ```

### Setup Frontend
1. Navigate to the web folder:
   ```bash
   cd src/BizFlow.Web
   ```
2. Create your `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running Instructions

### Run Backend
```bash
cd src/BizFlow.API
dotnet run
```
The API will be available at `http://localhost:5017`.

### Run Frontend
```bash
cd src/BizFlow.Web
npm run dev
```
The application will be accessible at `http://localhost:5173`.
