import { useState, useEffect } from 'react'
import type { Scene as SceneDetails } from '../../../../../../types/index'
import type { SceneForCreation } from '../types'
import { DEFAULT_SCENE, VALIDATION_MESSAGES } from '../constants'
import { getDateErrorMessage, normalizeDate, maskDate } from '../../../../../../utils/date-validation'

interface UseSceneFormProps {
    isOpen: boolean
    scene?: SceneDetails
    isCreating?: boolean
}

export function useSceneForm({ isOpen, scene, isCreating = false }: UseSceneFormProps) {
    const [editedScene, setEditedScene] = useState<SceneDetails | undefined>(scene)
    const [isSaving, setIsSaving] = useState(false)
    const [dateError, setDateError] = useState<string | null>(null)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
    const [hasUserEditedDate, setHasUserEditedDate] = useState(false)

    // Reset do estado quando o modal abre/fecha ou quando a cena muda
    useEffect(() => {
        if (isOpen) {
            if (scene) {
                // Modo edição - converte a data para o formato com máscara se existir
                const maskedScene = {
                    ...scene,
                    recordDate: scene.recordDate ? maskDate(scene.recordDate) : ''
                }
                setEditedScene(maskedScene)

                // Valida a data existente na abertura do modal
                if (maskedScene.recordDate) {
                    const errorMessage = getDateErrorMessage(maskedScene.recordDate)
                    setDateError(errorMessage)
                }
            } else if (isCreating) {
                // Modo criação
                setEditedScene(DEFAULT_SCENE)
            }
            setSaveError(null)
            setValidationErrors({})
            setHasUserEditedDate(false)
        }
    }, [isOpen, scene, isCreating])

    const handleChange = (field: keyof SceneDetails, value: string | number) => {
        if (!editedScene) return

        if (field === "recordDate") {
            const maskedDate = value as string

            // Marca que o usuário editou o campo de data
            setHasUserEditedDate(true)

            // Atualiza o valor com máscara
            setEditedScene({ ...editedScene, [field]: maskedDate })

            // Valida a data e atualiza o erro
            const errorMessage = getDateErrorMessage(maskedDate)
            setDateError(errorMessage)

            // Limpa erro de validação do campo se existir
            if (validationErrors.recordDate) {
                setValidationErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors.recordDate
                    return newErrors
                })
            }
            return
        }

        setEditedScene({ ...editedScene, [field]: value })

        // Limpa erro de validação do campo
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const validateScene = (scene: SceneDetails): boolean => {
        const errors: Record<string, string> = {}

        if (!scene.title.trim()) {
            errors.title = VALIDATION_MESSAGES.title
        }

        if (!scene.description.trim()) {
            errors.description = VALIDATION_MESSAGES.description
        }

        if (!scene.episode.trim()) {
            errors.episode = VALIDATION_MESSAGES.episode
        }

        if (!scene.recordLocation.trim()) {
            errors.recordLocation = VALIDATION_MESSAGES.recordLocation
        }

        // Valida data se fornecida
        if (scene.recordDate) {
            const dateError = getDateErrorMessage(scene.recordDate)
            if (dateError) {
                errors.recordDate = dateError
            }
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSave = async (
        onCreate?: (scene: SceneForCreation) => void | Promise<void>,
        onUpdate?: (scene: SceneDetails) => void | Promise<void>,
        onClose?: () => void
    ) => {
        if (!editedScene) return

        // Valida os campos obrigatórios
        if (!validateScene(editedScene)) {
            return
        }

        setIsSaving(true)
        setSaveError(null)

        try {
            // Converte a data com máscara para o formato ISO antes de salvar
            const sceneToSave = {
                ...editedScene,
                recordDate: editedScene.recordDate ? normalizeDate(editedScene.recordDate) : ''
            }

            if (isCreating && onCreate) {
                // Modo criação - remove o ID temporário
                const { id, ...sceneForCreation } = sceneToSave
                await onCreate(sceneForCreation)
            } else if (onUpdate) {
                // Modo edição
                await onUpdate(sceneToSave)
            }
            onClose?.()
        } catch (err) {
            // Obtém mensagem amigável
            const friendlyMessage = err instanceof Error ? err.message : 'Erro ao salvar cena'
            setSaveError(friendlyMessage)
        } finally {
            setIsSaving(false)
        }
    }

    return {
        editedScene,
        isSaving,
        dateError,
        saveError,
        validationErrors,
        handleChange,
        handleSave
    }
} 