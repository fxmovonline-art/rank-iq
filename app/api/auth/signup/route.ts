import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    console.log(body);
    
    const { email, password } = body as { email?: string; password?: string };

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    let existing;
    try {
      existing = await db.user.findUnique({ where: { email } });
    } catch (dbError: any) {
      console.error("Database error checking existing user:", dbError);
      return NextResponse.json(
        { error: "Unable to process request. Please try again later." },
        { status: 503 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    let passwordHash;
    try {
      passwordHash = await bcrypt.hash(password, 10);
    } catch (hashError: any) {
      console.error("Password hashing error:", hashError);
      return NextResponse.json(
        { error: "Unable to process request. Please try again later." },
        { status: 500 }
      );
    }

    // Create new user
    let newUser;
    try {
      newUser = await db.user.create({
        data: {
          email,
          passwordHash,
          plan: "free",
          usageCount: 0,
        },
      });
    } catch (dbError: any) {
      console.error("Database error creating user:", dbError);
      return NextResponse.json(
        { error: "Unable to create account. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "Account created successfully" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
