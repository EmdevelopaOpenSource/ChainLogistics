import dynamic from "next/dynamic";

const EventTrackingForm = dynamic(
    () => import("@/components/forms/EventTrackingForm"),
    {
        loading: () => (
            <div className="h-96 flex items-center justify-center bg-white rounded-3xl border border-gray-100 shadow p-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                    <p className="text-lg font-medium text-gray-500">Preparing tracking terminal...</p>
                </div>
            </div>
        ),
        ssr: false,
    }
);

export default function TrackingPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Event tracking</h1>
      <EventTrackingForm />
    </main>
  );
}
