"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AdminHeader, AdminSkeleton, Can, ForbiddenState, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { archiveStudent } from "@/lib/admin/api";
import { can } from "@/lib/admin/permissions";
import { canViewStudent, formatIsoDate } from "@/lib/admin/scope";
import { useAdminStore } from "@/lib/admin/store";
import { classLabel, personName } from "@/lib/admin/types";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function StudentProfilePage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const { state, ready } = useAdminStore();
  const [confirm, setConfirm] = useState<"archive" | "deactivate" | null>(null);
  const student = state.students.find((item) => item.id === params.id);

  if (!user || !can(user.role, "students", "view")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  if (!ready) return <AdminSkeleton />;
  if (!student || !canViewStudent(state, user, student.id)) {
    return <ForbiddenState message={c.notFound} />;
  }

  const klass = state.classes.find((item) => item.id === student.classId);
  const parents = state.parents.filter((item) => student.parentIds.includes(item.id));
  const logs = state.activity.filter((item) => item.entityId === student.id);

  async function applyStatus() {
    if (!user || !student) return;
    const status = confirm === "archive" ? "archived" : "inactive";
    await archiveStudent(student.id, status, user.name);
    toast.success(c.saved);
    setConfirm(null);
  }

  const record = student;

  async function activate() {
    if (!user) return;
    await archiveStudent(record.id, "active", user.name);
    toast.success(c.saved);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader
        title={personName(student)}
        hint={student.admissionNo}
        actions={
          <>
            <Can module="students" action="edit">
              <Button asChild variant="outline">
                <Link href={`/admin/students/${student.id}/edit`}>{c.edit}</Link>
              </Button>
            </Can>
            <Can module="students" action="edit">
              {student.status === "active" ? (
                <>
                  <Button type="button" variant="outline" onClick={() => setConfirm("deactivate")}>
                    {c.deactivate}
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => setConfirm("archive")}>
                    {c.archive}
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={activate}>
                  {c.activate}
                </Button>
              )}
            </Can>
          </>
        }
      />

      <Tabs defaultValue="personal">
        <TabsList variant="line" className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="personal">{c.personal}</TabsTrigger>
          <TabsTrigger value="admission">{c.admission}</TabsTrigger>
          <TabsTrigger value="class">{c.classDetails}</TabsTrigger>
          <TabsTrigger value="parents">{c.parents}</TabsTrigger>
          <TabsTrigger value="activity">{c.activity}</TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="pt-4">
          <Card>
            <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
              <Field label={c.gender} value={student.gender === "female" ? c.female : student.gender === "male" ? c.male : c.other} />
              <Field label={c.dob} value={formatIsoDate(student.dateOfBirth)} />
              <Field label={c.email} value={student.email || c.none} />
              <Field label={c.phone} value={student.phone || c.none} />
              <Field label={c.address} value={student.address || c.none} />
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">{c.status}</p>
                <StatusBadge status={student.status} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admission" className="pt-4">
          <Card>
            <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
              <Field label={c.admissionNo} value={student.admissionNo} />
              <Field label={c.admissionDate} value={formatIsoDate(student.admissionDate)} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="class" className="pt-4">
          <Card>
            <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
              <Field label={c.class} value={klass ? classLabel(klass) : c.noClass} />
              <Field label={c.section} value={klass?.section ?? c.none} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="parents" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{c.parents}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {parents.length === 0 ? (
                <p className="text-sm text-muted-foreground">{c.none}</p>
              ) : (
                parents.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/parents/${item.id}`}
                    className="rounded-lg border border-border/70 px-3 py-2 text-sm hover:bg-muted/40"
                  >
                    {personName(item)} · {item.relation} · {item.phone}
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="pt-4">
          <Card>
            <CardContent className="flex flex-col gap-3 pt-6">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">{c.noActivity}</p>
              ) : (
                logs.map((item) => (
                  <p key={item.id} className="text-sm">
                    {item.summary}
                    <span className="text-muted-foreground"> · {item.actor} · {formatIsoDate(item.at)}</span>
                  </p>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={confirm !== null} onOpenChange={() => setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirm === "archive" ? c.confirmArchive : c.confirmDeactivate}</DialogTitle>
            <DialogDescription>
              {confirm === "archive" ? c.confirmArchiveHint : c.confirmDeactivateHint}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirm(null)}>
              {c.cancel}
            </Button>
            <Button type="button" variant="destructive" onClick={applyStatus}>
              {confirm === "archive" ? c.archive : c.deactivate}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
