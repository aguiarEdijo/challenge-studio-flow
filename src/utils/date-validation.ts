/**
 * Utilitário para validação e formatação de datas
 */

/**
 * Aplica máscara de data no formato DD/MM/AAAA
 * @param value - Valor digitado pelo usuário
 * @returns Valor com máscara aplicada
 */
export function applyDateMask(value: string): string {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')

    // Limita a 8 dígitos (DDMMAAAA)
    const limitedNumbers = numbers.slice(0, 8)

    // Aplica a máscara
    if (limitedNumbers.length <= 2) {
        return limitedNumbers
    } else if (limitedNumbers.length <= 4) {
        return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(2)}`
    } else {
        return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(2, 4)}/${limitedNumbers.slice(4)}`
    }
}

/**
 * Converte data do formato DD/MM/AAAA para YYYY-MM-DD
 * @param maskedDate - Data com máscara (DD/MM/AAAA)
 * @returns Data no formato YYYY-MM-DD ou string vazia se inválida
 */
export function unmaskDate(maskedDate: string): string {
    if (!maskedDate) return ''

    // Remove a máscara e pega apenas os números
    const numbers = maskedDate.replace(/\D/g, '')

    // Verifica se tem 8 dígitos
    if (numbers.length !== 8) return ''

    const day = numbers.slice(0, 2)
    const month = numbers.slice(2, 4)
    const year = numbers.slice(4, 8)

    // Valida se é uma data válida
    const date = new Date(`${year}-${month}-${day}T00:00:00`)
    const isValidDate = !isNaN(date.getTime()) &&
        date.getDate() === parseInt(day) &&
        date.getMonth() === parseInt(month) - 1 &&
        date.getFullYear() === parseInt(year)

    if (!isValidDate) return ''

    return `${year}-${month}-${day}`
}

/**
 * Converte data do formato YYYY-MM-DD para DD/MM/AAAA
 * @param isoDate - Data no formato YYYY-MM-DD
 * @returns Data no formato DD/MM/AAAA ou string vazia se inválida
 */
export function maskDate(isoDate: string): string {
    if (!isoDate) return ''

    // Verifica se está no formato correto
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(isoDate)) return ''

    const [year, month, day] = isoDate.split('-')

    // Valida se é uma data válida
    const date = new Date(`${year}-${month}-${day}T00:00:00`)
    const isValidDate = !isNaN(date.getTime()) &&
        date.getDate() === parseInt(day) &&
        date.getMonth() === parseInt(month) - 1 &&
        date.getFullYear() === parseInt(year)

    if (!isValidDate) return ''

    return `${day}/${month}/${year}`
}

/**
 * Verifica se uma data com máscara é válida
 * @param maskedDate - Data no formato DD/MM/AAAA
 * @returns true se a data é válida
 */
export function isValidMaskedDate(maskedDate: string): boolean {
    if (!maskedDate) return true // Permite campo vazio

    const isoDate = unmaskDate(maskedDate)
    return isoDate !== ''
}

/**
 * Verifica se uma data é válida e não é no passado
 * @param maskedDate - Data no formato DD/MM/AAAA
 * @returns true se a data é válida e não é no passado
 */
export function isValidRecordingDate(maskedDate: string): boolean {
    if (!maskedDate) return true // Permite campo vazio

    const isoDate = unmaskDate(maskedDate)
    if (!isoDate) return false

    // Converte a data para timestamp de meia-noite (UTC)
    const selectedDate = new Date(isoDate + 'T00:00:00Z')
    const selectedTimestamp = selectedDate.getTime()

    // Obtém o timestamp de meia-noite de hoje (UTC)
    const today = new Date()
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
    const todayTimestamp = todayUTC.getTime()

    return selectedTimestamp >= todayTimestamp
}

/**
 * Obtém a data mínima permitida (hoje) no formato DD/MM/AAAA
 * @returns Data mínima no formato DD/MM/AAAA
 */
export function getMinRecordingDate(): string {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    return `${day}/${month}/${year}`
}

/**
 * Obtém uma mensagem de erro para data inválida
 * @param maskedDate - Data no formato DD/MM/AAAA
 * @returns Mensagem de erro ou null se a data for válida
 */
export function getDateErrorMessage(maskedDate: string): string | null {
    if (!maskedDate) return null

    // Verifica se o formato é válido
    if (!isValidMaskedDate(maskedDate)) {
        return 'Data inválida. Use o formato DD/MM/AAAA'
    }

    // Verifica se não é no passado
    if (!isValidRecordingDate(maskedDate)) {
        return 'A data de gravação deve ser hoje ou uma data futura'
    }

    return null
}

/**
 * Normaliza uma data para o formato YYYY-MM-DD
 * @param dateString - Data em qualquer formato
 * @returns Data normalizada ou string vazia se inválida
 */
export function normalizeDate(dateString: string): string {
    if (!dateString) return ''

    // Se já está no formato YYYY-MM-DD, retorna
    const isoRegex = /^\d{4}-\d{2}-\d{2}$/
    if (isoRegex.test(dateString)) {
        return dateString
    }

    // Se está no formato DD/MM/AAAA, converte
    const maskedRegex = /^\d{2}\/\d{2}\/\d{4}$/
    if (maskedRegex.test(dateString)) {
        return unmaskDate(dateString)
    }

    // Tenta converter de outros formatos
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
        return ''
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

/**
 * Formata uma data para exibição
 * @param dateString - Data em formato string
 * @returns Data formatada para exibição
 */
export function formatDateForDisplay(dateString: string): string {
    if (!dateString) return ''

    // Se está no formato DD/MM/AAAA, retorna como está
    const maskedRegex = /^\d{2}\/\d{2}\/\d{4}$/
    if (maskedRegex.test(dateString)) {
        return dateString
    }

    // Converte de YYYY-MM-DD para DD/MM/AAAA
    const isoRegex = /^\d{4}-\d{2}-\d{2}$/
    if (isoRegex.test(dateString)) {
        return maskDate(dateString)
    }

    // Tenta converter de outros formatos
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
        return ''
    }

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
} 