import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { VIRTUALIZATION_CONFIG } from '../constants'

interface UseVirtualizationProps {
    children?: ReactNode
}

export const useVirtualization = ({ children }: UseVirtualizationProps) => {
    // Determina se deve usar virtualização baseado no número de itens
    const shouldVirtualize = useMemo(() => {
        return Array.isArray(children) && children.length > VIRTUALIZATION_CONFIG.VIRTUALIZATION_THRESHOLD
    }, [children])

    const itemCount = useMemo(() => {
        return Array.isArray(children) ? children.length : 1
    }, [children])

    // Calcula a altura da lista virtualizada
    const listHeight = useMemo(() => {
        return Math.min(
            VIRTUALIZATION_CONFIG.CONTAINER_HEIGHT,
            Math.max(200, itemCount * VIRTUALIZATION_CONFIG.ITEM_HEIGHT)
        )
    }, [itemCount])

    return {
        shouldVirtualize,
        itemCount,
        listHeight,
        itemHeight: VIRTUALIZATION_CONFIG.ITEM_HEIGHT,
        overscanCount: VIRTUALIZATION_CONFIG.OVERSCAN_COUNT,
    }
} 