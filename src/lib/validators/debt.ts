import { z } from "zod";

export const createDebtSchema = z.object({
  creditorName: z.string().min(1, "Kreditor nomini kiriting").max(255),
  creditorType: z.enum(["COMPANY", "PERSON"], {
    errorMap: () => ({ message: "Kreditor turi COMPANY yoki PERSON bo'lishi kerak" }),
  }),
  phone: z.string().optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  totalAmount: z.number().positive("Summa musbat bo'lishi kerak"),
  dueDate: z.string().datetime().optional().nullable(),
});

export const updateDebtSchema = createDebtSchema.partial();

export const createPaymentSchema = z.object({
  amount: z.number().positive("To'lov summasi musbat bo'lishi kerak"),
  date: z.string().datetime().optional(),
  note: z.string().max(500).optional().nullable(),
});

export type CreateDebtInput = z.infer<typeof createDebtSchema>;
export type UpdateDebtInput = z.infer<typeof updateDebtSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
