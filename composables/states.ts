export const useFlexiMode = () => useState<String>('flexiMode', () => 'blog')
export const useShowListDetail = () => useState<Boolean>('showListDetail', () => false)
export const useShowCatalog = () => useState<Boolean>('showCatalog', () => true)
export const useToggleExpandAllCatalog = () => useState<Boolean>('toggleExpandAllCatalog', () => true)
export const useActiveHeadings = () => useState<Set<string>>('activeHeadings', () => new Set())
