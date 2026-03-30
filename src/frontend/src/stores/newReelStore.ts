// Simple module-level store to pass a newly recorded reel to the explore feed
export interface NewReelData {
  id: string;
  videoUrl: string;
  reelName: string;
  caption: string;
  hashtags: string[];
  taggedUsers: string[];
  songName: string;
}

export let pendingNewReel: NewReelData | null = null;
export function setPendingNewReel(r: NewReelData) {
  pendingNewReel = r;
}
export function clearPendingNewReel() {
  pendingNewReel = null;
}
