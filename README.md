# Personal Finance Visualizer

## Deployement link [https://yardstick-assignment-theta.vercel.app/](https://yardstick-assignment-theta.vercel.app/)

A simple web application for tracking personal finances. This project is built with Next.js, React, shadcn/ui, Recharts, and MongoDB.

## Overview

**Personal Finance Visualizer** is designed to help users track and visualize their financial transactions. The application is divided into three stages:

-  **Stage 1: Basic Transaction Tracking**

   -  Add, edit, and delete transactions (amount, date, description)
   -  View a list of transactions
   -  Display a monthly expenses bar chart
   -  Basic form validation

-  **Stage 2: Categories**

   -  All Stage 1 features plus:
   -  Predefined categories for transactions
   -  Category-wise pie chart
   -  Dashboard with summary cards: total expenses, category breakdown, and most recent transactions

-  **Stage 3: Budgeting**
   -  All Stage 2 features plus:
   -  Set monthly category budgets
   -  Budget vs. actual comparison chart
   -  Simple spending insights

## Tech Stack

-  **Frontend:** Next.js, React, shadcn/ui, Recharts
-  **Backend:** Next.js API Routes
-  **Database:** MongoDB

## Getting Started

### Prerequisites

-  [Node.js](https://nodejs.org/) (v14 or later)
-  [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
-  A MongoDB instance (local or cloud, e.g., MongoDB Atlas)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SauravChaudhary26/anonymous-4352
   cd yardstick-assignment
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or if you use Yarn:
   yarn install
   ```

3. **Configure Environment Variables:**

   Create a `.env.local` file in the root directory of your project and add the following:

   ```env
   MONGODB_URI=your-mongodb-connection-string
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Deployment

To build and start the project in production mode:

```bash
npm run build
npm start
```

or with Yarn:

```bash
yarn build
yarn start
```

## Project Structure

-  **/app**: Contains the Next.js application pages and components.
-  **/components/ui**: UI components built using shadcn/ui.
-  **/lib**: Utility functions, constants, and database connection files.
-  **/app/api**: API routes for transactions and budgets.

## Budgeting Feature

This stage allows users to set monthly category budgets and compare them against their actual spending. The budgeting page includes:

-  A form to set or update monthly budgets per predefined category.
-  A bar chart comparing budgeted amounts versus actual spending for the current month.
-  Simple spending insights indicating if a category is over, under, or on budget.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
