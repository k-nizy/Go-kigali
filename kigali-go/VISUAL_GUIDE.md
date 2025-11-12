# 👀 Visual Guide - KigaliGo Auth Integration

## 🏠 Home Page Views

### View 1: Unauthenticated User (Default)

```
╔══════════════════════════════════════════════════════════╗
║                     KIGALI GO                            ║
║                                                          ║
║              Welcome to KigaliGo                         ║
║        Your smarter way to explore Kigali                ║
║                                                          ║
║     ┌──────────────┐    ┌──────────────┐               ║
║     │  🔓 Sign In  │    │  ➕ Sign Up  │               ║
║     └──────────────┘    └──────────────┘               ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

**What happens:**
- User sees two prominent buttons
- "Sign In" → Solid white button with teal text
- "Sign Up" → Outlined white button
- Both buttons have hover effects (scale + shadow)

---

### View 2: Authenticated User

```
╔══════════════════════════════════════════════════════════╗
║                     KIGALI GO                            ║
║                                                          ║
║              Welcome to KigaliGo                         ║
║        Your smarter way to explore Kigali                ║
║                                                          ║
║            Welcome back, Kevin! 👋                       ║
║                                                          ║
║     ┌────────────────────┐    ┌──────────────┐         ║
║     │ 📊 Go to Dashboard │    │ 🗺️ View Map  │         ║
║     └────────────────────┘    └──────────────┘         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

**What happens:**
- Personalized greeting with user's name
- "Go to Dashboard" → Navigate to /map
- "View Map" → Quick access to map view
- User avatar appears in navigation

---

## 📱 Mobile Navigation

### Unauthenticated:

```
┌────────────────────────────────────────┐
│ ☰  🚌 KigaliGo         [🔓 Sign In]   │
└────────────────────────────────────────┘
```

### Authenticated:

```
┌────────────────────────────────────────┐
│ ☰  🚌 KigaliGo                  [K]    │ ← Avatar
└────────────────────────────────────────┘
```

Click avatar → Opens menu:
```
┌──────────────┐
│ 👤 Profile   │
├──────────────┤
│ 🚪 Logout    │
└──────────────┘
```

---

## 🖥️ Desktop Sidebar

### Always Visible:

```
┌─────────────────┐
│  🚌 KigaliGo    │
│                 │
│  🏠 Home        │
│  🗺️ Map         │
│  🧭 Plan        │
│  📊 Reports     │
│  👤 Profile     │
│                 │
│  ─────────────  │
│  🌙 Dark Mode   │
│  🌐 Language    │
└─────────────────┘
```

---

## 🎨 Button States

### Sign In Button:

**Normal:**
```
┌──────────────┐
│  🔓 Sign In  │  ← White bg, teal text
└──────────────┘
```

**Hover:**
```
┌──────────────┐
│  🔓 Sign In  │  ← Slightly larger, shadow
└──────────────┘
     ↑ Scale 1.04x
```

### Sign Up Button:

**Normal:**
```
┌──────────────┐
│  ➕ Sign Up  │  ← Outlined white
└──────────────┘
```

**Hover:**
```
┌──────────────┐
│  ➕ Sign Up  │  ← Light white bg, shadow
└──────────────┘
     ↑ Scale 1.04x
```

---

## 🔄 User Flow Diagram

```
START
  │
  ├─→ Not Logged In?
  │     │
  │     ├─→ See "Sign In" & "Sign Up"
  │     │     │
  │     │     ├─→ Click "Sign Up"
  │     │     │     │
  │     │     │     └─→ Register → Verify Email → Sign In
  │     │     │
  │     │     └─→ Click "Sign In"
  │     │           │
  │     │           └─→ Enter Credentials → Home (Authenticated)
  │     │
  │     └─→ Logged In?
  │           │
  │           └─→ See "Welcome back, [Name]!"
  │                 │
  │                 ├─→ Click "Go to Dashboard" → /map
  │                 │
  │                 └─→ Click Avatar → Profile or Logout
  │
END
```

---

## 🎯 Click Targets

### Home Page Buttons:

```
Desktop:
┌─────────────────────────────────────────┐
│  [    Sign In    ]  [    Sign Up    ]  │
│   160px × 48px      160px × 48px        │
└─────────────────────────────────────────┘
         ↑ 16px gap ↑

Mobile:
┌─────────────────┐
│   Sign In       │  ← Full width
├─────────────────┤
│   Sign Up       │  ← Full width
└─────────────────┘
     ↑ 16px gap ↑
```

---

## 🌈 Color Palette

### Light Mode:
- **Background**: #F9FAFB (light gray)
- **Text**: #1A1A1A (near black)
- **Primary**: #0D7377 (teal)
- **Button Hover**: #0A5A5D (darker teal)

### Dark Mode:
- **Background**: #121212 (dark gray)
- **Text**: #FFFFFF (white)
- **Primary**: #0D7377 (teal)
- **Button Hover**: rgba(255,255,255,0.1)

---

## 📐 Spacing Guide

```
Hero Section:
┌─────────────────────────────────────┐
│  ↕ 64px padding top                 │
│                                     │
│  Title (4rem)                       │
│  ↕ 16px                             │
│  Subtitle (1.25rem)                 │
│  ↕ 32px                             │
│  Buttons                            │
│                                     │
│  ↕ 96px padding bottom              │
└─────────────────────────────────────┘
```

---

## 🎬 Animation Timeline

```
Page Load:
0ms   → Skeleton loaders appear
200ms → Auth check complete
300ms → Fade in buttons
400ms → Ready for interaction

Button Hover:
0ms   → Hover starts
150ms → Scale to 1.04x
150ms → Shadow appears
300ms → Animation complete

Button Click:
0ms   → Click registered
100ms → Navigate to new page
```

---

## 📱 Responsive Breakpoints

```
Mobile (< 600px):
- Buttons stack vertically
- Full width buttons
- Compact spacing

Tablet (600px - 960px):
- Buttons side-by-side
- Medium spacing
- Sidebar collapses

Desktop (> 960px):
- Buttons side-by-side
- Full spacing
- Sidebar always visible
```

---

## ✨ Interactive Elements

### Hover States:
1. **Buttons**: Scale + Shadow
2. **Navigation Items**: Background color change
3. **Avatar**: Subtle lift effect

### Focus States:
1. **Keyboard Navigation**: Blue outline
2. **Tab Order**: Logical flow
3. **Screen Reader**: Proper ARIA labels

### Loading States:
1. **Initial Load**: Skeleton loaders
2. **Auth Check**: Spinner in button area
3. **Navigation**: Progress indicator

---

## 🎊 Final Result

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              🎉 KIGALI GO 🎉                        │
│                                                      │
│     Modern • Responsive • Accessible                 │
│                                                      │
│  ✅ Prominent Auth Buttons                          │
│  ✅ Personalized Welcome                            │
│  ✅ Smooth Animations                               │
│  ✅ Mobile Optimized                                │
│  ✅ Dark Mode Support                               │
│                                                      │
│         Ready to Use! 🚀                            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

**Open http://localhost:3000 to see it in action!**
