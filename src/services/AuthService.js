/**
 * AuthService.js - Handles authentication operations
 * 
 * In a real application, this would interact with your backend API.
 * For this example, we're using localStorage for simplicity.
 */

// Mock user data - replace with API calls in production
const mockUsers = {
  user: { username: 'user', password: '1234', role: 'user' },
  admin: { username: 'admin', password: 'admin', role: 'admin' },
};

const AuthService = {
  /**
   * Authenticate a user with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise} - Resolves to user object or rejects with error
   */
  login: (username, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const user = mockUsers[username];
        
        if (user && user.password === password) {
          // Store authentication data
          localStorage.setItem('role', user.role);
          localStorage.setItem('username', username);
          resolve({ username, role: user.role });
        } else {
          reject(new Error('Invalid username or password'));
        }
      }, 800);
    });
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Resolves on success or rejects with error
   */
  register: (userData) => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        console.log('Registration data:', userData);
        // In a real app, you would call your API here
        resolve({ success: true });
      }, 1500);
    });
  },

  /**
   * Log out the current user
   */
  logout: () => {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = '/login';
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('role');
  },

  /**
   * Get current user's role
   * @returns {string|null} - User role or null if not authenticated
   */
  getUserRole: () => {
    return localStorage.getItem('role');
  },

  /**
   * Get current username
   * @returns {string|null} - Username or null if not authenticated
   */
  getUsername: () => {
    return localStorage.getItem('username');
  }
};

export default AuthService;