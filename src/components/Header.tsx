import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { getProfile, getSessionUser } from "@/lib/auth";

interface HeaderProps {
  showFeaturesLink?: boolean;
}

export async function Header({ showFeaturesLink = false }: HeaderProps) {
  const user = await getSessionUser();
  const profile = user ? await getProfile() : null;

  return (
    <header className="sticky top-0 z-50 bg-canvas-raised">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-lg font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          CivicPulse
        </Link>

        <nav className="flex items-center gap-3 text-sm sm:gap-5">
          {showFeaturesLink && (
            <a
              href="#features"
              className="hidden text-slate-civic transition-colors hover:text-ink sm:inline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Features
            </a>
          )}
          {user ? (
            <>
              <Link
                href="/submit"
                className="text-slate-civic transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Submit
              </Link>
              <Link
                href="/my-submissions"
                className="hidden text-slate-civic transition-colors hover:text-ink sm:inline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                My Submissions
              </Link>
              {profile?.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="text-slate-civic transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  Admin
                </Link>
              )}
              <span className="hidden text-line sm:inline">|</span>
              <span className="hidden max-w-[140px] truncate text-slate-civic sm:inline">
                {profile?.full_name || user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-[12px] border border-line px-3 py-1.5 text-ink transition-all duration-200 hover:bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-civic transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Sign in
              </Link>
              <Link href="/signup" className="btn-primary px-4 py-2 text-sm">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="gradient-line" />
    </header>
  );
}
