import { ref } from 'vue'

interface SnapshotData {
  site: any
  menus: any[]
  articles: any[]
  pages: any[]
  generatedAt: string
  version: string
}

const snapshotData = ref<SnapshotData | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useSnapshot() {
  const fetchSnapshot = async () => {
    if (snapshotData.value) {
      // 已经加载过，直接返回
      return snapshotData.value
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch('http://localhost:3000/api/v1/deploy/snapshot/active')
      if (!response.ok) {
        throw new Error('Failed to fetch snapshot')
      }
      snapshotData.value = await response.json()
      return snapshotData.value
    } catch (err: any) {
      error.value = err.message
      console.error('Failed to load snapshot:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const getMenus = () => {
    return snapshotData.value?.menus || []
  }

  const getArticles = (categoryId?: number) => {
    const articles = snapshotData.value?.articles || []
    if (categoryId) {
      return articles.filter(a => a.category_id === categoryId)
    }
    return articles
  }

  const getArticleBySlug = (slug: string) => {
    const articles = snapshotData.value?.articles || []
    return articles.find(a => a.slug === slug)
  }

  const getPages = () => {
    return snapshotData.value?.pages || []
  }

  const getSiteConfig = () => {
    return snapshotData.value?.site || {}
  }

  return {
    snapshotData,
    loading,
    error,
    fetchSnapshot,
    getMenus,
    getArticles,
    getArticleBySlug,
    getPages,
    getSiteConfig,
  }
}
