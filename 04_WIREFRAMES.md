# Book Recommendation & Community Platform - UI Wireframes & Design Concepts

## 1. Design System Overview

### 1.1 Color Palette

```
Primary Brand Colors:
├── Primary Blue: #1E40AF (Main CTAs and navigation)
├── Secondary Gold: #D97706 (Highlights and accents)
├── Success Green: #10B981 (Positive feedback)
├── Error Red: #EF4444 (Errors and warnings)
└── Neutral Gray: #6B7280 (Text and backgrounds)

Semantic Colors:
├── Heart/Like: #EF4444 (Red)
├── Stars Rating: #D97706 (Gold)
├── Owned: #10B981 (Green)
└── Background: #F9FAFB (Light gray)
```

### 1.2 Typography

```
Font Family: 'Inter' or 'Segoe UI' (sans-serif)

Heading h1: 32px, 700 weight, 40px line-height
Heading h2: 24px, 700 weight, 32px line-height
Heading h3: 18px, 600 weight, 28px line-height
Body Text: 16px, 400 weight, 24px line-height
Small Text: 14px, 400 weight, 20px line-height
Caption: 12px, 400 weight, 16px line-height
```

### 1.3 Spacing & Grid

```
Base unit: 8px
Spacing scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px
Grid: 12-column layout
Breakpoints: 
  - Mobile: 320px
  - Tablet: 768px
  - Desktop: 1024px
  - Large: 1280px
```

---

## 2. Page Wireframes

### 2.1 Home Page / Landing Page Wireframe

```
╔════════════════════════════════════════════════════════╗
║ HEADER                                                 ║
║ Logo    Search Bar    Nav Links    [Login] [Sign Up]  ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │         HERO SECTION WITH TRENDING BOOKS         │ ║
║  │ ┌──────────────────────────────────────────────┐ ║
║  │ │                                              │ ║
║  │ │   High-Quality Book Cover / Illustration    │ ║
║  │ │   Title: "Top Reads This Week"               │ ║
║  │ │   Subtitle: "Discover what readers love"     │ ║
║  │ │                                              │ ║
║  │ │   [Carousel Controls: < Book1  Book2  Book3 >] ║
║  │ │   ● ○ ○  (indicator dots)                    │ ║
║  │ └──────────────────────────────────────────────┘ ║
║  └──────────────────────────────────────────────────┘ ║
║                                                        ║
║  CATEGORY FILTER BAR:                                 ║
║  [Psychology] [Self-Improve] [Mystery] [Y-Novel] +5  ║
║                                                        ║
║  SECTION: "RECOMMENDED FOR YOU" (Logged-in users)     ║
║  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         ║
║  │ Book 1 │ │ Book 2 │ │ Book 3 │ │ Book 4 │ ...     ║
║  │ Cover  │ │ Cover  │ │ Cover  │ │ Cover  │         ║
║  │ Title  │ │ Title  │ │ Title  │ │ Title  │         ║
║  │ ⭐4.5  │ │ ⭤4.8  │ │ ⭤4.2  │ │ ⭤4.0  │         ║
║  │ ♥ 234  │ │ ♥ 567  │ │ ♥ 123  │ │ ♥ 456  │         ║
║  └────────┘ └────────┘ └────────┘ └────────┘         ║
║                                         [See More →]   ║
║                                                        ║
║  SECTION: "NEW RELEASES"                              ║
║  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         ║
║  │ Book 1 │ │ Book 2 │ │ Book 3 │ │ Book 4 │         ║
║  │ Cover  │ │ Cover  │ │ Cover  │ │ Cover  │         ║
║  │ NEW    │ │ NEW    │ │ NEW    │ │ NEW    │         ║
║  └────────┘ └────────┘ └────────┘ └────────┘         ║
║                                         [See More →]   ║
║                                                        ║
║  SECTION: "TOP RATED BOOKS" (Most Hearts)             ║
║  1. 📕 "Book Title" - ♥ 2,456 - Rating: ⭐ 4.9       ║
║  2. 📗 "Book Title" - ♥ 2,234 - Rating: ⭐ 4.8       ║
║  3. 📘 "Book Title" - ♥ 1,987 - Rating: ⭐ 4.7       ║
║  ...                                                   ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║ FOOTER: Links, Social, Newsletter Signup             ║
╚════════════════════════════════════════════════════════╝
```

**Key Features:**
- Autorotating hero carousel (5-second interval)
- Category quick filters (horizontal scroll on mobile)
- Grid layout responsive (4 cols desktop, 2 cols tablet, 1 col mobile)
- Smooth animations on hover
- "See More" links for infinite scroll or pagination

---

### 2.2 Book Detail Page Wireframe

```
╔════════════════════════════════════════════════════════╗
║ HEADER: [← Back]  Logo  Search Bar  [User Menu]       ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  Breadcrumb: Home > Psychology > Top Reads > This   ║
║  Book                                                 ║
║                                                        ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │           BOOK INFO (Left Column)  │ STATS (Right)║
║  │ ┌────────────────────────────────┐ │              ║
║  │ │                                │ │ ♥ 2,456     ║
║  │ │   HIGH-RES BOOK COVER          │ │ Likes       ║
║  │ │   Image: 300x400px             │ │              ║
║  │ │   (Lazy loaded)                │ │ ⭐ 4.8      ║
║  │ │                                │ │ 1,234 Votes ║
║  │ │                                │ │              ║
║  │ │                                │ │ 845 Comments║
║  │ │                                │ │              ║
║  │ │                                │ │ Owned By    ║
║  │ │                                │ │ 567 Users   ║
║  │ │                                │ │              ║
║  │ └────────────────────────────────┘ │              ║
║  │  [♥ ADD TO FAVORITES]                             ║
║  │  [☑ I OWN THIS BOOK]                              ║
║  │                                                    ║
║  │  Title: "Atomic Habits"                           ║
║  │  Author: James Clear                              ║
║  │  ISBN: 9780735211292                              ║
║  │  Published: October 16, 2018                       ║
║  │  Pages: 320 | Language: English                    ║
║  │  Price: $16.99                                     ║
║  │                                                    ║
║  │  WHERE TO BUY:                                    ║
║  │  [🛒 Amazon] [📕 Local Bookstore] [...Other]     ║
║  │                                                    ║
║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║  │  SYNOPSIS:                                         ║
║  │  "An easy and proven way to build good habits,   ║
║  │   break bad ones, and master tiny behaviors that  ║
║  │   lead to remarkable results..."                  ║
║  │  [Show More ▼]                                     ║
║  │                                                    ║
║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║  │  RATING DISTRIBUTION:                             ║
║  │  ⭐⭐⭐⭐⭐ 45% (567 votes)     ▮▮▮▮▮▮░░░░       ║
║  │  ⭐⭐⭐⭐  ☆ 35% (434 votes)  ▮▮▮▮▬░░░░░░       ║
║  │  ⭐⭐⭐  ☆☆ 15% (189 votes)   ▮▮▬░░░░░░░░       ║
║  │  ⭐⭐  ☆☆☆ 4% (56 votes)      ▮░░░░░░░░░░       ║
║  │  ⭐  ☆☆☆☆ 1% (12 votes)      ░░░░░░░░░░       ║
║  │                                                    ║
║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║  │  RELATED BOOKS:                                    ║
║  │  ┌        ┐ ┌        ┐ ┌        ┐                ║
║  │  │ Book 1 │ │ Book 2 │ │ Book 3 │ [See More]    ║
║  │  └        ┘ └        ┘ └        ┘                ║
║  └──────────────────────────────────────────────────┘ ║
║                                                        ║
║  COMMENTS & REVIEWS SECTION:                          ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │ 845 Comments  [Sort: Newest ▼] [Search Comments]│ ║
║  │                                                  │ ║
║  │ YOUR OPINION:                                    │ ║
║  │ [Star Rating: ☆ ☆ ☆ ☆ ☆]  Clear rating         │ ║
║  │ ┌────────────────────────────────────────────┐  │ ║
║  │ │ Write your review or comment here...       │  │ ║
║  │ │                                            │  │ ║
║  │ │ B I U ~ • ∞  @mention                      │  │ ║
║  │ └────────────────────────────────────────────┘  │ ║
║  │   (0/2000 characters)                            │ ║
║  │   [Preview] [Submit Comment]                    │ ║
║  │                                                  │ ║
║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─  │ ║
║  │  COMMENT THREAD 1:                               │ ║
║  │  👤 Sarah Smith  (Verified Owner)     3 days ago │ ║
║  │  Rating: ⭐⭐⭐⭐⭐                             │ ║
║  │  "This book literally changed my life! The       │ ║
║  │   2% improvement rule is genius..."              │ ║
║  │   ♥ 234 likes                                    │ ║
║  │   [Like] [Report] [Reply ▼]                     │ ║
║  │                                                  │ ║
║  │   └─ Reply by James Clear (Author) 2 days ago: │ ║
║  │      "Thank you so much for the kind words!"    │ ║
║  │      ♥ 567 likes                                │ ║
║  │                                                  │ ║
║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─  │ ║
║  │  COMMENT THREAD 2:                               │ ║
║  │  👤 Mike Johnson                     1 week ago  │ ║
║  │  Rating: ⭐⭐⭐⭐ ☆                             │ ║
║  │  "Good book but felt repetitive in parts..."    │ ║
║  │   ♥ 45 likes                                    │ ║
║  │   [Like] [Report] [Reply ▼]                     │ ║
║  │                                                  │ ║
║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─  │ ║
║  │                                                  │ ║
║  │            [Load More Comments...]               │ ║
║  │                                                  │ ║
║  └──────────────────────────────────────────────────┘ ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║ FOOTER                                                 ║
╚════════════════════════════════════════════════════════╝
```

**Key Features:**
- Image lazy loading with skeleton screen
- Floating action buttons (Like, Own)
- Nested comment threads with indentation
- Rating distribution chart
- Related books carousel
- Rich text editor for comments
- Author verification badge

---

### 2.3 Event Calendar Page Wireframe

```
╔════════════════════════════════════════════════════════╗
║ HEADER: Logo  [Book Events]  Search  [User Menu]      ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  FILTERING & CONTROLS:                                ║
║  View: [◉ Calendar] [○ List] 👁️ [Filters ▼]         ║
║  Time: [Next 30 Days ▼]  Location: [All ▼]           ║
║  Type: [All Events ▼]                                ║
║                                                        ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │                   MARCH 2026                      │ ║
║  │  Mo Tu We Th Fr Sa Su                             │ ║
║  │                       1  2                         │ ║
║  │   3  4  5  6  7  8  9                             ║
║  │  10 11 12 13 14 15 16                             ║
║  │ ●17 18 19 20 21 22 23  (Today)                    ║
║  │  24 25 26 27 28 29 30                             ║
║  │  31                                                │ ║
║  │                                                    │ ║
║  │  ● = Event date (marked with colored dot)         │ ║
║  │  Events on 03/17: 📚 "Book Fair 2026"             │ ║
║  │  Events on 03/22: 👤 "Author Reading - Sarah"    │ ║
║  │                                                    │ ║
║  │  ← [MARCH 2026] →                                 ║
║  └──────────────────────────────────────────────────┘ ║
║                                                        ║
║  UPCOMING EVENTS (Next 60 Days):                       ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │                                                  │ ║
║  │  📚 BOOK FAIR 2026                              │ ║
║  │  March 17-19, 2026 | 09:00 AM - 06:00 PM       │ ║
║  │  Convention Center, Main Hall                   │ ║
║  │  📍 Downtown, 2.5 km away                       │ ║
║  │  Organizer: Local Library                       │ ║
║  │                                                  │ ║
║  │  Description: "Annual book fair featuring 200+  │ ║
║  │  authors and publishers. Browse, buy, and meet  │ ║
║  │  your favorite authors!"                        │ ║
║  │                                                  │ ║
║  │  👥 1,234 Registered | Capacity: 5,000          │ ║
║  │                                                  │ ║
║  │  [🗺️ View on Map] [🚗 Get Directions]           │ ║
║  │  [📍 Parking Info] [♿ Accessibility]           │ ║
║  │                                                  │ ║
║  │  Tags: #BookFair #Publishing #Community        │ ║
║  │                                                  │ ║
║  │  [Register for Event] [Share] [Save]            │ ║
║  │                                                  │ ║
║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     ║
║  │                                                  │ ║
║  │  👤 AUTHOR READING: "Atomic Habits Discussion"  │ ║
║  │  March 22, 2026 | 05:00 PM - 07:00 PM         │ ║
║  │  Riverside Books Café                           │ ║
║  │  📍 Downtown, 1.8 km away                       │ ║
║  │  Speaker: James Clear (Author)                 │ ║
║  │                                                  │ ║
║  │  Join bestselling author James Clear for a     │ ║
║  │  discussion about building better habits.       │ ║
║  │                                                  │ ║
║  │  👥 234 Registered | Capacity: 150             │ ║
║  │                                                  │ ║
║  │  [Register for Event] [Interested] [Share]     │ ║
║  │                                                  │ ║
║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     ║
║  │                                                  │ ║
║  │  [Load More Events...]                          │ ║
║  │                                                  │ ║
║  └──────────────────────────────────────────────────┘ ║
║                                                        ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │          GOOGLE MAP (Event Locations)             │ ║
║  │  ┌──────────────────────────────────────────────┐ ║
║  │  │  🗺️  [Zoom controls]                         │ ║
║  │  │      Center: User Location                   │ ║
║  │  │                                              │ ║
║  │  │  📍 Book Fair (Mar 17)         [2.5 km]     │ ║
║  │  │  👤 Author Reading (Mar 22)    [1.8 km]     │ ║
║  │  │  🎓 Book Club Meeting (Mar 25) [3.2 km]     │ ║
║  │  │                                              │ ║
║  │  │  Click marker for details or directions     │ ║
║  │  └──────────────────────────────────────────────┘ ║
║  └──────────────────────────────────────────────────┘ ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║ FOOTER                                                 ║
╚════════════════════════════════════════════════════════╝
```

**Key Features:**
- Dual view: Calendar + List
- Interactive map with location clustering
- Event cards with quick info and CTAs
- Filter by date range, location, event type
- Integration with Google Maps for directions
- Registration count and capacity indicator
- Event details expandable

---

### 2.4 User Profile Page Wireframe

```
╔════════════════════════════════════════════════════════╗
║ HEADER                                                 ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  PROFILE HEADER:                                       ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │ [Cover Image - Customizable Background]         │ ║
║  │                     👤 Avatar (120x120px)        │ ║
║  │  Username: "bookworm_john"                       │ ║
║  │  Full Name: John Doe                             │ ║
║  │                                                  │ ║
║  │  Bio: "Avid reader and book collector..."       │ ║
║  │  Location: San Francisco, CA  🌐 Website         │ ║
║  │                                                  │ ║
║  │  [✎ Edit Profile] [Follow] [Share] [Settings]  │ ║
║  │                                                  │ ║
║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │ ║
║  │  STATS:                                          │ ║
║  │  📚 Books Owned: 234        ❤️ Books Liked: 567 │ ║
║  │  💬 Comments: 89             ⭐ Avg Rating: 4.2 │ ║
║  │  👥 Followers: 1,234  Following: 456             │ ║
║  │                                                  │ ║
║  └──────────────────────────────────────────────────┘ ║
║                                                        ║
║  NAVIGATION TABS:                                      ║
║  [Collection] [Favorites] [Ratings] [Comments] [Activity]║
║                                                        ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │ MY BOOK COLLECTION                               │ ║
║  │                                                  │ ║
║  │ Filter: [All Books ▼] [Show: Grid ⊞] [List ☰]  │ ║
║  │ Sort: [Date Added ▼]                            │ ║
║  │                                                  │ ║
║  │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    ║
║  │ │ Book 1 │ │ Book 2 │ │ Book 3 │ │ Book 4 │    ║
║  │ │ Cover  │ │ Cover  │ │ Cover  │ │ Cover  │    ║
║  │ │        │ │        │ │        │ │        │    ║
║  │ │ Title  │ │ Title  │ │ Title  │ │ Title  │    ║
║  │ │ Author │ │ Author │ │ Author │ │ Author │    ║
║  │ │ 📕Owned│ │ 🔴Read │ │ 📚List │ │ 📕Owned│    ║
║  │ └────────┘ └────────┘ └────────┘ └────────┘    ║
║  │                                                  ║
║  │ [Load More Books...]                             │ ║
║  │                                                  ║
║  │ ACTIONS:                                         │ ║
║  │ [📥 Export Collection] [🔗 Share Collection]    │ ║
║  │                                                  ║
║  └──────────────────────────────────────────────────┘ ║
║                                                        ║
║  RECENT ACTIVITY:                                      ║
║  ⏱️  1 day ago    - Liked "The Midnight Library"     ║
║  ⏱️  3 days ago   - Added comment on "Atomic Habits" ║
║  ⏱️  1 week ago   - Registered for "Book Fair 2026"  ║
║  ⏱️  2 weeks ago  - Rated "Sapiens" 5 stars         ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║ FOOTER                                                 ║
╚════════════════════════════════════════════════════════╝
```

**Key Features:**
- Customizable profile header with background image
- Multiple tabs for different content views
- Grid/List view toggle
- Collection statistics and metrics
- Activity timeline
- Export and sharing functionality

---

### 2.5 Search Results Page Wireframe

```
╔════════════════════════════════════════════════════════╗
║ HEADER: Logo  [Advanced Search Bar - sticky]          ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  SEARCH QUERY: "atomic habits"                         ║
║  Results: 1,234 books found (0.42 seconds)            ║
║                                                        ║
║  FILTERS (Sidebar - Left Column on Desktop):          ║
║  ┌─────────────────────────────┐                      ║
║  │ CATEGORIES                  │                      ║
║  │ ☑ Psychology            123  │                      ║
║  │ ☑ Self-improvement       98  │                      ║
║  │ ☐ Science               45  │                      ║
║  │ ☐ Biography             32  │                      ║
║  │ [Show More ▼]               │                      ║
║  │                             │                      ║
║  │ RATING                      │                      ║
║  │ ○ 5 stars           234      │                      ║
║  │ ○ 4+ stars          567      │                      ║
║  │ ○ 3+ stars          890      │                      ║
║  │ ○ All ratings     1,234      │                      ║
║  │                             │                      ║
║  │ PUBLICATION DATE            │                      ║
║  │ ○ Last 1 year       345      │                      ║
║  │ ○ Last 5 years      678      │                      ║
║  │ ○ All time        1,234      │                      ║
║  │                             │                      ║
║  │ PRICE RANGE                 │                      ║
║  │ Min: [$] Max: [$]           │                      ║
║  │ ☑ Free ebooks         89     │                      ║
║  │                             │                      ║
║  │ [Clear All Filters]         │                      ║
║  └─────────────────────────────┘                      ║
║                                                        ║
║  RESULTS (Right Column):                              ║
║  Sort: [Relevance ▼] View: [List ☰] [Grid ⊞]        ║
║                                                        ║
║  1. ATOMIC HABITS                              ⭐4.8  ║
║     📕 By James Clear                          ♥2,456║
║     ISBN: 9780735211292 | 320 pages | $16.99          ║
║     "An easy and proven way to build good habits,     ║
║      break bad ones, and master tiny behaviors..."    ║
║     [View Details] [♡ Like] [☑ Own] [💬 Comments]   ║
║                                                        ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                        ║
║  2. POWER OF HABIT                             ⭐4.6  ║
║     📘 By Charles Duhigg                       ♥1,234║
║     ISBN: 9780812981605 | 416 pages | $17.99          ║
║     "In The Power of Habit, Pulitzer Prize winner     ║
║      Charles Duhigg unlocks the secret..."            ║
║     [View Details] [♡ Like] [☑ Own] [💬 Comments]   ║
║                                                        ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                        ║
║  3. TINY HABITS                                ⭐4.4  ║
║     📗 By BJ Fogg                              ♥  987║
║     ISBN: 9780593539683 | 384 pages | $18.99          ║
║     "Bestselling author BJ Fogg brings you...         ║
║     [View Details] [♡ Like] [☑ Own] [💬 Comments]   ║
║                                                        ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                        ║
║  [Showing 1-9 of 1,234 results]                       ║
║  Pagination: [← Previous] [1] [2] [3] ... [10] [Next →]║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║ FOOTER                                                 ║
╚════════════════════════════════════════════════════════╝
```

**Key Features:**
- Sticky search bar for refinement
- Left sidebar filters (collapsible on mobile)
- Result count and search performance time
- List and grid view toggle
- Multiple sort options
- Detailed result cards with actionable items
- Pagination or infinite scroll

---

## 3. Component Library

### 3.1 Book Card Component

```
┌──────────────────────────┐   Interactive States:
│                          │   - Default
│   Book Cover             │   - Hover (show quick actions)
│   (Dynamic Height-       │   - Loading (skeleton)
│    width based on theme) │   - Error (placeholder)
│                          │
│  ────────────────────    │   Quick Actions (on hover):
│ Title: "Book Name"       │   - ♥ Like
│ Author: "Author Name"    │   - ☑ Own This
│                          │   - 👁️ View Details
│ Rating: ⭐ 4.8           │   - 💬 Comments
│ Likes: ♥ 234            │
│                          │
│ [View]  [♡]  [☑] [☰]  │
└──────────────────────────┘
```

### 3.2 Comment Card Component

```
┌────────────────────────────────┐
│ 👤 John Doe                3d  │
│    Verified Owner              │
│                                │
│ ⭐⭐⭐⭐⭐ (Rating)           │
│                                │
│ "This book changed my          │
│  perspective on habits..."     │
│                                │
│ ♥ 234  [Like] [Report] [Reply] │
│                                │
│  └─ 👤 Author Reply            │
│     "Thank you for the..."     │
│     ♥ 567                      │
│                                │
└────────────────────────────────┘
```

### 3.3 Event Card Component

```
┌──────────────────────────────────┐
│ 📚 BOOK FAIR 2026                │
│ March 17-19 | 09:00 AM - 06 PM  │
│ Downtown Convention Center       │
│ 📍 2.5 km away                  │
│                                  │
│ "Annual book fair featuring..." │
│ 👥 1,234 Registered | Cap: 5000 │
│                                  │
│ [View Details] [Register]        │
│                                  │
└──────────────────────────────────┘
```

---

## 4. Interaction & Animation Specifications

### 4.1 Key Animations

| Element | Animation | Duration | Trigger |
|---------|-----------|----------|---------|
| Like Button | Heart scale + pulse | 0.4s | Click |
| Page Transition | Fade + slide | 0.3s | Route change |
| Book Hover | Scale + shadow | 0.2s | Hover |
| Comment Load | Fade in with slide up | 0.5s | Load |
| Modal Open | Scale from center | 0.3s | Modal trigger |
| Toast Notification | Slide up from bottom | 0.4s | Action complete |

### 4.2 Hover States

- **Book Cards:** Scale 1.02, shadow elevation, quick action buttons appear
- **Buttons:** Background color change, slight scale
- **Links:** Underline appears, color transition
- **Comment:** Highlight background, reply button visible

---

## 5. Responsive Design Breakpoints

### 5.1 Mobile (320px - 767px)

```
Hero:     Full width, stacked layout
Books:    1 column grid
Events:   List view (no calendar)
Filters:  Modal/drawer instead of sidebar
Navigation: Hamburger menu
```

### 5.2 Tablet (768px - 1023px)

```
Hero:     Full width
Books:    2 column grid
Events:   Mixed calendar + list
Filters:  Collapsible left sidebar
Navigation: Top navigation bar
```

### 5.3 Desktop (1024px+)

```
Hero:     Full width with carousel
Books:    4 column grid
Events:   Side-by-side calendar + map
Filters:  Fixed left sidebar
Navigation: Full top navigation
```

---

## 6. Accessibility Requirements

### 6.1 Color Contrast

- Normal text (14px): 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

### 6.2 Focus States

```
┌─────────────────────────┐
│ Focused Button          │
│ ├─ 2px border outline   │
│ ├─ Color: Primary Blue  │
│ └─ Visible at 2x zoom   │
└─────────────────────────┘
```

### 6.3 Screen Reader Support

- Alt text for all images
- Semantic HTML (button, nav, main, etc.)
- ARIA labels for icons
- Form labels and error messages
- Skip navigation link

---

## 7. Dark Mode Design

### 7.1 Color Adjustments

```
Dark Mode Palette:
├── Background: #1F2937
├── Surface: #111827
├── Primary: #60A5FA
├── Text: #F3F4F6
└── Accent: #FBBF24
```

### 7.2 Implementation

- User preference toggle in settings
- Respect system preference (prefers-color-scheme)
- Smooth transition (0.3s)
- Persistent in localStorage

---

## 8. Loading & Error States

### 8.1 Skeleton Screens

Show while loading:
- Book cards with placeholder
- Comment sections
- Event list items
- User profile header

### 8.2 Error Handling

```
Error Message:
┌────────────────────────┐
│ ⚠️  Something went wrong │
│ "Failed to load books"  │
│ [Retry] [Go Back]       │
└────────────────────────┘
```

---

## 9. Internationalization (i18n)

- Support for multiple languages
- Right-to-left (RTL) support
- Date/time localization
- Currency formatting
- Language toggle in header

---

## 10. Performance Considerations

### 10.1 Image Optimization

```
Responsive images:
- Thumbnail: 200x300px (50KB)
- Detail page: 400x600px (150KB)
- Hero banner: 1920x600px (300KB)
- WebP format with JPEG fallback
- Lazy loading for below-the-fold
```

### 10.2 Code Splitting

- Route-based splitting
- Component-level splitting
- Vendor bundle separation
- Load critical CSS inline

---

**Document Version:** 1.0
**Last Updated:** March 2026
**Design Tool:** Figma (recommended for detailed mockups)
