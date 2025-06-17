import { Fragment } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { XIcon, ArrowRightIcon, CheckCircleIcon } from "lucide-react"
import { PRODUCTION_STEPS } from "../../../../utils/scene-transitions"

interface TransitionConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    sceneTitle: string
    fromStep: number
    toStep: number
    isConfirming?: boolean
}

export function TransitionConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    sceneTitle,
    fromStep,
    toStep,
    isConfirming = false
}: TransitionConfirmationModalProps) {
    const fromStepLabel = PRODUCTION_STEPS[fromStep as keyof typeof PRODUCTION_STEPS]
    const toStepLabel = PRODUCTION_STEPS[toStep as keyof typeof PRODUCTION_STEPS]

    const handleConfirm = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onConfirm()
    }

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onClose()
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
                                        Confirmar Transição
                                    </DialogTitle>
                                    <button
                                        onClick={handleClose}
                                        disabled={isConfirming}
                                        className='rounded-full p-1 hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                                    >
                                        <XIcon className='h-5 w-5 text-primary' />
                                    </button>
                                </div>

                                <div className='space-y-4'>
                                    {/* Ícone de confirmação */}
                                    <div className='flex justify-center'>
                                        <div className='rounded-full bg-green-100 p-3'>
                                            <CheckCircleIcon className='h-8 w-8 text-green-600' />
                                        </div>
                                    </div>

                                    {/* Informações da transição */}
                                    <div className='text-center space-y-2'>
                                        <h4 className='text-sm font-medium text-primary/70'>Cena</h4>
                                        <p className='text-primary font-medium'>{sceneTitle}</p>
                                    </div>

                                    {/* Visualização da transição */}
                                    <div className='bg-muted/50 rounded-lg p-4'>
                                        <div className='flex items-center justify-between'>
                                            <div className='text-center flex-1'>
                                                <p className='text-xs text-primary/60 mb-1'>De</p>
                                                <p className='text-sm font-medium text-primary'>{fromStepLabel}</p>
                                            </div>

                                            <div className='mx-4'>
                                                <ArrowRightIcon className='h-5 w-5 text-primary/60' />
                                            </div>

                                            <div className='text-center flex-1'>
                                                <p className='text-xs text-primary/60 mb-1'>Para</p>
                                                <p className='text-sm font-medium text-primary'>{toStepLabel}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mensagem de confirmação */}
                                    <div className='text-center'>
                                        <p className='text-sm text-primary/80'>
                                            Tem certeza que deseja mover esta cena para a próxima etapa?
                                        </p>
                                        <p className='text-xs text-primary/60 mt-1'>
                                            Esta ação não pode ser desfeita automaticamente.
                                        </p>
                                    </div>

                                    {/* Botões de ação */}
                                    <div className='mt-6 flex justify-end gap-3'>
                                        <button
                                            onClick={handleClose}
                                            disabled={isConfirming}
                                            className='rounded-md px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleConfirm}
                                            disabled={isConfirming}
                                            className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-accent hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer'
                                        >
                                            {isConfirming ? (
                                                <>
                                                    <div className='w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin' />
                                                    Confirmando...
                                                </>
                                            ) : (
                                                'Confirmar'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
} 