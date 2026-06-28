import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthTabs } from "../components/auth/AuthTabs";
import { LoginForm } from "../components/auth/LoginForm";
import { SignupForm } from "../components/auth/SignupForm";
import { Button } from "../components/ui/Button";
import { Header } from "../components/layout/Header";
import { useAuth } from "../hooks/useAuth";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const { isAuthenticated, signOut, user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = (location.state as { from?: string })?.from ?? "/";

  if (isAuthenticated && user) {
    return (
      <>
        <Header showMenu={false} title="My Account" />
        <div className="flex min-h-[calc(100dvh-6rem)] items-center justify-center bg-linear-to-b from-surface-container-low to-background px-margin-mobile py-stack-lg lg:min-h-[calc(100dvh-4rem)] lg:px-margin-desktop">
          <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-8 shadow-elevation-2 lg:max-w-lg lg:p-10">
            <h1 className="text-center text-headline-md font-bold text-primary-container lg:text-headline-lg">
              My Account
            </h1>
            <p className="mt-2 text-center text-body-md text-on-surface-variant">
              Signed in as {user.email}
            </p>
            <div className="mt-6 space-y-3">
              <Button fullWidth onClick={() => navigate("/")}>
                Continue Shopping
              </Button>
              {isAdmin && (
                <Button fullWidth variant="secondary" onClick={() => navigate("/admin")}>
                  Admin Panel
                </Button>
              )}
              <Button fullWidth variant="secondary" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header showMenu={false} />
      <div className="flex min-h-[calc(100dvh-6rem)] flex-col lg:min-h-[calc(100dvh-4rem)] lg:flex-row">
        <div className="hidden flex-1 flex-col justify-center bg-primary-container px-12 py-16 lg:flex xl:px-20">
          <h1 className="text-headline-lg font-bold text-on-primary xl:text-4xl">
            LuxCom
          </h1>
          <p className="mt-4 max-w-md text-body-lg text-on-primary/80">
            Elegance in every click. Discover premium products curated for the
            modern lifestyle.
          </p>
          <ul className="mt-8 space-y-3 text-body-md text-on-primary/90">
            <li>Exclusive member deals</li>
            <li>Free shipping on all orders</li>
            <li>Secure checkout &amp; easy returns</li>
          </ul>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center bg-linear-to-b from-surface-container-low to-background px-margin-mobile py-stack-lg lg:px-12 lg:py-16 xl:px-20">
          <div className="mb-6 text-center lg:hidden">
            <h1 className="text-headline-md font-bold text-primary-container">LuxCom</h1>
            <p className="text-body-md text-on-surface-variant">Elegance in every click.</p>
          </div>

          <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-elevation-2 lg:max-w-lg lg:p-8">
            <AuthTabs active={tab} onChange={setTab} />

            {tab === "login" ? (
              <LoginForm redirectTo={redirectTo} />
            ) : (
              <SignupForm redirectTo={redirectTo} />
            )}

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-outline-variant" />
              <span className="text-label-md text-on-surface-variant">OR CONTINUE WITH</span>
              <div className="h-px flex-1 bg-outline-variant" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" type="button">
                Google
              </Button>
              <Button variant="secondary" type="button">
                Apple
              </Button>
            </div>

            <p className="mt-6 text-center text-label-sm text-on-surface-variant">
              By continuing, you agree to LuxCom&apos;s{" "}
              <Link to="/" className="underline">
                Terms of Service
              </Link>{" "}
              and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
