import { type ReactNode } from 'react'

export interface ColumnProps {
    id: string
    step: number
    label: string
    count?: number
    children?: ReactNode
    onAddScene?: (step: number) => void
}

export interface ColumnState {
    disabled: boolean
    tooltipMessage: string
}

export interface ColumnHeaderProps {
    label: string
    count?: number
    onAddScene?: () => void
}

export interface ColumnContentProps {
    children?: ReactNode
    shouldVirtualize: boolean
    itemCount: number
    renderItem: (props: { index: number; style: React.CSSProperties }) => ReactNode
}

export interface ColumnTooltipProps {
    message: string
    isVisible: boolean
}

export interface VirtualizedListProps {
    itemCount: number
    itemHeight: number
    containerHeight: number
    renderItem: (props: { index: number; style: React.CSSProperties }) => ReactNode
} 