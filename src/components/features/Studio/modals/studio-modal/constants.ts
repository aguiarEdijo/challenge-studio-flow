import { getMinRecordingDate } from '../../../../../utils/date-validation'

export const DEFAULT_SCENE = {
    id: '',
    title: '',
    description: '',
    step: 1,
    columnId: 'column-1',
    episode: '',
    recordDate: getMinRecordingDate(),
    recordLocation: ''
}

export const FIELD_LABELS = {
    title: 'Título',
    description: 'Descrição',
    episode: 'Episódio',
    status: 'Status',
    recordDate: 'Data de Gravação',
    recordLocation: 'Local de Gravação'
}

export const FIELD_PLACEHOLDERS = {
    title: 'Digite o título da cena',
    description: 'Descreva a cena',
    episode: 'Digite o episódio',
    recordLocation: 'Digite o local de gravação'
}

export const VALIDATION_MESSAGES = {
    title: 'Título é obrigatório',
    description: 'Descrição é obrigatória',
    episode: 'Episódio é obrigatório',
    recordLocation: 'Local de gravação é obrigatório'
}

export const MODAL_TITLES = {
    edit: 'Editar Cena',
    create: 'Nova Cena'
}

export const BUTTON_LABELS = {
    cancel: 'Cancelar',
    save: 'Salvar',
    create: 'Criar',
    saving: 'Salvando...'
} 