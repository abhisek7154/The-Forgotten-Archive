import z from "zod";

export const SignUpInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const SignInInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const CreateBlogInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const EditBlogInput = z.object({
  id: z.string().uuid(), // stricter than plain string
  title: z.string(),
  content: z.string(),
});

export type SignUpInput = z.infer<typeof SignUpInput>;
export type SignInInput = z.infer<typeof SignInInput>;
export type CreateBlogInput = z.infer<typeof CreateBlogInput>;
export type EditBlogInput = z.infer<typeof EditBlogInput>;
