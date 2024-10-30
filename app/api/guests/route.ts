import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function ensureTableExists() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS guests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      checkIn DATE NOT NULL,
      checkOut DATE NOT NULL,
      phone VARCHAR(20),
      email VARCHAR(255),
      photoPath VARCHAR(255),
      passportPhotoPath VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(createTableSQL);
}

export async function GET(request: Request) {
  try {
    await ensureTableExists();
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;

    let query =
      "SELECT id, fullName, email, checkIn, checkOut, photoPath FROM guests ORDER BY checkIn DESC";
    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    const [guests] = await pool.query(query);
    return NextResponse.json(guests);
  } catch (error) {
    console.error("Failed to fetch guests:", error);
    return NextResponse.json(
      { error: "Failed to fetch guests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureTableExists();
    const formData = await request.formData();
    const fullName = formData.get("fullName") as string;
    const checkIn = formData.get("checkIn") as string;
    const checkOut = formData.get("checkOut") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const photo = formData.get("photo") as File | null;
    const passportPhoto = formData.get("passportPhoto") as File | null;

    let photoPath = null;
    let passportPhotoPath = null;

    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    if (photo) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      const filename = Date.now() + "_" + photo.name;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      photoPath = "/uploads/" + filename;
    }

    if (passportPhoto) {
      const buffer = Buffer.from(await passportPhoto.arrayBuffer());
      const filename = Date.now() + "_passport_" + passportPhoto.name;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      passportPhotoPath = "/uploads/" + filename;
    }

    await pool.query(
      "INSERT INTO guests (fullName, checkIn, checkOut, phone, email, photoPath, passportPhotoPath) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [fullName, checkIn, checkOut, phone, email, photoPath, passportPhotoPath]
    );

    return NextResponse.json(
      { message: "guest added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding guest:", error);
    return NextResponse.json({ error: "Failed to add guest" }, { status: 500 });
  }
}
