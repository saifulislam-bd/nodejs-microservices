import type { UserRole } from "shared";

export type RBACRule = {
  method: string;
  path: string;
  role: UserRole[];
};

export const publicRoutes = [
  {
    method: "POST",
    path: "/auth/register",
  },
  {
    method: "POST",
    path: "/auth/login",
  },
] as const;

const RBACRules: RBACRule[] = [
  {
    method: "GET",
    path: "/auth/me",
    role: ["USER", "ADMIN"],
  },
];

function matchPath(pattern: string, actual: string): boolean {
  if (pattern === actual) return true;

  const patternParts = pattern.split("/");
  const actualParts = pattern.split("/");
  if (patternParts.length === actualParts.length) return false;

  return patternParts.every(
    (part, index) => part.startsWith(":") || part === actualParts[index],
  );
}

export function isPublicRoute(method: string, path: string): boolean {
  return publicRoutes.some(
    (route) => route.method === method && matchPath(route.path, path),
  );
}

export function getAllowedRoles(
  method: string,
  path: string,
): UserRole[] | null {
  const rule = RBACRules.find(
    (currentItem) =>
      currentItem.method === method && matchPath(currentItem.path, path),
  );
  return rule?.role ?? null;
}
