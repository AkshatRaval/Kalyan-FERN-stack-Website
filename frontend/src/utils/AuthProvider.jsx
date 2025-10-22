import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [userData, setUserData] = useState(null);
    const [userApplicationsData, setUserApplicationsData] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user)
            if (user) {
                try {

                    const userApplicationsRef = collection(db, 'userApplications');
                    const usersCollectionRef = collection(db, 'users');

                    const userq = query(usersCollectionRef, where("userId", "==", user.uid));
                    const appq = query(userApplicationsRef, where("userId", "==", user.uid));

                    const [userSnapshot, applicationsSnapshot] = await Promise.all([
                        getDocs(userq),
                        getDocs(appq)
                    ]);

                    if (!userSnapshot.empty) {
                        // There should only be one user doc, so getting the first is okay
                        const userData = userSnapshot.docs[0].data();
                        setUserData(userData);
                    } else {
                        console.warn("No user document found in Firestore for UID:", user.uid);
                        setUserData(null); // No custom data found
                    }

                    if (!applicationsSnapshot.empty) {
                        const allApplications = applicationsSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        setUserApplicationsData(allApplications);
                    } else {
                        console.log("No applications found for this user.");
                        setUserApplicationsData([]); // Set to an empty array if none are found
                    }
                } catch (error) {
                    console.error("Error fetching user data from Firestore:", error);
                    setUserData(null);
                    setUserApplicationsData([]);
                }
            } else {
                // 3. Clear profile data on logout
                setUserData(null);
                setUserApplicationsData([]);
                setCurrentUser(null);
            }
            setLoading(false)
        });
        return unsubscribe;
    }, [])

    const logout = () => signOut(auth);
    const value = {
        currentUser,
        userApplicationsData,
        loading,
        userData,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
