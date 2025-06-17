/**
 * Utilitário para validação de datas
 */

/**
 * Verifica se uma data é válida (não é no passado)
 * @param dateString - Data em formato string (YYYY-MM-DD)
 * @returns true se a data é válida (hoje ou no futuro)
 */
export function isValidRecordingDate(dateString: string): boolean {
    if (!dateString) return true // Permite campo vazio

    const selectedDate = new Date(dateString)
    const today = new Date()

    // Remove o horário para comparar apenas as datas
    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)

    return selectedDate >= today
}

/**
 * Obtém a data mínima permitida (hoje)
 * @returns Data mínima no formato YYYY-MM-DD
 */
export function getMinRecordingDate(): string {
    const today = new Date()
    return today.toISOString().split('T')[0]
}

/**
 * Obtém uma mensagem de erro para data inválida
 * @param dateString - Data em formato string
 * @returns Mensagem de erro ou null se a data for válida
 */
export function getDateErrorMessage(dateString: string): string | null {
    if (!dateString) return null

    if (!isValidRecordingDate(dateString)) {
        return 'A data de gravação deve ser hoje ou uma data futura'
    }

    return null
}

/**
 * Formata uma data para exibição
 * @param dateString - Data em formato string
 * @returns Data formatada para exibição
 */
export function formatDateForDisplay(dateString: string): string {
    if (!dateString) return ''

    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
} 