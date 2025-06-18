import type { Scene as SceneDetails } from '../../../../../types/index'

export type SceneForCreation = Omit<SceneDetails, 'id'>

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    scene?: SceneDetails
    onUpdate?: (scene: SceneDetails) => void
    onCreate?: (scene: SceneForCreation) => void
    isCreating?: boolean
}

export interface FormFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    error?: string
    placeholder?: string
    required?: boolean
    type?: 'text' | 'textarea' | 'date'
    rows?: number
    min?: string
}

export interface StepSelectorProps {
    value: number
    onChange: (value: number) => void
    originalStep?: number
    isEditMode: boolean
    validNextSteps: number[]
} 