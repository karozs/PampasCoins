# Verification Plan for Tayacoins Redesign

## Goal
Verify that the Tayacoins application is fully functional, visually consistent, and free of critical bugs after the major redesign and feature implementation.

## Verification Steps

### 1. User Authentication & Onboarding
- [ ] **Register:** Create a new user account. Verify successful redirection to the dashboard.
- [ ] **Login:** Log out and log back in with the new account. Verify successful access.
- [ ] **UI Check:** Verify `Login` and `Register` pages match the new Tailwind CSS design.

### 2. Dashboard & Navigation
- [ ] **Dashboard UI:** Verify the dashboard displays correct user information (name, balance).
- [ ] **Navigation:** Test all links in the Navbar (Dashboard, Marketplace, Publicar, Historial, Profile).
- [ ] **Responsiveness:** Check Navbar and Dashboard on mobile view (simulated).

### 3. Product Management
- [ ] **Create Product:** Publish a new product. Verify it appears in the "My Products" list and the Marketplace.
- [ ] **Edit Product:** Edit the newly created product (change price or quantity). Verify updates are reflected.
- [ ] **Delete/Hide:** (If applicable) Verify product visibility.

### 4. Marketplace & Transactions
- [ ] **Marketplace UI:** Verify product cards, filters, and sorting options.
- [ ] **Buy Product:** Purchase a product from another user (using a second account or demo data).
- [ ] **Balance Update:** Verify the buyer's balance decreases and the seller's balance increases.
- [ ] **Transaction History:** Verify the transaction appears in the `History` page for both buyer and seller.

### 5. Seller Ratings
- [ ] **Trigger Rating:** Verify the `RateSellerModal` appears after a successful purchase.
- [ ] **Submit Rating:** Submit a rating and review.
- [ ] **View Reviews:** Verify the review appears on the seller's profile.

### 6. Profile
- [ ] **Profile UI:** Verify the profile page design.
- [ ] **Profile Image:** Upload/Change profile image.
- [ ] **My Products:** Verify the list of products being sold.
- [ ] **Reviews Tab:** Verify the reviews tab displays received reviews.

## Automated Checks (if possible)
- [ ] Check for console errors during navigation and actions.
- [ ] Verify API responses for critical endpoints (`/api/products`, `/api/transactions`, `/api/users`).
