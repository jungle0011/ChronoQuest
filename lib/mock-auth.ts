interface User {
  uid: string
  email: string
  displayName?: string
}

type AuthStateListener = (user: User | null) => void

class MockAuth {
  private currentUser: User | null = null
  private listeners: AuthStateListener[] = []

  constructor() {
    // Check for existing session
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("mockAuth_user")
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser)
      }
    }
  }

  onAuthStateChanged(callback: AuthStateListener) {
    this.listeners.push(callback)
    // Immediately call with current state
    callback(this.currentUser)

    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentUser))
  }

  async signIn(email: string, password: string): Promise<User> {
    // Mock validation
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    // Create mock user
    const user: User = {
      uid: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      displayName: email.split("@")[0],
    }

    this.currentUser = user

    if (typeof window !== "undefined") {
      localStorage.setItem("mockAuth_user", JSON.stringify(user))
    }

    this.notifyListeners()
    return user
  }

  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    // Mock validation
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    // Create mock user
    const user: User = {
      uid: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      displayName: displayName || email.split("@")[0],
    }

    this.currentUser = user

    if (typeof window !== "undefined") {
      localStorage.setItem("mockAuth_user", JSON.stringify(user))
    }

    this.notifyListeners()
    return user
  }

  async signOut(): Promise<void> {
    this.currentUser = null

    if (typeof window !== "undefined") {
      localStorage.removeItem("mockAuth_user")
    }

    this.notifyListeners()
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }
}

export const mockAuth = new MockAuth()
