// flexible mode
export const useFlexiMode = () => useState<String>('flexiMode', () => 'blog')

// list page detail
export const useShowListDetail = () => useState<Boolean>('showListDetail', () => false)

// article page catalog
export const useShowCatalog = () => useState<Boolean>('showCatalog', () => true)
export const useSidebarFloat = () => useState<Boolean>('sidebarFloat', () => false)
export const useToggleSidebarFloat = () => useState<Boolean>('toggleSidebarFloat', () => false)
export const useFloatCatalogType = () => useState<'list' | 'tree'>('catalogType', () => 'list')
export const useToggleAllCatalog = () => useState<'expand' | 'collapse' | ''>('toggleAllCatalog', () => '')
export const useActiveHeadings = () => useState<Set<string>>('activeHeadings', () => new Set())

// article page zoom image
export const useZoomImage = () => useState<Boolean>('zoomImage', () => false)
