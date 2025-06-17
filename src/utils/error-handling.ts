// Função simples para tratar erros de forma amigável
export function getFriendlyErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        const message = error.message.toLowerCase()

        // Se contém "not found", é um erro 404
        if (message.includes('not found')) {
            return 'Cena não encontrada. Ela pode ter sido removida.'
        }

        // Se contém "network", é erro de rede
        if (message.includes('network') || message.includes('fetch')) {
            return 'Problema de conexão. Verifique sua internet.'
        }

        // Se contém "timeout", é erro de timeout
        if (message.includes('timeout')) {
            return 'A operação demorou muito. Tente novamente.'
        }

        // Se contém códigos de erro HTTP
        if (message.includes('404')) {
            return 'Cena não encontrada. Ela pode ter sido removida.'
        }
        if (message.includes('500')) {
            return 'Erro interno do servidor. Tente novamente.'
        }
        if (message.includes('400')) {
            return 'Dados inválidos. Verifique as informações.'
        }

        // Se é uma mensagem técnica, retorna uma genérica
        if (message.includes('erro ao') || message.includes('failed')) {
            return 'Ocorreu um erro. Tente novamente.'
        }
    }

    // Erro genérico
    return 'Ocorreu um erro inesperado. Tente novamente.'
}

// Função para tratar múltiplos erros
export function getFirstErrorMessage(...errors: (unknown | null | undefined)[]): string {
    for (const error of errors) {
        if (error) {
            return getFriendlyErrorMessage(error)
        }
    }
    return ''
} 