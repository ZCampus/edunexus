export function TeacherHeader({
  title,
  hint,
}: {
  title: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight md:text-3xl">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}
