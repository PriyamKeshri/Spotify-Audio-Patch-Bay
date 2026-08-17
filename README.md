# Signal/Chain — Spotify Web API Client

A full-featured Spotify client built with React 19, TypeScript, Tailwind CSS 4, and the Spotify Web API. Framed as an audio patch bay: playback, discovery, and library management routed through one console.

## Features

- **Auth** — OAuth 2.0 Authorization Code with PKCE (no client secret, no backend required), automatic token refresh, cross-tab session sync
- **Playback control** — play/pause/skip/seek, volume, shuffle, repeat (off/context/track), queueing, device transfer, all via Spotify Connect
- **Discovery** — debounced multi-type search, featured playlists, new releases, genre-seeded recommendations
- **Library** — saved tracks, saved albums, followed artists, playlist browsing and playback
- **Live state** — playback polled every 3s with a smooth client-side progress ticker between polls
- **Signal Monitor** — an in-app debug panel showing live auth status, poll state, and a request log (toggle via the header icon)

## Requirements

- Node 18+
- A Spotify account. **Playback control (play/pause/seek/volume/etc.) requires Spotify Premium** — this is a Spotify Web API restriction, not something this app can work around. Free accounts can still authenticate, search, browse, and manage their library.
- A Spotify Developer app (free, instant setup — see below)

## Setup

### 1. Create a Spotify app

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and log in.
2. Click **Create app**.
3. Fill in a name/description (anything works).
4. Under **Redirect URIs**, add exactly:
   ```
   http://127.0.0.1:5173/callback
   ```
   This must match `VITE_SPOTIFY_REDIRECT_URI` exactly, including the port and trailing slash behavior. Spotify no longer allows plain `localhost` — use `127.0.0.1`.
5. Check the **Web API** checkbox under "Which API/SDKs are you planning to use?"
6. Save, then copy the **Client ID** from the app's settings page. You do not need the Client Secret — this app never uses it.

### 2. Configure the app

```bash
cp .env.example .env
```

Edit `.env` and paste your client ID:

```
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open the URL Vite prints (should be `http://127.0.0.1:5173`) and click **Connect with Spotify**.

## Scopes requested

The app requests only the scopes it uses, grouped by feature: playback state/control, recently played, library read/modify, playlist read/modify (public and private), follow read/modify, top items, and basic profile info. See `src/auth/config.ts` for the exact list — Spotify shows every one of these to the user on the consent screen, so it's kept minimal.

## Architecture

```
src/
├── auth/           PKCE flow, token storage, config
├── api/            Typed axios wrappers per feature area (playback, discovery, library, playlists)
├── hooks/          React Query hooks that call the api/ layer and sync Zustand stores
├── store/          Zustand: auth state, player/UI state
├── components/
│   ├── layout/     Shell, sidebar, top bar, debug panel
│   ├── player/     Now-playing bar, transport controls, volume, device picker
│   ├── discovery/  Media cards/rails, track rows
│   ├── visualizer/ VU meter, seeded waveform (decorative — see note below)
│   └── ui/         Buttons, loading states, error boundary
├── pages/          Route-level screens
└── types/          Spotify API response types
```

**Why polling instead of the Web Playback SDK:** this app controls playback on *any* Spotify Connect device (phone, speaker, desktop app, another browser tab) via the REST API, rather than turning the browser itself into a playback device. That's a deliberate trade-off — it means no in-browser audio and no `Web Audio API` access, so the waveform/VU meter visuals are stylized and deterministic (seeded from track ID) rather than real-time frequency analysis. Swapping in the Web Playback SDK for in-browser playback would be a natural extension if that's the priority instead of controlling existing devices.

**Token refresh:** the axios response interceptor catches `401`s, refreshes once (de-duped across concurrent requests), retries the original request, and only forces re-login if the refresh itself fails.

## Known limitations

- Spotify's `/recommendations` and several endpoints are subject to rate limits; the client surfaces `429` responses with a `Retry-After` value rather than silently retrying.
- No offline/PWA support.

## License

MIT — see [LICENSE](LICENSE).
