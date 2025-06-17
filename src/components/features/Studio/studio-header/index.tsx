import { ArrowLeftIcon } from 'lucide-react'
import { Button } from '../../../shared/button'
import Title from '../title'

interface StudioHeaderProps {
    onBack: () => void
}

/**
 * Componente do header do Studio
 * Exibe o título da produção e botão de voltar
 */
export function StudioHeader({ onBack }: StudioHeaderProps) {
    return (
        <div className='flex items-center gap-4'>
            <Button variant='outline' size='icon' onClick={onBack}>
                <ArrowLeftIcon />
            </Button>
            <Title />
        </div>
    )
} 