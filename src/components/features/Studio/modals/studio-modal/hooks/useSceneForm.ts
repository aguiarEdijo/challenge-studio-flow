import { useState, useEffect } from 'react'
import type { Scene as SceneDetails } from '../../../../../../types/index'
import type { SceneForCreation } from '../types'
import { DEFAULT_SCENE, VALIDATION_MESSAGES } from '../constants'
import { getDateErrorMessage } from '../../../../../../utils/date-validation'

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

    // Reset do estado quando o modal abre/fecha ou quando a cena muda
    useEffect(() => {
        if (isOpen) {
            if (scene) {
                // Modo edição
                setEditedScene({ ...scene })
            } else if (isCreating) {
                // Modo criação
                setEditedScene(DEFAULT_SCENE)
            }
            setDateError(null)
            setSaveError(null)
            setValidationErrors({})
        }
    }, [isOpen, scene, isCreating])

    const handleChange = (field: keyof SceneDetails, value: string | number) => {
        if (!editedScene) return

        if (field === "recordDate") {
            const dateValue = value as string
            setEditedScene({ ...editedScene, [field]: dateValue })

            // Valida a data e atualiza o erro
            const errorMessage = getDateErrorMessage(dateValue)
            setDateError(errorMessage)
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

        if (dateError) {
            errors.recordDate = dateError
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
            if (isCreating && onCreate) {
                // Modo criação - remove o ID temporário
                const { id, ...sceneForCreation } = editedScene
                await onCreate(sceneForCreation)
            } else if (onUpdate) {
                // Modo edição
                await onUpdate(editedScene)
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