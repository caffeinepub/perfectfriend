import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Bookmark,
  Camera,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  UserCheck,
  UserPlus,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  CURRENT_USER,
  MOCK_POSTS,
  MOCK_USERS,
  type MockComment,
  type MockPost,
  TRENDING_HASHTAGS,
} from "../data/mockData";

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function PostCard({
  post: initialPost,
  onDelete,
}: { post: MockPost; onDelete: (id: string) => void }) {
  const [post, setPost] = useState(initialPost);
  const [commentInput, setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption);
  const [isFollowing, setIsFollowing] = useState(post.user.isFollowing);

  const handleLike = () => {
    setPost((p) => ({
      ...p,
      likes: p.isLiked ? p.likes - 1 : p.likes + 1,
      isLiked: !p.isLiked,
    }));
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment: MockComment = {
      id: `c_${Date.now()}`,
      userId: "me",
      user: {
        id: "me",
        username: "priya_sharma",
        displayName: "Priya Sharma",
        avatar: "/assets/generated/avatar-priya.dim_200x200.jpg",
        bio: "",
        followers: 0,
        following: 0,
        postsCount: 0,
        isFollowing: false,
        isOnline: true,
        hobbies: [],
        dateOfBirth: "",
        socialLinks: [],
      },
      text: commentInput,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setPost((p) => ({ ...p, comments: [...p.comments, newComment] }));
    setCommentInput("");
    setShowComments(true);
  };

  const handleEditSave = () => {
    setPost((p) => ({ ...p, caption: editCaption }));
    setEditOpen(false);
    toast.success("Post updated!");
  };

  const handleFollow = () => {
    setIsFollowing((f) => !f);
    toast.success(
      isFollowing
        ? `Unfollowed ${post.user.displayName}`
        : `Following ${post.user.displayName}`,
    );
  };

  return (
    <motion.article
      className="bg-card rounded-2xl overflow-hidden border border-border"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-ocid="feed.post.card"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.user.avatar} alt={post.user.displayName} />
              <AvatarFallback>{post.user.displayName[0]}</AvatarFallback>
            </Avatar>
            {post.user.isOnline && (
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card"
                style={{ background: "oklch(var(--online-green))" }}
              />
            )}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">
              {post.user.displayName}
            </p>
            <p className="text-xs text-muted-foreground">
              @{post.user.username} · {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!post.isOwner && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleFollow}
              className="h-7 text-xs gap-1 border-border"
              data-ocid="feed.follow.button"
            >
              {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
          {post.isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  data-ocid="feed.post.dropdown_menu"
                >
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-border bg-popover"
              >
                <DropdownMenuItem
                  onClick={() => setEditOpen(true)}
                  className="gap-2"
                  data-ocid="feed.post.edit_button"
                >
                  <Pencil size={14} /> Edit post
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    onDelete(post.id);
                    toast.success("Post deleted");
                  }}
                  className="gap-2 text-destructive focus:text-destructive"
                  data-ocid="feed.post.delete_button"
                >
                  <Trash2 size={14} /> Delete post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="w-full bg-secondary">
        {post.type === "reel" || post.type === "video" ? (
          // biome-ignore lint/a11y/useMediaCaption: user-generated content
          <video
            src={post.mediaUrl}
            className="w-full max-h-[500px] object-cover"
            controls
            poster={post.thumbnail}
          />
        ) : (
          <img
            src={post.mediaUrl}
            alt="post"
            className="w-full max-h-[500px] object-cover"
            loading="lazy"
          />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleLike}
              className="flex items-center gap-1.5 transition-transform active:scale-90"
              data-ocid="feed.post.like.button"
            >
              <Heart
                size={20}
                className={
                  post.isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground hover:text-foreground"
                }
              />
              <span className="text-sm font-medium">
                {formatCount(post.likes)}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowComments((s) => !s)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="feed.post.comment.button"
            >
              <MessageCircle size={20} />
              <span className="text-sm font-medium">
                {post.comments.length}
              </span>
            </button>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => toast.success("Link copied!")}
              data-ocid="feed.post.share.button"
            >
              <Share2 size={20} />
            </button>
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bookmark size={20} />
          </button>
        </div>

        <p className="text-sm text-foreground mb-1">
          <span className="font-semibold mr-1">{post.user.username}</span>
          {post.caption}
        </p>
        <p className="text-xs text-muted-foreground">
          {post.hashtags.join(" ")}
        </p>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2 overflow-hidden"
            >
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2">
                  <Avatar className="w-6 h-6 flex-shrink-0">
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback>
                      {comment.user.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-secondary rounded-xl px-3 py-1.5 text-xs flex-1">
                    <span className="font-semibold mr-1">
                      {comment.user.username}
                    </span>
                    <span className="text-muted-foreground">
                      {comment.text}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleComment} className="flex items-center gap-2 mt-3">
          <Avatar className="w-7 h-7 flex-shrink-0">
            <AvatarImage src="/assets/generated/avatar-priya.dim_200x200.jpg" />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          <Input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            className="h-8 text-xs bg-secondary border-0 rounded-full"
            data-ocid="feed.comment.input"
          />
          <Button
            type="submit"
            size="sm"
            className="h-8 text-xs px-3"
            style={{ background: "oklch(var(--primary))" }}
            data-ocid="feed.comment.submit_button"
          >
            Post
          </Button>
        </form>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          className="bg-card border-border"
          data-ocid="feed.edit.dialog"
        >
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editCaption}
            onChange={(e) => setEditCaption(e.target.value)}
            className="bg-secondary border-border min-h-[100px]"
            data-ocid="feed.edit.textarea"
          />
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setEditOpen(false)}
              data-ocid="feed.edit.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              style={{ background: "oklch(var(--primary))" }}
              data-ocid="feed.edit.save_button"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.article>
  );
}

type UploadMode = "image" | "video" | null;

export default function Home() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [uploadMode, setUploadMode] = useState<UploadMode>(null);
  const [newCaption, setNewCaption] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: string) => {
    setPosts((p) => p.filter((post) => post.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const openUpload = (mode: "image" | "video") => {
    setUploadMode(mode);
    setNewCaption("");
    setNewFile(null);
    setPreviewUrl(null);
  };

  const closeUpload = () => {
    setUploadMode(null);
    setNewCaption("");
    setNewFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFile || !uploadMode) {
      toast.error("Please select a file first");
      return;
    }
    const mediaUrl = URL.createObjectURL(newFile);
    const postType: MockPost["type"] =
      uploadMode === "image" ? "photo" : "video";
    const newPost: MockPost = {
      id: Date.now().toString(),
      userId: CURRENT_USER.id,
      type: postType,
      mediaUrl,
      caption: newCaption,
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <main>
          {/* Create Post Bar */}
          <div className="bg-card rounded-2xl border border-border p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={CURRENT_USER.avatar} />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-sm text-muted-foreground bg-secondary rounded-full px-4 py-2">
                What's on your mind, {CURRENT_USER.displayName.split(" ")[0]}?
              </div>
            </div>
            <div className="flex gap-2 border-t border-border pt-3">
              <Button
                variant="ghost"
                className="flex-1 gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary"
                onClick={() => openUpload("image")}
                data-ocid="feed.photo_upload.button"
              >
                <Camera size={18} style={{ color: "oklch(var(--primary))" }} />
                Photo
              </Button>
              <Button
                variant="ghost"
                className="flex-1 gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary"
                onClick={() => openUpload("video")}
                data-ocid="feed.video_upload.button"
              >
                <Video size={18} className="text-purple-400" />
                Video
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                data-ocid={`feed.post.item.${i + 1}`}
              >
                <PostCard post={post} onDelete={handleDelete} />
              </motion.div>
            ))}
          </div>
        </main>

        <aside className="hidden lg:block space-y-4">
          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Suggested for You
            </h3>
            <div className="space-y-3">
              {MOCK_USERS.filter((u) => !u.isFollowing).map((user, i) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                  data-ocid={`sidebar.suggested.item.${i + 1}`}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-semibold">
                        {user.displayName}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatCount(user.followers)} followers
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs border-border px-2"
                    data-ocid="sidebar.follow.button"
                  >
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {TRENDING_HASHTAGS.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    background: "oklch(var(--chip-bg))",
                    color: "oklch(var(--primary))",
                  }}
                  data-ocid="sidebar.hashtag.button"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground text-center px-2">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              caffeine.ai
            </a>
          </p>
        </aside>
      </div>

      {/* Upload Dialog */}
      <Dialog
        open={uploadMode !== null}
        onOpenChange={(open) => !open && closeUpload()}
      >
        <DialogContent
          className="bg-card border-border"
          data-ocid="feed.upload.dialog"
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
              onClick={() => fileInputRef.current?.click()}
              data-ocid="feed.upload.dropzone"
            >
              {previewUrl ? (
                uploadMode === "video" ? (
                  // biome-ignore lint/a11y/useMediaCaption: user-generated content
                  <video
                    src={previewUrl}
                    className="w-full max-h-48 rounded-lg object-cover"
                  />
                ) : (
                  <img
                    src={previewUrl}
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
                  <p className="text-xs text-muted-foreground mt-1">
                    or drag & drop here
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={uploadMode === "image" ? "image/*" : "video/*"}
                className="hidden"
                onChange={handleFileChange}
              />
            </button>
            {newFile && (
              <p className="text-xs text-muted-foreground text-center">
                {newFile.name}
              </p>
            )}
            <Textarea
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="Write a caption... #hashtags"
              className="bg-secondary border-border"
              data-ocid="feed.upload.textarea"
            />
            <DialogFooter>
              <Button
                variant="ghost"
                type="button"
                onClick={closeUpload}
                data-ocid="feed.upload.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ background: "oklch(var(--primary))" }}
                data-ocid="feed.upload.submit_button"
              >
                Share {uploadMode === "image" ? "Photo" : "Video"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
