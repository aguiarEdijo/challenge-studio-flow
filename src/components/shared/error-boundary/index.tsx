import { Component } from 'react'
import { ErrorFallback } from './components'
import type { ErrorBoundaryProps, ErrorBoundaryState } from './types'

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        }
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return {
            hasError: true,
            error,
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        })

        // Chama callback de erro se fornecido
        if (this.props.onError) {
            this.props.onError(error, errorInfo)
        }
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        // Reset do erro quando resetKey muda
        if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
            })
        }
    }

    resetError = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        })
    }

    render() {
        if (this.state.hasError) {
            // Renderiza fallback customizado se fornecido
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Renderiza fallback padrão
            return (
                <ErrorFallback
                    error={this.state.error!}
                    errorInfo={this.state.errorInfo || undefined}
                    resetError={this.resetError}
                />
            )
        }

        return this.props.children
    }
} 