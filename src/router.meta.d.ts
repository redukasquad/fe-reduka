import "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    seo?: {
      title?: string
      description?: string
      keywords?: string
      robots?: string
    }
    layout?: "default" | "auth" | 'plain'
    requiresAuth?: boolean
    guestOnly?: boolean
  }
}