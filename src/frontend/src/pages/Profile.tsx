import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  Edit2,
  Globe,
  Grid,
  ImageIcon,
  Instagram,
  Pencil,
  Play,
  Trash2,
  Twitter,
  VideoIcon,
  Youtube,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  CURRENT_USER,
  MOCK_POSTS,
  type MockPost,
  type MockUser,
} from "../data/mockData";

const PLATFORM_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  Instagram,
  Twitter,
  YouTube: Youtube,
  GitHub: Globe,
};

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function Profile() {
  const [user, setUser] = useState<MockUser>(CURRENT_USER);
  const [editOpen, setEditOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [uploadMode, setUploadMode] = useState<"image" | "video" | null>(null);
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [posts, setPosts] = useState<MockPost[]>(
    MOCK_POSTS.filter((p) => p.isOwner),
  );
  const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");
  const [editPost, setEditPost] = useState<{
    id: string;
    caption: string;
  } | null>(null);

  const [editForm, setEditForm] = useState({
    displayName: user.displayName,
    bio: user.bio,
    hobbies: user.hobbies.join(", "),
    dateOfBirth: user.dateOfBirth,
    instagram:
      user.socialLinks.find((l) => l.platform === "Instagram")?.url || "",
    twitter: user.socialLinks.find((l) => l.platform === "Twitter")?.url || "",
    youtube: user.socialLinks.find((l) => l.platform === "YouTube")?.url || "",
  });

  const handleSaveProfile = () => {
    setUser((u) => ({
      ...u,
      displayName: editForm.displayName,
      bio: editForm.bio,
      hobbies: editForm.hobbies
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean),
      dateOfBirth: editForm.dateOfBirth,
      socialLinks: [
        ...(editForm.instagram
          ? [{ platform: "Instagram", url: editForm.instagram }]
          : []),
        ...(editForm.twitter
          ? [{ platform: "Twitter", url: editForm.twitter }]
          : []),
        ...(editForm.youtube
          ? [{ platform: "YouTube", url: editForm.youtube }]
          : []),
      ],
    }));
    setEditOpen(false);
    toast.success("Profile updated!");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveAvatar = () => {
    if (!avatarPreview) return;
    setUser((u) => ({ ...u, avatar: avatarPreview }));
    setAvatarOpen(false);
    setAvatarFile(null);
    toast.success("Profile photo updated!");
  };

  const closeAvatarDialog = () => {
    setAvatarOpen(false);
    setAvatarFile(null);
    if (avatarPreview && avatarPreview !== user.avatar) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(null);
  };

  const handleDeletePost = (id: string) => {
    setPosts((p) => p.filter((post) => post.id !== id));
    toast.success("Post deleted");
  };

  const handleSavePostEdit = () => {
    if (!editPost) return;
    setPosts((p) =>
      p.map((post) =>
        post.id === editPost.id ? { ...post, caption: editPost.caption } : post,
      ),
    );
    setEditPost(null);
    toast.success("Post updated!");
  };

  const openUpload = (mode: "image" | "video") => {
    setUploadMode(mode);
    setUploadCaption("");
    setUploadFile(null);
    setUploadPreview(null);
  };

  const closeUpload = () => {
    setUploadMode(null);
    setUploadCaption("");
    setUploadFile(null);
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    setUploadPreview(null);
  };

  const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadFile(file);
    if (file) setUploadPreview(URL.createObjectURL(file));
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadMode) {
      toast.error("Please select a file first");
      return;
    }
    const mediaUrl = URL.createObjectURL(uploadFile);
    const postType: MockPost["type"] =
      uploadMode === "image" ? "photo" : "video";
    const newPost: MockPost = {
      id: Date.now().toString(),
      userId: CURRENT_USER.id,
      type: postType,
      mediaUrl,
      caption: uploadCaption,
      hashtags: [],
      likes: 0,
      isLiked: false,
      comments: [],
      isOwner: true,
      createdAt: new Date().toISOString(),
      user: CURRENT_USER,
    };
    setPosts((p) => [newPost, ...p]);
    closeUpload();
    toast.success(uploadMode === "image" ? "Photo shared!" : "Video shared!");
  };

  const ownReels = MOCK_POSTS.filter((p) => p.isOwner && p.type === "reel");
  const displayPosts = activeTab === "posts" ? posts : ownReels;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <motion.div
        className="bg-card rounded-2xl border border-border p-6 mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar
              className="w-24 h-24 border-2"
              style={{ borderColor: "oklch(var(--primary))" }}
            >
              <AvatarImage src={user.avatar} alt={user.displayName} />
              <AvatarFallback className="text-2xl">
                {user.displayName[0]}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-card"
              style={{ background: "oklch(var(--primary))" }}
              onClick={() => setAvatarOpen(true)}
              data-ocid="profile.avatar.edit_button"
            >
              <Camera size={14} className="text-white" />
            </button>
            <span
              className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-card"
              style={{ background: "oklch(var(--online-green))" }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold font-display">
                {user.displayName}
              </h1>
              <span className="text-sm text-muted-foreground">
                @{user.username}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>

            <div className="flex items-center gap-6 mt-3">
              <div className="text-center">
                <p className="font-bold text-lg">{user.postsCount}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">
                  {formatCount(user.followers)}
                </p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">
                  {formatCount(user.following)}
                </p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {user.hobbies.map((hobby) => (
                <Badge
                  key={hobby}
                  variant="secondary"
                  className="text-xs rounded-full"
                  style={{ background: "oklch(var(--chip-bg))" }}
                >
                  {hobby}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-3">
              {user.socialLinks.map((link) => {
                const Icon = PLATFORM_ICONS[link.platform] || Globe;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid="profile.social.link"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <Button
              onClick={() => setEditOpen(true)}
              variant="outline"
              className="gap-2 border-border"
              data-ocid="profile.edit.button"
            >
              <Edit2 size={14} /> Edit Profile
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => openUpload("image")}
                size="sm"
                className="gap-1 flex-1"
                style={{ background: "oklch(var(--primary))" }}
                data-ocid="profile.photo_upload.button"
              >
                <ImageIcon size={14} /> Photo
              </Button>
              <Button
                onClick={() => openUpload("video")}
                size="sm"
                variant="outline"
                className="gap-1 flex-1 border-border"
                data-ocid="profile.video_upload.button"
              >
                <VideoIcon size={14} /> Video
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Posts Grid */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "posts"
                ? "text-foreground border-b-2"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={
              activeTab === "posts"
                ? { borderColor: "oklch(var(--primary))" }
                : {}
            }
            data-ocid="profile.posts.tab"
          >
            <Grid size={16} /> Posts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reels")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "reels"
                ? "text-foreground border-b-2"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={
              activeTab === "reels"
                ? { borderColor: "oklch(var(--primary))" }
                : {}
            }
            data-ocid="profile.reels.tab"
          >
            <Play size={16} /> Reels
          </button>
        </div>

        <div className="grid grid-cols-3 gap-0.5">
          {displayPosts.map((post, i) => (
            <div
              key={post.id}
              className="relative group cursor-pointer bg-secondary"
              style={{ aspectRatio: "1" }}
              data-ocid={`profile.post.item.${i + 1}`}
            >
              {post.type === "reel" || post.type === "video" ? (
                <>
                  <img
                    src={post.thumbnail || post.mediaUrl}
                    alt="reel"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 text-white">
                    <Play size={14} fill="white" />
                  </div>
                </>
              ) : (
                <img
                  src={post.mediaUrl}
                  alt="post"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setEditPost({ id: post.id, caption: post.caption })
                  }
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 transition-colors flex items-center justify-center text-white"
                  data-ocid={`profile.post.edit_button.${i + 1}`}
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePost(post.id)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-500/70 transition-colors flex items-center justify-center text-white"
                  data-ocid={`profile.post.delete_button.${i + 1}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {displayPosts.length === 0 && (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="profile.posts.empty_state"
          >
            <p className="font-semibold">No {activeTab} yet</p>
            <p className="text-sm mt-1">
              Share your first{" "}
              {activeTab === "posts" ? "photo or video" : "reel"}!
            </p>
          </div>
        )}
      </div>

      {/* Change Profile Photo Dialog */}
      <Dialog
        open={avatarOpen}
        onOpenChange={(open) => !open && closeAvatarDialog()}
      >
        <DialogContent
          className="bg-card border-border"
          data-ocid="profile.avatar.dialog"
        >
          <DialogHeader>
            <DialogTitle>Change Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar
                className="w-24 h-24 border-2"
                style={{ borderColor: "oklch(var(--primary))" }}
              >
                <AvatarImage src={avatarPreview || user.avatar} />
                <AvatarFallback className="text-2xl">
                  {user.displayName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <button
              type="button"
              className="w-full border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => avatarInputRef.current?.click()}
              data-ocid="profile.avatar.dropzone"
            >
              {avatarFile ? (
                <p className="text-sm text-foreground">{avatarFile.name}</p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Tap to select a photo
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, GIF supported
                  </p>
                </>
              )}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </button>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={closeAvatarDialog}
              data-ocid="profile.avatar.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAvatar}
              disabled={!avatarPreview}
              style={{ background: "oklch(var(--primary))" }}
              data-ocid="profile.avatar.save_button"
            >
              Save Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="profile.edit.dialog"
        >
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label
                htmlFor="edit-displayname"
                className="text-xs text-muted-foreground"
              >
                Display Name
              </Label>
              <Input
                id="edit-displayname"
                value={editForm.displayName}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, displayName: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="profile.edit.name.input"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="edit-bio"
                className="text-xs text-muted-foreground"
              >
                Bio
              </Label>
              <Textarea
                id="edit-bio"
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, bio: e.target.value }))
                }
                className="bg-secondary border-border"
                rows={3}
                data-ocid="profile.edit.bio.textarea"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="edit-dob"
                className="text-xs text-muted-foreground"
              >
                Date of Birth
              </Label>
              <Input
                id="edit-dob"
                type="date"
                value={editForm.dateOfBirth}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, dateOfBirth: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="profile.edit.dob.input"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="edit-hobbies"
                className="text-xs text-muted-foreground"
              >
                Hobbies (comma separated)
              </Label>
              <Input
                id="edit-hobbies"
                value={editForm.hobbies}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, hobbies: e.target.value }))
                }
                placeholder="Photography, Hiking, Cooking..."
                className="bg-secondary border-border"
                data-ocid="profile.edit.hobbies.input"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="edit-instagram"
                className="text-xs text-muted-foreground"
              >
                Instagram URL
              </Label>
              <Input
                id="edit-instagram"
                value={editForm.instagram}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, instagram: e.target.value }))
                }
                placeholder="https://instagram.com/..."
                className="bg-secondary border-border"
                data-ocid="profile.edit.instagram.input"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="edit-twitter"
                className="text-xs text-muted-foreground"
              >
                Twitter URL
              </Label>
              <Input
                id="edit-twitter"
                value={editForm.twitter}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, twitter: e.target.value }))
                }
                placeholder="https://twitter.com/..."
                className="bg-secondary border-border"
                data-ocid="profile.edit.twitter.input"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="edit-youtube"
                className="text-xs text-muted-foreground"
              >
                YouTube URL
              </Label>
              <Input
                id="edit-youtube"
                value={editForm.youtube}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, youtube: e.target.value }))
                }
                placeholder="https://youtube.com/..."
                className="bg-secondary border-border"
                data-ocid="profile.edit.youtube.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setEditOpen(false)}
              data-ocid="profile.edit.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              style={{ background: "oklch(var(--primary))" }}
              data-ocid="profile.edit.save_button"
            >
              Save Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Post Dialog */}
      <Dialog
        open={uploadMode !== null}
        onOpenChange={(open) => !open && closeUpload()}
      >
        <DialogContent
          className="bg-card border-border"
          data-ocid="profile.upload.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {uploadMode === "image" ? "📷 Share Photo" : "🎬 Share Video"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <button
              type="button"
              className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => uploadInputRef.current?.click()}
              data-ocid="profile.upload.dropzone"
            >
              {uploadPreview ? (
                uploadMode === "video" ? (
                  // biome-ignore lint/a11y/useMediaCaption: user-generated content
                  <video
                    src={uploadPreview}
                    className="w-full max-h-48 rounded-lg object-cover"
                  />
                ) : (
                  <img
                    src={uploadPreview}
                    alt="preview"
                    className="w-full max-h-48 rounded-lg object-cover"
                  />
                )
              ) : (
                <>
                  <p className="text-3xl mb-2">
                    {uploadMode === "image" ? "📷" : "🎬"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {uploadMode === "image"
                      ? "Tap to select a photo"
                      : "Tap to select a video"}
                  </p>
                </>
              )}
              <input
                ref={uploadInputRef}
                type="file"
                accept={uploadMode === "image" ? "image/*" : "video/*"}
                className="hidden"
                onChange={handleUploadFileChange}
              />
            </button>
            <Textarea
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              placeholder="Write a caption... #hashtags"
              className="bg-secondary border-border"
              data-ocid="profile.upload.caption.textarea"
            />
            <DialogFooter>
              <Button
                variant="ghost"
                type="button"
                onClick={closeUpload}
                data-ocid="profile.upload.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ background: "oklch(var(--primary))" }}
                data-ocid="profile.upload.submit_button"
              >
                Share {uploadMode === "image" ? "Photo" : "Video"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit post dialog */}
      <Dialog open={!!editPost} onOpenChange={(o) => !o && setEditPost(null)}>
        <DialogContent
          className="bg-card border-border"
          data-ocid="profile.edit_post.dialog"
        >
          <DialogHeader>
            <DialogTitle>Edit Post Caption</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editPost?.caption || ""}
            onChange={(e) =>
              setEditPost((ep) =>
                ep ? { ...ep, caption: e.target.value } : null,
              )
            }
            className="bg-secondary border-border min-h-[100px]"
            data-ocid="profile.edit_post.textarea"
          />
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setEditPost(null)}
              data-ocid="profile.edit_post.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePostEdit}
              style={{ background: "oklch(var(--primary))" }}
              data-ocid="profile.edit_post.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
