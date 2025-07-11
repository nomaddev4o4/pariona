"use client";

import Banner from "@/components/Banner";
import NoPermissionCard from "@/components/NoPermissionCard";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  productCustomizationSchema,
  TProductCustomizationSchema,
} from "@/schemas/products";
import { updateProductCustomization } from "@/server/actions/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ProductCustomizationForm({
  customization,
  canCustomizeBanner,
  canRemoveBranding,
}: {
  customization: {
    productId: string;
    locationMessage: string;
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    bannerContainer: string;
    isSticky: boolean;
    classPrefix: string | null;
  };
  canRemoveBranding: boolean;
  canCustomizeBanner: boolean;
}) {
  const form = useForm<TProductCustomizationSchema>({
    resolver: zodResolver(productCustomizationSchema),
    defaultValues: {
      ...customization,
      classPrefix: customization.classPrefix ?? "",
    },
  });

  async function onSubmit(values: TProductCustomizationSchema) {
    const data = await updateProductCustomization(
      customization.productId,
      values
    );

    if (data?.message) {
      toast[data.error ? "error" : "success"](
        data.error ? "error" : "success",
        { description: data.message }
      );
    }
  }

  const formValues = form.watch();

  return (
    <>
      <div>
        <Banner
          message={formValues.locationMessage}
          mappings={{
            country: "India",
            coupon: "HALF-OFF",
            discount: "50",
          }}
          customization={formValues}
          canRemoveBranding={canRemoveBranding}
        />
      </div>
      {!canCustomizeBanner && (
        <div className="mt-8">
          <NoPermissionCard />
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-6 flex-col mt-8"
        >
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="locationMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    PPP Discount Message
                    <RequiredLabelIcon />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={!canCustomizeBanner}
                      className="min-h-20 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {"Data Parameters: {country}, {coupon}, {discount}"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Background Color
                      <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input disabled={!canCustomizeBanner} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="textColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Text Color
                      <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input disabled={!canCustomizeBanner} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fontSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Font Size
                      <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input disabled={!canCustomizeBanner} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isSticky"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sticky?</FormLabel>
                    <FormControl>
                      <Switch
                        className="block"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!canCustomizeBanner}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          {canCustomizeBanner && (
            <div className="self-end">
              <Button disabled={form.formState.isSubmitting} type="submit">
                Save
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  );
}
