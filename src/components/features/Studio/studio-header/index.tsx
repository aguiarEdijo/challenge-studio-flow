import { ArrowLeftIcon } from 'lucide-react'
import { Button } from '../../../shared/button'

interface StudioHeaderProps {
    onBack: () => void
}

/**
 * Componente do header do Studio
 * Exibe o título da produção e botão de voltar
 */
export function StudioHeader({ onBack }: StudioHeaderProps) {
    return (
        <div className="flex items-center gap-4 mb-4 mt-2">
            <Button variant='outline' size='icon' onClick={onBack}>
                <ArrowLeftIcon />
            </Button>
            <h1 className="text-2xl font-extrabold text-primary tracking-tight" style={{ letterSpacing: '0.01em' }}>
                Renascer
            </h1>
        </div>
    )
} 