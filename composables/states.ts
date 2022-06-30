// flexible mode
export const useFlexiMode = () => useState<String>('flexiMode', () => 'blog')

// list page detail
export const useShowListDetail = () => useState<Boolean>('showListDetail', () => false)

// article page catalog
export const useShowCatalog = () => useState<Boolean>('showCatalog', () => true)
export const useCatalogType = () => useState<'list' | 'tree'>('catalogType', () => 'list')
export const useToggleAllCatalog = () => useState<'expand' | 'collapse' | ''>('toggleAllCatalog', () => '')
export const useActiveHeadings = () => useState<Set<string>>('activeHeadings', () => new Set())
