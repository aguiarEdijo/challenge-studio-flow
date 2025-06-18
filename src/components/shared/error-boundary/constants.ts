// Configurações de Error Boundary
export const ERROR_BOUNDARY_CONFIG = {
    MAX_RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 segundo
    ERROR_DISPLAY_TIMEOUT: 5000, // 5 segundos
} as const

// Classes CSS para Error Boundary
export const ERROR_BOUNDARY_CLASSES = {
    CONTAINER: 'flex flex-col items-center justify-center min-h-[200px] p-6 bg-background rounded-lg border border-destructive/20',
    OVERLAY: 'fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50',
    CARD: 'bg-card border border-border rounded-lg shadow-lg max-w-md w-full mx-4',
} as const

// Classes CSS para Error Display
export const ERROR_DISPLAY_CLASSES = {
    CONTAINER: 'flex flex-col items-center text-center p-6 space-y-4',
    ICON: 'w-16 h-16 text-destructive/60 mb-4',
    TITLE: 'text-lg font-semibold text-foreground',
    MESSAGE: 'text-sm text-muted-foreground leading-relaxed',
    DETAILS: 'text-xs text-muted-foreground/80 bg-muted p-3 rounded text-left font-mono max-h-32 overflow-y-auto',
    ACTIONS: 'flex gap-3 mt-6',
    BUTTON_PRIMARY: 'px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium',
    BUTTON_SECONDARY: 'px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium',
    BUTTON_DESTRUCTIVE: 'px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors text-sm font-medium',
} as const

// Classes CSS para Error Fallback
export const ERROR_FALLBACK_CLASSES = {
    CONTAINER: 'flex flex-col items-center justify-center min-h-[300px] p-8 bg-background rounded-lg border border-destructive/20',
    CONTENT: 'text-center space-y-4 max-w-md',
    ICON: 'w-20 h-20 text-destructive/60 mx-auto mb-6',
    TITLE: 'text-xl font-semibold text-foreground',
    MESSAGE: 'text-sm text-muted-foreground leading-relaxed',
    STACK_TRACE: 'text-xs text-muted-foreground/60 bg-muted p-4 rounded text-left font-mono max-h-40 overflow-y-auto mt-4',
    ACTIONS: 'flex gap-3 mt-8 justify-center',
} as const

// Mensagens padrão de erro
export const ERROR_MESSAGES = {
    DEFAULT_TITLE: 'Algo deu errado',
    DEFAULT_MESSAGE: 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.',
    NETWORK_ERROR: 'Erro de conexão',
    NETWORK_MESSAGE: 'Verifique sua conexão com a internet e tente novamente.',
    VALIDATION_ERROR: 'Erro de validação',
    VALIDATION_MESSAGE: 'Os dados fornecidos não são válidos. Verifique e tente novamente.',
    PERMISSION_ERROR: 'Erro de permissão',
    PERMISSION_MESSAGE: 'Você não tem permissão para realizar esta ação.',
    NOT_FOUND_ERROR: 'Recurso não encontrado',
    NOT_FOUND_MESSAGE: 'O recurso solicitado não foi encontrado.',
} as const

// Tipos de erro para categorização
export const ERROR_TYPES = {
    NETWORK: 'network',
    VALIDATION: 'validation',
    PERMISSION: 'permission',
    NOT_FOUND: 'not_found',
    UNKNOWN: 'unknown',
} as const 