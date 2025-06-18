import { memo } from 'react'
import { FixedSizeList as List } from 'react-window'
import { COLUMN_CLASSES, REGULAR_LIST_CLASSES } from '../constants'
import type { ColumnContentProps } from '../types'

export const ColumnContent = memo(({
    children,
    shouldVirtualize,
    itemCount,
    renderItem,
    listHeight,
    itemHeight,
    overscanCount
}: ColumnContentProps & {
    listHeight: number
    itemHeight: number
    overscanCount: number
}) => {
    return (
        <div
            className={COLUMN_CLASSES.CONTENT}
            style={{
                scrollbarGutter: 'stable',
                maxHeight: COLUMN_CLASSES.CONTENT_MAX_HEIGHT
            }}
        >
            {shouldVirtualize ? (
                <List
                    height={listHeight}
                    itemCount={itemCount}
                    itemSize={itemHeight}
                    width="100%"
                    className="virtual-list"
                    overscanCount={overscanCount}
                >
                    {renderItem}
                </List>
            ) : (
                <div className={REGULAR_LIST_CLASSES.BASE}>
                    {children}
                </div>
            )}
        </div>
    )
})

ColumnContent.displayName = 'ColumnContent' 