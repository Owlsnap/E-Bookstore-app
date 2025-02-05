import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase.config';







const AuthContext = createContext();
export const useAuth = () => {
    return useContext(AuthContext);
};

//authProvider
export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const registerUser = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setCurrentUser(userCredential.user);
            return userCredential;
        } catch (error) {
            console.error("Error creating user:", error.message);
            // Handle specific error codes if needed
            if (error.code === 'auth/invalid-email') {
                console.error("Invalid email format.");
            } else if (error.code === 'auth/weak-password') {
                console.error("Password is too weak.");
            }
            // Add more error handling as needed
        }
    }
    // Login user
    const loginUser = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password);
    }

    //sign in or sign up with google
    const signInWithGoogle = async () => {
        // Create a new Google provider
        const provider = new GoogleAuthProvider();
        // Sign in with the provider
        return await signInWithPopup(auth, provider);
    }

    //logout user
    const logout = () => {
        return signOut(auth);
    };

    //manage user state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);

            if (user) {
                const {email, displayName, photoURL} = user;
                const userData = {
                    email, username: displayName, photo: photoURL
                }
            } else {
                
            }
        });
        return () => unsubscribe();
    }, [])

    const value = {
        currentUser,
        loading,
        registerUser,
        loginUser,
        signInWithGoogle,
        logout
    };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
