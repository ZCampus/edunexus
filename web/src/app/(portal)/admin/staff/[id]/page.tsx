"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { AdminHeader, AdminSkeleton, Can, ForbiddenState, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { archiveStaff } from "@/lib/admin/api";
import { can } from "@/lib/admin/permissions";
import { useAdminStore } from "@/lib/admin/store";
import { classLabel, personName } from "@/lib/admin/types";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { roleLabelKey } from "@/lib/role-label";

export default function StaffProfilePage() {
  const c = useAdminCopy();
  const { t } = useI18n();
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const { state, ready } = useAdminStore();
  const staff = state.staff.find((item) => item.id === params.id);

  if (!user || !can(user.role, "staff", "view")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  if (!ready) return <AdminSkeleton />;
  if (!staff) return <ForbiddenState message={c.notFound} />;

  const subjects = state.subjects.filter((item) => staff.subjectIds.includes(item.id));
  const classes = state.classes.filter((item) => staff.classIds.includes(item.id));
  const classTeacherOf = state.classes.find((item) => item.id === staff.classTeacherOfId);

  const record = staff;

  async function toggleStatus() {
    if (!user) return;
    await archiveStaff(record.id, record.status === "active" ? "inactive" : "active", user.name);
    toast.success(c.saved);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader
        title={personName(staff)}
        hint={t(roleLabelKey(staff.role))}
        actions={
          <>
            <Can module="staff" action="edit">
              <Button asChild variant="outline">
                <Link href={`/admin/staff/${staff.id}/edit`}>{c.edit}</Link>
              </Button>
            </Can>
            <Can module="staff" action="edit">
              <Button type="button" variant="outline" onClick={toggleStatus}>
                {staff.status === "active" ? c.deactivate : c.activate}
              </Button>
            </Can>
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.personal}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Info label={c.email} value={staff.email} />
            <Info label={c.phone} value={staff.phone || c.none} />
            <Info label={c.loginAccess} value={staff.hasLogin ? c.hasLogin : c.noLogin} />
            <Info label={c.classTeacher} value={classTeacherOf ? classLabel(classTeacherOf) : c.unassigned} />
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">{c.status}</p>
              <StatusBadge status={staff.status} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.subjects}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {subjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">{c.none}</p>
            ) : (
              subjects.map((item) => (
                <p key={item.id} className="text-sm">
                  {item.name} · {item.code}
                </p>
              ))
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{c.classes}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {classes.length === 0 ? (
              <p className="text-sm text-muted-foreground">{c.none}</p>
            ) : (
              classes.map((item) => (
                <Button key={item.id} asChild variant="outline" size="sm">
                  <Link href={`/admin/classes/${item.id}`}>{classLabel(item)}</Link>
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
