# 🎧 Spotify Audio Patch Bay

A full-featured **Spotify client** built with **React 19, TypeScript, Tailwind CSS 4, Zustand, and the Spotify Web API**.

The project is designed as an **audio patch bay** — playback, music discovery, and library management are routed through a single interactive console.

> 🎛️ **One console. One library. One playback surface.**

---

## ✨ Features

### 🎵 Playback

- ▶️ Play / pause tracks
- ⏮️ Previous / next track controls
- 🎚️ Seek through the current track
- 🔊 Volume control
- 📱 Spotify Connect device selection
- ⏱️ Real-time playback progress
- 🎧 Currently playing track information
- 🔄 Playback state synchronization

### 🔎 Discovery

- 🔍 Search for tracks, albums, artists, and playlists
- 🎵 Browse Spotify content
- 🧭 Discover new music
- 📚 Horizontal media rails
- 🎼 Track previews and metadata
- 📱 Responsive discovery interface

### 📚 Library Management

- ❤️ View saved tracks
- 🎵 Browse user playlists
- 💿 Access saved albums
- 📂 Manage and navigate personal music collections
- ❤️ Dedicated **Liked Songs** experience

### 🎛️ Audio Visualization

- 📊 Custom VU meter
- 🌊 Waveform visualization
- 🎚️ Real-time playback-oriented UI
- 🎧 Audio-console inspired interface

### 🔐 Authentication

- 🔑 Spotify OAuth 2.0 authentication
- 🔐 **PKCE authorization flow**
- 💾 Secure token handling
- 🛡️ Protected application routes
- 🔄 Authentication state management
- ↩️ OAuth callback handling

### 🖥️ Application UI

- 📐 Responsive application shell
- 📑 Persistent sidebar navigation
- 🧭 Top navigation bar
- 🌑 Spotify-inspired dark interface
- 🧩 Reusable component system
- ⏳ Loading states
- ⚠️ Error boundaries
- 🐛 Development debug panel

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| ⚛️ **React 19** | UI framework |
| 🔷 **TypeScript** | Type-safe development |
| 🎨 **Tailwind CSS 4** | Styling and responsive UI |
| 🗃️ **Zustand** | Global state management |
| 🎵 **Spotify Web API** | Music, library, playlist & playback data |
| 🔐 **Spotify OAuth 2.0 + PKCE** | Authentication |
| ⚡ **Vite** | Development & build tooling |
| 🧹 **ESLint** | Code quality |

---

## 🏗️ Project Structure

```text
src/
├── auth/
│   ├── pkce.ts
│   ├── config.ts
│   ├── tokenStore.ts
│   └── authFlow.ts
│
├── api/
│   ├── client.ts
│   ├── playback.ts
│   ├── discovery.ts
│   ├── library.ts
│   └── playlists.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── usePlayback.ts
│   ├── useDiscovery.ts
│   ├── useLibrary.ts
│   └── usePlaylists.ts
│
├── store/
│   ├── authStore.ts
│   └── playerStore.ts
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── DebugPanel.tsx
│   │
│   ├── player/
│   │   ├── NowPlayingBar.tsx
│   │   ├── ProgressScrubber.tsx
│   │   ├── VolumeFader.tsx
│   │   └── DevicePicker.tsx
│   │
│   ├── discovery/
│   │   ├── MediaCard.tsx
│   │   ├── MediaRail.tsx
│   │   └── TrackRow.tsx
│   │
│   ├── visualizer/
│   │   ├── VuMeter.tsx
│   │   └── Waveform.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Loading.tsx
│       └── ErrorBoundary.tsx
│
├── pages/
│   ├── Login.tsx
│   ├── Callback.tsx
│   ├── Home.tsx
│   ├── Search.tsx
│   ├── Discover.tsx
│   ├── Library.tsx
│   ├── LikedSongs.tsx
│   └── Playlist.tsx
│
├── routes/
│   └── ProtectedRoute.tsx
│
└── types/
    └── spotify.ts
```

---

## 🧩 Architecture

The application follows a layered architecture with clear separation of concerns.

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │       Pages         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Custom Hooks     │
                    │                     │
                    │ Auth / Player / API │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
       ┌─────────────────┐          ┌─────────────────┐
       │  Zustand Store  │          │    API Layer    │
       │                 │          │                 │
       │ Auth / Player   │          │ Playback        │
       └─────────────────┘          │ Discovery       │
                                    │ Library         │
                                    │ Playlists       │
                                    └────────┬────────┘
                                             │
                                             ▼
                                  ┌────────────────────┐
                                  │   Spotify Web API  │
                                  └────────────────────┘
```

---

## 🔐 Authentication Architecture

Authentication is implemented using Spotify's **OAuth 2.0 Authorization Code with PKCE** flow.

```text
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       ▼
┌─────────────────────┐
│       Login         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Generate PKCE       │
│ Verifier + Challenge│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Spotify Authorization│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Callback       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Exchange Code       │
│ for Access Token    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Token Store      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Authenticated App   │
└─────────────────────┘
```

### Authentication Files

```text
auth/
├── pkce.ts         → PKCE verifier/challenge generation
├── config.ts       → Spotify configuration
├── tokenStore.ts   → Token persistence and retrieval
└── authFlow.ts     → OAuth authorization & callback flow
```

---

## 🎛️ State Management

Global state is managed using **Zustand**.

### Authentication Store

```text
authStore
    │
    ├── User session
    ├── Access token
    ├── Authentication status
    └── Logout
```

### Player Store

```text
playerStore
    │
    ├── Current track
    ├── Playback status
    ├── Playback progress
    ├── Volume
    ├── Active device
    └── Playback controls
```

Keeping authentication and playback state separate makes the application easier to maintain and extend.

---

## 🌐 Spotify API Layer

Spotify API functionality is separated by responsibility.

```text
api/
├── client.ts       → Base API client
├── playback.ts     → Playback controls & state
├── discovery.ts    → Search & discovery
├── library.ts      → Saved content
└── playlists.ts    → Playlist operations
```

This prevents API logic from being tightly coupled to React components.

### API Flow

```text
React Component
       │
       ▼
 Custom Hook
       │
       ▼
 API Module
       │
       ▼
 API Client
       │
       ▼
 Spotify Web API
```

---

## 🪝 Custom Hooks

Application functionality is exposed to the UI through custom React hooks.

| Hook | Responsibility |
|---|---|
| `useAuth` | Authentication state and actions |
| `usePlayback` | Playback state and controls |
| `useDiscovery` | Search and discovery |
| `useLibrary` | Saved music and library |
| `usePlaylists` | Playlist data and operations |

This keeps page components focused on rendering and user interaction.

---

## 📱 Application Pages

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Spotify authentication |
| `/callback` | Callback | OAuth callback handler |
| `/` | Home | Main dashboard |
| `/search` | Search | Search Spotify content |
| `/discover` | Discover | Music discovery |
| `/library` | Library | User music library |
| `/liked-songs` | Liked Songs | Saved tracks |
| `/playlist/:id` | Playlist | Playlist details |

---

## 🎨 Component Architecture

The UI is organized into reusable component groups.

### Layout

```text
AppShell
├── Sidebar
├── TopBar
├── Main Content
└── NowPlayingBar
```

### Player

```text
NowPlayingBar
├── Track Information
├── Playback Controls
├── ProgressScrubber
├── VolumeFader
└── DevicePicker
```

### Discovery

```text
MediaRail
├── MediaCard
├── MediaCard
├── MediaCard
└── ...
```

### Visualizer

```text
Visualizer
├── VuMeter
└── Waveform
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- A Spotify account
- A Spotify Developer application

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

cd YOUR_REPOSITORY
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Create a Spotify Developer Application

Create an application through the Spotify Developer Dashboard.

You will need the application's:

```text
Client ID
```

Configure your redirect URI to match the one used by the application.

For local development:

```text
http://127.0.0.1:5173/callback
```

---

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
```

> ⚠️ **Important:** Never commit your `.env` file or expose private credentials in your repository.

Add it to `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
```

---

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://127.0.0.1:5173
```

---

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build the application
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

---

## 🔄 Application Flow

A typical user session looks like this:

```text
┌──────────────┐
│    Login     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Spotify OAuth    │
│      + PKCE      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Authenticated    │
│      Home        │
└────────┬─────────┘
         │
    ┌────┼───────────────┐
    │    │               │
    ▼    ▼               ▼
 Search Discover       Library
    │    │               │
    └────┼───────────────┘
         │
         ▼
    Select Track
         │
         ▼
┌──────────────────┐
│   Player Store   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Spotify Playback │
└──────────────────┘
```

---

## 🎧 Playback Architecture

Playback functionality is separated from the UI layer.

```text
                    Spotify
                       │
                       ▼
              ┌────────────────┐
              │ playback.ts    │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │ usePlayback()  │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │ playerStore    │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │ Player UI      │
              ├────────────────┤
              │ Now Playing    │
              │ Progress       │
              │ Volume         │
              │ Device Picker  │
              └────────────────┘
```

---

## 🎯 Engineering Concepts Demonstrated

This project demonstrates practical experience with:

- ⚛️ React 19
- 🔷 TypeScript
- 🧩 Component-driven architecture
- 🪝 Custom React hooks
- 🗃️ Zustand state management
- 🌐 REST API integration
- 🔐 OAuth 2.0
- 🔑 PKCE authentication
- 🛡️ Protected routes
- 🧱 API abstraction layers
- 📐 Type-safe API models
- 📱 Responsive UI development
- 🎨 Tailwind CSS
- ⚠️ Error boundaries
- ⏳ Loading states
- 🧩 Reusable UI components
- 🏗️ Separation of concerns
- 📦 Modular frontend architecture

---

## 🧠 Design Philosophy

Rather than treating this project as a simple Spotify clone, the application is designed around the concept of an **audio patch bay**.

Every major capability acts as a signal path:

```text
                 ┌──────────────┐
                 │   Spotify    │
                 │     API      │
                 └──────┬───────┘
                        │
             ┌──────────┼──────────┐
             │          │          │
             ▼          ▼          ▼
        Discovery    Library    Playback
             │          │          │
             └──────────┼──────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │    Hooks     │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │    Stores    │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │   Console    │
                 │      UI      │
                 └──────────────┘
```

The goal is to combine:

> **A visually expressive interface with a clean, scalable frontend architecture.**

---

## 📸 Screenshots

Add your screenshots to:

```text
docs/
└── screenshots/
    ├── home.png
    ├── discover.png
    ├── search.png
    ├── library.png
    ├── playlist.png
    └── player.png
```

### 🏠 Home

---

## 🗺️ Roadmap

### Authentication

- [x] Spotify OAuth authentication
- [x] PKCE authentication flow
- [x] Protected routes
- [x] Token management

### Playback

- [x] Play / pause
- [x] Previous / next
- [x] Track progress
- [x] Volume controls
- [x] Device selection
- [x] Now playing information

### Discovery

- [x] Search
- [x] Music discovery
- [x] Media cards
- [x] Track rows
- [x] Media rails

### Library

- [x] Library page
- [x] Liked Songs
- [x] Playlist browsing
- [x] Saved content

### UI

- [x] Responsive layout
- [x] Sidebar navigation
- [x] Top bar
- [x] Player bar
- [x] Loading states
- [x] Error boundary
- [x] Debug panel
- [x] VU meter
- [x] Waveform

### Future Improvements

- [ ] Advanced queue management
- [ ] Enhanced recommendations
- [ ] More advanced audio visualizations
- [ ] PWA support
- [ ] Production deployment
- [ ] Improved offline experience
- [ ] More granular playback controls

---

## 🧪 Development & Debugging

The project includes a dedicated `DebugPanel` for development.

It can be used to inspect:

- Authentication state
- Spotify API responses
- Playback state
- Active device information
- Session information
- API errors

This makes debugging OAuth and playback-related issues significantly easier during development.

---

## ⚠️ Spotify API Considerations

This project relies on Spotify's Web API and its current capabilities and restrictions.

Some playback functionality may require:

- An eligible Spotify account
- An active Spotify playback device
- Appropriate Spotify API scopes
- Spotify-supported playback capabilities

Spotify API behavior and available features may change over time.

Always refer to the latest Spotify Developer documentation when configuring or extending the application.

---

## 🔒 Security

The application follows a browser-based OAuth flow using **PKCE**.

### Environment Variables

Never commit:

```text
.env
.env.local
.env.*.local
```

### Example

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
```

Only public configuration required by the frontend should be exposed through Vite environment variables.

---

## 📈 Future Architecture

The project is structured so additional functionality can be introduced without heavily modifying existing layers.

For example:

```text
New Feature
     │
     ├── API module
     │
     ├── Custom hook
     │
     ├── Zustand state (if required)
     │
     ├── Reusable components
     │
     └── Page integration
```

This makes the application easier to scale as additional Spotify functionality is introduced.

---

## 📄 License

This project is intended for **educational and portfolio purposes**.

Spotify is a trademark of Spotify AB.

This project is **not affiliated with, endorsed by, or sponsored by Spotify**.

---

## 👨‍💻 Author

### Your Name

**Frontend Developer | React | TypeScript**

Built with:

```text
React
  +
TypeScript
  +
Tailwind CSS
  +
Zustand
  +
Spotify Web API
        ↓
🎧 AUDIO PATCH BAY
```

---

## ⭐ Show Your Support

If you found this project useful or interesting, consider giving the repository a ⭐.

```text
⭐ Star the repository
🍴 Fork the project
🐛 Report issues
💡 Suggest improvements
```

---

<p align="center">
  Built with ❤️ using React, TypeScript & the Spotify Web API
</p>
