import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email atau username harus diisi').email('Format email tidak valid'),
  password: z.string().min(1, 'Password harus diisi').min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Nama lengkap harus diisi'),
  email: z.string().min(1, 'Email harus diisi').email('Format email tidak valid'),
  password: z.string().min(1, 'Password harus diisi').min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi password harus diisi'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email harus diisi').email('Format email tidak valid'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;


export const createSubdomainSchema = z.object({
  name: z
    .string()
    .min(3, "Subdomain minimal 3 karakter")
    .max(63, "Subdomain maksimal 63 karakter")
    .regex(
      /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/,
      "Subdomain hanya boleh berisi huruf kecil, angka, dan tanda hubung (-). Tidak boleh diawali atau diakhiri dengan tanda hubung."
    )
    .refine((val) => !val.includes("--"), "Subdomain tidak boleh mengandung tanda hubung berturut-turut (--)."),
});

export const availabilityCheckSchema = z.object({
  name: z
    .string()
    .min(3, "Subdomain minimal 3 karakter")
    .max(63, "Subdomain maksimal 63 karakter")
    .regex(
      /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/,
      "Subdomain hanya boleh berisi huruf kecil, angka, dan tanda hubung (-). Tidak boleh diawali atau diakhiri dengan tanda hubung."
    )
    .refine((val) => !val.includes("--"), "Subdomain tidak boleh mengandung tanda hubung berturut-turut (--)."),
});

const recordTypeEnum = z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "NS"]);

export const createDnsRecordSchema = z.object({
  type: recordTypeEnum,
  name: z.string().min(1, "Nama record tidak boleh kosong"),
  value: z.string().min(1, "Nilai record tidak boleh kosong"),
  ttl: z.number().int().min(1).max(86400).default(1),
  priority: z.number().int().min(0).max(65535).optional(),
}).superRefine((data, ctx) => {
  if (data.type === "MX" && data.priority === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Priority wajib diisi untuk record MX",
      path: ["priority"],
    });
  }
});

export const updateDnsRecordSchema = z.object({
  type: recordTypeEnum.optional(),
  name: z.string().min(1, "Nama record tidak boleh kosong").optional(),
  value: z.string().min(1, "Nilai record tidak boleh kosong").optional(),
  ttl: z.number().int().min(1).max(86400).optional(),
  priority: z.number().int().min(0).max(65535).optional(),
}).superRefine((data, ctx) => {
  if (data.type === "MX" && data.priority === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Priority wajib diisi untuk record MX",
      path: ["priority"],
    });
  }
});
