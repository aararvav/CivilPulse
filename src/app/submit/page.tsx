import { Header } from "@/components/Header";
import { SubmitForm } from "./submit-form";

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />

      <main className="mx-auto max-w-content px-4 py-10 sm:px-6">
        <div className="max-w-2xl">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Submit a Development Request
          </h1>
          <p className="mt-2 text-sm text-slate-civic">
            Share a local development need with your MP office. Your submission will be reviewed
            by constituency staff.
          </p>

          <div className="card-static mt-8 p-6 sm:p-8">
            <SubmitForm />
          </div>
        </div>
      </main>
    </div>
  );
}
