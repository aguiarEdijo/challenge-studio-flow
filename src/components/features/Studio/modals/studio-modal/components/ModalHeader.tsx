import { DialogTitle } from '@headlessui/react'
import { XIcon } from 'lucide-react'

interface ModalHeaderProps {
    title: string
    onClose: () => void
}

export function ModalHeader({ title, onClose }: ModalHeaderProps) {
    return (
        <div className='flex items-center justify-between mb-4'>
            <DialogTitle as='h3' className='text-base font-semibold text-primary'>
                {title}
            </DialogTitle>
            <button
                onClick={onClose}
                className='rounded-full p-1.5 hover:bg-primary/10 transition-colors cursor-pointer group'
                aria-label="Fechar modal"
            >
                <XIcon className='h-4 w-4 text-primary group-hover:text-primary/80 transition-colors' />
            </button>
        </div>
    )
} 