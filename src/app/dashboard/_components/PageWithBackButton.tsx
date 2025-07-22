import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export function PageWithBackButton({
  backButtonHref,
  pageTitle,
  children,
}: {
  backButtonHref: string;
  pageTitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <Button size="icon" variant="outline" className="rounded-full" asChild>
        <Link href={backButtonHref}>
          <div className="sr-only">Back</div>
          <ChevronLeftIcon className="size-8" />
        </Link>
      </Button>
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-2xl font-semibold">{pageTitle}</h1>
        <div className="col-start-2">{children}</div>
      </div>
    </div>
  );
}
