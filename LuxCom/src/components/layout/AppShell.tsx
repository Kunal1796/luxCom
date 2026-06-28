import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { DesktopNav } from "./DesktopNav";

type AppShellProps = {
  showBottomNav?: boolean;
};

export function AppShell({ showBottomNav = true }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background font-sans">
      <DesktopNav />
      <main
        className={`mx-auto w-full max-w-7xl ${
          showBottomNav ? "pb-24 lg:pb-12" : "pb-12"
        }`}
      >
        <Outlet />
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
