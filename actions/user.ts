"use server";

import { auth } from "@/auth";
import { DB } from "@/db/queries";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { sendEmail } from "./mail";
import { SignInSchema } from "@/types/zod-schema";
import { hashPassword } from "@/auth/credentials";

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function updateUser(formData: FormData) {
  try {
    const image = formData.get("image") as File;
    const name = formData.get("name") as string;

    if (!(name?.length > 4) && !(name?.length < 24)) {
      throw new Error(
        "Name must be at least 4 characters long and no more than 24 characters",
      );
    }

    let imageUrl: string | null = null;
    if (image?.size > 0) {
      imageUrl = await uploadImage(image);
      if (!imageUrl) {
        throw new Error("Image upload failed");
      }
    }

    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    await DB.updateUser(session.user.id, {
      name,
      ...(imageUrl ? { image: imageUrl } : {}),
    });

    revalidatePath("/profile");
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error?.message ?? "Error updating user" };
  }
}

type PrevState =
  | {
      success?: boolean;
      message?: string;
      otpSent?: boolean;
      loggedIn?: boolean;
      resend?: boolean;
      errors?: {
        email?: string[];
        password?: string[];
        otp?: string[];
      };
    }
  | undefined
  | null;

export async function registerUser(prevState: PrevState, formData: FormData) {
  try {
    const { email, password, otp, resendOtp } = Object.fromEntries(
      formData,
    ) as Record<string, string>;

    const validatedData = SignInSchema.safeParse({ email, password });

    if (!validatedData.success) {
      return {
        ...prevState,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { email: validatedEmail, password: validatedPassword } =
      validatedData.data;

    if (!prevState?.otpSent || resendOtp) {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      await sendVerificationEmail(email, newOtp);
      await redis.setex(`otp:${email}`, 5 * 60, newOtp);

      return {
        ...prevState,
        success: true,
        loggedIn: false,
        otpSent: true,
        message: "OTP sent. Please verify your email.",
      };
    }

    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp || storedOtp !== Number(otp)) {
      return {
        ...prevState,
        success: false,
        loggedIn: false,
        message: "Invalid OTP",
      };
    }

    const hashedPassword = hashPassword(validatedPassword);

    await DB.createUser({
      email: validatedEmail,
      password: hashedPassword,
      name: email.split("@")[0],
    });

    // Clear OTP after successful registration
    await redis.del(`otp:${email}`);

    return {
      ...prevState,
      success: true,
      message: "Registration successful. Please verify your email.",
    };
  } catch (err) {
    const error = err as Error;
    return { success: false, message: error?.message ?? "Error creating user" };
  }
}

async function sendVerificationEmail(email: string, otp: string) {
  console.log(`Sending verification email to ${email} with OTP: ${otp}`);
  await sendEmail({
    email: email,
    subject: "Knock Knock... OTP’s Here! Open Up!",
    message: `
      <html>
      <head>
        <title>Email Verification – Prove You're Real</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600&display=swap');

          body {
            font-family: 'Raleway', sans-serif;
            background-color: #121212;
            text-align: center;
            padding: 40px;
            color: #fff;
          }
          .container {
            background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
            max-width: 500px;
            margin: auto;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          h1 {
            color: #ffcc00;
            font-size: 28px;
            margin-bottom: 10px;
          }
          p {
            color: #ccc;
            font-size: 16px;
            line-height: 1.6;
          }
          .otp-box {
            font-size: 32px;
            font-weight: bold;
            background: #ffcc00;
            color: #222;
            display: inline-block;
            padding: 15px 30px;
            border-radius: 5px;
            margin: 20px 0;
            letter-spacing: 2px;
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
          }
          .cta {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #fff;
            background: #ff5733;
            text-decoration: none;
            border-radius: 5px;
            box-shadow: 0 4px 10px rgba(255, 87, 51, 0.3);
            transition: all 0.3s ease;
          }
          .cta:hover {
            background: #ff6f47;
            box-shadow: 0 6px 15px rgba(255, 87, 51, 0.4);
          }
          .footer {
            margin-top: 25px;
            font-size: 14px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔥 Hey, Future Millionaire! 🔥</h1>
          <p>So, you've decided to sign up on <strong>Money Forge</strong>.<br> Bold move. Big dreams. We respect that.</p>
          <p>But let’s be real—do you even exist? 🤔 Just to be sure, here’s your <em>highly classified, VIP-only</em> OTP:</p>
          <div class="otp-box">${otp}</div>
          <p>Act fast! This OTP expires quicker than a bad investment.</p>
          <a href="#" class="cta">Verify Now</a>
          <p class="footer">- Vimal, The Guy Who <em>Really</em> Wants You to Sign Up</p>
        </div>
      </body>
      </html>
    `,
  });
}
