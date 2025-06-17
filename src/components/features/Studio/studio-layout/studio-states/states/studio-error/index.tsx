interface StudioErrorProps {
    message: string
}

export function StudioError({ message }: StudioErrorProps) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-lg text-red-500">
                Erro ao carregar dados: {message}
            </div>
        </div>
    )
} 