import { z } from "zod";

export const registrationSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const teamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(50, "Team name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9\s-_]+$/,
      "Team name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .nullable(),
});

// Schema for adding members to a team
export const addTeamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  team: z.string().nonempty("Team is required"),
  role: z.enum(["ADMIN", "MEMBER"], {
    errorMap: () => ({ message: "Role must be either ADMIN or MEMBER" }),
  }),
});

// Schema for updating team details
export const updateTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(50, "Team name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9\s-_]+$/,
      "Team name can only contain letters, numbers, spaces, hyphens, and underscores"
    )
    .optional(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .nullable(),
});

// Schema for team member role update
export const updateTeamMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"], {
    errorMap: () => ({ message: "Role must be either ADMIN or MEMBER" }),
  }),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  status: z
    .enum(["backlog", "todo", "in-progress", "done", "cancelled"])
    .default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().optional(),
  teamId: z.string().optional(),
});
