"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GuestForm() {
  const [fullName, setFullName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const passportPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("checkIn", checkIn);
    formData.append("checkOut", checkOut);
    formData.append("phone", phone);
    formData.append("email", email);
    if (photo) formData.append("photo", photo);
    if (passportPhoto) formData.append("passportPhoto", passportPhoto);

    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        // Reset form
        setFullName("");
        setCheckIn("");
        setCheckOut("");
        setPhone("");
        setEmail("");
        setPhoto(null);
        setPassportPhoto(null);
        if (photoInputRef.current) photoInputRef.current.value = "";
        if (passportPhotoInputRef.current)
          passportPhotoInputRef.current.value = "";
      } else {
        console.error("Failed to add guest");
      }
    } catch (error) {
      console.error("Error adding guest:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 col-span-2 p-8 border rounded-lg"
    >
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="checkIn">Check-in Date</Label>
        <Input
          id="checkIn"
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="checkOut">Check-out Date</Label>
        <Input
          id="checkOut"
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="photo">Photo</Label>
        <Input
          id="photo"
          type="file"
          accept="image/*"
          ref={photoInputRef}
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
        />
      </div>
      <div>
        <Label htmlFor="passportPhoto">Passport Photo</Label>
        <Input
          id="passportPhoto"
          type="file"
          accept="image/*"
          ref={passportPhotoInputRef}
          onChange={(e) => setPassportPhoto(e.target.files?.[0] || null)}
        />
      </div>
      <Button type="submit">Add Guest</Button>
    </form>
  );
}
