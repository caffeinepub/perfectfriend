# PerfectFriend

## Current State
- `/explore` page shows a photo/video grid with search bar and hashtag filters
- `+` button in bottom nav shows a popup menu with 3 options: Photo Post, Video Post, New Reel
- `/reels` shows TikTok-style full-screen vertical reels feed
- App.tsx hides TopBar and adjusts padding only when `pathname === '/reels'`
- Reels data (INITIAL_REELS, Reel interface, Song interface, MUSIC_CATALOG) is all defined inside Reels.tsx

## Requested Changes (Diff)

### Add
- `CameraReelRecorder.tsx` component: full-screen camera overlay using `getUserMedia` + `MediaRecorder`
  - Live camera preview (full-screen, vertically centered)
  - Red record button (tap to start, tap again to stop)
  - Recording timer (00:00 format)
  - After recording stops: show recorded video preview + reel details form (reel name, caption, hashtags, music picker reusing MUSIC_CATALOG)
  - Submit: adds reel to a module-level global store and navigates to `/explore`
  - Close/X button to cancel and close camera
  - Handle camera permission denied with a friendly error message
- `src/frontend/src/stores/newReelStore.ts`: simple module-level singleton to pass a newly created reel from camera to the explore feed
  ```ts
  // stores newReel data between camera recorder and explore page
  export let pendingNewReel: any = null;
  export function setPendingNewReel(r: any) { pendingNewReel = r; }
  export function clearPendingNewReel() { pendingNewReel = null; }
  ```

### Modify
- `Explore.tsx`: Replace entire page with a TikTok-style full-screen reels feed
  - Same structure as Reels.tsx: full-screen video, progress bars, tab switcher ("Trending" / "For You" instead of Following/For You), right-side action rail (like, comment, share, music), creator info overlay
  - On mount: check `pendingNewReel` from store; if present, prepend it to local reels state and call `clearPendingNewReel()`
  - Import MUSIC_CATALOG and Song from Reels.tsx exports OR duplicate locally — keep it simple
  - Has its own upload FAB (+ button) that opens the upload dialog (same as Reels.tsx upload dialog) — OR remove upload FAB since camera is now the way to create
  - Use explore-specific initial reels data (can use the same INITIAL_REELS from Reels.tsx by importing from a shared location)
- `App.tsx`: Change `isReels` check from `pathname === '/reels'` to `pathname === '/reels' || pathname === '/explore'` so Explore also gets full-screen treatment (no TopBar, no padding)
- `BottomNav.tsx`:
  - Remove `showUploadMenu` state, `menuRef`, upload popup menu JSX entirely
  - `+` button onClick now calls a prop `onCameraOpen` or uses a shared state passed from parent to open `CameraReelRecorder`
  - Since BottomNav doesn't have a parent that can pass props easily, instead: manage `cameraOpen` state in `BottomNav.tsx` itself and render `<CameraReelRecorder>` directly from BottomNav when open
- `Reels.tsx`: Keep as-is, no changes needed

### Remove
- `Explore.tsx`: Remove photo grid, search input, hashtag filter, TRENDING_HASHTAGS usage, EXPLORE_POSTS usage
- `BottomNav.tsx`: Remove upload popup menu (showUploadMenu state, menuRef, btnRef click-outside handler, entire popup div JSX)

## Implementation Plan
1. Create `src/frontend/src/stores/newReelStore.ts`
2. Create `src/frontend/src/components/CameraReelRecorder.tsx` — camera modal with recording + upload form, posts to /explore via router navigate
3. Replace `src/frontend/src/pages/Explore.tsx` with full-screen reels feed (copy structure from Reels.tsx, change tab labels to "Trending"/"For You", check pendingNewReel on mount)
4. Update `src/frontend/src/App.tsx` — extend isReels condition to include /explore
5. Update `src/frontend/src/components/BottomNav.tsx` — remove popup menu, + button opens CameraReelRecorder inline
6. Validate (lint + typecheck + build)
