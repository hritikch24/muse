import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const generateMockProfiles = () => {
  const indianNames = [
    'Aisha', 'Priya', 'Ananya', 'Sneha', 'Riya', 'Kavya', 'Neha', 'Pooja', 'Shruti', 'Divya',
    'Aditya', 'Raj', 'Arjun', 'Vikram', 'Arnav', 'Aryan', 'Karan', 'Rohan', 'Ishaan', 'Dhruv',
    'Sarah', 'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia', 'Harper'
  ];
  
  const indianBios = [
    'Software Engineer 💻 | Coffee addict | Dog lover',
    'Marketing Professional 📱 | Travel enthusiast | Foodie',
    'Doctor by day ✨ | Dancer by night | Adventure seeker',
    'CA | Chess player | Book worm 📚',
    'Designer 🎨 | Nature lover | Coffee enthusiast',
    ' MBA | Gym rat | Netflix binger',
    'Engineer 🚀 | Music lover | Party animal',
    'Teacher 📖 | Art lover | Vegan foodie',
    'Chef 👩‍🍳 | Travel blogger | Cat mom',
    'Photographer 📸 | Fashionista | Coffee lover'
  ];
  
  const westernBios = [
    'Coffee lover ☕ | Dog mom 🐕 | Adventure seeker',
    'Yoga instructor | Plant mom | Beach vibes',
    'Foodie at heart | Travel addict | Movie nights',
    'Tech geek by day, dancer by night 💃',
    'Book worm 📚 | Cat person | Sarcasm is my superpower',
    'Chef 👩‍🍳 | Wine enthusiast | Let\'s grab a pizza',
    'Photographer 📸 | Music festival regular | Dog lover',
    'Marketing guru | Brunch enthusiast | Netflix binger',
    'Nurse by profession | Wanderlust soul | Dog mom',
    'Artist 🎨 | Coffee addict | Looking for my partner in crime'
  ];
  
  const interests = ['Travel', 'Music', 'Food', 'Fitness', 'Reading', 'Movies', 'Art', 'Cooking', 'Photography', 'Yoga', 'Gaming', 'Dancing', 'Hiking', 'Wine', 'Coffee', 'Fashion', 'Tech', 'Gym', 'Cooking', 'Nature'];
  
  const prompts = [
    { question: 'My simple pleasure', answer: 'Morning coffee on the balcony' },
    { question: 'I\'m overly competitive about', answer: 'Board game nights' },
    { question: 'My type?', answer: 'Someone who makes me laugh' },
    { question: 'Ideal first date', answer: 'Something fun and adventurous' },
    { question: 'A fact about me', answer: 'I\'ve been to 15 countries!' },
    { question: 'My simple pleasure', answer: 'Street food at night markets 🌙' },
    { question: 'I\'m overly competitive about', answer: ' IPL cricket matches' },
    { question: 'My type?', answer: 'Someone who loves Bollywood & Netflix' }
  ];

  const allNames = [...indianNames];
  const allBios = [...indianBios, ...westernBios];
  
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Goa', 'Ahmedabad', 'New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Seattle'];

  // Generate 40 profiles - mix of Indian and Western
  return Array.from({ length: 40 }, (_, i) => {
    const isIndian = i < 30; // First 30 are Indian
    const isWomen = i % 2 === 0;
    const seed = isIndian ? 1000 + i : 2000 + (i - 30);
    
    // Use randomuser.me which has real-looking photos
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
      lastActive: Math.random() > 0.5 ? 'Now' : `${Math.floor(Math.random() * 24)}+h ago`
    };
  });
};

const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      isAuthenticated: false,
      
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

      // Profile Stats
      profileStats: {
        likes: 0,
        matches: 0,
        messages: 0,
        profileViews: 0
      },

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
          // Boost puts your profile at top of others' feeds
          // In real app, this would notify other users
        }
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

      login: (email, password) => {
        // For demo purposes, accept any valid email/password
        // In production, this would validate against a backend
        if (!email || !password || password.length < 6) {
          return false;
        }
        
        const user = {
          id: uuidv4(),
          email,
          name: 'You',
          age: 25,
          bio: 'Looking for something real',
          photos: ['https://randomuser.me/api/portraits/women/44.jpg'],
          interests: ['Music', 'Travel', 'Food'],
          prompts: [{ question: 'A fact about me', answer: 'Building this app!' }],
          location: 'Your Location',
          distance: 0,
          onboardingCompleted: true
        };
        set({ currentUser: user, isAuthenticated: true });
        get().fetchLocation();
        return true;
      },

      signup: (userData) => {
        const user = {
          id: uuidv4(),
          ...userData,
          matches: [],
          likes: [],
          onboardingCompleted: true
        };
        set({ currentUser: user, isAuthenticated: true });
        get().fetchLocation();
        return true;
      },

      logout: () => set({ currentUser: null, isAuthenticated: false }),

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

      updateUserPhoto: (photoUrl) => {
        set(state => ({
          currentUser: state.currentUser ? { ...state.currentUser, photos: [photoUrl, ...state.currentUser.photos] } : null
        }));
      }
    }),
    {
      name: 'muse-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        matchedProfiles: state.matchedProfiles,
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

export default useStore;
