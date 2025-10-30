"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AlertDialog } from "../ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import ImageUpload from "../shared/image-upload";
import axios from "axios";
import { toast } from "sonner";
import { useEffect } from "react";
import { useModal } from "@/providers/modal-provider";
import { StoreFormSchema } from "@/utils/store.schema";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { useSaveStoreMutation } from "@/data/store.queries";

type StoreProps = {
  data?: {
    id?: string;
    name: string;
    description?: string;
    email?: string;
    phone?: string;
    logo: { url: string }[];
    cover: { url: string }[];
    url?: string;
    featured?: boolean;
    status: string;
  };
};

const StoreDetails = ({ data }: StoreProps) => {
  const router = useRouter();
  const { closeModal } = useModal();
  const { mutateAsync: saveStore, isPending } = useSaveStoreMutation();

  const form = useForm<z.infer<typeof StoreFormSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(StoreFormSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      logo: Array.isArray(data?.logo)
        ? data.logo
        : data?.logo
        ? [{ url: data.logo }]
        : [],
      cover: Array.isArray(data?.cover)
        ? data.cover
        : data?.cover
        ? [{ url: data.cover }]
        : [],
      url: data?.url ?? "",
      featured: data?.featured ?? false,
      status: data?.status.toString(),
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name ?? "",
        description: data?.description ?? "",
        email: data?.email ?? "",
        phone: data?.phone ?? "",
        logo: data?.logo ?? [{ url: "" }],
        cover: data?.cover ?? [{ url: "" }],
        url: data?.url ?? "",
        featured: data?.featured ?? false,
        status: data?.status ?? "",
      });
    }
  }, [data, form]);

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof StoreFormSchema>) {
    try {
      //API CALL
      const payload = {
        ...(data?.id ? { id: data.id } : {}),
        name: values.name,
        description: values.description,
        email: values.email,
        phone: values.phone,
        logo: values.logo,
        cover: values.cover,
        url: values.url,
        featured: values.featured,
        status: values.status,
        updatedAt: new Date(),
      };

      const storeData = await saveStore(payload);

      toast.success(data?.id ? "Store updated" : "Store created");

      if (!data?.id) {
        router.push(`/dashboard/seller/stores/${storeData.url}`);
      }

      closeModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "error on creating");
        console.log(error);
      }
    }
  }

  return (
    <AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} store information `
              : "Lets create a store. You can edit the store later from the store settings page"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="relative">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="absolute z-20 -bottom-10 left-30">
                      <FormControl>
                        <div className="flex justify-center items-center w-full">
                          <ImageUpload
                            type="profile"
                            value={field.value.map((image) => image.url)}
                            disabled={isLoading}
                            onChange={(url) => field.onChange([{ url }])}
                            onRemove={(url) =>
                              field.onChange([
                                ...field.value.filter(
                                  (current) => current.url !== url
                                ),
                              ])
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex justify-center items-center w-full">
                          <ImageUpload
                            type="cover"
                            value={field.value.map((image) => image.url)}
                            disabled={isLoading}
                            onChange={(url) => field.onChange([{ url }])}
                            onRemove={(url) =>
                              field.onChange([
                                ...field.value.filter(
                                  (current) => current.url !== url
                                ),
                              ])
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-4 mt-[50px]">
                    <FormLabel>Store name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1 my-4">
                    <FormLabel>Store Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-6 md:flex-row mb-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store url</FormLabel>
                    <FormControl>
                      <Input placeholder="/store-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 my-4">
                    {/* <FormLabel>Store name</FormLabel> */}
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)} // force boolean
                      />
                    </FormControl>
                    <div>
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This Store will appear on home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
              >
                {isLoading
                  ? "saving..."
                  : data?.id
                  ? "update store"
                  : "create store"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDetails;
