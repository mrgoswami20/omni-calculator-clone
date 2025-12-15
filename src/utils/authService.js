/**
 * Mock Authentication Service using LocalStorage
 * Simulates backend delays and persistence
 */

const USERS_KEY = 'omni_clone_users';
const CURRENT_USER_KEY = 'omni_clone_current_user';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
    /**
     * Register a new user
     * @param {string} email 
     * @param {string} password 
     * @param {string} name 
     */
    async signup(email, password, name) {
        await delay(800); // Simulate network latency

        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

        if (users.find(u => u.email === email)) {
            throw new Error('User with this email already exists');
        }

        const newUser = {
            id: Date.now().toString(),
            email,
            password, // In a real app, this should be hashed!
            name,
            avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Auto-login after signup
        this.setSession(newUser);
        return newUser;
    },

    /**
     * Log in an existing user
     * @param {string} email 
     * @param {string} password 
     */
    async login(email, password) {
        await delay(800);

        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        this.setSession(user);
        return user;
    },

    /**
     * Log out the current user
     */
    async logout() {
        await delay(300);
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    /**
     * Get the currently logged in user
     */
    getCurrentUser() {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    setSession(user) {
        // Don't store password in session
        const { password, ...safeUser } = user;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    }
};
