"use client";

import Link from "next/link";
import { ArrowBigUp, MessageCircle, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export type FeedPost = {
  id: string;
  category: string;
  date: string;
  title: string;
  detail: string;
  author: string;
};

export function FeedCard({ post }: { post: FeedPost }) {
  const { t } = useI18n();
  const { user } = useAuth();

  return (
    <article className="rounded-lg border border-border/80 bg-card shadow-[0_1px_2px_oklch(0.3_0.02_165/0.06)]">
      <div className="px-4 pt-4 pb-3">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold tracking-wide text-primary uppercase">
            {post.category}
          </span>
          <span className="text-muted-foreground">{post.date}</span>
        </div>
        <h3 className="text-[15px] font-semibold leading-snug tracking-tight">
          {post.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{post.detail}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {t("createdBy")}{" "}
            <span className="font-medium text-primary">{post.author}</span>
          </p>
          {user?.role !== "student" ? (
            <Button asChild variant="link" size="sm" className="h-auto px-0 text-primary">
              <Link href="/notifications">{t("viewMore")}</Link>
            </Button>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-1 border-t border-border/70 px-2 py-1.5">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowBigUp className="size-3.5" aria-hidden />
          {t("feedUpvote")}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <MessageCircle className="size-3.5" aria-hidden />
          {t("feedComment")}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Share2 className="size-3.5" aria-hidden />
          {t("feedShare")}
        </button>
      </div>
    </article>
  );
}
