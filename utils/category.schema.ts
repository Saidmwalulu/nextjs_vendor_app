import * as z from "zod";

export const CategoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "category name must be at least 2 characters long")
    .max(50, "category name cannot exceed 50 characters long")
    .regex(/^[A-Za-z0-9 ]+$/, {
      message:
        "only letters, numbers and spaces are allowed in the category name",
    }),
  image: z
    .object({
      url: z.string(),
    })
    .array()
    .min(1, "Please upload at least one category image")
    .length(1, "choose a category image"),
  url: z
    .string()
    .min(2, "category url must be at least 2 characters long")
    .max(50, "category url cannot exceed 50 characters long")
    .regex(/^(?!.*(--|__|  ))[A-Za-z0-9-_ ]+$/, {
      message:
        "only letters, numbers, hyphen and underscore are allowed in the category url, and consecutive occurences of hyphens, underscores or spaces are not permitted",
    }),
  featured: z.boolean(),
});

export const CategorySchema = CategoryFormSchema.extend({
  id: z.string(),
});

export const SubCategoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "category name must be at least 2 characters long")
    .max(50, "category name cannot exceed 50 characters long")
    .regex(/^[A-Za-z0-9 ]+$/, {
      message:
        "only letters, numbers and spaces are allowed in the category name",
    }),
  image: z
    .object({
      url: z.string(),
    })
    .array()
    .min(1, "Please upload at least one category image")
    .length(1, "choose a category image"),
  url: z
    .string()
    .min(2, "category url must be at least 2 characters long")
    .max(50, "category url cannot exceed 50 characters long")
    .regex(/^(?!.*(--|__|  ))[A-Za-z0-9-_ ]+$/, {
      message:
        "only letters, numbers, hyphen and underscore are allowed in the category url, and consecutive occurences of hyphens, underscores or spaces are not permitted",
    }),
  featured: z.boolean(),
  categoryId: z.string().uuid()
});
