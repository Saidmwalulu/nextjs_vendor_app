"use client";
import { CategoryFormSchema } from "@/utils/category.schema";
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
import { API_URL } from "@/server";
import { toast } from "sonner";
import { useEffect } from "react";
import { useModal } from "@/providers/modal-provider";
import { useQueryClient } from "@tanstack/react-query";

export type CategoryProps = {
  data?: {
    id: string;
    name: string;
    image: { url: string }[];
    url: string;
    featured: boolean;
  };
};

const CategoryDetails = ({ data }: CategoryProps) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: data?.name ?? "",
      image: data?.image ?? [{ url: "" }],
      url: data?.url ?? "",
      featured: data?.featured ?? false,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        image: data.image ?? [],
        url: data.url,
        featured: data.featured,
      });
    }
  }, [data, form]);

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof CategoryFormSchema>) {

    try {
      //API CALL
      const payload =
        {
          name: values.name,
          image: values.image,
          url: values.url,
          featured: values.featured,
          updatedAt: new Date(),
        };
        
        let response

        if (data?.id) {
          response = await axios.put(`${API_URL}/category/${data.id}`, payload, {
            withCredentials: true
          })
          toast.success(response.data.message || "category updated");
        } else {
          response = await axios.post(`${API_URL}/category/create`, {...payload, createdAt: new Date()}, {withCredentials: true})
          toast.success(response.data.message || "category created");
        }

        queryClient.invalidateQueries({ queryKey: ["categories"] });
        form.reset();
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
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} category information `
              : "Lets create a category. You can edit the category later from the categories table or category page"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
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
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1 my-4">
                    <FormLabel>Category name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category url</FormLabel>
                    <FormControl>
                      <Input placeholder="/category-url" {...field} />
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
                    <FormLabel>Category name</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked: boolean | "indeterminate") => field.onChange(!!checked)} // force boolean
                      />
                    </FormControl>
                    <div>
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This category will appear on home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer">
                {isLoading
                  ? "saving..."
                  : data?.id
                  ? "update category"
                  : "create category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;
