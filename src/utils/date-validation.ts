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

    // Converte a data string para um timestamp de meia-noite
    const selectedTimestamp = new Date(dateString + 'T00:00:00').getTime()

    // Obtém o timestamp de meia-noite de hoje
    const today = new Date()
    const todayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()

    return selectedTimestamp >= todayTimestamp
}

/**
 * Obtém a data mínima permitida (hoje)
 * @returns Data mínima no formato YYYY-MM-DD
 */
export function getMinRecordingDate(): string {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
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