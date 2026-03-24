# Book Recommendation & Community Platform - Database Schema

## 1. Entity-Relationship Diagram (ERD)

### 1.1 ER Diagram (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ BOOK_LIKES : "likes"
    USERS ||--o{ BOOK_COMMENTS : "writes"
    USERS ||--o{ COMMENT_LIKES : "likes"
    USERS ||--o{ USER_BOOK_OWNERSHIP : "owns"
    USERS ||--o{ BOOK_RATINGS : "rates"
    USERS ||--o{ EVENT_REGISTRATIONS : "registers"
    USERS ||--o{ USER_PREFERENCES : "has"
    USERS ||--o{ USER_PROFILES : "has"
    
    BOOKS ||--o{ BOOK_LIKES : "receives"
    BOOKS ||--o{ BOOK_COMMENTS : "has"
    BOOKS ||--o{ USER_BOOK_OWNERSHIP : "is_owned_by"
    BOOKS ||--o{ BOOK_RATINGS : "receives"
    BOOKS ||--o{ BOOK_CATEGORIES : "belongs_to"
    BOOKS ||--o{ BOOK_AUTHORS : "written_by"
    
    CATEGORIES ||--o{ BOOK_CATEGORIES : "contains"
    
    AUTHORS ||--o{ BOOK_AUTHORS : "writes"
    
    BOOK_COMMENTS ||--o{ COMMENT_LIKES : "receives"
    BOOK_COMMENTS ||--o{ BOOK_COMMENTS : "replies_to"
    
    EVENTS ||--o{ EVENT_REGISTRATIONS : "has"
    EVENTS ||--o{ EVENT_DETAILS : "describes"
    
    USERS : int user_id
    USERS : string email
    USERS : string username
    USERS : string password_hash
    USERS : timestamp created_at
    USERS : timestamp updated_at
    
    BOOKS : int book_id
    BOOKS : string title
    BOOKS : string isbn
    BOOKS : string description
    BOOKS : string cover_image_url
    BOOKS : decimal price
    BOOKS : int total_pages
    BOOKS : timestamp publication_date
    
    CATEGORIES : int category_id
    CATEGORIES : string name
    CATEGORIES : string description
    
    AUTHORS : int author_id
    AUTHORS : string name
    AUTHORS : string bio
    
    BOOK_LIKES : int like_id
    BOOK_LIKES : int user_id
    BOOK_LIKES : int book_id
    BOOK_LIKES : timestamp created_at
    
    BOOK_COMMENTS : int comment_id
    BOOK_COMMENTS : int user_id
    BOOK_COMMENTS : int book_id
    BOOK_COMMENTS : int parent_comment_id
    BOOK_COMMENTS : string comment_text
    BOOK_COMMENTS : timestamp created_at
    
    COMMENT_LIKES : int comment_like_id
    COMMENT_LIKES : int user_id
    COMMENT_LIKES : int comment_id
    COMMENT_LIKES : timestamp created_at
    
    USER_BOOK_OWNERSHIP : int ownership_id
    USER_BOOK_OWNERSHIP : int user_id
    USER_BOOK_OWNERSHIP : int book_id
    USER_BOOK_OWNERSHIP : timestamp created_at
    
    BOOK_RATINGS : int rating_id
    BOOK_RATINGS : int user_id
    BOOK_RATINGS : int book_id
    BOOK_RATINGS : int rating_value
    BOOK_RATINGS : timestamp created_at
    
    EVENTS : int event_id
    EVENTS : string event_name
    EVENTS : string description
    EVENTS : timestamp event_date
    EVENTS : string location
    EVENTS : decimal latitude
    EVENTS : decimal longitude
    
    EVENT_REGISTRATIONS : int registration_id
    EVENT_REGISTRATIONS : int user_id
    EVENT_REGISTRATIONS : int event_id
    EVENT_REGISTRATIONS : timestamp registered_at
    
    USER_PREFERENCES : int preference_id
    USER_PREFERENCES : int user_id
    USER_PREFERENCES : string preferred_genres
    USER_PREFERENCES : boolean notifications_enabled
```

---

## 2. Detailed Table Schemas

### 2.1 Core Tables

#### USERS
User accounts and authentication

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    auth_provider VARCHAR(50), -- 'google', 'github', 'email'
    auth_provider_id VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified_email BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
```

---

#### BOOKS
Book catalog

```sql
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    description TEXT,
    cover_image_url VARCHAR(500),
    cover_image_path VARCHAR(255), -- For local storage
    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    total_pages INTEGER,
    publication_date DATE,
    language VARCHAR(50),
    publisher VARCHAR(255),
    edition VARCHAR(100),
    summary TEXT,
    content_warning TEXT,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_is_featured ON books(is_featured);
CREATE INDEX idx_books_created_at ON books(created_at);
```

---

#### CATEGORIES
Book categories/genres

```sql
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    color_code VARCHAR(7), -- Hex color
    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_name ON categories(name);
```

---

#### AUTHORS
Book authors

```sql
CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url VARCHAR(500),
    birth_date DATE,
    nationality VARCHAR(100),
    website VARCHAR(500),
    social_media JSONB, -- {twitter, instagram, website}
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_authors_name ON authors(name);
```

---

### 2.2 Relationship Tables

#### BOOK_CATEGORIES
Books belong to categories (many-to-many)

```sql
CREATE TABLE book_categories (
    book_category_id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    primary_category BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(book_id, category_id)
);

CREATE INDEX idx_book_categories_book_id ON book_categories(book_id);
CREATE INDEX idx_book_categories_category_id ON book_categories(category_id);
```

---

#### BOOK_AUTHORS
Books written by authors (many-to-many)

```sql
CREATE TABLE book_authors (
    book_author_id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES authors(author_id) ON DELETE CASCADE,
    author_order INTEGER, -- For multiple authors
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(book_id, author_id)
);

CREATE INDEX idx_book_authors_book_id ON book_authors(book_id);
CREATE INDEX idx_book_authors_author_id ON book_authors(author_id);
```

---

#### USER_BOOK_OWNERSHIP
Users mark books they own

```sql
CREATE TABLE user_book_ownership (
    ownership_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    ownership_status VARCHAR(50) DEFAULT 'owned', -- owned, reading, wishlist
    acquired_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

CREATE INDEX idx_ownership_user_id ON user_book_ownership(user_id);
CREATE INDEX idx_ownership_book_id ON user_book_ownership(book_id);
CREATE INDEX idx_ownership_status ON user_book_ownership(ownership_status);
```

---

### 2.3 Engagement Tables

#### BOOK_LIKES
User likes (hearts) for books

```sql
CREATE TABLE book_likes (
    like_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

CREATE INDEX idx_likes_user_id ON book_likes(user_id);
CREATE INDEX idx_likes_book_id ON book_likes(book_id);
CREATE INDEX idx_likes_created_at ON book_likes(created_at);
```

---

#### BOOK_RATINGS
User ratings for books (1-5 stars)

```sql
CREATE TABLE book_ratings (
    rating_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    rating_value INTEGER NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),
    review_text TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

CREATE INDEX idx_ratings_user_id ON book_ratings(user_id);
CREATE INDEX idx_ratings_book_id ON book_ratings(book_id);
CREATE INDEX idx_ratings_rating_value ON book_ratings(rating_value);
```

---

#### BOOK_COMMENTS
Comments and reviews on books

```sql
CREATE TABLE book_comments (
    comment_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    parent_comment_id INTEGER REFERENCES book_comments(comment_id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,
    report_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_book_id ON book_comments(book_id);
CREATE INDEX idx_comments_user_id ON book_comments(user_id);
CREATE INDEX idx_comments_parent_id ON book_comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON book_comments(created_at);
```

---

#### COMMENT_LIKES
Upvotes on comments

```sql
CREATE TABLE comment_likes (
    comment_like_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    comment_id INTEGER NOT NULL REFERENCES book_comments(comment_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, comment_id)
);

CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);
```

---

### 2.4 Events Tables

#### EVENTS
Book events and book fairs

```sql
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(50), -- 'book_fair', 'author_reading', 'book_launch', 'book_club'
    description TEXT,
    event_start_date TIMESTAMP NOT NULL,
    event_end_date TIMESTAMP NOT NULL,
    location_name VARCHAR(255),
    location_address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    organizer_name VARCHAR(255),
    organizer_contact VARCHAR(255),
    organizer_email VARCHAR(255),
    event_url VARCHAR(500),
    image_url VARCHAR(500),
    capacity INTEGER,
    registration_count INTEGER DEFAULT 0,
    travel_instructions TEXT,
    parking_info TEXT,
    accessibility_info TEXT,
    nearby_amenities JSONB, -- restaurants, hotels, etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_event_date ON events(event_start_date);
CREATE INDEX idx_events_location ON events(latitude, longitude);
CREATE INDEX idx_events_is_active ON events(is_active);
```

---

#### EVENT_REGISTRATIONS
User registrations for events

```sql
CREATE TABLE event_registrations (
    registration_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    registration_status VARCHAR(50) DEFAULT 'registered', -- 'registered', 'attended', 'cancelled'
    number_of_attendees INTEGER DEFAULT 1,
    special_requests TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    registered_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

CREATE INDEX idx_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_registrations_event_id ON event_registrations(event_id);
```

---

### 2.5 User Profile Tables

#### USER_PROFILES
Extended user profile information

```sql
CREATE TABLE user_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    photo_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    bio TEXT,
    location VARCHAR(255),
    website VARCHAR(500),
    birth_date DATE,
    gender VARCHAR(50),
    reading_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
    favorite_genres TEXT[],
    total_books_owned INTEGER DEFAULT 0,
    total_books_read INTEGER DEFAULT 0,
    joined_date TIMESTAMP DEFAULT NOW(),
    is_public BOOLEAN DEFAULT true,
    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON user_profiles(user_id);
```

---

#### USER_PREFERENCES
User preferences and settings

```sql
CREATE TABLE user_preferences (
    preference_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    preferred_genres TEXT[], -- Array of category slugs
    recommended_only BOOLEAN DEFAULT false, -- Only show recommended books
    language VARCHAR(10) DEFAULT 'en',
    theme VARCHAR(50) DEFAULT 'light', -- 'light', 'dark'
    notifications_email BOOLEAN DEFAULT true,
    notifications_push BOOLEAN DEFAULT true,
    notifications_weekly_digest BOOLEAN DEFAULT true,
    notifications_new_releases BOOLEAN DEFAULT false,
    notifications_friend_activity BOOLEAN DEFAULT false,
    privacy_show_collection BOOLEAN DEFAULT true,
    privacy_show_likes BOOLEAN DEFAULT true,
    privacy_show_ratings BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_preferences_user_id ON user_preferences(user_id);
```

---

### 2.6 Audit & System Tables

#### AUDIT_LOG
Track system changes for compliance

```sql
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    action_type VARCHAR(100), -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
    entity_type VARCHAR(100), -- 'BOOK', 'COMMENT', 'USER'
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at);
```

---

## 3. Data Views

### 3.1 Materialized View - Book Statistics

```sql
CREATE MATERIALIZED VIEW book_statistics AS
SELECT
    b.book_id,
    b.title,
    COUNT(DISTINCT bl.like_id) as total_likes,
    COUNT(DISTINCT br.rating_id) as total_ratings,
    AVG(br.rating_value)::DECIMAL(3,2) as average_rating,
    COUNT(DISTINCT bc.comment_id) as total_comments,
    COUNT(DISTINCT ubo.ownership_id) as total_owners,
    b.view_count,
    b.created_at
FROM books b
LEFT JOIN book_likes bl ON b.book_id = bl.book_id
LEFT JOIN book_ratings br ON b.book_id = br.book_id
LEFT JOIN book_comments bc ON b.book_id = bc.book_id AND bc.is_deleted = false
LEFT JOIN user_book_ownership ubo ON b.book_id = ubo.book_id
GROUP BY b.book_id, b.title, b.view_count, b.created_at;

CREATE INDEX idx_book_statistics_total_likes ON book_statistics(total_likes DESC);
CREATE INDEX idx_book_statistics_average_rating ON book_statistics(average_rating DESC);
```

---

### 3.2 View - Trending Books

```sql
CREATE VIEW trending_books AS
SELECT
    bs.book_id,
    bs.title,
    bs.total_likes,
    bs.total_ratings,
    bs.average_rating,
    bs.total_owners,
    (bs.total_likes * 0.4 + bs.total_ratings * 0.3 + bs.view_count * 0.3) as trend_score
FROM book_statistics bs
WHERE bs.created_at > NOW() - INTERVAL '30 days'
ORDER BY trend_score DESC;
```

---

### 3.3 View - User Feed

```sql
CREATE VIEW user_activity_feed AS
SELECT
    u.user_id,
    'comment_created' as activity_type,
    bc.comment_id as activity_id,
    b.book_id,
    b.title as book_title,
    bc.comment_text as activity_detail,
    bc.created_at as activity_date
FROM users u
JOIN book_comments bc ON u.user_id = bc.user_id
JOIN books b ON bc.book_id = b.book_id
WHERE bc.is_deleted = false

UNION ALL

SELECT
    u.user_id,
    'book_liked' as activity_type,
    bl.like_id as activity_id,
    b.book_id,
    b.title as book_title,
    'liked a book' as activity_detail,
    bl.created_at as activity_date
FROM users u
JOIN book_likes bl ON u.user_id = bl.user_id
JOIN books b ON bl.book_id = b.book_id;
```

---

## 4. Indexes Strategy

### 4.1 Performance Critical Indexes

```sql
-- For book discovery
CREATE INDEX idx_books_featured_created ON books(is_featured DESC, created_at DESC);

-- For category filtering
CREATE INDEX idx_book_categories_category_book ON book_categories(category_id, book_id);

-- For like/comment queries
CREATE INDEX idx_likes_book_created ON book_likes(book_id, created_at DESC);
CREATE INDEX idx_comments_book_created ON book_comments(book_id, created_at DESC);

-- For user timeline
CREATE INDEX idx_comments_user_created ON book_comments(user_id, created_at DESC);

-- For event proximity search
CREATE INDEX idx_events_geospatial ON events USING GIST(ll_to_earth(latitude, longitude));

-- For search
CREATE INDEX idx_books_title_trigram ON books USING GIN(title gin_trgm_ops);
```

---

## 5. Relationships Summary

| Relationship | Type | Description |
|-------------|------|-------------|
| Users → Books (Likes) | Many-to-Many | Users can like many books; books can be liked by many users |
| Users → Books (Ownership) | Many-to-Many | Users own multiple books; books are owned by multiple users |
| Users → Comments | One-to-Many | User writes many comments; each comment by one user |
| Users → Events | Many-to-Many | Users register for multiple events; events have multiple users |
| Comments → Comments | Self-Join | Comments can have reply comments |
| Books → Categories | Many-to-Many | Books belong to multiple categories; categories contain multiple books |
| Books → Authors | Many-to-Many | Books written by multiple authors; authors write multiple books |

---

## 6. Data Examples

### 6.1 Sample Users

```json
{
  "user_id": 1,
  "email": "john@example.com",
  "username": "bookworm_john",
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Avid reader and book collector",
  "is_verified_email": true,
  "created_at": "2025-01-15T10:00:00Z"
}
```

### 6.2 Sample Books

```json
{
  "book_id": 42,
  "title": "Atomic Habits",
  "isbn": "9780735211292",
  "description": "An easy and proven way to build good habits...",
  "cover_image_url": "https://cdn.example.com/books/atomic-habits.jpg",
  "price": 16.99,
  "publication_date": "2018-10-16",
  "total_pages": 320,
  "publisher": "Penguin Books"
}
```

### 6.3 Sample Comments

```json
{
  "comment_id": 123,
  "user_id": 1,
  "book_id": 42,
  "parent_comment_id": null,
  "comment_text": "This book changed my perspective on habits!",
  "like_count": 15,
  "created_at": "2025-03-10T14:30:00Z"
}
```

---

## 7. Database Sizing Estimate

### Year 1 Projections (10,000 active users)

| Table | Estimated Records | Storage |
|-------|------------------|---------|
| users | 10,000 | 5 MB |
| books | 50,000 | 25 MB |
| book_likes | 500,000 | 20 MB |
| book_comments | 100,000 | 50 MB |
| book_ratings | 200,000 | 10 MB |
| events | 1,000 | 2 MB |
| **Total** | **861,000** | **~150 MB** |

---

**Document Version:** 1.0
**Last Updated:** March 2026
