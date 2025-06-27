"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProduct } from "@/server/actions/products";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeleteProductAltertDialogContent({ id }: { id: string }) {
  const [isDeletePending, startDeleteTransition] = useTransition();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the product
          and all associated data.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          disabled={isDeletePending}
          onClick={() => {
            startDeleteTransition(async () => {
              const data = await deleteProduct(id);
              if (data.message) {
                toast[data.error ? "error" : "success"](data.message);
              }
            });
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
