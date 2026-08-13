import { apiFetch, mockDelay } from "@/lib/api/client";
import { reportCard, tenants, type TenantId } from "@/lib/mock-data";

export async function fetchReportCard(tenantId: TenantId) {
  try {
    return await apiFetch<typeof reportCard>(
      `/tenants/${tenantId}/report-cards/current`,
    );
  } catch (error) {
    if (error instanceof Error && error.message === "API_BASE_MISSING") {
      await mockDelay();
      const tenant = tenants.find((item) => item.id === tenantId);
      return {
        ...reportCard,
        term: tenant?.term ?? reportCard.term,
      };
    }
    throw error;
  }
}

export async function fetchTenantList() {
  try {
    return await apiFetch<(typeof tenants)[number][]>("/tenants");
  } catch (error) {
    if (error instanceof Error && error.message === "API_BASE_MISSING") {
      await mockDelay(200);
      return [...tenants];
    }
    throw error;
  }
}

/** Placeholder for JWT login — wire to NestJS POST /auth/login when ready */
export async function loginRequest(payload: {
  schoolCode: string;
  email: string;
  password: string;
}) {
  try {
    return await apiFetch<{ accessToken: string; refreshToken: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "API_BASE_MISSING") {
      await mockDelay(400);
      return {
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      };
    }
    throw error;
  }
}
