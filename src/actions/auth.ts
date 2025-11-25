"use server";

import prisma from "@/lib/prisma";
import {
  verifyPassword,
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  setAccessTokenCookie,
} from "@/lib/auth.util";
import { redirect } from "next/navigation";
import { z } from "zod";

// Login Schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

// Signup Schema
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormState = {
  success: boolean;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  user?: {
    id: string;
    username: string;
    email: string | null;
    role: string | null;
  };
};

export type SignupFormState = {
  success: boolean;
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string;
};

/**
 * Server action for user login
 */
export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    const validatedFields = loginSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username: email }],
      },
    });

    if (!user) {
      return {
        success: false,
        errors: {
          _form: ["Invalid credentials"],
        },
      };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return {
        success: false,
        errors: {
          _form: ["Invalid credentials"],
        },
      };
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set cookies
    await setRefreshTokenCookie(refreshToken);
    await setAccessTokenCookie(accessToken);

    // Return user data
    return {
      success: true,
      user: {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      errors: {
        _form: ["Failed to login. Please try again."],
      },
    };
  }
}

/**
 * Server action for user signup
 */
export async function signupAction(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  try {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    const validatedFields = signupSchema.safeParse({ username, email, password });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return {
        success: false,
        errors: {
          _form: ["User with this email or username already exists"],
        },
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set cookies
    await setRefreshTokenCookie(refreshToken);
    await setAccessTokenCookie(accessToken);

    return {
      success: true,
      message: "Account created successfully!",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      errors: {
        _form: ["Failed to create account. Please try again."],
      },
    };
  }
}
