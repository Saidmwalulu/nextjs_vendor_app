import * as z from "zod";

export const StoreFormSchema = z.object({
  name: z
    .string()
    .min(2, "Store name must be at least 2 characters long.")
    .max(50, "Store name cannot exceed 50 characters.")
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
      message:
        "Only letters, numbers, space, hyphen, and underscore are allowed in the store name, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
  description: z
    .string()
    .min(30, "Store description must be at least 30 characters long.")
    .max(500, "Store description cannot exceed 500 characters."),
  email: z.email("Invalid email format."),
  phone: z.string().regex(/^\+?\d+$/, "Invalid phone number format."),
  logo: z.object({ url: z.string() }).array().min(1).length(1, "Choose a logo image."),
  cover: z
    .object({ url: z.string() })
    .array()
    .min(1)
    .length(1, "Choose a cover image."),
  url: z
    .string()
    .min(2, "Store url must be at least 2 characters long.")
    .max(50, "Store url cannot exceed 50 characters.")
    .regex(
      /^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, hyphen, and underscore are allowed in the store url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."
    ),
  featured: z.boolean().default(false).optional(),
  status: z.string().default("PENDING").optional(),
});
