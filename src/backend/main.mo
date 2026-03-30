import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  type InternalUserId = Principal;
  type PostId = Nat;
  type ReelId = Nat;
  type MessageId = Nat;
  type NotificationId = Nat;

  // MODULES AND TYPES
  module UserProfile {
    public type Public = {
      displayName : Text;
      bio : Text;
      dateOfBirth : Text;
      hobbies : [Text];
      socialLinks : [(Text, Text)];
      profilePhoto : Storage.ExternalBlob;
    };

    public type Internal = {
      displayName : Text;
      bio : Text;
      dateOfBirth : Text;
      hobbies : [Text];
      socialLinks : Map.Map<Text, Text>;
      profilePhoto : Storage.ExternalBlob;
      followers : Set.Set<InternalUserId>;
      following : Set.Set<InternalUserId>;
      notifications : List.List<NotificationId>;
    };
  };

  module Comment {
    public type Internal = {
      author : InternalUserId;
      text : Text;
      timestamp : Time.Time;
    };
  };

  module Notification {
    public type Type = {
      #follow : { followerId : InternalUserId };
      //#like : Post.Like.NotificationType; // Commented out due to undefined Post
      #comment : { postId : PostId; commenterId : InternalUserId };
    };

    public type Internal = {
      notificationId : NotificationId;
      recipient : InternalUserId;
      notificationType : Type;
      timestamp : Time.Time;
      isRead : Bool;
    };
  };

  module Message {
    public type Public = {
      sender : Principal;
      content : Text;
      timestamp : Time.Time;
    };

    public type Internal = {
      sender : InternalUserId;
      recipient : InternalUserId;
      content : Text;
      timestamp : Time.Time;
      isRead : Bool;
    };
  };

  // Authorization Mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Blob Storage Mixin
  include MixinStorage();

  // ACTOR STATE
  let userProfiles = Map.empty<InternalUserId, UserProfile.Internal>();
  let posts = Map.empty<PostId, ()>();
  let reels = Map.empty<ReelId, Storage.ExternalBlob>();
  let messages = Map.empty<MessageId, Message.Internal>();
  let notifications = Map.empty<NotificationId, Notification.Internal>();
  let directConversations = Map.empty<(InternalUserId, InternalUserId), List.List<MessageId>>();
  var nextPostId = 0;
  var nextReelId = 0;
  var nextMessageId = 0;
  var nextNotificationId = 0;

  // USER PROFILE MANAGEMENT
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile.Public {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) {
        ?{
          displayName = profile.displayName;
          bio = profile.bio;
          dateOfBirth = profile.dateOfBirth;
          hobbies = profile.hobbies;
          socialLinks = profile.socialLinks.entries().toArray();
          profilePhoto = profile.profilePhoto;
        };
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile.Public {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?profile) {
        ?{
          displayName = profile.displayName;
          bio = profile.bio;
          dateOfBirth = profile.dateOfBirth;
          hobbies = profile.hobbies;
          socialLinks = profile.socialLinks.entries().toArray();
          profilePhoto = profile.profilePhoto;
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile.Public) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let hobbiesArray = List.empty<Text>();
    for (hobby in profile.hobbies.values()) {
      hobbiesArray.add(hobby);
    };
    let userProfile : UserProfile.Internal = {
      profile with
      socialLinks = Map.fromIter(profile.socialLinks.values().map(func(pair) { pair }));
      followers = Set.empty();
      following = Set.empty();
      notifications = List.empty();
      hobbies = hobbiesArray.toArray();
    };
    userProfiles.add(caller, userProfile);
  };
};
