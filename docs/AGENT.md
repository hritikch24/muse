# Muse Dating App - Agent Documentation

## Project Overview
- **Name**: Muse Dating App
- **Tech Stack**: React 19, Vite, Zustand, React Router, Framer Motion
- **Platform**: Web (Mobile-first)

## Current Features

### Core Pages
1. **AuthPage** - Login/Signup with email, Google/Facebook OAuth (UI)
2. **OnboardingPage** - 4-step profile creation (photos, info, interests, prompts)
3. **DiscoveryPage** - Swipe cards with like/dislike/super-like/undo
4. **MatchesPage** - View matches and likes/requests
5. **ChatPage** - Messaging with icebreakers and quick replies
6. **MomentsPage** - Stories feature
7. **ProfilePage** - Edit profile, interests, prompts, premium

### Fixed Issues
- ✅ Super Like button now works (has onClick handler)
- ✅ Undo swipe restores exact profile
- ✅ Edit profile includes interests and prompts
- ✅ All buttons have proper onClick handlers
- ✅ Discovery filters modal (age, distance, gender)
- ✅ Icebreakers in chat
- ✅ Removed duplicate logo on Discovery page

### Authentication Security (CRITICAL FIXES)
- ✅ Login now validates password against stored hash
- ✅ Passwords hashed with salt before storage
- ✅ Session tracking with lastActivity timestamp
- ✅ 24-hour session timeout
- ✅ Duplicate email check on signup
- ✅ Password strength validation (8+ chars, upper, lower, number)
- ✅ Visual password strength meter
- ✅ Proper error messages (wrong password vs no account)

### Onboarding Validation (COMPLETE)
- ✅ Step 1 (Photos): Required, max 6, file type/size validation
- ✅ Step 2 (Info): Name 2-50 chars, age 18-99, bio max 500 chars
- ✅ Step 3 (Interests): 1-5 required
- ✅ Step 4 (Prompts): At least 1 required, max 100 chars each
- ✅ Back button maintains state
- ✅ Progress bar accurate

### Discovery/Swipe (COMPLETE)
- ✅ Profile cards display with photos, name, age, location
- ✅ Like/Nope/SuperLike buttons functional
- ✅ Undo restores last profile
- ✅ Filters modal (age, distance, gender)
- ✅ Profile detail view
- ✅ Match modal on mutual like
- ✅ Empty state when no profiles

### Matches & Chat (COMPLETE)
- ✅ Matches page with match cards
- ✅ Likes/Requests section
- ✅ Start chat from match
- ✅ Chat page with messages
- ✅ Icebreakers (10 pre-made messages)
- ✅ Quick replies
- ✅ Auto-replies (simulated)
- ✅ Read receipts
- ✅ Video call button (UI)

### Moments/Stories (COMPLETE)
- ✅ Stories feed with sample moments
- ✅ Add story button
- ✅ Story viewer with auto-advance
- ✅ Progress bar
- ✅ Tap to pause/play
- ✅ Like/comment/share buttons
- ✅ View count

### Profile & Premium (COMPLETE)
- ✅ Profile display with photos, name, age, location
- ✅ Edit profile modal
- ✅ Photo management (add/remove)
- ✅ Interests editing
- ✅ Prompts editing
- ✅ Premium section with 4 plans
- ✅ Purchase flow simulation
- ✅ Settings modal
- ✅ Logout functionality

### Additional Features (COMPLETE)
- ✅ Error Boundary for crash handling
- ✅ Accessibility improvements (ARIA labels, roles, keyboard nav)
- ✅ Session management with timeout
- ✅ Notifications system (mark read, clear all)
- ✅ Preferences (age, distance, gender filters)
- ✅ Location fetching
- ✅ Code splitting (lazy loading pages)
- ✅ Visibility settings (show online, show profile)

### Premium Plans
- Daily: ₹10 for 1 day
- Weekly: ₹50 for 7 days
- Monthly: ₹199 for 30 days
- Yearly: ₹999 for 365 days

## Key Files

### Store (`src/store/useStore.js`)
- User authentication state
- Profile management
- Swipe logic (swipeRight, swipeLeft, undoSwipe)
- Chat/messaging
- Moments/stories
- Premium state
- Preferences (ageRange, distance, gender)

### Pages
- `src/pages/AuthPage.jsx` - Authentication
- `src/pages/OnboardingPage.jsx` - 4-step onboarding
- `src/pages/DiscoveryPage.jsx` - Swipe cards + filters
- `src/pages/MatchesPage.jsx` - Matches list
- `src/pages/ChatPage.jsx` - Messaging + icebreakers
- `src/pages/MomentsPage.jsx` - Stories
- `src/pages/ProfilePage.jsx` - Profile + edit + premium

### Components
- `src/components/common/MainLayout.jsx` - Navigation shell

## Running the App
```bash
npm run dev    # Development server on port 3000
npm run build  # Production build
npm run test   # Run tests
```

## Testing
- Tests are in `src/test/`
- Run with `npm run test:run`

## Common Issues & Fixes
1. **Duplicate logo** - Remove duplicate from DiscoveryPage
2. **Super Like not working** - Add onClick handler
3. **Undo not restoring profile** - Fix index calculation after undo
4. **Edit profile missing fields** - Add interests/prompts to edit modal
