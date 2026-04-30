"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { ProductFormState } from "./actions";

// Avoid importing Prisma enum into a client bundle — declare values inline.
const PRODUCT_STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
export type ProductStatusValue = (typeof PRODUCT_STATUSES)[number];

type Category = { id: string; name: string };
type ProductInitial = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  price: number | string;
  compareAt: number | string;
  stock: number | string;
  weightGram: number | string;
  status: ProductStatusValue;
  primaryImageUrl: string;
};

export type ProductFormAction = (
  prev: ProductFormState,
  formData: FormData,
) => Promise<ProductFormState>;

const initialState: ProductFormState = {};

export function ProductForm({
  action,
  categories,
  initial,
  submitLabel,
  cancelHref,
  extraSlot,
}: {
  action: ProductFormAction;
  categories: Category[];
  initial: ProductInitial;
  submitLabel: string;
  cancelHref: string;
  extraSlot?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 md:grid-cols-2 gap-lg max-w-[960px] mx-auto"
    >
      <div className="md:col-span-2 flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Name
        </label>
        <input
          name="name"
          required
          minLength={2}
          maxLength={200}
          defaultValue={initial.name}
          className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded text-body-md text-on-surface focus:outline-none focus:border-secondary"
        />
        {state.fieldErrors?.name?.length ? (
          <p className="text-body-sm text-error">
            {state.fieldErrors.name.join(", ")}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Slug (opsional)
        </label>
        <input
          name="slug"
          pattern="[a-z0-9-]+"
          maxLength={80}
          defaultValue={initial.slug}
          placeholder="otomatis dari name"
          className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded text-body-md text-on-surface font-mono focus:outline-none focus:border-secondary"
        />
        {state.fieldErrors?.slug?.length ? (
          <p className="text-body-sm text-error">
            {state.fieldErrors.slug.join(", ")}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Category
        </label>
        <select
          name="categoryId"
          defaultValue={initial.categoryId}
          className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded text-body-md text-on-surface focus:outline-none focus:border-secondary"
        >
          <option value="">— Tanpa kategori —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2 flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Description
        </label>
        <textarea
          name="description"
          rows={5}
          maxLength={5000}
          defaultValue={initial.description}
          className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded text-body-md text-on-surface focus:outline-none focus:border-secondary resize-y"
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Price (USD)
        </label>
        <input
          name="price"
          type="number"
          required
          min={0}
          step="0.01"
          defaultValue={initial.price}
          className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded text-body-md text-on-surface font-data-tabular focus:outline-none focus:border-secondary"
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Compare-at price (opsional)
        </label>
        <input
          name="compareAt"
          type="number"
          min={0}
          step="0.01"
          defaultValue={initial.compareAt}
          className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded text-body-md text-on-surface font-data-tabular focus:outline-none focus:border-secondary"
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Stock
        </label>
        <input
          name="stock"
          type="number"
          required
          min={0}
          step={1}
          defaultValue={initial.stock}
          className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded text-body-md text-on-surface font-data-tabular focus:outline-none focus:border-secondary"
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Weight (gram)
        </label>
        <input
          name="weightGram"
          type="number"
          min={0}
          step={1}
          defaultValue={initial.weightGram}
          className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded text-body-md text-on-surface font-data-tabular focus:outline-none focus:border-secondary"
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Status
        </label>
        <select
          name="status"
          defaultValue={initial.status}
          className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded text-body-md text-on-surface focus:outline-none focus:border-secondary"
        >
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="md:col-span-2 flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Primary Image URL
        </label>
        <input
          name="primaryImageUrl"
          type="url"
          defaultValue={initial.primaryImageUrl}
          placeholder="https://..."
          className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded text-body-md text-on-surface focus:outline-none focus:border-secondary"
        />
      </div>

      {state.error ? (
        <p className="md:col-span-2 text-body-sm text-error">{state.error}</p>
      ) : null}

      <div className="md:col-span-2 flex items-center justify-between gap-md mt-md">
        <Link
          href={cancelHref}
          className="px-md py-sm border border-outline-variant text-on-surface rounded font-label-md text-label-md hover:bg-surface-container-low transition-colors"
        >
          Cancel
        </Link>
        <div className="flex items-center gap-sm">
          {extraSlot}
          <button
            type="submit"
            disabled={pending}
            className="px-md py-sm bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-surface-tint transition-colors disabled:opacity-50"
          >
            {pending ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
