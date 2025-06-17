export interface Production {
    id: string
    name: string
    description?: string
}

export interface Scene {
    id: string
    title: string
    description: string
    step: number
    columnId: string
    episode: string
    recordDate: string
    recordLocation: string
} 