# MUSE Dating App - Design Specification

## Design Philosophy
- **Clean & Modern**: Inspired by Bumble, Hinge, Tinder but with uniqueMuse identity
- **Mobile-First**: Designed for 375px first, scales up to tablet/web
- **Delightful**: Smooth animations, clear visual hierarchy, intuitive interactions

---

## 1. COLOR PALETTE

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary Pink | `#FF4D6D` | Main CTAs, active states, hearts |
| Primary Light | `#FF8FA3` | Hover states, secondary accents |
| Primary Dark | `#C9184A` | Pressed states |

### Background Colors
| Name | Hex | Usage |
|------|-----|-------|
| Background Dark | `#0D0D0D` | Main background |
| Surface | `#1A1A1A` | Cards, modals |
| Surface Elevated | `#242424` | Elevated cards, hover states |
| Surface Glass | `rgba(255,255,255,0.08)` | Glass effects |

### Accent Colors
| Name | Hex | Usage |
|------|-----|-------|
| Gold | `#FFD700` | Premium, boost, filters |
| Success Green | `#00D26A` | Online status, success states |
| Error Red | `#FF4757` | Errors, nope button |
| Info Blue | `#3742FA` | Super like, links |

### Text Colors
| Name | Hex | Usage |
|------|-----|-------|
| Text Primary | `#FFFFFF` | Headings, primary text |
| Text Secondary | `#A0A0A0` | Body text, descriptions |
| Text Muted | `#666666` | Placeholders, disabled |

---

## 2. TYPOGRAPHY

### Font Families
- **Headings**: `'Outfit', sans-serif` - Modern, geometric
- **Body**: `'DM Sans', sans-serif` - Clean, readable
- **Accent**: `'Playfair Display', serif` - Elegant for logo

### Font Scale (Mobile → Desktop)
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Logo | 32px | 36px | 40px |
| H1 | 28px | 32px | 36px |
| H2 | 24px | 26px | 28px |
| H3 | 20px | 22px | 24px |
| Body Large | 17px | 18px | 18px |
| Body | 15px | 16px | 16px |
| Caption | 13px | 14px | 14px |
| Small | 11px | 12px | 12px |

### Font Weights
- Bold: 700 (Logo, H1)
- SemiBold: 600 (H2, H3, buttons)
- Medium: 500 (Body bold, labels)
- Regular: 400 (Body text)

---

## 3. SPACING SYSTEM

### Base Unit: 4px
```
xs: 4px    - Tight spacing
sm: 8px    - Icon gaps
md: 16px   - Default padding
lg: 24px   - Section spacing
xl: 32px   - Page margins
xxl: 48px  - Major sections
```

### Common Spacing Patterns
- **Page Padding**: 16px mobile, 24px tablet, 32px desktop
- **Card Padding**: 16px mobile, 20px desktop
- **Element Gap**: 12px between related items
- **Section Gap**: 24px between sections

---

## 4. COMPONENT SPECIFICATIONS

### Buttons
| Type | Height | Padding | Border Radius | Font |
|------|--------|---------|---------------|------|
| Primary | 56px | 16px 24px | 28px | 16px/600 |
| Secondary | 48px | 12px 20px | 24px | 15px/600 |
| Icon | 48px | 12px | 50% | 20px |
| Small | 36px | 8px 16px | 18px | 14px/500 |

### Input Fields
| Type | Height | Padding | Border Radius |
|------|--------|---------|---------------|
| Default | 56px | 16px 20px | 16px |
| Small | 44px | 12px 16px | 12px |

### Cards
| Type | Border Radius | Shadow | Padding |
|------|---------------|--------|---------|
| Standard | 20px | 0 8px 32px rgba(0,0,0,0.4) | 20px |
| Elevated | 24px | 0 12px 48px rgba(0,0,0,0.5) | 24px |
| Profile | 16px | none | 12px |

### Bottom Navigation
- Height: 64px + safe area
- Icon Size: 24px
- Label: 11px
- Active Color: Primary Pink
- Inactive Color: #666666

### Top Bar
- Height: 56px + safe area
- Logo: Left aligned
- Actions: Right aligned

---

## 5. PAGE LAYOUTS

### AuthPage (Login/Signup)
```
┌─────────────────────────────┐
│         Logo (center)      │  ← 60px from top
│      "Find your perfect    │
│        connection"         │
│                             │
│   ┌─────────────────────┐   │
│   │   Sign In  Sign Up  │   │  ← Tab selector
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │   Email input       │   │  ← 56px height
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │   Password input    │   │  ← 56px height
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │  ← Full width, 56px
│   │      Sign In        │   │
│   └─────────────────────┘   │
│                             │
│   ────── or continue ─────  │
│   [Google]    [Facebook]   │  ← Social login
│                             │
│   Don't have an account?    │  ← Footer
│   Sign up                  │
└─────────────────────────────┘
  ↓
Page margin: 24px sides
```

### OnboardingPage (4 Steps)
```
┌─────────────────────────────┐
│  ● ● ● ●    [Back]         │  ← Progress dots
├─────────────────────────────┤
│                             │
│     Step Title (center)    │  ← H2
│   Step subtitle (center)   │  ← Text Secondary
│                             │
│   ┌─────┐ ┌─────┐ ┌─────┐  │  ← Photo grid
│   │  +  │ │     │ │     │  │  ← 3 columns
│   └─────┘ └─────┘ └─────┘  │
│                             │
│   OR form inputs...         │
│   OR interest chips...      │
│   OR prompt answers...     │
│                             │
├─────────────────────────────┤
│  [Back]      [Continue]    │  ← Bottom navigation
└─────────────────────────────┘
```

### DiscoveryPage (Swipe Cards)
```
┌─────────────────────────────┐
│  MUSE        [Filters] ⚙️  │  ← Header
├─────────────────────────────┤
│                             │
│   ┌─────────────────────┐   │
│   │                     │   │
│   │                     │   │
│   │    Profile Photo    │   │  ← 85% height
│   │                     │   │
│   │   Name, Age    ✓   │   │
│   │   📍 5 miles • 2h  │   │
│   │   [Interest] [Int] │   │
│   │                     │   │
│   └─────────────────────┘   │
│                             │
│   [⟲]  [✕]  [★]  [⚡]  [♥] │  ← Action buttons
│        68px  52px  52px 68px
└─────────────────────────────┘
  ↓
Card: 92% width, aspect ratio 4:5
Card radius: 20px
Action button spacing: 16px
```

### MatchesPage
```
┌─────────────────────────────┐
│  Matches        [❤️ 3]     │  ← Header + requests
├─────────────────────────────┤
│  ┌───────────────────────┐ │
│  │ ○ Jessica  •  2h ago │ │  ← Horizontal scroll
│  │ [✕]  [♥]            │ │  ← Request cards
│  └───────────────────────┘ │
│                             │
│  ┌─────────────────────┐   │
│  │ [Photo]  Name, Age  │   │  ← Vertical list
│  │         Bio text... │   │
│  │         [Say Hi →]  │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ [Photo]  Name, Age  │   │  ← Match cards
│  │         Bio text... │   │
│  │         [Say Hi →]  │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ ✨ Get Premium      → │   │  ← Premium banner
│  └─────────────────────┘   │
└─────────────────────────────┘
```

### ChatPage
```
┌─────────────────────────────┐
│ [←] [Photo]  Name          │  ← Header
│         Active now  [📞][📹]│
├─────────────────────────────┤
│                             │
│   ┌────────────────────┐   │
│   │ Hi! How are you?   │   │  ← Their message
│   │              10:30 │   │
│   └────────────────────┘   │
│                             │
│        ┌────────────────┐   │
│        │ Hey! Great!   │   │  ← My message
│        │         10:31 ✓│   │
│        └────────────────┘   │
│                             │
│   [Quick replies...]        │  ← Horizontal scroll
│                             │
├─────────────────────────────┤
│  [🎤]  [Type a message...] [➤] │  ← Input
└─────────────────────────────┘
  ↓
Message bubble max-width: 75%
My message: right-aligned, pink gradient
Their message: left-aligned, surface color
Input height: 56px
```

### ProfilePage
```
┌─────────────────────────────┐
│  Profile           [Edit ✏️]│  ← Header
├─────────────────────────────┤
│                             │
│   ┌───┐ ┌───┐ ┌───┐       │
│   │ + │ │   │ │   │       │  ← Photo grid
│   └───┘ └───┘ └───┘       │
│   5 photos                 │
│                             │
│   Name, Age                │  ← H2
│   📍 Location              │  ← Text Secondary
│                             │
│   ┌─────────┐ ┌─────────┐  │  ← Stats row
│   │  ❤️ 12  │ │  ⭐ 45  │  │
│   │ Matches │ │  Likes  │  │
│   └─────────┘ └─────────┘  │
│                             │
│   ┌─────────────────────┐   │
│   │ ✨ Muse Premium    → │   │  ← Premium card
│   └─────────────────────┘   │
│                             │
│   Interests                 │  ← Section
│   [Chip] [Chip] [Chip]     │
│                             │
│   About                     │
│   "Bio text here..."       │
│                             │
│   Settings                  │  ← Section
│   ├─ Settings              │
│   ├─ Safety                │
│   ├─ Help                  │
│   └─ About                 │
│                             │
│   [Log Out]                │  ← Red button
└─────────────────────────────┘
```

---

## 6. ANIMATIONS

### Page Transitions
- Enter: fadeIn 200ms + slideUp 10px
- Exit: fadeOut 150ms

### Micro-interactions
- Button press: scale 0.96, 100ms
- Button hover: scale 1.02, 150ms
- Card swipe: follow finger with elastic 0.7
- Like overlay: fade in at 30% swipe, scale 1.1

### Modals
- Open: scale from 0.9 + fade, 200ms
- Close: scale to 0.95 + fade, 150ms
- Bottom sheet: slide up from bottom, 300ms spring

---

## 7. RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Scale Factor |
|------------|-------|--------------|
| Mobile | 320px - 480px | 1x |
| Tablet | 481px - 768px | 1.1x |
| Desktop | 769px - 1280px | 1.2x |
| Large | 1280px+ | 1.3x max |

---

## 8. ACCESSIBILITY

- Touch targets: minimum 44x44px
- Color contrast: 4.5:1 minimum
- Focus states: 2px outline with offset
- Screen reader: proper ARIA labels
- Reduced motion: respect prefers-reduced-motion
