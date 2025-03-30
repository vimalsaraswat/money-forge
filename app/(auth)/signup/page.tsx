"use client";

import { registerUser } from "@/actions/user";
import InputWithLabel from "@/components/forms/InputWithLabel";
import SubmitButton from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useActionState, useState } from "react";

export default function SignupPage() {
  const [state, action] = useActionState(registerUser, null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });

  return (
    <div className="grid place-items-center">
      <Card className="w-lg aspect-video">
        <CardHeader>
          <h1 className="text-2xl font-bold">Sign Up</h1>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={action}>
            <InputWithLabel
              label="Email:"
              type="email"
              id="email"
              name="email"
              value={formData?.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
            <InputWithLabel
              label="Password:"
              type="password"
              id="password"
              name="password"
              value={formData?.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />

            {state?.otpSent && (
              <InputOTP name="otp" maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
            <SubmitButton
              label={state?.otpSent ? "Verify OTP" : "Register"}
              loadingLabel={state?.otpSent ? "Verifying..." : "Registering..."}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// import { signIn } from "@/auth";

// export default function SignIn() {
//   return (
//     <form
//       action={async (formData) => {
//         "use server";
//         await signIn("credentials", formData);
//       }}
//     >
//       <label>
//         Email
//         <input name="email" type="email" />
//       </label>
//       <label>
//         Password
//         <input name="password" type="password" />
//       </label>
//       <button>Sign In</button>
//     </form>
//   );
// }
