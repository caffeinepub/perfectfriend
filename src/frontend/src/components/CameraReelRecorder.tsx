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
import { useNavigate } from "@tanstack/react-router";
import { Camera, Check, Music, Music2, Plus, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CURRENT_USER } from "../data/mockData";
import { setPendingNewReel } from "../stores/newReelStore";

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

type Phase = "live" | "preview" | "denied";

interface Props {
  onClose: () => void;
}

export default function CameraReelRecorder({ onClose }: Props) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("live");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  // Form state
  const [reelName, setReelName] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedMusic, setSelectedMusic] = useState<Song | null>(null);
  const [musicPickerOpen, setMusicPickerOpen] = useState(false);
  const [musicSearch, setMusicSearch] = useState("");

  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const postedRef = useRef(false);

  const stopStream = useCallback(() => {
    for (const t of streamRef.current?.getTracks() ?? []) {
      t.stop();
    }
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        setPhase("denied");
      });
  }, []);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopStream();
    };
  }, [startCamera, stopStream]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    chunksRef.current = [];

    let mimeType = "";
    if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
      mimeType = "video/webm;codecs=vp9";
    } else if (MediaRecorder.isTypeSupported("video/webm")) {
      mimeType = "video/webm";
    }

    const mr = mimeType
      ? new MediaRecorder(streamRef.current, { mimeType })
      : new MediaRecorder(streamRef.current);

    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: mimeType || "video/webm",
      });
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
      stopStream();
      setPhase("preview");
    };

    mr.start();
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
  }, [stopStream]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  }, []);

  const handleRecordButton = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleClose = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }
    stopStream();
    onClose();
  }, [onClose, stopStream]);

  const handlePost = () => {
    if (!recordedUrl) {
      toast.error("Pehle video record karo!");
      return;
    }
    const hashes = hashtags
      .split(/\s+/)
      .filter((h) => h.trim())
      .map((h) => (h.startsWith("#") ? h : `#${h}`));
    const songLabel = selectedMusic
      ? `${selectedMusic.title} - ${selectedMusic.artist}`
      : "Original Audio";

    postedRef.current = true;
    setPendingNewReel({
      id: `r${Date.now()}`,
      videoUrl: recordedUrl,
      reelName: reelName || "My Reel",
      caption,
      hashtags: hashes,
      taggedUsers: [],
      songName: songLabel,
    });

    navigate({ to: "/explore" });
    onClose();
    toast.success("Reel post ho gayi! 🎬");
  };

  const handleReRecord = () => {
    setPhase("live");
    setRecordedUrl(null);
    setRecordingSeconds(0);
    setIsRecording(false);
    startCamera();
  };

  const filteredSongs = MUSIC_CATALOG.filter(
    (s) =>
      s.title.toLowerCase().includes(musicSearch.toLowerCase()) ||
      s.artist.toLowerCase().includes(musicSearch.toLowerCase()),
  );

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        {/* ── DENIED STATE ── */}
        {phase === "denied" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <Camera size={36} className="text-white/40" />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">
                Camera access denied
              </p>
              <p className="text-white/60 text-sm mt-2 leading-relaxed">
                Camera permission allow karo browser settings mein.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={handleClose}
              data-ocid="camera.close.button"
            >
              Wapas Jao
            </Button>
          </div>
        )}

        {/* ── LIVE CAMERA STATE ── */}
        {phase === "live" && (
          <div className="relative flex-1 overflow-hidden">
            {/* Live video */}
            <video
              ref={liveVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/60" />

            {/* X button */}
            <button
              type="button"
              className="absolute top-5 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              onClick={handleClose}
              data-ocid="camera.close.button"
            >
              <X size={20} />
            </button>

            {/* Recording indicator */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-5 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5"
              >
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                />
                <span className="text-white text-sm font-mono font-semibold">
                  {formatTime(recordingSeconds)}
                </span>
              </motion.div>
            )}

            {/* Hint text */}
            {!isRecording && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-36 left-1/2 -translate-x-1/2 text-white/60 text-sm whitespace-nowrap"
              >
                Record karne ke liye tap karo
              </motion.p>
            )}

            {/* Record button */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10">
              <motion.button
                type="button"
                whileTap={{ scale: 0.93 }}
                onClick={handleRecordButton}
                className="relative flex items-center justify-center"
                data-ocid="camera.record.button"
              >
                <div
                  className="w-20 h-20 rounded-full border-[3px] flex items-center justify-center transition-colors duration-300"
                  style={{
                    borderColor: isRecording
                      ? "rgba(255,0,80,0.6)"
                      : "rgba(255,255,255,0.8)",
                  }}
                >
                  {isRecording ? (
                    <motion.div
                      className="w-10 h-10 rounded-lg bg-[#ff0050]"
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{
                        duration: 0.8,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#ff0050]" />
                  )}
                </div>
              </motion.button>
            </div>
          </div>
        )}

        {/* ── PREVIEW STATE ── */}
        {phase === "preview" && recordedUrl && (
          <div className="relative flex-1 overflow-hidden">
            {/* Recorded video background */}
            <video
              src={recordedUrl}
              autoPlay
              loop
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/55 pointer-events-none" />

            {/* X button */}
            <button
              type="button"
              className="absolute top-5 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              onClick={handleClose}
              data-ocid="camera.preview.close.button"
            >
              <X size={20} />
            </button>

            {/* Preview label */}
            <div className="absolute top-5 left-4 z-20">
              <span className="text-white/70 text-sm font-medium bg-black/40 rounded-full px-3 py-1">
                Preview
              </span>
            </div>

            {/* Bottom form sheet */}
            <div className="absolute bottom-0 left-0 right-0 z-20 max-h-[72vh] overflow-y-auto">
              <div className="bg-black/92 backdrop-blur-xl rounded-t-2xl px-4 pt-3 pb-10 space-y-3.5">
                {/* Handle */}
                <div className="w-9 h-1 rounded-full bg-white/25 mx-auto mb-1" />

                <h3 className="text-white font-bold text-base">
                  Reel Post Karo 🎬
                </h3>

                <div>
                  <Label className="text-white/75 text-xs uppercase tracking-wide">
                    Reel ka naam
                  </Label>
                  <Input
                    value={reelName}
                    onChange={(e) => setReelName(e.target.value)}
                    placeholder="e.g. Meri Reel ✨"
                    className="mt-1 bg-white/10 border-white/15 text-white placeholder:text-white/35 focus:border-white/40"
                    data-ocid="camera.reel_name.input"
                  />
                </div>

                <div>
                  <Label className="text-white/75 text-xs uppercase tracking-wide">
                    Caption
                  </Label>
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Kuch likho apni reel ke baare mein..."
                    className="mt-1 bg-white/10 border-white/15 text-white placeholder:text-white/35 resize-none focus:border-white/40"
                    rows={2}
                    data-ocid="camera.caption.textarea"
                  />
                </div>

                <div>
                  <Label className="text-white/75 text-xs uppercase tracking-wide">
                    Hashtags
                  </Label>
                  <Input
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="#viral #reel #trending"
                    className="mt-1 bg-white/10 border-white/15 text-white placeholder:text-white/35 focus:border-white/40"
                    data-ocid="camera.hashtags.input"
                  />
                </div>

                {/* Music */}
                <div>
                  <Label className="text-white/75 text-xs uppercase tracking-wide">
                    Music
                  </Label>
                  <button
                    type="button"
                    onClick={() => setMusicPickerOpen(true)}
                    className={`mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                      selectedMusic
                        ? "border-[#ff0050]/60 bg-[#ff0050]/10 text-[#ff0050]"
                        : "border-white/15 bg-white/10 text-white/60 hover:border-white/30"
                    }`}
                    data-ocid="camera.music.button"
                  >
                    <Music size={16} className="flex-shrink-0" />
                    <span className="flex-1 text-left truncate">
                      {selectedMusic
                        ? `${selectedMusic.title} — ${selectedMusic.artist}`
                        : "Music add karo 🎵"}
                    </span>
                    {selectedMusic ? (
                      <Check
                        size={15}
                        className="flex-shrink-0 text-[#ff0050]"
                      />
                    ) : (
                      <Plus size={15} className="flex-shrink-0" />
                    )}
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-white/25 text-white hover:bg-white/10 bg-transparent"
                    onClick={handleReRecord}
                    data-ocid="camera.rerecord.button"
                  >
                    Re-record
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 font-semibold"
                    style={{ background: "#ff0050" }}
                    onClick={handlePost}
                    data-ocid="camera.post.button"
                  >
                    Post Karo 🚀
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Music Picker Dialog */}
      <Dialog open={musicPickerOpen} onOpenChange={setMusicPickerOpen}>
        <DialogContent
          className="max-w-sm"
          data-ocid="camera.music_picker.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Music Select Karo 🎵
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-3">
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
                data-ocid="camera.music_search.input"
              />
            </div>
            <div className="max-h-[52vh] overflow-y-auto -mx-1 px-1 space-y-1">
              {filteredSongs.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">
                  Koi song nahi mila 😔
                </p>
              ) : (
                filteredSongs.map((song) => {
                  const isSelected = selectedMusic?.id === song.id;
                  return (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => {
                        setSelectedMusic(song);
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
