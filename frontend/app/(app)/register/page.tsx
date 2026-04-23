import dynamic from "next/dynamic";

const ProductRegistrationForm = dynamic(
  () => import("@/components/forms/ProductRegistrationForm").then((mod) => mod.ProductRegistrationForm),
  {
    loading: () => (
      <div className="h-96 flex items-center justify-center bg-white rounded-xl border p-8 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
          <p className="text-sm font-medium text-zinc-500">Loading registration form...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function RegisterProductPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-zinc-900">Product Registration</h1>
        <p className="text-zinc-600 mt-2">Registers your product assets on the Stellar blockchain for verified tracking.</p>
      </div>

      <ProductRegistrationForm />
    </main>
  );
}
