import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { firebaseAuth } from '../firebase/auth';

const getStoredUsers = () => {
  try {
    const stored = localStorage.getItem('muse_users');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(16);
};

const saveUser = (user) => {
  try {
    const users = getStoredUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('muse_users', JSON.stringify(users));
    return true;
  } catch {
    return false;
  }
};

const findUserByEmail = (email) => {
  const users = getStoredUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

const hashPassword = (password) => {
  return simpleHash(password + 'muse_salt_2024');
};

const generateMockProfiles = () => {
  try {
  const indianNames = [
    'Aisha', 'Priya', 'Ananya', 'Sneha', 'Riya', 'Kavya', 'Neha', 'Pooja', 'Shruti', 'Divya',
    'Aditya', 'Raj', 'Arjun', 'Vikram', 'Arnav', 'Aryan', 'Karan', 'Rohan', 'Ishaan', 'Dhruv',
    'Sarah', 'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia', 'Harper'
  ];
  
  const indianBios = [
    'Software Engineer | Coffee addict | Dog lover',
    'Marketing Professional | Travel enthusiast | Foodie',
    'Doctor by day | Dancer by night',
    'CA | Chess player | Book worm',
    'Designer | Nature lover | Coffee enthusiast',
    'MBA | Gym rat | Netflix binger',
    'Engineer | Music lover | Party animal',
    'Teacher | Art lover | Vegan foodie',
    'Chef | Travel blogger | Cat mom',
    'Photographer | Fashionista | Coffee lover'
  ];
  
  const westernBios = [
    'Coffee lover | Dog mom | Adventure seeker',
    'Yoga instructor | Plant mom | Beach vibes',
    'Foodie at heart | Travel addict | Movie nights',
    'Tech geek by day, dancer by night',
    'Book worm | Cat person | Sarcasm is my superpower',
    'Chef | Wine enthusiast',
    'Photographer | Music festival regular | Dog lover',
    'Marketing guru | Brunch enthusiast | Netflix binger',
    'Nurse by profession | Wanderlust soul',
    'Artist | Coffee addict'
  ];
  
  const interests = ['Travel', 'Music', 'Food', 'Fitness', 'Reading', 'Movies', 'Art', 'Cooking', 'Photography', 'Yoga', 'Gaming', 'Dancing', 'Hiking', 'Wine', 'Coffee', 'Fashion', 'Tech', 'Gym', 'Nature'];
  
  const prompts = [
    { question: 'My simple pleasure', answer: 'Morning coffee on the balcony' },
    { question: 'I am overly competitive about', answer: 'Board game nights' },
    { question: 'My type?', answer: 'Someone who makes me laugh' },
    { question: 'Ideal first date', answer: 'Something fun and adventurous' },
    { question: 'A fact about me', answer: 'I have been to 15 countries!' }
  ];

  const allNames = [...indianNames];
  const allBios = [...indianBios, ...westernBios];
  
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Goa', 'Ahmedabad', 'New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Seattle'];

  // Generate 40 profiles - mix of Indian and Western
  return Array.from({ length: 40 }, (_, i) => {
    const isIndian = i < 30;
    const isWomen = i % 2 === 0;
    
    const gender = isWomen ? 'women' : 'men';
    const photoIndex = (i * 7) % 99;
    
    return {
      id: uuidv4(),
      name: allNames[i % allNames.length],
      age: 21 + Math.floor(Math.random() * 15),
      bio: allBios[i % allBios.length],
      photos: [
        `https://randomuser.me/api/portraits/${gender}/${photoIndex}.jpg`,
        `https://randomuser.me/api/portraits/${gender}${(photoIndex + 17) % 99}.jpg`,
        `https://randomuser.me/api/portraits/${gender}${(photoIndex + 23) % 99}.jpg`,
        `https://randomuser.me/api/portraits/${gender}${(photoIndex + 31) % 99}.jpg`,
        `https://randomuser.me/api/portraits/${gender}${(photoIndex + 41) % 99}.jpg`
      ],
      interests: interests.sort(() => 0.5 - Math.random()).slice(0, 5),
      prompts: prompts.sort(() => 0.5 - Math.random()).slice(0, 3),
      location: cities[i % cities.length],
      distance: Math.floor(Math.random() * 30) + 1,
      online: Math.random() > 0.6,
      lastActive: Math.random() > 0.5 ? 'Now' : (Math.floor(Math.random() * 24) + 1) + 'h ago'
    };
  });
  } catch (e) {
    console.error('Error generating profiles:', e);
    return [];
  }
};

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      isAuthenticated: false,
      lastActivity: null,
      
      // Profiles
      profiles: generateMockProfiles(),
      passedProfiles: [],
      matchedProfiles: [],
      
      // Chat
      chats: [],
      messages: {},
      
      // Moments (Stories)
      moments: [],
      
      // Notifications
      notifications: [],
      
      // Settings
      preferences: {
        ageRange: [18, 50],
        distance: 50,
        gender: 'all'
      },

      // Premium
      premiumPlan: null,
      premiumExpiry: null,

      // Location
      userLocation: null,

      // Premium Plans
      premiumPlans: [
        { id: 'daily', name: 'Daily', price: 10, duration: 1, durationType: 'day' },
        { id: 'weekly', name: 'Weekly', price: 50, duration: 7, durationType: 'day' },
        { id: 'monthly', name: 'Monthly', price: 199, duration: 30, durationType: 'day' },
        { id: 'yearly', name: 'Yearly', price: 999, duration: 365, durationType: 'day' }
      ],

      // Boost
      lastBoost: null,
      profileViews: 0,
      likesReceived: 0,

      // Visibility
      showOnline: true,
      showProfile: true,

      // Calls
      callState: {
        isCallActive: false,
        isIncomingCall: false,
        callType: null,
        caller: null,
        roomUrl: null,
        callStartTime: null,
        isVideoEnabled: true,
        isAudioEnabled: true,
      },

      // Profile Stats
      profileStats: {
        likes: 0,
        matches: 0,
        messages: 0,
        profileViews: 0
      },

      // Call History
      callHistory: [],

      // Actions
      fetchLocation: () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              // Reverse geocode (simplified - would need API in production)
              set({ 
                userLocation: { 
                  lat: latitude, 
                  lng: longitude,
                  city: 'Detecting...',
                  country: 'Unknown'
                } 
              });
            },
            (error) => {
              console.log('Location error:', error.message);
              set({ userLocation: { lat: null, lng: null, city: 'Location unavailable', country: '' } });
            }
          );
        }
      },

      setLocation: (location) => {
        set({ userLocation: location });
      },

      purchasePremium: (planId) => {
        const plan = get().premiumPlans.find(p => p.id === planId);
        if (plan) {
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + plan.duration);
          set({ 
            premiumPlan: plan,
            premiumExpiry: expiry.toISOString()
          });
        }
      },

      cancelPremium: () => {
        set({ premiumPlan: null, premiumExpiry: null });
      },

      boostProfile: () => {
        const { premiumPlan } = get();
        if (premiumPlan) {
          set({ lastBoost: new Date().toISOString() });
        }
      },

      // Call actions
      initiateCall: (matchId, callType) => {
        set(state => ({
          callState: {
            ...state.callState,
            isCallActive: true,
            callType,
            caller: matchId,
            callStartTime: Date.now()
          }
        }));
      },

      receiveCall: (caller, callType, roomUrl) => {
        set(state => ({
          callState: {
            ...state.callState,
            isIncomingCall: true,
            callType,
            caller,
            roomUrl
          }
        }));
      },

      acceptCall: () => {
        set(state => ({
          callState: {
            ...state.callState,
            isIncomingCall: false,
            isCallActive: true,
            callStartTime: Date.now()
          }
        }));
      },

      rejectCall: () => {
        set(state => ({
          callState: {
            ...state.callState,
            isIncomingCall: false,
            caller: null,
            roomUrl: null
          }
        }));
      },

      endCall: (duration = 0) => {
        const { callState, callHistory } = get();
        
        if (callState.caller) {
          const newHistory = {
            id: Date.now(),
            matchId: callState.caller,
            type: callState.callType,
            duration,
            timestamp: Date.now(),
            status: 'completed'
          };
          
          set(state => ({
            callState: {
              isCallActive: false,
              isIncomingCall: false,
              callType: null,
              caller: null,
              roomUrl: null,
              callStartTime: null,
              isVideoEnabled: true,
              isAudioEnabled: true,
            },
            callHistory: [newHistory, ...(state.callHistory || [])].slice(0, 50)
          }));
        } else {
          set(state => ({
            callState: {
              isCallActive: false,
              isIncomingCall: false,
              callType: null,
              caller: null,
              roomUrl: null,
              callStartTime: null,
              isVideoEnabled: true,
              isAudioEnabled: true,
            }
          }));
        }
      },

      toggleCallVideo: () => {
        set(state => ({
          callState: {
            ...state.callState,
            isVideoEnabled: !state.callState.isVideoEnabled
          }
        }));
      },

      toggleCallAudio: () => {
        set(state => ({
          callState: {
            ...state.callState,
            isAudioEnabled: !state.callState.isAudioEnabled
          }
        }));
      },

      addProfileView: () => {
        set(state => ({
          profileStats: {
            ...state.profileStats,
            profileViews: state.profileStats.profileViews + 1
          }
        }));
      },

      addLikeReceived: () => {
        set(state => ({
          profileStats: {
            ...state.profileStats,
            likes: state.profileStats.likes + 1
          }
        }));
      },

      addMatch: () => {
        set(state => ({
          profileStats: {
            ...state.profileStats,
            matches: state.profileStats.matches + 1
          }
        }));
      },

      login: async (email, password) => {
        const result = await firebaseAuth.login(email, password);
        if (result.success) {
          set({ currentUser: result.user, isAuthenticated: true, lastActivity: Date.now() });
          get().fetchLocation();
          return true;
        }
        console.log('Login failed:', result.error);
        return false;
      },

      signup: async (userData, password) => {
        const result = await firebaseAuth.signup(userData.email, password, userData);
        if (result.success) {
          set({ currentUser: result.user, isAuthenticated: true, lastActivity: Date.now() });
          get().fetchLocation();
          return true;
        }
        console.log('Signup failed:', result.error);
        return false;
      },

      logout: async () => {
        await firebaseAuth.logout();
        set({ currentUser: null, isAuthenticated: false, lastActivity: null });
      },

      updateLastActivity: () => set({ lastActivity: Date.now() }),

      checkSession: () => {
        const { lastActivity, isAuthenticated } = get();
        if (!isAuthenticated || !lastActivity) return false;
        if (Date.now() - lastActivity > SESSION_TIMEOUT) {
          set({ currentUser: null, isAuthenticated: false, lastActivity: null });
          return false;
        }
        return true;
      },

      swipeRight: (profileId) => {
        const { profiles, matchedProfiles, currentUser, passedProfiles } = get();
        const profile = profiles.find(p => p.id === profileId);
        
        // 40% chance of match
        const isMatch = Math.random() > 0.6;
        
        if (isMatch && profile) {
          const newMatch = {
            id: uuidv4(),
            matchedAt: new Date().toISOString(),
            user: profile,
            matchedUser: currentUser
          };
          
          set({
            matchedProfiles: [...matchedProfiles, newMatch],
            profiles: profiles.filter(p => p.id !== profileId),
            notifications: [
              { id: uuidv4(), type: 'match', message: `🎉 You matched with ${profile.name}!`, read: false, createdAt: new Date().toISOString() },
              ...get().notifications
            ]
          });
        } else {
          // Store for undo - non-match swipe right
          set({
            profiles: profiles.filter(p => p.id !== profileId),
            passedProfiles: [...passedProfiles, { id: profileId, profile, action: 'liked' }]
          });
        }
      },

      swipeLeft: (profileId) => {
        const { profiles, passedProfiles } = get();
        const profile = profiles.find(p => p.id === profileId);
        set({
          profiles: profiles.filter(p => p.id !== profileId),
          passedProfiles: [...passedProfiles, { id: profileId, profile, action: 'passed' }]
        });
      },

      undoSwipe: () => {
        const { passedProfiles, profiles } = get();
        if (passedProfiles.length > 0) {
          const lastPassed = passedProfiles[passedProfiles.length - 1];
          const restoredProfile = lastPassed.profile;
          if (restoredProfile) {
            set({
              profiles: [...profiles, restoredProfile],
              passedProfiles: passedProfiles.slice(0, -1)
            });
          }
        }
      },

      sendMessage: (chatId, message) => {
        const { messages, chats } = get();
        const newMessage = {
          id: uuidv4(),
          chatId,
          text: message,
          sender: 'me',
          timestamp: new Date().toISOString(),
          read: false
        };
        
        const chatMessages = messages[chatId] || [];
        const updatedMessages = { ...messages, [chatId]: [...chatMessages, newMessage] };
        
        // Update chat last message
        const updatedChats = chats.map(chat => 
          chat.id === chatId ? { ...chat, lastMessage: message, lastMessageTime: new Date().toISOString() } : chat
        );
        
        // Simulate reply after 2 seconds
        setTimeout(() => {
          const replies = [
            "That sounds amazing! 😊",
            "I'd love that!",
            "Tell me more about yourself",
            "Haha that's funny!",
            "What else do you like to do?",
            "That's so interesting!",
            "Can't wait to chat more! 💕"
          ];
          const reply = {
            id: uuidv4(),
            chatId,
            text: replies[Math.floor(Math.random() * replies.length)],
            sender: 'them',
            timestamp: new Date().toISOString(),
            read: false
          };
          set(state => ({
            messages: {
              ...state.messages,
              [chatId]: [...(state.messages[chatId] || []), reply]
            }
          }));
        }, 2000);
        
        set({ messages: updatedMessages, chats: updatedChats });
      },

      createChat: (matchedProfile) => {
        const { chats } = get();
        const newChat = {
          id: uuidv4(),
          matchedProfile,
          lastMessage: '',
          lastMessageTime: null,
          unreadCount: 0
        };
        set({ chats: [newChat, ...chats] });
        return newChat.id;
      },

      addMoment: (moment) => {
        const { moments, currentUser } = get();
        const newMoment = {
          id: uuidv4(),
          userId: currentUser.id,
          userName: currentUser.name,
          userPhoto: currentUser.photos[0],
          ...moment,
          createdAt: new Date().toISOString(),
          views: 0,
          reactions: []
        };
        set({ moments: [newMoment, ...moments] });
      },

      viewMoment: (momentId) => {
        const { moments } = get();
        set({
          moments: moments.map(m => 
            m.id === momentId ? { ...m, views: m.views + 1 } : m
          )
        });
      },

      updatePreferences: (prefs) => {
        set(state => ({ preferences: { ...state.preferences, ...prefs } }));
      },

      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },

      markAllNotificationsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true }))
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      // Visibility settings
      setShowOnline: (show) => {
        set({ showOnline: show });
      },

      setShowProfile: (show) => {
        set({ showProfile: show });
      },

      updateUserPhoto: (photoUrl) => {
        set(state => ({
          currentUser: state.currentUser ? { ...state.currentUser, photos: [photoUrl, ...state.currentUser.photos] } : null
        }));
      },

      updateCurrentUser: (userData) => {
        const currentUser = get().currentUser;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          
          // Update localStorage
          try {
            const users = JSON.parse(localStorage.getItem('muse_users') || '[]');
            const userIndex = users.findIndex(u => u.id === updatedUser.id);
            if (userIndex >= 0) {
              users[userIndex] = updatedUser;
              localStorage.setItem('muse_users', JSON.stringify(users));
            }
          } catch (e) {
            console.error('Error updating user:', e);
          }
          
          set({ currentUser: updatedUser });
        }
      }
    }),
    {
      name: 'muse-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity,
        matchedProfiles: state.matchedProfiles,
        passedProfiles: state.passedProfiles,
        chats: state.chats,
        messages: state.messages,
        moments: state.moments,
        preferences: state.preferences,
        premiumPlan: state.premiumPlan,
        premiumExpiry: state.premiumExpiry,
        profileStats: state.profileStats,
        lastBoost: state.lastBoost
      })
    }
  )
);

export { findUserByEmail, getStoredUsers, saveUser };
export default useStore;
