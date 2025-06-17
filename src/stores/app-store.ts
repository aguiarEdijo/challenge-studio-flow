import { create } from 'zustand'
import { type Production } from '../types'

interface AppStore {
    // Estado de produção
    selectedProduction: Production | null
    selectProduction: (production: Production) => void
    deselectProduction: () => void

    // Estado de UI
    isLoading: boolean
    setLoading: (loading: boolean) => void

    // Estado de erros
    error: string | null
    setError: (error: string | null) => void
    clearError: () => void
}

export const useAppStore = create<AppStore>((set) => ({
    // Produção
    selectedProduction: null,
    selectProduction: (production) => set({ selectedProduction: production, error: null }),
    deselectProduction: () => set({ selectedProduction: null }),

    // Loading
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),

    // Erros
    error: null,
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
})) 