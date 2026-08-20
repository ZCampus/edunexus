"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { AdminHeader, AdminSkeleton, Can, ForbiddenState, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { can } from "@/lib/admin/permissions";
import { useAdminStore } from "@/lib/admin/store";
import { classLabel, personName } from "@/lib/admin/types";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function ParentProfilePage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const { state, ready } = useAdminStore();
  const parent = state.parents.find((item) => item.id === params.id);

  if (!user || !can(user.role, "parents", "view")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  if (!ready) return <AdminSkeleton />;
  if (!parent) return <ForbiddenState message={c.notFound} />;

  const children = state.students.filter((item) => item.parentIds.includes(parent.id));

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader
        title={personName(parent)}
        hint={parent.relation}
        actions={
          <Can module="parents" action="edit">
            <Button asChild variant="outline">
              <Link href={`/admin/parents/${parent.id}/edit`}>{c.edit}</Link>
            </Button>
          </Can>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.contact}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Info label={c.phone} value={parent.phone || c.none} />
            <Info label={c.email} value={parent.email || c.none} />
            <Info label={c.occupation} value={parent.occupation || c.none} />
            <Info label={c.address} value={parent.address || c.none} />
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">{c.status}</p>
              <StatusBadge status={parent.status} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.children}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {children.length === 0 ? (
              <p className="text-sm text-muted-foreground">{c.none}</p>
            ) : (
              children.map((item) => {
                const klass = state.classes.find((entry) => entry.id === item.classId);
                return (
                  <Link
                    key={item.id}
                    href={`/admin/students/${item.id}`}
                    className="rounded-lg border border-border/70 px-3 py-2 text-sm hover:bg-muted/40"
                  >
                    {personName(item)}
                    {klass ? ` · ${classLabel(klass)}` : ""}
                  </Link>
                );
              })
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
