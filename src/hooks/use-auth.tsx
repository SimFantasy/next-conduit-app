import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
	authUser: any | null
	isAuth: boolean
	setAuthUser: (user: any) => void
	clearAuthUser: () => void
}

export const useAuth = create<AuthState>()(set => ({
	authUser: null,
	isAuth: false,
	setAuthUser: user => set({ authUser: user, isAuth: !!user }),
	clearAuthUser: () => set({ authUser: null, isAuth: false })
}))
