export interface MockUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  isFollowing: boolean;
  isOnline: boolean;
  hobbies: string[];
  dateOfBirth: string;
  socialLinks: { platform: string; url: string }[];
}

export interface MockPost {
  id: string;
  userId: string;
  user: MockUser;
  type: "photo" | "video" | "reel";
  mediaUrl: string;
  thumbnail?: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: MockComment[];
  isLiked: boolean;
  createdAt: string;
  isOwner: boolean;
}

export interface MockComment {
  id: string;
  userId: string;
  user: MockUser;
  text: string;
  createdAt: string;
  likes: number;
}

export interface MockNotification {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  user: MockUser;
  postThumbnail?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface MockMessage {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
  read: boolean;
}

export interface MockConversation {
  id: string;
  user: MockUser;
  messages: MockMessage[];
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export const CURRENT_USER: MockUser = {
  id: "me",
  username: "priya_sharma",
  displayName: "Priya Sharma",
  avatar: "/assets/generated/avatar-priya.dim_200x200.jpg",
  bio: "Living life one adventure at a time 🌍 | Foodie | Traveler | Dreamer",
  followers: 2847,
  following: 412,
  postsCount: 63,
  isFollowing: false,
  isOnline: true,
  hobbies: ["Photography", "Hiking", "Cooking", "Reading", "Dancing"],
  dateOfBirth: "1999-08-15",
  socialLinks: [
    { platform: "Instagram", url: "https://instagram.com/priya_sharma" },
    { platform: "Twitter", url: "https://twitter.com/priya_sharma" },
    { platform: "YouTube", url: "https://youtube.com/@priyasharma" },
  ],
};

export const MOCK_USERS: MockUser[] = [
  {
    id: "u1",
    username: "rohan_verma",
    displayName: "Rohan Verma",
    avatar: "/assets/generated/avatar-rohan.dim_200x200.jpg",
    bio: "Tech enthusiast & coffee addict ☕ | Building cool stuff",
    followers: 5231,
    following: 312,
    postsCount: 89,
    isFollowing: true,
    isOnline: true,
    hobbies: ["Coding", "Gaming", "Music", "Coffee"],
    dateOfBirth: "1998-03-22",
    socialLinks: [{ platform: "GitHub", url: "https://github.com/rohanverma" }],
  },
  {
    id: "u2",
    username: "neha_kapoor",
    displayName: "Neha Kapoor",
    avatar: "/assets/generated/avatar-neha.dim_200x200.jpg",
    bio: "Artist & storyteller 🎨 | Mumbai → Delhi | Making magic happen",
    followers: 12480,
    following: 891,
    postsCount: 234,
    isFollowing: false,
    isOnline: false,
    hobbies: ["Painting", "Yoga", "Travel", "Poetry"],
    dateOfBirth: "2000-11-08",
    socialLinks: [
      { platform: "Instagram", url: "https://instagram.com/neha.kapoor" },
    ],
  },
  {
    id: "u3",
    username: "arjun_mehta",
    displayName: "Arjun Mehta",
    avatar: "/assets/generated/avatar-arjun.dim_200x200.jpg",
    bio: "Books > everything else 📚 | Philosophy nerd | Chai lover",
    followers: 3104,
    following: 267,
    postsCount: 47,
    isFollowing: true,
    isOnline: true,
    hobbies: ["Reading", "Chess", "Writing", "Hiking"],
    dateOfBirth: "1997-06-14",
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/arjunmehta" },
    ],
  },
];

export const MOCK_POSTS: MockPost[] = [
  {
    id: "p1",
    userId: "u1",
    user: MOCK_USERS[0],
    type: "photo",
    mediaUrl: "/assets/generated/post-city.dim_800x600.jpg",
    caption:
      "Mumbai at golden hour hits different. The city never sleeps and neither do I 🌆✨",
    hashtags: ["#Mumbai", "#GoldenHour", "#CityLife", "#India"],
    likes: 847,
    isLiked: false,
    createdAt: "2026-03-29T18:30:00Z",
    isOwner: false,
    comments: [
      {
        id: "c1",
        userId: "u2",
        user: MOCK_USERS[1],
        text: "Absolutely stunning shot!! 😍🔥",
        createdAt: "2026-03-29T19:00:00Z",
        likes: 12,
      },
      {
        id: "c2",
        userId: "me",
        user: CURRENT_USER,
        text: "This is my favourite view in all of Mumbai!",
        createdAt: "2026-03-29T19:30:00Z",
        likes: 8,
      },
    ],
  },
  {
    id: "p2",
    userId: "u2",
    user: MOCK_USERS[1],
    type: "photo",
    mediaUrl: "/assets/generated/post-food.dim_800x600.jpg",
    caption:
      "Dilli ki galiyon ki pani puri 🤤 Nothing beats street food at midnight!",
    hashtags: ["#Delhi", "#StreetFood", "#FoodieLife", "#PaniPuri"],
    likes: 2341,
    isLiked: true,
    createdAt: "2026-03-29T14:15:00Z",
    isOwner: false,
    comments: [
      {
        id: "c3",
        userId: "u3",
        user: MOCK_USERS[2],
        text: "The one at Chandni Chowk is the best! 🙌",
        createdAt: "2026-03-29T15:00:00Z",
        likes: 45,
      },
    ],
  },
  {
    id: "p3",
    userId: "me",
    user: CURRENT_USER,
    type: "photo",
    mediaUrl: "/assets/generated/post-friends.dim_800x600.jpg",
    caption:
      "Sunday brunches with these amazing people 💛 Grateful for every laugh and every memory we make together!",
    hashtags: ["#Friends", "#Brunch", "#Blessed", "#SundayVibes"],
    likes: 1203,
    isLiked: false,
    createdAt: "2026-03-28T11:00:00Z",
    isOwner: true,
    comments: [
      {
        id: "c4",
        userId: "u1",
        user: MOCK_USERS[0],
        text: "Best squad ever!! Miss you guys 🥲",
        createdAt: "2026-03-28T11:30:00Z",
        likes: 23,
      },
    ],
  },
  {
    id: "p4",
    userId: "u3",
    user: MOCK_USERS[2],
    type: "photo",
    mediaUrl: "/assets/generated/post-nature.dim_800x600.jpg",
    caption:
      "Trekked 12km to reach this spot and it was worth every step 🏔️ Nature therapy > everything!",
    hashtags: ["#Trekking", "#Nature", "#Adventure", "#Himalayas"],
    likes: 689,
    isLiked: false,
    createdAt: "2026-03-27T08:00:00Z",
    isOwner: false,
    comments: [],
  },
  {
    id: "p5",
    userId: "u1",
    user: MOCK_USERS[0],
    type: "reel",
    mediaUrl: "/assets/video_1-019d3fcb-2382-712d-b6ee-bcfe77659a39.mp4",
    thumbnail: "/assets/generated/reel-thumb.dim_400x700.jpg",
    caption:
      "Caught this incredible sunset moment ☀️ Pure magic in every frame!",
    hashtags: ["#Reel", "#Sunset", "#Vibes", "#PerfectMoment"],
    likes: 4521,
    isLiked: false,
    createdAt: "2026-03-26T19:00:00Z",
    isOwner: false,
    comments: [
      {
        id: "c5",
        userId: "u2",
        user: MOCK_USERS[1],
        text: "This is fire 🔥🔥🔥",
        createdAt: "2026-03-26T20:00:00Z",
        likes: 67,
      },
    ],
  },
];

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "n1",
    type: "like",
    user: MOCK_USERS[0],
    postThumbnail: "/assets/generated/post-friends.dim_800x600.jpg",
    message: "liked your photo",
    createdAt: "2026-03-30T09:00:00Z",
    read: false,
  },
  {
    id: "n2",
    type: "follow",
    user: MOCK_USERS[1],
    message: "started following you",
    createdAt: "2026-03-30T08:30:00Z",
    read: false,
  },
  {
    id: "n3",
    type: "comment",
    user: MOCK_USERS[2],
    postThumbnail: "/assets/generated/post-friends.dim_800x600.jpg",
    message: 'commented: "This is so beautiful! ❤️"',
    createdAt: "2026-03-29T22:00:00Z",
    read: false,
  },
  {
    id: "n4",
    type: "like",
    user: MOCK_USERS[1],
    postThumbnail: "/assets/generated/post-nature.dim_800x600.jpg",
    message: "liked your post",
    createdAt: "2026-03-29T18:00:00Z",
    read: true,
  },
  {
    id: "n5",
    type: "mention",
    user: MOCK_USERS[0],
    message: "mentioned you in a comment",
    createdAt: "2026-03-29T14:00:00Z",
    read: true,
  },
];

export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: "conv1",
    user: MOCK_USERS[0],
    lastMessage: "Bhai kal chal raha hai kya? 🤙",
    lastMessageTime: "2026-03-30T09:15:00Z",
    unread: 2,
    messages: [
      {
        id: "m1",
        text: "Hey! Kya haal hai? 😄",
        senderId: "u1",
        createdAt: "2026-03-30T09:00:00Z",
        read: true,
      },
      {
        id: "m2",
        text: "Sab theek! Tu bata",
        senderId: "me",
        createdAt: "2026-03-30T09:05:00Z",
        read: true,
      },
      {
        id: "m3",
        text: "Bhai kal chal raha hai kya? 🤙",
        senderId: "u1",
        createdAt: "2026-03-30T09:15:00Z",
        read: false,
      },
    ],
  },
  {
    id: "conv2",
    user: MOCK_USERS[1],
    lastMessage: "Your latest photo is amazing! 😍",
    lastMessageTime: "2026-03-29T20:00:00Z",
    unread: 0,
    messages: [
      {
        id: "m4",
        text: "Your latest photo is amazing! 😍",
        senderId: "u2",
        createdAt: "2026-03-29T20:00:00Z",
        read: true,
      },
      {
        id: "m5",
        text: "Thank you so much!! 🙏❤️",
        senderId: "me",
        createdAt: "2026-03-29T20:05:00Z",
        read: true,
      },
    ],
  },
  {
    id: "conv3",
    user: MOCK_USERS[2],
    lastMessage: "Have you read 'The Alchemist'? 📚",
    lastMessageTime: "2026-03-28T16:00:00Z",
    unread: 1,
    messages: [
      {
        id: "m6",
        text: "Have you read 'The Alchemist'? 📚",
        senderId: "u3",
        createdAt: "2026-03-28T16:00:00Z",
        read: false,
      },
    ],
  },
];

export const TRENDING_HASHTAGS = [
  "#DostiKaPerfectPlatform",
  "#MumbaiDiaries",
  "#Bollywood",
  "#IndianFoodie",
  "#TravelIndia",
  "#DesiVibes",
  "#YouthOfIndia",
  "#CreativeIndia",
];

export const EXPLORE_POSTS = [
  ...MOCK_POSTS,
  {
    id: "e1",
    userId: "u2",
    user: MOCK_USERS[1],
    type: "photo" as const,
    mediaUrl: "/assets/generated/post-city.dim_800x600.jpg",
    caption: "Colors of Delhi 🌈",
    hashtags: ["#Delhi", "#Colors"],
    likes: 892,
    isLiked: false,
    createdAt: "2026-03-25T10:00:00Z",
    isOwner: false,
    comments: [],
  },
  {
    id: "e2",
    userId: "u3",
    user: MOCK_USERS[2],
    type: "photo" as const,
    mediaUrl: "/assets/generated/post-food.dim_800x600.jpg",
    caption: "Sunday chai time ☕",
    hashtags: ["#Chai", "#Sunday"],
    likes: 531,
    isLiked: true,
    createdAt: "2026-03-24T08:00:00Z",
    isOwner: false,
    comments: [],
  },
];
