"use client";
import { SubCategoryFormSchema } from "@/utils/category.schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type SubCategoryProps = {
  data?: {
    id: string;
    name: string;
    image: { url: string }[];
    url: string;
    featured: boolean;
    categoryId: string;
  };
  categories: {
    id: string;
    name: string;
    image: { url: string }[];
    url: string;
    featured: boolean;
  }[];
};

const SubCategoryDetails = ({ data, categories }: SubCategoryProps) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(SubCategoryFormSchema),
    defaultValues: {
      name: data?.name ?? "",
      image: data?.image ?? [{ url: "" }],
      url: data?.url ?? "",
      featured: data?.featured ?? false,
      categoryId: data?.categoryId,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        image: data.image ?? [],
        url: data.url,
        featured: data.featured,
        categoryId: data.categoryId,
      });
    }
  }, [data, form]);

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof SubCategoryFormSchema>) {
    try {
      //API CALL
      const payload = {
        name: values.name,
        image: values.image,
        url: values.url,
        featured: values.featured,
        categoryId: values.categoryId,
        updatedAt: new Date(),
      };

      let response;

      if (data?.id) {
        response = await axios.put(
          `${API_URL}/sub-category/${data.id}`,
          payload,
          {
            withCredentials: true,
          }
        );
        toast.success(response.data.message || "sub-category updated");
      } else {
        response = await axios.post(
          `${API_URL}/sub-category/create`,
          { ...payload, createdAt: new Date() },
          { withCredentials: true }
        );
        toast.success(response.data.message || "sub-category created");
      }

      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
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
          <CardTitle>Sub-Category Information</CardTitle>
          {/* <CardDescription>
            {data?.id
              ? `Update ${data?.name} sub-category information `
              : "Lets create a sub-category. You can edit the sub-category later from the sub sub-categories table or sub-category page"}
          </CardDescription> */}
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
                  <FormItem className="flex-1 my-3">
                    <FormLabel>Sub-category name</FormLabel>
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
                  <FormItem className="flex-1 ">
                    <FormLabel>Sub-category url</FormLabel>
                    <FormControl>
                      <Input placeholder="/sub category-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full my-3">
                    <FormLabel>Category</FormLabel>

                    <Select
                      disabled={isLoading || categories.length == 0}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger className="w-full">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-3">
                    <FormLabel>Sub-category name</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked: boolean | "indeterminate") => field.onChange(!!checked)} // force boolean
                      />
                    </FormControl>
                    <div>
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This sub-category will appear on home page
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
                  ? "update sub-category"
                  : "create sub-category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SubCategoryDetails;
