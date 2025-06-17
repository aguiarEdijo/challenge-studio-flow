import { useAppStore } from '../stores/app-store'
import { type Production } from '../types'

export function useProductionSelection() {
    const {
        selectedProduction,
        selectProduction,
        deselectProduction,
        error: storeError,
        clearError
    } = useAppStore()

    const handleSelectProduction = (production: Production) => {
        selectProduction(production)
    }

    const handleDeselectProduction = () => {
        deselectProduction()
    }

    return {
        selectedProduction,
        storeError,
        selectProduction: handleSelectProduction,
        deselectProduction: handleDeselectProduction,
        clearError
    }
} 