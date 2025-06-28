"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  productDetailsSchema,
  TProductDetailsSchema,
} from "@/schemas/products";
import { createProduct, updateProduct } from "@/server/actions/products";
import { toast } from "sonner";

export default function ProductDetailsForm({
  product,
}: {
  product?: {
    id: string;
    name: string;
    description: string | null;
    url: string;
  };
}) {
  const form = useForm<TProductDetailsSchema>({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: product
      ? { ...product, description: product?.description ?? "" }
      : {
          name: "",
          url: "",
          description: "",
        },
  });

  async function onSubmit(values: TProductDetailsSchema) {
    const action =
      product == null ? createProduct : updateProduct.bind(null, product.id);

    const data = await action(values);

    if (data?.message) {
      toast[data.error ? "error" : "success"](
        data.error ? "Error" : "Success",
        {
          description: data.message,
        }
      );
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter your website URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Include the full URL, including http:// or https:// to the
                  sales page.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea className="min-h-20 resize-none" {...field} />
              </FormControl>
              <FormDescription>
                A optional description to help distinguish your product from
                others
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
