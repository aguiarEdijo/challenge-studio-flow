import { Fragment, useState, useEffect, useCallback, useMemo } from "react"

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { XIcon, AlertCircleIcon } from "lucide-react"

import { Button } from '../../../shared/button'
import { Input } from '../../../shared/input'
import { type Scene as SceneDetails } from "../../../../types"
import { PRODUCTION_STEPS, getValidNextSteps, isLastStep } from "../../../../utils/scene-transitions"
import { isValidRecordingDate, getMinRecordingDate, getDateErrorMessage } from "../../../../utils/date-validation"

type SceneForCreation = Omit<SceneDetails, 'id'>

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  scene?: SceneDetails
  onUpdate?: (scene: SceneDetails) => void
  onCreate?: (scene: SceneForCreation) => void
  isCreating?: boolean
}

const Modal = ({ isOpen, onClose, scene, onUpdate, onCreate, isCreating = false }: ModalProps) => {
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
        setEditedScene({
          id: '', // ID temporário para o estado interno
          title: '',
          description: '',
          step: 1, // Começa na primeira etapa
          columnId: 'column-1',
          episode: '',
          recordDate: getMinRecordingDate(),
          recordLocation: ''
        })
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
      errors.title = 'Título é obrigatório'
    }

    if (!scene.description.trim()) {
      errors.description = 'Descrição é obrigatória'
    }

    if (!scene.episode.trim()) {
      errors.episode = 'Episódio é obrigatório'
    }

    if (!scene.recordLocation.trim()) {
      errors.recordLocation = 'Local de gravação é obrigatório'
    }

    if (dateError) {
      errors.recordDate = dateError
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
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
      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao salvar cena'
      setSaveError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  // Obtém as próximas etapas válidas baseadas no step ORIGINAL da cena
  const originalStep = scene?.step
  const validNextSteps = originalStep !== undefined ? getValidNextSteps(originalStep) : []

  const isEditMode = !isCreating && scene
  const modalTitle = isEditMode ? 'Editar Cena' : 'Nova Cena'

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all'>
                <div className='flex items-center justify-between mb-4'>
                  <DialogTitle as='h3' className='text-lg font-medium leading-6 text-primary'>
                    {modalTitle}
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className='rounded-full p-1 hover:bg-primary/10 transition-colors cursor-pointer'
                  >
                    <XIcon className='h-5 w-5 text-primary' />
                  </button>
                </div>

                {editedScene ? (
                  <div className='space-y-4'>
                    <div>
                      <h4 className='text-sm font-medium text-primary/70'>Título *</h4>
                      <input
                        type='text'
                        value={editedScene.title}
                        onChange={e => handleChange("title", e.target.value)}
                        className={`mt-1 w-full rounded-md border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 ${validationErrors.title ? 'border-red-500 focus:ring-red-500/50' : 'border-border'}`}
                        placeholder="Digite o título da cena"
                      />
                      {validationErrors.title && (
                        <p className='mt-1 text-xs text-red-600'>{validationErrors.title}</p>
                      )}
                    </div>

                    <div>
                      <h4 className='text-sm font-medium text-primary/70'>Descrição *</h4>
                      <textarea
                        value={editedScene.description}
                        onChange={e => handleChange("description", e.target.value)}
                        className={`mt-1 w-full rounded-md border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 ${validationErrors.description ? 'border-red-500 focus:ring-red-500/50' : 'border-border'}`}
                        rows={3}
                        placeholder="Descreva a cena"
                      />
                      {validationErrors.description && (
                        <p className='mt-1 text-xs text-red-600'>{validationErrors.description}</p>
                      )}
                    </div>

                    <div>
                      <h4 className='text-sm font-medium text-primary/70'>Episódio *</h4>
                      <input
                        type='text'
                        value={editedScene.episode}
                        onChange={e => handleChange("episode", e.target.value)}
                        className={`mt-1 w-full rounded-md border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 ${validationErrors.episode ? 'border-red-500 focus:ring-red-500/50' : 'border-border'}`}
                        placeholder="Digite o episódio"
                      />
                      {validationErrors.episode && (
                        <p className='mt-1 text-xs text-red-600'>{validationErrors.episode}</p>
                      )}
                    </div>

                    <div>
                      <h4 className='text-sm font-medium text-primary/70'>Status</h4>
                      {isEditMode && originalStep !== undefined && isLastStep(originalStep) ? (
                        <div className='mt-1 w-full rounded-md border border-border bg-muted px-3 py-2 text-muted-foreground'>
                          {PRODUCTION_STEPS[originalStep as keyof typeof PRODUCTION_STEPS]} (Finalizado)
                        </div>
                      ) : (
                        <select
                          value={editedScene.step}
                          onChange={e => handleChange("step", Number(e.target.value))}
                          className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50'
                        >
                          {isEditMode ? (
                            <>
                              {/* Mostra a etapa atual */}
                              <option value={originalStep}>
                                {originalStep !== undefined ? PRODUCTION_STEPS[originalStep as keyof typeof PRODUCTION_STEPS] : ''} (Atual)
                              </option>

                              {/* Mostra apenas as próximas etapas válidas baseadas no step original */}
                              {validNextSteps.map((step) => (
                                <option key={step} value={step}>
                                  {PRODUCTION_STEPS[step as keyof typeof PRODUCTION_STEPS]}
                                </option>
                              ))}
                            </>
                          ) : (
                            // Modo criação: mostra todas as etapas
                            Object.entries(PRODUCTION_STEPS).map(([step, label]) => (
                              <option key={step} value={Number(step)}>
                                {label}
                              </option>
                            ))
                          )}
                        </select>
                      )}
                    </div>

                    <div>
                      <h4 className='text-sm font-medium text-primary/70'>Data de Gravação</h4>
                      <input
                        type='date'
                        value={editedScene.recordDate}
                        min={getMinRecordingDate()}
                        onChange={e => handleChange("recordDate", e.target.value)}
                        className={`mt-1 w-full rounded-md border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 ${dateError || validationErrors.recordDate ? 'border-red-500 focus:ring-red-500/50' : 'border-border'}`}
                      />
                      {(dateError || validationErrors.recordDate) && (
                        <div className='mt-1 flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-md'>
                          <AlertCircleIcon className='h-4 w-4 text-red-600 mt-0.5 flex-shrink-0' />
                          <p className='text-xs text-red-800'>{dateError || validationErrors.recordDate}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className='text-sm font-medium text-primary/70'>Local de Gravação *</h4>
                      <input
                        type='text'
                        value={editedScene.recordLocation}
                        onChange={e => handleChange("recordLocation", e.target.value)}
                        className={`mt-1 w-full rounded-md border bg-background px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 ${validationErrors.recordLocation ? 'border-red-500 focus:ring-red-500/50' : 'border-border'}`}
                        placeholder="Digite o local de gravação"
                      />
                      {validationErrors.recordLocation && (
                        <p className='mt-1 text-xs text-red-600'>{validationErrors.recordLocation}</p>
                      )}
                    </div>

                    {/* Mensagem de erro de salvamento */}
                    {saveError && (
                      <div className='flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md'>
                        <AlertCircleIcon className='h-4 w-4 text-red-600 mt-0.5 flex-shrink-0' />
                        <div className='flex-1'>
                          <p className='text-sm font-medium text-red-800 mb-1'>Erro ao salvar</p>
                          <p className='text-xs text-red-700'>{saveError}</p>
                        </div>
                      </div>
                    )}

                    <div className='mt-6 flex justify-end gap-3'>
                      <button
                        onClick={onClose}
                        className='rounded-md px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 cursor-pointer'
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving || !!dateError || Object.keys(validationErrors).length > 0}
                        className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-accent hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                      >
                        {isSaving ? "Salvando..." : (isCreating ? "Criar" : "Salvar")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className='text-primary'>Nenhuma cena selecionada</p>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export { Modal, type SceneDetails }
