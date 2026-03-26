

## Arteco — Full Website Build Plan

### Design System
- **Colors**: White background, black text, yellow (#F5C518) accent for CTAs, dark (#1a1a1a) for header bar
- **Typography**: Clean sans-serif, bold headings
- **Components**: Rounded cards with subtle shadows, pill-shaped stepper, yellow CTA buttons

### Pages & Features

#### 1. Landing / Home Page (Desktop)
- Black header bar with Arteco logo + nav links (OFFERINGS, ABOUT, CONTACT)
- Hero section: "Introducing ARTECO — ALL ARCHITECTURAL" with "Contact Us" and "Explore Offerings" CTAs
- Offerings carousel: 6 cards (Vending Machine, Online Stationery, Software Courses, AR/VR Solutions, Educational Tours, Workshops & Events) — horizontal scroll with dark card backgrounds and illustrations

#### 2. Offerings Detail Pages
- Individual pages for each offering with hero image, description, and CTA
- **Vending Machine page**: Product showcase with key features list, ₹1,20,000 price, "View More" button
- **Software Courses page**: Basic/Intermediate/Advanced tiers with course listings and about section
- **Online Stationery page**: Links into the shop flow

#### 3. Shop Flow (Mobile-first, works on desktop too)
- **Step 1 — Select Item**: Category cards (Drawing Sheets, Stationery, Software Tutorials) in a grid
- **Step 2 — Select Sheet Type**: Sub-category cards (Cartridge, Butter, Mill Board) with back navigation
- **Step 3 — Enter Details**: Product image + size selector (A1/A2/A4) + quantity picker (+/-) + price display + "Add to Cart" button
- **Stationery items**: Micro pens, Cutting mat, Thermocol sheet — each with quantity picker and price
- Progress stepper at top: "Select Your Item → Complete Your Payment → Receive Your Order"

#### 4. Cart Page
- Cart items with product image, name, size selector, quantity picker, price, and delete button
- "Add More Item" and "Proceed to Buy" (yellow) buttons at bottom

#### 5. Checkout Page
- Order summary on left (cart items with details)
- Price breakdown on right (Items + Delivery = Order Total in ₹)
- QR code payment placeholder (Razorpay integration to be added later)

#### 6. Order Confirmation
- Dispensing status screen with "Kindly hold on while the sheets are being dispensed"
- Ad placement area
- "Thank you! Need more?" with Yes/No buttons and "Continue Shopping"

#### 7. About Page
- Company info and mission

#### 8. Contact Page
- Contact form or contact details

### State Management
- React Context for cart state (items, quantities, sizes, prices)
- React Router for page navigation

### Backend (Supabase via Lovable Cloud)
- **Products table**: name, category, sub_category, sizes, price, image_url
- **Orders table**: user info, items, total, status
- Edge function for order creation
- Payment integration placeholder (Razorpay to be added when keys are ready)

### Responsive Design
- Mobile-first shop flow (as shown in Figma)
- Desktop layout for landing page, offerings, courses pages

