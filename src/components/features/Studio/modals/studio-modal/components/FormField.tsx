import { cn } from '../../../../../../utils/cn'
import { applyDateMask } from '../../../../../../utils/date-validation'
import type { FormFieldProps } from '../types'

export function FormField({
    label,
    value,
    onChange,
    error,
    placeholder,
    required = false,
    type = 'text',
    rows = 3,
    min
}: FormFieldProps) {
    const inputId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`
    const hasError = !!error

    const inputClasses = cn(
        'mt-1.5 w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-primary',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50',
        'transition-all duration-200 placeholder:text-muted-foreground/60',
        hasError
            ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500/50'
            : 'border-border hover:border-primary/30'
    )

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value

        // Se o campo está vazio, permite
        if (!inputValue) {
            onChange('')
            return
        }

        // Aplica a máscara
        const maskedValue = applyDateMask(inputValue)

        // Atualiza o valor com a máscara aplicada
        onChange(maskedValue)
    }

    const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Permite apenas números, backspace, delete, tab, enter, setas e /
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End'
        ]

        const isNumber = /^\d$/.test(e.key)
        const isSlash = e.key === '/'
        const isAllowedKey = allowedKeys.includes(e.key)

        if (!isNumber && !isSlash && !isAllowedKey) {
            e.preventDefault()
        }
    }

    const renderInput = () => {
        if (type === 'textarea') {
            return (
                <textarea
                    id={inputId}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={inputClasses}
                    rows={rows}
                    placeholder={placeholder}
                />
            )
        }

        if (type === 'date') {
            return (
                <input
                    id={inputId}
                    type="text"
                    value={value}
                    onChange={handleDateChange}
                    onKeyDown={handleDateKeyDown}
                    className={inputClasses}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="off"
                />
            )
        }

        return (
            <input
                id={inputId}
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                className={inputClasses}
                placeholder={placeholder}
                min={min}
            />
        )
    }

    return (
        <div className='space-y-1.5'>
            <label htmlFor={inputId} className='text-xs font-medium text-primary/80 flex items-center gap-1'>
                {label}
                {required && <span className='text-red-500'>*</span>}
            </label>
            {renderInput()}
            {hasError && (
                <p className='text-xs text-red-600 flex items-center gap-1'>
                    <span className='w-1 h-1 bg-red-600 rounded-full'></span>
                    {error}
                </p>
            )}
        </div>
    )
} 