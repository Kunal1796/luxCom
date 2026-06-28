import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { FiLock, FiMail, FiUser } from "../ui/icons";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

type SignupFormProps = {
  redirectTo?: string;
};

export function SignupForm({ redirectTo = "/" }: SignupFormProps) {
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    await signup(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      redirectTo,
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h2 className="text-headline-md text-on-surface">Create Account</h2>
        <p className="text-body-md text-on-surface-variant">
          Join LuxCom for a premium shopping experience.
        </p>
      </div>

      <Input
        label="Full Name"
        icon={<FiUser size={16} />}
        error={errors.name?.message}
        {...register("name")}
      />

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

      <Input
        label="Confirm Password"
        type="password"
        icon={<FiLock size={16} />}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
