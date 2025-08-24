import z from "zod";

const PageSchema = z.object({
  Id: z.string().optional(),
  Name: z.string().min(1, "Name is required"),
  Type: z.string(),
  Styles: z.any(),
  ProjectId: z.string(),
  CreatedAt: z.date().optional(),
  UpdatedAt: z.date().optional(),
  DeletedAt: z.date().nullable().optional(),
})

export { PageSchema };
