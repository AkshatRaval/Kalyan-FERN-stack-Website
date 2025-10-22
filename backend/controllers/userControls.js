import { db } from '../utils/firebaseConfig.js';

export const getAllUsers = async (req, res) => {
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No users found.' });
        }

        let users = [];
        snapshot.forEach(doc => {
            users.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json({
            message: 'Successfully retrieved Users.',
            data: users
        });

    } catch (error) {
        console.error('Error fetching Users:', error);
        res.status(500).json({ error: 'Failed to fetch Users.' });
    }
};


export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const userRef = db.collection('users').doc(id);
        const doc = await userRef.get()

        if (!doc.exists) {
            return res.status(404).json({ message: 'User Not found.' });
        }

        res.status(200).json({
            message: 'Successfully retrieved User.',
            data: {
                id: doc.id,
                ...doc.data()
            }
        });

    } catch (error) {
        console.error('Error fetching Users:', error);
        res.status(500).json({ error: 'Failed to fetch Users.' });
    }
};

