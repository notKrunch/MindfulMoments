

class Auth {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.authStateListeners = [];
        this.init();
    }

    init() {
        const session = this.getSession();
        if (session) {
            this.currentUser = session.user;
            this.isAuthenticated = true;
            this.notifyAuthStateChange();
        }
    }

    getSession() {
        const session = localStorage.getItem('session');
        if (!session) return null;
        
        try {
            const parsedSession = JSON.parse(session);
            if (parsedSession.expiresAt && new Date(parsedSession.expiresAt) < new Date()) {
                this.clearSession();
                return null;
            }
            return parsedSession;
        } catch (error) {
            console.error('Error parsing session:', error);
            return null;
        }
    }

    setSession(user, expiresIn = 24 * 60 * 60 * 1000) { 
        const session = {
            user,
            expiresAt: new Date(Date.now() + expiresIn).toISOString()
        };
        localStorage.setItem('session', JSON.stringify(session));
        this.currentUser = user;
        this.isAuthenticated = true;
        this.notifyAuthStateChange();
    }

    clearSession() {
        localStorage.removeItem('session');
        this.currentUser = null;
        this.isAuthenticated = false;
        this.notifyAuthStateChange();
    }

    async login(email, password) {
        try {
            
            const user = {
                id: 'temp-id',
                email,
                name: email.split('@')[0],
                createdAt: new Date().toISOString()
            };

            this.setSession(user);
            return { success: true, user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Invalid credentials' };
        }
    }

    async signup(userData) {
        try {
            
            const user = {
                id: 'temp-id',
                ...userData,
                createdAt: new Date().toISOString()
            };

            this.setSession(user);
            return { success: true, user };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: 'Failed to create account' };
        }
    }

    async logout() {
        try {
            
            
            this.clearSession();
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: 'Failed to logout' };
        }
    }

    onAuthStateChange(listener) {
        this.authStateListeners.push(listener);
        listener(this.isAuthenticated, this.currentUser);
    }

    notifyAuthStateChange() {
        this.authStateListeners.forEach(listener => 
            listener(this.isAuthenticated, this.currentUser)
        );
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    async requestPasswordReset(email) {
        try {
            

            return { success: true };
        } catch (error) {
            console.error('Password reset request error:', error);
            return { success: false, error: 'Failed to request password reset' };
        }
    }

    async resetPassword(token, newPassword) {
        try {
            

            return { success: true };
        } catch (error) {
            console.error('Password reset error:', error);
            return { success: false, error: 'Failed to reset password' };
        }
    }
}

const auth = new Auth();
export default auth; 