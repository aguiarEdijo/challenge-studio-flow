// Configurações de virtualização
export const VIRTUALIZATION_CONFIG = {
    ITEM_HEIGHT: 90, // Altura aproximada de cada cena + margem
    CONTAINER_HEIGHT: 600, // Altura máxima do container
    VIRTUALIZATION_THRESHOLD: 10, // Número mínimo de itens para ativar virtualização
    OVERSCAN_COUNT: 5, // Número de itens extras renderizados para scroll suave
} as const

// Classes CSS para estados da coluna
export const COLUMN_CLASSES = {
    BASE: 'flex flex-col bg-secondary rounded-lg min-w-[15rem] max-w-[15rem] flex-1 relative overflow-hidden',
    MAX_HEIGHT: 'max-h-[calc(100vh-11rem)]',
    OVER: 'ring-2 ring-primary/50',
    DISABLED: 'opacity-50 cursor-not-allowed',
    CONTENT: 'flex-1 overflow-y-auto px-1 py-1 column-scroll',
    CONTENT_MAX_HEIGHT: 'max-h-[calc(100vh-12rem)]',
} as const

// Classes CSS para o header da coluna
export const HEADER_CLASSES = {
    BASE: 'flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/95 backdrop-blur-sm sticky top-0 z-10 max-h-[calc(100vh-11rem)] mb-2',
    LABEL: 'font-semibold text-primary',
    COUNT: 'text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full',
    ADD_BUTTON: 'text-lg font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer p-1 rounded hover:bg-primary/10',
} as const

// Classes CSS para o tooltip
export const TOOLTIP_CLASSES = {
    BASE: 'absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center pointer-events-none',
    MESSAGE: 'text-xs text-primary bg-background px-2 py-1 rounded shadow-sm',
} as const

// Classes CSS para itens virtualizados
export const VIRTUALIZED_ITEM_CLASSES = {
    BASE: 'px-1 pb-2',
} as const

// Classes CSS para lista não virtualizada
export const REGULAR_LIST_CLASSES = {
    BASE: 'space-y-2',
} as const 