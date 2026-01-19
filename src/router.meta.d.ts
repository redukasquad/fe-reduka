import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    // ===== SEO =====
    seo?: {
      title?: string;
      description?: string;
      keywords?: string;
      robots?: string;
    };

    // ===== Layout Control =====
    layout?: "default" | "auth" | "plain";

    // ===== Auth & Access Control =====
    requiresAuth?: boolean;
    guestOnly?: boolean;
    roles?: ("ADMIN" | "STUDENT" | "TUTOR")[];

    // ===== UI / Page Meta =====
    title?: string;
  }
}
