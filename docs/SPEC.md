# Muse Dating App - Comprehensive Specification

## Version: 2.0

## Core Philosophy
Create a dating app that combines the best features from Bumble, Hinge, and Tinder with unique innovations to provide a superior dating experience.

---

## 1. User Authentication & Onboarding

### 1.1 Auth Page
- [x] Email/password login
- [x] Email/password signup
- [x] Google OAuth button (UI only - shows toast)
- [x] Facebook OAuth button (UI only - shows toast)
- [x] Toggle between login/signup
- [x] Animated background with particles

### 1.2 Onboarding Flow (4 Steps)
**Step 1: Photos**
- [x] Add up to 6 photos
- [x] Remove photos
- [x] Mark primary photo
- [x] File upload via camera/gallery

**Step 2: Basic Info**
- [x] Name input
- [x] Age input (18-99)
- [x] Bio text area (500 char max)

**Step 3: Interests**
- [x] Select up to 5 interests from predefined list
- [x] 18 predefined interests with icons
- [x] Visual feedback on selection

**Step 4: Prompts**
- [x] 3 prompt questions
- [x] Custom answers (100 char max)
- [x] Pre-defined prompt suggestions

---

## 2. Discovery/Swipe Page

### 2.1 Profile Cards
- [x] Large photo display
- [x] Name and age
- [x] Location/distance
- [x] Online status indicator
- [x] Interests tags (max 3)
- [x] Bio preview (2 lines)
- [x] "Tap to view full profile" button

### 2.2 Swipe Interactions
- [x] Drag left to pass (dislike)
- [x] Drag right to like
- [x] Tap X button for dislike
- [x] Tap heart button for like
- [x] **Super Like** (star button) - 80% match rate
- [x] Undo last swipe - restores exact profile

### 2.3 Profile Detail Modal
- [x] Full photo gallery (horizontal scroll)
- [x] Complete bio
- [x] All interests
- [x] Prompt answers

### 2.4 Match Experience
- [x] Match modal with animation
- [x] Both photos displayed
- [x] "Send a Message" button
- [x] "Keep Swiping" button

### 2.5 Empty State
- [x] "That's everyone!" message
- [x] Refresh prompt

---

## 3. Matches Page

### 3.1 Match List
- [x] Grid/list of matched profiles
- [x] Match time (relative)
- [x] Bio preview
- [x] "Say Hi" chat button

### 3.2 Likes/Requests Section
- [x] Toggle show/hide
- [x] Profile cards with accept/reject
- [x] Request count badge

### 3.3 Premium Banner
- [x] Premium upgrade CTA
- [x] Navigate to profile for upgrade

---

## 4. Chat/Messaging

### 4.1 Chat List (from Matches)
- [x] All matches listed
- [x] Last message preview
- [x] Unread count
- [x] Online status

### 4.2 Chat Room
- [x] Header with match photo/name
- [x] Online status indicator
- [x] Message bubbles (sent/received)
- [x] Message timestamps
- [x] Read receipts (single/double check)
- [x] Quick reply suggestions
- [x] Text input with send button
- [x] Video call button (shows toast)
- [x] More options button

### 4.3 Action Sheet
- [x] View Profile
- [x] Unmatch
- [x] Block
- [x] Report
- [x] Cancel

### 4.4 Auto Replies
- [x] Simulated replies after 2 seconds
- [x] 7 different reply messages
- [x] Random selection

---

## 5. Moments/Stories

### 5.1 Story Viewer
- [x] Full-screen story display
- [x] Progress bar (multiple stories)
- [x] Auto-advance (5 seconds)
- [x] Tap to pause/resume
- [x] Story header with user info
- [x] Close button

### 5.2 Moments Feed
- [x] My Story section (add new)
- [x] Other users' stories
- [x] Grid view of moments
- [x] View count display
- [x] User overlay info

### 5.3 Story Actions
- [x] Like button
- [x] Comment button
- [x] Share button
- [x] Add new moment (photo upload)

---

## 6. Profile Page

### 6.1 Profile Display
- [x] Photo grid (up to 6 photos)
- [x] Add/remove photos
- [x] Camera button
- [x] Name and age
- [x] Location
- [x] Bio
- [x] Match count
- [x] Likes count

### 6.2 Edit Profile
- [x] Name (editable)
- [x] Age (editable)
- [x] Bio (editable)
- [x] Location (editable)
- [x] Interests (add/remove - up to 5)
- [x] Prompts (edit answers)
- [x] Photos (add/remove)

### 6.3 Premium Section
- [x] Premium card display
- [x] Plan selection modal
- [x] 4 plans: Daily(₹10), Weekly(₹50), Monthly(₹199), Yearly(₹999)
- [x] Purchase functionality
- [x] Expiry display

### 6.4 Settings
- [x] Settings (modal)
- [x] Safety (modal)
- [x] Help (modal)
- [x] About (modal)

### 6.5 Logout
- [x] Logout button
- [x] Navigate to auth

---

## 7. Navigation

### 7.1 Bottom Nav
- [x] Discover (compass icon)
- [x] Matches (heart icon)
- [x] Moments (play icon)
- [x] Profile (user icon)
- [x] Active indicator
- [x] Badge for notifications

### 7.2 Top Bar
- [x] Logo
- [x] Premium button

---

## 8. Premium Features

### 8.1 Premium Plans
- [x] Daily: ₹10 for 1 day
- [x] Weekly: ₹50 for 7 days
- [x] Monthly: ₹199 for 30 days
- [x] Yearly: ₹999 for 365 days

### 8.2 Premium Benefits (Display Only)
- Unlimited likes
- See who likes you
- Unlimited rewinds
- Top priority in likes
- 5 super likes per day
- Boost once per week
- See online status
- See profile views

---

## 9. Advanced Features (To Add)

## 9.1 Discovery Settings
- [x] Age preference slider (18-60+)
- [x] Distance preference (1-100 miles)
- [x] Gender preference (Men/Women/Everyone)
- [x] Show online users only
- [x] **Filters button** in header with modal
- [x] **Undo swipe** - restores exact profile that was disliked

### 9.2 Icebreakers
- [x] Pre-made opening lines (10 different options)
- [x] Toggle show/hide
- [x] One-tap send
- [x] Quick replies section

### 9.3 Notifications
- [ ] New match notification
- [ ] New message notification
- [ ] Someone liked you notification
- [ ] Message notification

### 9.4 Boost Feature
- [x] Boost button in DiscoveryPage
- [x] Boost animation overlay
- [x] Premium users can boost once per day
- [x] Non-premium users redirected to upgrade
- [x] Store: boostProfile function, lastBoost tracking

### 9.5 Profile Stats
- [x] Track likes, matches, messages, profile views
- [x] Stats stored in store

### 9.6 Discovery Filters
- [x] Age range filter (min/max)
- [x] Distance filter (slider 1-100 miles)
- [x] Gender filter (Everyone/Men/Women)
- [x] Filters modal with Apply button

### 9.3 Safety Features
- [ ] Block user
- [ ] Report user
- [ ] Unmatch
- [ ] Hide profile from certain users

### 9.4 Social Features
- [ ] Share profile
- [ ] Share match
- [ ] Instagram integration

### 9.5 Analytics (User)
- [ ] Profile views count
- [ ] Likes received count
- [ ] Matches count
- [ ] Messages sent/received

### 9.6 Icebreakers
- [ ] Pre-made opening lines
- [ ] Prompt-based starters
- [ ] Question of the day

### 9.7 Events
- [ ] Virtual events
- [ ] Group dates
- [ ] Local events

### 9.8 Video Features
- [ ] Video call in chat
- [ ] Video intro on profile
- [ ] Video date scheduling

---

## 10. UI/UX Enhancements

### 10.1 Animations
- [x] Card swipe animations
- [x] Match hearts animation
- [x] Page transitions
- [x] Button press feedback
- [x] Loading states

### 10.2 Visual Design
- [x] Dark theme (primary)
- [x] Pink/purple accent colors
- [x] Gradient backgrounds
- [x] Glassmorphism effects
- [x] Rounded corners (cards, buttons)
- [x] Proper spacing

### 10.3 Responsive
- [x] Mobile-first design
- [x] Touch-friendly buttons
- [x] Proper safe areas

---

## 11. Technical Features

### 11.1 State Management (Zustand)
- [x] Persistent storage
- [x] User authentication state
- [x] Profile management
- [x] Swipe management
- [x] Chat/messaging
- [x] Moments/stories
- [x] Premium state
- [x] Preferences

### 11.2 Routing (React Router)
- [x] Auth routes
- [x] Onboarding routes
- [x] Main app routes
- [x] Chat routes

### 11.3 Performance
- [x] Code splitting
- [x] Lazy loading
- [x] Image optimization

---

## Implementation Priority

### Phase 1 (Core - Done)
1. Auth & Onboarding ✓
2. Discovery/Swipe ✓
3. Matches ✓
4. Chat ✓
5. Moments ✓
6. Profile ✓
7. Navigation ✓
8. Premium ✓

### Phase 2 (Enhanced - In Progress)
1. Undo swipe fix ✓
2. Edit profile enhancement (interests/prompts)
3. Discovery settings
4. Better notifications
5. Icebreakers

### Phase 3 (Advanced - Planned)
1. Video calling
2. Events
3. Social sharing
4. Advanced analytics

---

## Notes
- All buttons now have proper onClick handlers
- All forms have proper state management
- Super Like shows animation but doesn't auto-chat
- Undo restores exact profile that was swiped
- Edit profile includes all fields
