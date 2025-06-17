import { ArrowLeftIcon } from 'lucide-react'
import { Button } from '../../../../shared/button'
import { useAppStore } from '../../../../../stores/app-store';

interface StudioHeaderProps {
    onBack: () => void
}

export function StudioHeader({ onBack }: StudioHeaderProps) {
    const { selectedProduction } = useAppStore();
    return (
        <div className="flex items-center gap-4 mb-4 mt-2">
            <Button variant='outline' size='icon' onClick={onBack}>
                <ArrowLeftIcon />
            </Button>
            <h1 className="text-2xl font-extrabold text-primary tracking-tight" style={{ letterSpacing: '0.01em' }}>
                {selectedProduction?.name}
            </h1>
        </div>
    )
} 