import { AlertCircleIcon } from 'lucide-react'

interface ErrorDisplayProps {
    error: string | null
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
    if (!error) return null

    return (
        <div className='mt-3 p-3 bg-red-50 border border-red-200 rounded-lg'>
            <div className='flex items-start gap-2'>
                <AlertCircleIcon className='h-4 w-4 text-red-600 mt-0.5 flex-shrink-0' />
                <div className='flex-1'>
                    <h4 className='text-xs font-medium text-red-800 mb-0.5'>Erro ao salvar</h4>
                    <p className='text-xs text-red-700'>{error}</p>
                </div>
            </div>
        </div>
    )
} 