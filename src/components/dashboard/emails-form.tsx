"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

// Zod schema for email validation
const emailSchema = z.object({
  emails: z.array(z.string().email("Invalid email address")),
});

type EmailsFormProps = {
  initialEmails?: string[];
  onSubmit: (emails: string[]) => Promise<void>;
};

export default function EmailsForm({ initialEmails = [], onSubmit }: EmailsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("Emails");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      emails: initialEmails,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-expect-error correct type
    name: "emails",
  });

  const onFormSubmit = async (data: z.infer<typeof emailSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data.emails);
    } catch (error) {
      console.error("Failed to update emails:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <label className="block text-sm font-medium text-gray-700">{t("description")}</label>
        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="email"
                {...control.register(`emails.${index}`)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-black"
                placeholder="Enter email address"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            {errors.emails?.[index]?.message && <p className="mt-1 text-sm text-red-600">{errors.emails[index]?.message}</p>}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append("")}
          className="mt-2 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex justify-center rounded-md border border-transparent bg-blue py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? "Updating..." : t("updateEmails")}
      </button>
    </form>
  );
}
