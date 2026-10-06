Build a **fully functional, modern hotel booking website** inspired by the overall user experience and information architecture of Booking.com, but with a **completely original brand identity, UI design, colors, typography, components, images, and content**. Do not copy Booking.com's exact branding, logo, proprietary assets, or source code.

## 1. Technology Stack

Use:

* React
* Vite
* JavaScript
* CSS / modern responsive CSS
* React Router
* Supabase for backend/database
* Lucide React or another suitable icon library
* Local state management with React hooks
* Environment variables for Supabase credentials

The application must be fully responsive and work properly on:

* Desktop
* Laptop
* Tablet
* Mobile

---

# 2. Website Brand

Create an original hotel-booking brand.

Suggested name:

**Stayora**

Tagline:

**Find your stay. Make it memorable.**

Create a professional travel-focused visual identity.

### Color direction

Use an attractive premium travel palette such as:

* Deep Navy
* Royal Blue
* Soft Sky Blue
* White
* Warm Gold accent
* Light Gray backgrounds

The UI should feel:

* Premium
* Trustworthy
* Modern
* Clean
* Professional
* Travel-focused
* Easy to use

Avoid making the website look like a direct copy of Booking.com.

---

# 3. Main Pages

Create these pages:

1. Home
2. Search Results
3. Hotel Details
4. Booking / Checkout
5. Booking Confirmation
6. Login
7. Register
8. User Dashboard
9. My Bookings
10. Favorites
11. Profile
12. Admin Dashboard

Use React Router for navigation.

Every important button and navigation item must actually work.

---

# 4. HOME PAGE

Create a polished homepage.

## Header

Include:

* Stayora logo
* Hotels
* Apartments
* Villas
* Resorts
* Deals
* Help
* Currency selector
* Language selector
* Login
* Register

Make the header responsive.

On mobile, use a hamburger menu.

---

# 5. HERO SECTION

Create a large attractive hero section.

Heading:

**Find your next perfect stay**

Supporting text:

**Search hotels, resorts, apartments and unique stays at the best available prices.**

Add a large booking/search panel.

The search panel should contain:

### Destination

Input:

**Where are you going?**

Allow users to enter:

* City
* Country
* Hotel name

Show destination suggestions while typing.

Example:

* Karachi
* Lahore
* Islamabad
* Dubai
* Istanbul
* London
* Paris

---

### Check-in

Interactive date picker.

---

### Check-out

Interactive date picker.

---

### Guests

Interactive guest selector.

Allow:

* Adults
* Children
* Rooms

Example:

**2 Adults · 0 Children · 1 Room**

Users must be able to increase/decrease each value.

---

### Search button

Button:

**Search**

When clicked:

* Validate search fields
* Store search criteria
* Navigate to Search Results
* Filter available hotels based on destination/date/guests

---

# 6. WORK TRAVEL OPTION

Add a checkbox:

**I'm travelling for work**

Store this preference in search state.

---

# 7. POPULAR DESTINATIONS

Create a section:

## Popular destinations

Display attractive destination cards.

Examples:

* Karachi
* Lahore
* Islamabad
* Dubai
* Istanbul
* Paris

Each card should contain:

* Unique image
* Destination name
* Country
* Number of properties

Clicking a destination should perform a search for that destination.

Use a **different image for every destination**.

Never repeat the same image across multiple cards or sections.

---

# 8. SPECIAL OFFERS

Create an attractive offers section.

Examples:

### Weekend Escape

**Save up to 20% on selected stays**

### Early Booking

**Book early and enjoy exclusive prices**

### Luxury Getaway

**Premium stays with special offers**

Each offer should have:

* Image
* Title
* Description
* Discount
* CTA button

CTA:

**Explore Deal**

Clicking it should show matching hotels.

---

# 9. PROPERTY TYPES

Create a section:

## Explore stays

Cards:

* Hotels
* Apartments
* Resorts
* Villas
* Guest Houses
* Hostels

Each card should have:

* Unique image
* Icon
* Property type
* Short description
* Number of available properties

Make cards clickable.

---

# 10. HOTEL SEARCH RESULTS PAGE

When the user searches, show:

### Top section

Display:

**Karachi: 120 properties found**

Also show:

* Selected dates
* Guests
* Rooms
* Modify Search button

---

# 11. FILTER SIDEBAR

Create functional filters.

Filters should include:

### Price range

Minimum and maximum price.

### Property type

* Hotel
* Apartment
* Resort
* Villa
* Guest House
* Hostel

### Star rating

* 1 star
* 2 stars
* 3 stars
* 4 stars
* 5 stars

### Guest rating

* 8+
* 7+
* 6+

### Facilities

* Free WiFi
* Swimming Pool
* Parking
* Breakfast
* Restaurant
* Air Conditioning
* Spa
* Gym
* Airport Shuttle

### Location

Allow filtering by location/area.

Filters must actually change the displayed hotel results.

---

# 12. SORTING

Add sorting options:

* Recommended
* Price: Low to High
* Price: High to Low
* Guest Rating
* Distance
* Most Popular

Sorting must work dynamically.

---

# 13. HOTEL CARDS

Create professional hotel cards.

Each card should contain:

* Unique hotel image
* Hotel name
* Location
* Star rating
* Guest rating
* Review count
* Property type
* Key facilities
* Original price
* Discount
* Current price
* Price per night
* Cancellation information
* Favorite button
* View Details button

Example:

**The Royal Haven**

Karachi, Pakistan

★★★★★

**9.2 Exceptional**

287 reviews

~~PKR 28,000~~

**PKR 22,400 / night**

**20% OFF**

**Free cancellation**

Buttons:

**View Details**

**Reserve**

Use different hotel images. Do not repeat images.

---

# 14. HOTEL DETAILS PAGE

When the user clicks a hotel, open a complete hotel details page.

Include:

### Image Gallery

Create a large gallery with multiple unique images.

Features:

* Main image
* Thumbnail images
* Previous/next buttons
* Full-screen image viewer

---

### Hotel Information

Show:

* Hotel name
* Location
* Star rating
* Guest rating
* Reviews
* Description
* Facilities
* Policies
* Check-in time
* Check-out time

---

### Facilities

Display icons for:

* WiFi
* Pool
* Parking
* Restaurant
* Gym
* Spa
* Breakfast
* Air Conditioning

---

# 15. ROOM OPTIONS

Display available rooms.

Example:

### Deluxe King Room

* 1 King Bed
* 2 Guests
* 35 m²
* Free WiFi
* Breakfast available
* Free cancellation

Price:

**PKR 24,000 / night**

Button:

**Select Room**

---

### Executive Suite

* 1 King Bed
* 3 Guests
* 50 m²
* City View
* Breakfast included
* Free cancellation

Price:

**PKR 38,000 / night**

Button:

**Select Room**

Room selection must be functional.

---

# 16. FAVORITES

Allow users to click a heart icon to save hotels.

Store favorite hotels.

Logged-in users should have a:

**My Favorites**

page.

---

# 17. BOOKING FLOW

After selecting a room:

Navigate to:

**Booking / Checkout**

Display booking summary:

* Hotel
* Room
* Check-in
* Check-out
* Number of nights
* Guests
* Room count
* Price per night
* Taxes
* Service fee
* Discount
* Total price

Calculate all totals dynamically.

---

# 18. CUSTOMER INFORMATION

Create a booking form.

Fields:

* First name
* Last name
* Email
* Phone
* Country
* Special requests

Validation must be implemented.

Required fields should display proper validation messages.

---

# 19. PAYMENT SECTION

For the project/demo version, create a realistic payment interface.

Payment methods:

* Credit/Debit Card
* Pay at Property

Card fields:

* Cardholder name
* Card number
* Expiry
* CVV

Do not store real card details.

For demo payments, simulate successful payment.

---

# 20. BOOKING CONFIRMATION

After successful booking:

Show a professional confirmation page.

Example:

**Booking Confirmed! 🎉**

Include:

* Booking ID
* Hotel name
* Guest name
* Room
* Check-in
* Check-out
* Guests
* Total amount
* Payment status

Buttons:

**View Booking**

**Download Confirmation**

**Back to Home**

---

# 21. SUPABASE DATABASE

Connect the application to Supabase.

Create database tables for:

### users

* id
* name
* email
* phone
* country
* created_at

### hotels

* id
* name
* location
* city
* country
* description
* star_rating
* guest_rating
* review_count
* price_per_night
* discount
* image
* property_type
* created_at

### rooms

* id
* hotel_id
* name
* description
* capacity
* beds
* size
* price
* available_rooms

### bookings

* id
* user_id
* hotel_id
* room_id
* check_in
* check_out
* adults
* children
* rooms
* total_price
* booking_status
* payment_status
* created_at

### favorites

* id
* user_id
* hotel_id
* created_at

---

# 22. SUPABASE AUTHENTICATION

Implement:

* Register
* Login
* Logout
* Session persistence
* Protected routes

Users should be able to access:

* Dashboard
* My Bookings
* Favorites
* Profile

only after authentication.

---

# 23. USER DASHBOARD

Create a professional dashboard.

Show:

* Upcoming bookings
* Previous bookings
* Favorite hotels
* Profile information

Dashboard cards:

**Upcoming Trips**

**Completed Stays**

**Saved Hotels**

**Total Bookings**

---

# 24. MY BOOKINGS

Display booking history.

Each booking card should show:

* Hotel
* Image
* Booking ID
* Dates
* Guests
* Room
* Total price
* Booking status

Statuses:

* Confirmed
* Completed
* Cancelled

Add:

**View Details**

and, where appropriate:

**Cancel Booking**

---

# 25. ADMIN DASHBOARD

Create a basic admin dashboard.

Admin should be able to:

* View hotels
* Add hotel
* Edit hotel
* Delete hotel
* Add rooms
* Edit rooms
* View bookings
* Update booking status
* View users

Dashboard statistics:

* Total Hotels
* Total Users
* Total Bookings
* Revenue

---

# 26. RESPONSIVE DESIGN

The website must be completely responsive.

### Desktop

Use:

* Full navigation
* Sidebar filters
* Multi-column hotel cards
* Large hero search panel

### Tablet

Adapt:

* Grid columns
* Navigation
* Search form

### Mobile

Use:

* Hamburger menu
* Stacked search fields
* Mobile filter drawer
* Single-column hotel cards
* Bottom-friendly buttons
* Touch-friendly controls

Do not allow horizontal scrolling.

---

# 27. IMAGE REQUIREMENT

This is very important.

Every section must use an image that is relevant to its content.

Do NOT repeatedly use the same image.

For example:

* Karachi → Karachi-related image
* Lahore → Lahore-related image
* Dubai → Dubai-related image
* Hotel A → different hotel image
* Hotel B → different hotel image
* Hotel details gallery → different images
* Offers → different images
* Property types → different images

Use reliable image URLs or suitable remote image sources.

If remote images fail, provide a fallback image mechanism.

---

# 28. UI / UX

The interface should feel like a real commercial hotel booking platform.

Use:

* Clean spacing
* Rounded cards
* Subtle shadows
* Smooth hover effects
* Micro animations
* Loading states
* Skeleton loaders
* Empty states
* Error states
* Toast notifications
* Modal dialogs
* Confirmation dialogs

Use icons consistently.

Avoid excessive animations.

Keep the UI fast and professional.

---

# 29. FUNCTIONAL REQUIREMENT

Do not create a static UI mockup.

Everything important must work.

Test:

* Navigation
* Search
* Destination selection
* Date selection
* Guest selection
* Filters
* Sorting
* Hotel details
* Room selection
* Favorites
* Login
* Register
* Booking
* Price calculation
* Booking confirmation
* My bookings
* Logout
* Supabase database operations

No dead buttons.

No fake navigation.

No placeholder functionality for core features.

---

# 30. ERROR HANDLING

Implement proper handling for:

* Empty search
* Invalid dates
* Check-out before check-in
* No available hotels
* Failed Supabase request
* Failed login
* Invalid registration
* Booking failure
* Missing hotel
* Missing room

Show user-friendly error messages.

---

# 31. PROJECT STRUCTURE

Use a clean component-based architecture.

Suggested structure:

src/
├── components/
│   ├── Navbar.jsx
│   ├── HeroSearch.jsx
│   ├── DestinationCard.jsx
│   ├── OfferCard.jsx
│   ├── PropertyTypeCard.jsx
│   ├── HotelCard.jsx
│   ├── FilterSidebar.jsx
│   ├── SortBar.jsx
│   ├── DatePicker.jsx
│   ├── GuestSelector.jsx
│   ├── ImageGallery.jsx
│   ├── RoomCard.jsx
│   ├── BookingSummary.jsx
│   └── Footer.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── SearchResults.jsx
│   ├── HotelDetails.jsx
│   ├── Checkout.jsx
│   ├── BookingConfirmation.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── MyBookings.jsx
│   ├── Favorites.jsx
│   ├── Profile.jsx
│   └── AdminDashboard.jsx
│
├── context/
│   ├── AuthContext.jsx
│   ├── BookingContext.jsx
│   └── SearchContext.jsx
│
├── services/
│   ├── supabase.js
│   ├── hotelService.js
│   ├── bookingService.js
│   └── authService.js
│
├── data/
│   └── fallbackHotels.js
│
├── utils/
│   ├── dateUtils.js
│   ├── priceUtils.js
│   └── validation.js
│
├── App.jsx
├── main.jsx
└── index.css

---

# 32. IMPORTANT DEVELOPMENT PROCESS

Do NOT simply generate everything blindly.

First:

1. Inspect the existing project.
2. Check the current files.
3. Check package.json.
4. Check whether React/Vite is already configured.
5. Check whether Supabase is already connected.
6. Reuse existing useful code where appropriate.
7. Create missing folders/components.
8. Install only required dependencies.
9. Build the application in logical stages.
10. Run the application.
11. Check the browser console for errors.
12. Fix all errors.
13. Test all major user flows.
14. Verify responsive behavior.

---

# 33. FINAL QUALITY CHECK

Before finishing, verify:

* npm run dev works
* No compilation errors
* No console errors
* All routes work
* Search works
* Filters work
* Sorting works
* Hotel details work
* Room selection works
* Booking works
* Supabase operations work
* Authentication works
* Favorites work
* Dashboard works
* Mobile layout works
* Images load correctly
* No repeated images unnecessarily
* No horizontal scrolling
* No dead buttons

The final result should look and behave like a **real hotel booking application**, not a simple demo landing page.

Start by inspecting the existing project and then implement the application step by step.