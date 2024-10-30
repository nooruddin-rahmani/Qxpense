import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { writeFile, unlink } from "fs/promises";
import path from "path";

interface Guest {
  photoPath: string | null;
  passportPhotoPath: string | null;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const fullName = formData.get("fullName") as string;
    const checkIn = formData.get("checkIn") as string;
    const checkOut = formData.get("checkOut") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const photo = formData.get("photo") as File | null;
    const passportPhoto = formData.get("passportPhoto") as File | null;

    const existingGuestResult = await query<Guest[]>(
      "SELECT photoPath, passportPhotoPath FROM guests WHERE id = ?",
      [params.id]
    );

    if (existingGuestResult.length === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    const existingGuest = existingGuestResult[0];
    let photoPath = existingGuest.photoPath;
    let passportPhotoPath = existingGuest.passportPhotoPath;

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (photo) {
      if (photoPath) {
        await unlink(path.join(process.cwd(), "public", photoPath)).catch(
          console.error
        );
      }
      const buffer = Buffer.from(await photo.arrayBuffer());
      const filename = Date.now() + "_" + photo.name;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      photoPath = "/uploads/" + filename;
    }

    if (passportPhoto) {
      if (passportPhotoPath) {
        await unlink(
          path.join(process.cwd(), "public", passportPhotoPath)
        ).catch(console.error);
      }
      const buffer = Buffer.from(await passportPhoto.arrayBuffer());
      const filename = Date.now() + "_passport_" + passportPhoto.name;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      passportPhotoPath = "/uploads/" + filename;
    }

    await query(
      "UPDATE guests SET fullName = ?, checkIn = ?, checkOut = ?, phone = ?, email = ?, photoPath = ?, passportPhotoPath = ? WHERE id = ?",
      [
        fullName,
        checkIn,
        checkOut,
        phone,
        email,
        photoPath,
        passportPhotoPath,
        params.id,
      ]
    );

    return NextResponse.json({ message: "Guest updated successfully" });
  } catch (error) {
    console.error("Failed to update Guest:", error);
    return NextResponse.json(
      { error: "Failed to update guest" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existingGuestResult = await query<Guest[]>(
      "SELECT photoPath, passportPhotoPath FROM guests WHERE id = ?",
      [params.id]
    );

    if (existingGuestResult.length === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    const existingGuest = existingGuestResult[0];
    const photoPath = existingGuest.photoPath;
    const passportPhotoPath = existingGuest.passportPhotoPath;

    if (photoPath) {
      await unlink(path.join(process.cwd(), "public", photoPath)).catch(
        console.error
      );
    }

    if (passportPhotoPath) {
      await unlink(path.join(process.cwd(), "public", passportPhotoPath)).catch(
        console.error
      );
    }

    await query("DELETE FROM guests WHERE id = ?", [params.id]);
    return NextResponse.json({ message: "Guest deleted successfully" });
  } catch (error) {
    console.error("Failed to delete guest:", error);
    return NextResponse.json(
      { error: "Failed to delete guest" },
      { status: 500 }
    );
  }
}
