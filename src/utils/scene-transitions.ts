/**
 * Define as etapas do fluxo de produção e suas transições válidas
 */
export const PRODUCTION_STEPS = {
    1: 'Roteirizado',
    2: 'Em pré-produção',
    3: 'Em gravação',
    4: 'Em pós-produção',
    5: 'Finalizado',
} as const

export type StepNumber = keyof typeof PRODUCTION_STEPS
export type StepLabel = typeof PRODUCTION_STEPS[StepNumber]

/**
 * Resultado da validação de transição com mensagem explicativa
 */
export interface TransitionResult {
    isValid: boolean
    message: string
    canAdvance: boolean
    canGoBack: boolean
}

/**
 * Verifica se uma transição de etapa é válida e retorna mensagem explicativa
 * @param fromStep - Etapa atual
 * @param toStep - Etapa de destino
 * @returns Objeto com validação e mensagem explicativa
 */
export function validateTransition(fromStep: number, toStep: number): TransitionResult {
    // Se está tentando ir para a mesma etapa
    if (fromStep === toStep) {
        return {
            isValid: false,
            message: 'A cena já está nesta etapa',
            canAdvance: false,
            canGoBack: false,
        }
    }

    // Se está tentando voltar
    if (toStep < fromStep) {
        return {
            isValid: false,
            message: 'Não é possível voltar etapas. O fluxo de produção só permite avançar.',
            canAdvance: true,
            canGoBack: false,
        }
    }

    // Se está tentando pular etapas
    if (toStep > fromStep + 1) {
        const nextStep = fromStep + 1
        const nextStepLabel = PRODUCTION_STEPS[nextStep as keyof typeof PRODUCTION_STEPS]
        return {
            isValid: false,
            message: `Não é possível pular etapas. A próxima etapa válida é "${nextStepLabel}".`,
            canAdvance: true,
            canGoBack: false,
        }
    }

    // Se está tentando avançar para a próxima etapa válida
    if (toStep === fromStep + 1) {
        return {
            isValid: true,
            message: 'Transição válida',
            canAdvance: true,
            canGoBack: false,
        }
    }

    return {
        isValid: false,
        message: 'Transição inválida',
        canAdvance: false,
        canGoBack: false,
    }
}

/**
 * Verifica se uma transição de etapa é válida (método simplificado para compatibilidade)
 * @param fromStep - Etapa atual
 * @param toStep - Etapa de destino
 * @returns true se a transição é válida
 */
export function isValidTransition(fromStep: number, toStep: number): boolean {
    return validateTransition(fromStep, toStep).isValid
}

/**
 * Obtém as próximas etapas válidas para uma etapa atual
 * @param currentStep - Etapa atual
 * @returns Array com as próximas etapas válidas
 */
export function getValidNextSteps(currentStep: number): number[] {
    const nextStep = currentStep + 1
    return nextStep <= 5 ? [nextStep] : []
}

/**
 * Verifica se uma etapa é a última do fluxo
 * @param step - Etapa a ser verificada
 * @returns true se é a última etapa
 */
export function isLastStep(step: number): boolean {
    return step === 5
}

/**
 * Verifica se uma etapa é a primeira do fluxo
 * @param step - Etapa a ser verificada
 * @returns true se é a primeira etapa
 */
export function isFirstStep(step: number): boolean {
    return step === 1
}

/**
 * Obtém uma mensagem amigável para quando não há próximas etapas
 * @param currentStep - Etapa atual
 * @returns Mensagem explicativa
 */
export function getNoNextStepsMessage(currentStep: number): string {
    if (isLastStep(currentStep)) {
        return 'Esta cena já está finalizada. Não há próximas etapas disponíveis.'
    }

    const currentStepLabel = PRODUCTION_STEPS[currentStep as keyof typeof PRODUCTION_STEPS]
    return `A cena está em "${currentStepLabel}". Aguarde a conclusão desta etapa para avançar.`
} 