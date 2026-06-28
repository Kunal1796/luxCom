import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { FiLock, FiMail } from "../ui/icons";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

type LoginFormProps = {
  redirectTo?: string;
};

export function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "john@mail.com", password: "changeme" },
  });

  async function onSubmit(data: LoginFormData) {
    await login(data, redirectTo);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h2 className="text-headline-md text-on-surface">Welcome Back</h2>
        <p className="text-body-md text-on-surface-variant">
          Log in to access your curated shop.
        </p>
      </div>

      <Input
        label="Email Address"
        type="email"
        icon={<FiMail size={16} />}
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        icon={<FiLock size={16} />}
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="text-right">
        <button type="button" className="text-body-md text-primary-container">
          Forgot Password?
        </button>
      </div>

      <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
