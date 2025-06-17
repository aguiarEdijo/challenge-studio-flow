import { PlayIcon } from 'lucide-react'
import { Card } from '../../../shared/card'
import { type Production } from '../../../../types'

interface ProductionListProps {
    productions: Production[]
    onSelectProduction: (production: Production) => void
}

/**
 * Componente para exibir a lista de produções disponíveis
 * Permite selecionar uma produção para visualizar suas cenas
 */
export function ProductionList({ productions, onSelectProduction }: ProductionListProps) {
    return (
        <div className='w-screen bg-background p-4 flex flex-col gap-4'>
            <div className='flex flex-wrap gap-4'>
                {productions.map((production) => (
                    <Card
                        key={production.id}
                        icon={<PlayIcon />}
                        title={production.name}
                        subtitle={production.description}
                        quickLinks={[
                            {
                                label: 'Ir para produção',
                                onClick: () => onSelectProduction(production),
                            },
                        ]}
                    />
                ))}
            </div>
        </div>
    )
} 