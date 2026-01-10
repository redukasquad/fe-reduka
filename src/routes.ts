import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { useAuth } from "./stores/auth"
import type { UserRole } from "./types/entites/user"
import { landingPageRoutes } from "./routes/landing-page"
import { authRoutes } from "./routes/auth"
import { dashboardRoutes } from "./routes/dashboard"
import { tryoutsRoutes } from "./routes/tryouts"
import { programsRoutes } from "./routes/programs"
import { coursesRoutes } from "./routes/courses"
import { notfoundRoutes } from "./routes/not-found"




const routes: RouteRecordRaw[] = [
...landingPageRoutes,
...authRoutes,
...dashboardRoutes,
...tryoutsRoutes,
...programsRoutes,
...coursesRoutes,
...notfoundRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})



const DEFAULT_SEO = {
  title: "Reduka",
  description:
    "Platform modern berbasis AI untuk pembelajaran dan pengembangan skill.",
  keywords: "ai platform, learning platform",
  robots: "index, follow",
}

router.beforeEach((to, _, next) => {
  const seo = to.meta.seo || {}

  const title = seo.title
    ? `${seo.title} | Reduka`
    : DEFAULT_SEO.title

  document.title = title

  setMeta("description", seo.description || DEFAULT_SEO.description)
  setMeta("keywords", seo.keywords || DEFAULT_SEO.keywords)
  setMeta("robots", seo.robots || DEFAULT_SEO.robots)

  setMeta("og:title", title, "property")
  setMeta(
    "og:description",
    seo.description || DEFAULT_SEO.description,
    "property"
  )
  setMeta("og:type", "website", "property")
  setMeta("og:url", window.location.href, "property")


  setMeta("twitter:card", "summary_large_image")
  setMeta("twitter:title", title)
  setMeta(
    "twitter:description",
    seo.description || DEFAULT_SEO.description
  )

  const auth = useAuth()
  const user = auth.user


  if (to.meta.requiresAuth && !user) {
    return next("/auth/login")
  }

  if (to.meta.roles && user) {
    const allowedRoles = to.meta.roles as UserRole[]

    if (!allowedRoles.includes(user.role)) {
      return next("/courses")
    }
  }

  if (user && (to.path.startsWith("/auth") || to.path ==="/dashboard")) {

    if (user.role === "ADMIN") return next("/dashboard/admin")
    if (user.role === "TUTOR") return next("/dashboard/tutor")
    return next("/dashboard/user")
  }

  next()
})

function setMeta(
  name: string,
  content: string,
  attr: "name" | "property" = "name"
) {
  let tag = document.querySelector(
    `meta[${attr}="${name}"]`
  ) as HTMLMetaElement | null

  if (!tag) {
    tag = document.createElement("meta")
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }

  tag.setAttribute("content", content)
}

export default router
