import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

export const firebaseAuth = {
  // Login with email/password
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      
      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email,
          name: userData?.name || user.displayName || 'User',
          age: userData?.age || 25,
          bio: userData?.bio || '',
          photos: userData?.photos || [user.photoURL || 'https://randomuser.me/api/portraits/women/44.jpg'],
          interests: userData?.interests || [],
          prompts: userData?.prompts || [],
          location: userData?.location || 'Your Location',
          distance: userData?.distance || 0,
          onboardingCompleted: userData?.onboardingCompleted !== false
        }
      };
    } catch (error) {
      console.error('Firebase login error:', error);
      return { success: false, error: error.message };
    }
  },

  // Signup with email/password
  signup: async (email, password, userData) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      if (userData.name) {
        await updateProfile(user, { displayName: userData.name });
      }

      // Save user data to Firestore
      const userDocData = {
        email: user.email,
        name: userData.name || 'User',
        age: userData.age || 25,
        bio: userData.bio || 'Looking for something real',
        photos: userData.photos || ['https://randomuser.me/api/portraits/women/44.jpg'],
        interests: userData.interests || ['Music', 'Travel', 'Food'],
        prompts: userData.prompts || [{ question: 'A fact about me', answer: '' }],
        location: userData.location || 'Your Location',
        distance: 0,
        onboardingCompleted: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), userDocData);

      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email,
          ...userDocData
        }
      };
    } catch (error) {
      console.error('Firebase signup error:', error);
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Firebase logout error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Listen to auth changes
  onAuthChange: (callback) => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;
        callback({
          id: user.uid,
          email: user.email,
          name: userData?.name || user.displayName || 'User',
          age: userData?.age || 25,
          bio: userData?.bio || '',
          photos: userData?.photos || [user.photoURL || 'https://randomuser.me/api/portraits/women/44.jpg'],
          interests: userData?.interests || [],
          prompts: userData?.prompts || [],
          location: userData?.location || 'Your Location',
          distance: userData?.distance || 0,
          onboardingCompleted: userData?.onboardingCompleted !== false
        });
      } else {
        callback(null);
      }
    });
  }
};
