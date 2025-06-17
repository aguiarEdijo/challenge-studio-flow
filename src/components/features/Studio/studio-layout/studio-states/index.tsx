import { StudioError } from "./states/studio-error"
import { StudioLoading } from "./states/studio-loading"


interface StudioStatesProps {
    isLoading: boolean
    productionsError?: Error | null
    scenesError?: Error | null
    children: React.ReactNode
}

export function StudioStates({ isLoading, productionsError, scenesError, children }: StudioStatesProps) {
    if (isLoading) {
        return <StudioLoading />
    }

    if (productionsError || scenesError) {
        return (
            <StudioError
                message={productionsError?.message || scenesError?.message || 'Erro desconhecido'}
            />
        )
    }

    return <>{children}</>
} 