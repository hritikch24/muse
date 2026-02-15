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
