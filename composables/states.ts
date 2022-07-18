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
interface ZoomImageType {
  src: string;
  alt?: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ZoomImageListItem {
  src: string;
  alt?: string;
  width: number;
  height: number;
}

export const useShowZoomImage = () => useState<'show' | 'hiding' | 'hidden'>('showZoomImage', () => 'hidden')
export const useZoomImage = () => useState<null | ZoomImageType>('zoomImage', () => null)
export const useZoomImageList = () => useState<ZoomImageListItem[]>('zoomImageList', () => [])
