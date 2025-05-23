import { Role } from "@/lib/config/app.config";
import { hasRole } from "@/lib/utils";

type RoleGateProps = {
  userRoleId: number | null;
  role: Role | Role[];
  children: React.ReactNode;
};

export function RoleGate({ userRoleId, role, children }: RoleGateProps) {
  const roleArray = Array.isArray(role) ? role : [role];
  return hasRole(userRoleId, ...roleArray) ? <>{children}</> : null;
}
