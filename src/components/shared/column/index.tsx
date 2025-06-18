import { memo, useCallback } from 'react'
import { cn } from '../../../utils/cn'
import { COLUMN_CLASSES } from './constants'
import { useColumnState } from './hooks/useColumnState'
import { useVirtualization } from './hooks/useVirtualization'
import { ColumnHeader, ColumnContent, ColumnTooltip } from './components'
import type { ColumnProps } from './types'


export const Column = memo(({ id, step, label, count, children, onAddScene }: ColumnProps) => {
  const { setNodeRef, isOver, columnState } = useColumnState({ id, step })

  const {
    shouldVirtualize,
    itemCount,
    listHeight,
    itemHeight,
    overscanCount
  } = useVirtualization({ children })

  const renderItem = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    if (Array.isArray(children)) {
      const child = children[index]
      return (
        <div style={style} className="px-1 pb-2">
          {child}
        </div>
      )
    }

    return (
      <div style={style} className="px-1 pb-2">
        {children}
      </div>
    )
  }, [children])

  // Callback para adicionar cena
  const handleAddScene = useCallback(() => {
    if (onAddScene) {
      onAddScene(step)
    }
  }, [onAddScene, step])

  return (
    <div
      ref={setNodeRef}
      className={cn(
        COLUMN_CLASSES.BASE,
        COLUMN_CLASSES.MAX_HEIGHT,
        isOver && !columnState.disabled && COLUMN_CLASSES.OVER,
        columnState.disabled && COLUMN_CLASSES.DISABLED
      )}
    >
      <ColumnHeader
        label={label}
        count={count}
        onAddScene={handleAddScene}
      />

      <ColumnContent
        children={children}
        shouldVirtualize={shouldVirtualize}
        itemCount={itemCount}
        renderItem={renderItem}
        listHeight={listHeight}
        itemHeight={itemHeight}
        overscanCount={overscanCount}
      />

      <ColumnTooltip
        message={columnState.tooltipMessage}
        isVisible={isOver}
      />
    </div>
  )
})

Column.displayName = 'Column'
