
import {cn} from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <img
        src="/goomi.svg"
        alt="Goomi Logo"
        className="h-14 w-auto"
      />
      <span className="text-xl font-bold tracking-tight text-foreground">Goomi</span>
    </div>
  );
};
export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <img
      src="/goomi.svg"
      alt="Goomi Icon"
      className={cn("h-8 w-8", className)}
    />
  );
};

export const LogoIconDashboard = ({ className }: { className?: string }) => {
  return (
    <img
      src="/goomi.svg"
      alt="Goomi Icon"
      className={cn("h-15 w-15", className)}
    />
  );
};