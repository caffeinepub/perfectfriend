import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  Heart,
  MessageCircle,
  Music,
  Music2,
  Plus,
  Share2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CURRENT_USER, MOCK_USERS } from "../data/mockData";

type ReelUser = (typeof MOCK_USERS)[0] | typeof CURRENT_USER;

interface Reel {
  id: string;
  user: ReelUser;
  videoUrl: string;
  reelName: string;
  caption: string;
  hashtags: string[];
  taggedUsers: string[];
  songName: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

const MUSIC_CATALOG: Song[] = [
  { id: "s1", title: "Kesariya", artist: "Arijit Singh", duration: "4:28" },
  { id: "s2", title: "Thumkeshwari", artist: "Bappi Lahiri", duration: "3:15" },
  {
    id: "s3",
    title: "Raataan Lambiyan",
    artist: "Jubin Nautiyal",
    duration: "4:10",
  },
  { id: "s4", title: "Pasoori", artist: "Ali Sethi", duration: "4:35" },
  { id: "s5", title: "Apna Bana Le", artist: "Arijit Singh", duration: "4:05" },
  { id: "s6", title: "Ik Vaari Aa", artist: "Arijit Singh", duration: "4:45" },
  { id: "s7", title: "Bekhayali", artist: "Sachet Tandon", duration: "5:50" },
  { id: "s8", title: "Tere Bina", artist: "Guru Randhawa", duration: "3:30" },
  { id: "s9", title: "Lut Gaye", artist: "Jubin Nautiyal", duration: "4:00" },
  { id: "s10", title: "Kalaastar", artist: "Honey Singh", duration: "3:45" },
  { id: "s11", title: "Saware", artist: "Arijit Singh", duration: "4:20" },
  {
    id: "s12",
    title: "Dil Diyan Gallan",
    artist: "Atif Aslam",
    duration: "4:15",
  },
];

const INITIAL_REELS: Reel[] = [
  {
    id: "r1",
    user: MOCK_USERS[0],
    videoUrl: "/assets/video_1-019d3fcb-2382-712d-b6ee-bcfe77659a39.mp4",
    reelName: "Sunset Magic ☀️",
    caption:
      "Caught this incredible sunset moment ☀️ Pure magic in every frame!",
    hashtags: ["#Sunset", "#Vibes", "#Reel"],
    taggedUsers: ["@neha_kapoor"],
    songName: "Kesariya - Arijit Singh",
    likes: 4521,
    comments: 234,
    isLiked: false,
  },
  {
    id: "r2",
    user: MOCK_USERS[1],
    videoUrl: "/assets/video_1-019d3fcb-2382-712d-b6ee-bcfe77659a39.mp4",
    reelName: "Dance Life 💃",
    caption: "Dancing through life 💃 Every beat is a new adventure!",
    hashtags: ["#Dance", "#Life", "#Happy"],
    taggedUsers: [],
    songName: "Thumkeshwari - Bappi Lahiri",
    likes: 8931,
    comments: 512,
    isLiked: true,
  },
  {
    id: "r3",
    user: MOCK_USERS[2],
    videoUrl: "/assets/video_1-019d3fcb-2382-712d-b6ee-bcfe77659a39.mp4",
    reelName: "Morning Chai ☕",
    caption: "Morning reads at my favourite chai spot ☕📚",
    hashtags: ["#BookLover", "#MorningVibes", "#Chai"],
    taggedUsers: ["@priya_sharma"],
    songName: "Tu Jaane Na - Atif Aslam",
    likes: 2103,
    comments: 98,
    isLiked: false,
  },
];

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function Reels() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"following" | "foryou">("foryou");
  const [uploadOpen, setUploadOpen] = useState(false);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadReelName, setUploadReelName] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadHashtags, setUploadHashtags] = useState("");
  const [uploadTagged, setUploadTagged] = useState("");
  const [uploadSelectedMusic, setUploadSelectedMusic] = useState<Song | null>(
    null,
  );

  const [musicPickerOpen, setMusicPickerOpen] = useState(false);
  const [musicSearch, setMusicSearch] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reelsLengthRef = useRef(reels.length);
  reelsLengthRef.current = reels.length;

  const current = reels[currentIndex];

  const filteredSongs = MUSIC_CATALOG.filter(
    (s) =>
      s.title.toLowerCase().includes(musicSearch.toLowerCase()) ||
      s.artist.toLowerCase().includes(musicSearch.toLowerCase()),
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on index change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setProgress(0);
    video.currentTime = 0;
    video.play().catch(() => {});

    const onTimeUpdate = () => {
      if (video.duration)
        setProgress((video.currentTime / video.duration) * 100);
    };
    const onEnded = () => {
      setCurrentIndex((i) => Math.min(i + 1, reelsLengthRef.current - 1));
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, [currentIndex]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, reelsLengthRef.current - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goNext();
      else if (e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let lastWheelTime = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime < 600) return;
      lastWheelTime = now;
      if (e.deltaY > 0) goNext();
      else goPrev();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReels((rs) =>
      rs.map((r, i) =>
        i === currentIndex
          ? {
              ...r,
              likes: r.isLiked ? r.likes - 1 : r.likes + 1,
              isLiked: !r.isLiked,
            }
          : r,
      ),
    );
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error("Pehle video select karo!");
      return;
    }
    const videoUrl = URL.createObjectURL(uploadFile);
    const tags = uploadTagged
      .split(/\s+/)
      .filter((t) => t.trim())
      .map((t) => (t.startsWith("@") ? t : `@${t}`));
    const hashes = uploadHashtags
      .split(/\s+/)
      .filter((h) => h.trim())
      .map((h) => (h.startsWith("#") ? h : `#${h}`));

    const songLabel = uploadSelectedMusic
      ? `${uploadSelectedMusic.title} - ${uploadSelectedMusic.artist}`
      : "Original Audio";

    const newReel: Reel = {
      id: `r${Date.now()}`,
      user: CURRENT_USER,
      videoUrl,
      reelName: uploadReelName || "My Reel",
      caption: uploadCaption,
      hashtags: hashes,
      taggedUsers: tags,
      songName: songLabel,
      likes: 0,
      comments: 0,
      isLiked: false,
    };

    setReels((prev) => [newReel, ...prev]);
    setCurrentIndex(0);
    setUploadOpen(false);
    setUploadFile(null);
    setUploadReelName("");
    setUploadCaption("");
    setUploadHashtags("");
    setUploadTagged("");
    setUploadSelectedMusic(null);
    toast.success("Reel upload ho gayi! 🎬");
  };

  return (
    <>
      {/* Full-screen reels container */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
      >
        {/* Phone-shaped column: full height, max 430px wide */}
        <div className="relative w-full h-full max-w-[430px]">
          {/* Progress bars */}
          <div className="absolute top-2 left-3 right-3 z-30 flex gap-1">
            {reels.map((reel, i) => (
              <div
                key={reel.id}
                className="flex-1 h-0.5 rounded-full bg-white/25 overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-none"
                  style={{
                    width:
                      i < currentIndex
                        ? "100%"
                        : i === currentIndex
                          ? `${progress}%`
                          : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Tab switcher */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-8">
            <button
              type="button"
              className={`text-sm font-semibold pb-0.5 transition-all ${
                activeTab === "following"
                  ? "text-white border-b-2 border-white"
                  : "text-white/55"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("following");
              }}
              data-ocid="reels.following.tab"
            >
              Following
            </button>
            <button
              type="button"
              className={`text-sm font-semibold pb-0.5 transition-all ${
                activeTab === "foryou"
                  ? "text-white border-b-2 border-white"
                  : "text-white/55"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("foryou");
              }}
              data-ocid="reels.foryou.tab"
            >
              For You
            </button>
          </div>

          {/* Mute */}
          <button
            type="button"
            className="absolute top-5 right-3 z-30 w-9 h-9 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/65 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setMuted((m) => !m);
            }}
            data-ocid="reels.mute.toggle"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Upload FAB */}
          <button
            type="button"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-2xl"
            style={{ background: "oklch(var(--primary))" }}
            onClick={(e) => {
              e.stopPropagation();
              setUploadOpen(true);
            }}
            data-ocid="reels.upload.open_modal_button"
          >
            <Plus size={24} />
          </button>

          {/* Animated video area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              {/* Navigation tap zones (exclude right 64px where action rail lives) */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Previous reel"
                className="absolute top-0 left-0 z-10 cursor-pointer outline-none"
                style={{ width: "calc(100% - 64px)", height: "50%" }}
                onClick={goPrev}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") goPrev();
                }}
              />
              <div
                role="button"
                tabIndex={0}
                aria-label="Next reel"
                className="absolute left-0 z-10 cursor-pointer outline-none"
                style={{
                  top: "50%",
                  width: "calc(100% - 64px)",
                  height: "50%",
                }}
                onClick={goNext}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") goNext();
                }}
              />

              {/* Video */}
              <video
                ref={videoRef}
                src={current.videoUrl}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                playsInline
                muted={muted}
                data-ocid="reels.video.canvas_target"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/5 to-black/45" />

              {/* Bottom-left creator info */}
              <div className="absolute bottom-[88px] left-4 right-16 z-20 pointer-events-none">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-8 h-8 border-2 border-white flex-shrink-0">
                    <AvatarImage src={current.user.avatar} />
                    <AvatarFallback>
                      {current.user.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white text-sm font-bold drop-shadow-md">
                    @{current.user.username}
                  </span>
                  <button
                    type="button"
                    className="text-[11px] border border-white/80 text-white rounded-full px-2.5 py-0.5 pointer-events-auto hover:bg-white/20 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success(
                        `Following ${current.user.displayName}! 🎉`,
                      );
                    }}
                  >
                    Follow
                  </button>
                </div>
                <p className="text-white text-sm font-semibold mb-1 drop-shadow-md">
                  {current.reelName}
                </p>
                <p className="text-white/90 text-sm leading-snug line-clamp-2 drop-shadow">
                  {current.caption}
                </p>
                {current.hashtags.length > 0 && (
                  <p className="text-white/70 text-xs mt-1">
                    {current.hashtags.join(" ")}
                  </p>
                )}
                {current.taggedUsers.length > 0 && (
                  <p className="text-white/60 text-xs">
                    {current.taggedUsers.join(" ")}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-2">
                  <Music size={12} className="text-white flex-shrink-0" />
                  <p className="text-white text-xs truncate">
                    {current.songName}
                  </p>
                </div>
              </div>

              {/* Right action rail */}
              <div className="absolute right-3 bottom-[88px] z-20 flex flex-col items-center gap-5">
                {/* Creator avatar + follow */}
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-white">
                    <AvatarImage src={current.user.avatar} />
                    <AvatarFallback>
                      {current.user.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success(
                        `Following ${current.user.displayName}! 🎉`,
                      );
                    }}
                  >
                    <Plus size={12} className="text-black" />
                  </button>
                </div>

                {/* Like */}
                <button
                  type="button"
                  className="flex flex-col items-center gap-1"
                  onClick={handleLike}
                  data-ocid="reels.like.button"
                >
                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Heart
                      size={24}
                      className={
                        current.isLiked
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }
                    />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    {formatCount(current.likes)}
                  </span>
                </button>

                {/* Comment */}
                <button
                  type="button"
                  className="flex flex-col items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success("Comments khul rahe hain! 💬");
                  }}
                  data-ocid="reels.comment.button"
                >
                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <MessageCircle size={24} className="text-white" />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    {formatCount(current.comments)}
                  </span>
                </button>

                {/* Share */}
                <button
                  type="button"
                  className="flex flex-col items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success("Link copy ho gaya! 🔗");
                  }}
                  data-ocid="reels.share.button"
                >
                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Share2 size={24} className="text-white" />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    Share
                  </span>
                </button>

                {/* Music button in action rail */}
                <button
                  type="button"
                  className="flex flex-col items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast(`🎵 ${current.songName}`);
                  }}
                  data-ocid="reels.music.button"
                >
                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Music2 size={22} className="text-white" />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    Music
                  </span>
                </button>

                {/* Spinning vinyl disc */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="w-11 h-11 rounded-full border-[3px] border-white/25 flex items-center justify-center overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(circle at center, #666 15%, #333 45%, #111 100%)",
                  }}
                >
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Music size={8} className="text-white" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent
          className="max-w-sm max-h-[90vh] overflow-y-auto"
          data-ocid="reels.upload.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Reel Upload Karo 🎬
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpload} className="space-y-4 mt-2">
            <div>
              <Label>Video Select Karo *</Label>
              <div className="mt-1 border-2 border-dashed border-border rounded-xl p-5 text-center hover:border-primary/50 transition-colors">
                <label
                  htmlFor="reel-video-file"
                  className="cursor-pointer block"
                >
                  {uploadFile ? (
                    <div>
                      <p className="text-sm font-medium text-green-400">
                        ✓ Video selected
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-[220px] mx-auto">
                        {uploadFile.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Plus
                        size={24}
                        className="mx-auto text-muted-foreground mb-2"
                      />
                      <p className="text-sm text-muted-foreground">
                        Video select karo
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">
                        MP4, MOV, WEBM…
                      </p>
                    </div>
                  )}
                </label>
                <input
                  id="reel-video-file"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  data-ocid="reels.upload.dropzone"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reel-name-field">Reel ka naam</Label>
              <Input
                id="reel-name-field"
                value={uploadReelName}
                onChange={(e) => setUploadReelName(e.target.value)}
                placeholder="e.g. Sunset Magic ✨"
                className="mt-1"
                data-ocid="reels.upload.input"
              />
            </div>

            <div>
              <Label htmlFor="reel-caption-field">Caption likho...</Label>
              <Textarea
                id="reel-caption-field"
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="Apni reel ke baare mein kuch likho..."
                className="mt-1 resize-none"
                rows={3}
                data-ocid="reels.upload.textarea"
              />
            </div>

            <div>
              <Label htmlFor="reel-hashtags-field">Hashtags</Label>
              <Input
                id="reel-hashtags-field"
                value={uploadHashtags}
                onChange={(e) => setUploadHashtags(e.target.value)}
                placeholder="#dance #fun #viral"
                className="mt-1"
                data-ocid="reels.upload.hashtags.input"
              />
            </div>

            <div>
              <Label htmlFor="reel-tag-field">
                Profile Tag karo (@username)
              </Label>
              <Input
                id="reel-tag-field"
                value={uploadTagged}
                onChange={(e) => setUploadTagged(e.target.value)}
                placeholder="@username1 @username2"
                className="mt-1"
                data-ocid="reels.upload.tag.input"
              />
            </div>

            {/* Music selector */}
            <div>
              <Label>Music Add Karo 🎵</Label>
              <button
                type="button"
                onClick={() => setMusicPickerOpen(true)}
                className={`mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                  uploadSelectedMusic
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
                data-ocid="reels.upload.music_button"
              >
                <Music size={16} className="flex-shrink-0" />
                <span className="flex-1 text-left truncate">
                  {uploadSelectedMusic
                    ? `${uploadSelectedMusic.title} — ${uploadSelectedMusic.artist}`
                    : "Music add karo 🎵"}
                </span>
                {uploadSelectedMusic ? (
                  <Check size={15} className="flex-shrink-0 text-primary" />
                ) : (
                  <Plus size={15} className="flex-shrink-0" />
                )}
              </button>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setUploadOpen(false)}
                data-ocid="reels.upload.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                style={{ background: "oklch(var(--primary))" }}
                data-ocid="reels.upload.submit_button"
              >
                Upload Karo 🚀
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Music Picker Dialog */}
      <Dialog open={musicPickerOpen} onOpenChange={setMusicPickerOpen}>
        <DialogContent
          className="max-w-sm"
          data-ocid="reels.upload.music_picker"
        >
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Music Select Karo 🎵
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 space-y-3">
            {/* Search */}
            <div className="relative">
              <Music
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={musicSearch}
                onChange={(e) => setMusicSearch(e.target.value)}
                placeholder="Song ya artist search karo..."
                className="pl-9"
                data-ocid="reels.upload.music_search"
              />
            </div>

            {/* Remove music option */}
            {uploadSelectedMusic && (
              <button
                type="button"
                onClick={() => {
                  setUploadSelectedMusic(null);
                  setMusicPickerOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-destructive/40 bg-destructive/5 text-destructive text-sm hover:bg-destructive/10 transition-colors"
              >
                <X size={15} className="flex-shrink-0" />
                <span>Music hatao</span>
              </button>
            )}

            {/* Songs list */}
            <div className="max-h-[50vh] overflow-y-auto -mx-1 px-1 space-y-1">
              {filteredSongs.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">
                  Koi song nahi mila 😔
                </p>
              ) : (
                filteredSongs.map((song) => {
                  const isSelected = uploadSelectedMusic?.id === song.id;
                  return (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => {
                        setUploadSelectedMusic(song);
                        setMusicPickerOpen(false);
                        setMusicSearch("");
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                        isSelected
                          ? "bg-primary/15 border border-primary/40"
                          : "hover:bg-muted/60 border border-transparent"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-primary/20" : "bg-muted"
                        }`}
                      >
                        <Music2
                          size={14}
                          className={
                            isSelected
                              ? "text-primary"
                              : "text-muted-foreground"
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold truncate ${
                            isSelected ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {song.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {song.artist}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {song.duration}
                        </span>
                        {isSelected && (
                          <Check size={15} className="text-primary" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
