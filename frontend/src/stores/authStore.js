import { create } from 'zustand'
import { getToken, getRole, getUser, saveToken, saveRole, saveUser, removeToken } from '../utils/auth'

/**
 * Global auth + user state store using Zustand.
 * Eliminates prop drilling and duplicate API calls across pages.
 */
const useAuthStore = create((set) => ({
  // ── State ─────────────────────────────────────────────────────────────
  token: getToken(),
  role: getRole(),
  user: getUser(),
  isAuthenticated: !!getToken(),

  // ── Actions ───────────────────────────────────────────────────────────
  login: (token, role, user) => {
    saveToken(token)
    saveRole(role)
    saveUser(user)
    set({ token, role, user, isAuthenticated: true })
  },

  logout: () => {
    removeToken()
    set({ token: null, role: null, user: null, isAuthenticated: false })
  },

  // ── Role Checks ───────────────────────────────────────────────────────
  isStudent: () => getRole() === 'student',
  isFaculty: () => {
    const r = getRole()
    return r === 'faculty' || r === 'hod'
  },
  isAdmin: () => getRole() === 'admin',
}))

export default useAuthStore
