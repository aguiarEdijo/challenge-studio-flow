import { Fragment } from "react"
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"

import { useSceneForm } from './hooks/useSceneForm'
import {
  ModalHeader,
  FormField,
  StepSelector,
  ModalActions,
  ErrorDisplay
} from './components'
import { FIELD_LABELS, FIELD_PLACEHOLDERS, MODAL_TITLES } from './constants'
import { getValidNextSteps } from '../../../../../utils/scene-transitions'
import { getMinRecordingDate } from '../../../../../utils/date-validation'
import type { ModalProps } from './types'

const Modal = ({
  isOpen,
  onClose,
  scene,
  onUpdate,
  onCreate,
  isCreating = false
}: ModalProps) => {
  const {
    editedScene,
    isSaving,
    dateError,
    saveError,
    validationErrors,
    handleChange,
    handleSave
  } = useSceneForm({ isOpen, scene, isCreating })

  // Obtém as próximas etapas válidas baseadas no step ORIGINAL da cena
  const originalStep = scene?.step
  const validNextSteps = originalStep !== undefined ? getValidNextSteps(originalStep) : []

  const isEditMode = !isCreating && !!scene
  const modalTitle = isEditMode ? MODAL_TITLES.edit : MODAL_TITLES.create
  const hasErrors = !!dateError || Object.keys(validationErrors).length > 0

  const handleSaveClick = () => {
    handleSave(onCreate, onUpdate, onClose)
  }

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
          <div className='fixed inset-0 bg-black/40 backdrop-blur-sm' />
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
              <DialogPanel className='w-full max-w-lg transform overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-2xl transition-all'>
                <ModalHeader title={modalTitle} onClose={onClose} />

                {editedScene ? (
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        label={FIELD_LABELS.title}
                        value={editedScene.title}
                        onChange={value => handleChange("title", value)}
                        error={validationErrors.title}
                        placeholder={FIELD_PLACEHOLDERS.title}
                        required
                      />

                      <FormField
                        label={FIELD_LABELS.episode}
                        value={editedScene.episode}
                        onChange={value => handleChange("episode", value)}
                        error={validationErrors.episode}
                        placeholder={FIELD_PLACEHOLDERS.episode}
                        required
                      />
                    </div>

                    <FormField
                      label={FIELD_LABELS.description}
                      value={editedScene.description}
                      onChange={value => handleChange("description", value)}
                      error={validationErrors.description}
                      placeholder={FIELD_PLACEHOLDERS.description}
                      type="textarea"
                      rows={3}
                      required
                    />

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <StepSelector
                        value={editedScene.step}
                        onChange={value => handleChange("step", value)}
                        originalStep={originalStep}
                        isEditMode={isEditMode}
                        validNextSteps={validNextSteps}
                      />

                      <FormField
                        label={FIELD_LABELS.recordDate}
                        value={editedScene.recordDate}
                        onChange={value => handleChange("recordDate", value)}
                        error={dateError || undefined}
                        type="date"
                        min={getMinRecordingDate()}
                      />
                    </div>

                    <FormField
                      label={FIELD_LABELS.recordLocation}
                      value={editedScene.recordLocation}
                      onChange={value => handleChange("recordLocation", value)}
                      error={validationErrors.recordLocation}
                      placeholder={FIELD_PLACEHOLDERS.recordLocation}
                      required
                    />

                    <ErrorDisplay error={saveError} />

                    <ModalActions
                      onCancel={onClose}
                      onSave={handleSaveClick}
                      isSaving={isSaving}
                      isCreating={!!isCreating}
                      hasErrors={hasErrors}
                    />
                  </div>
                ) : (
                  <div className='text-center py-6'>
                    <p className='text-xs text-primary/60'>Nenhuma cena selecionada</p>
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export { Modal }
