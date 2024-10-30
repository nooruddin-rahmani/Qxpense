"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Pen, Save, SquareX, Trash } from "lucide-react";

interface Guest {
  id: number;
  fullName: string;
  checkIn: string;
  checkOut: string;
  phone: string;
  email: string;
  photoPath: string | null;
  passportPhotoPath: string | null;
}

export function GuestTable() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Guest>({
    id: 0,
    fullName: "",
    checkIn: "",
    checkOut: "",
    phone: "",
    email: "",
    photoPath: null,
    passportPhotoPath: null,
  });

  useEffect(() => {
    fetchGuests();
    const interval = setInterval(fetchGuests, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/guests");
      if (response.ok) {
        const data: Guest[] = await response.json();
        setGuests(data);
      } else {
        console.error("Failed to fetch guests");
      }
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };

  const handleEdit = (guest: Guest) => {
    setEditingId(guest.id);
    setEditForm(guest);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetch(`/api/guests/${editForm.id}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        setGuests(
          guests.map((cust) => (cust.id === editForm.id ? editForm : cust))
        );
        setEditingId(null);
      } else {
        console.error("Failed to update guest");
      }
    } catch (error) {
      console.error("Error updating guest:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/guests/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setGuests(guests.filter((cust) => cust.id !== id));
      } else {
        console.error("Failed to delete guest");
      }
    } catch (error) {
      console.error("Error deleting guest:", error);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "photo" | "passportPhoto"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditForm({
        ...editForm,
        [field === "photo" ? "photoPath" : "passportPhotoPath"]: file,
      });
    }
  };

  return (
    <div className="border p-8 rounded-lg">
      <CardHeader className="p-0 pb-5">
        <CardTitle>Guests Table</CardTitle>
        <CardDescription>All Guests Here</CardDescription>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Photo</TableHead>
            <TableHead>Passport</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id}>
              {editingId === guest.id ? (
                <>
                  <TableCell>
                    <Input
                      value={editForm.fullName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, fullName: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="date"
                      value={editForm.checkIn}
                      onChange={(e) =>
                        setEditForm({ ...editForm, checkIn: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="date"
                      value={editForm.checkOut}
                      onChange={(e) =>
                        setEditForm({ ...editForm, checkOut: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="file"
                      onChange={(e) => handleFileChange(e, "photo")}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="file"
                      onChange={(e) => handleFileChange(e, "passportPhoto")}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant={"outline"}
                      onClick={handleUpdate}
                    >
                      <Save size="16" />
                    </Button>
                    <Button
                      className="ml-3"
                      size="icon"
                      variant={"outline"}
                      onClick={() => setEditingId(null)}
                    >
                      <SquareX size="16" />
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{guest.fullName}</TableCell>
                  <TableCell>
                    {new Date(guest.checkIn).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(guest.checkOut).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{guest.phone}</TableCell>
                  <TableCell>{guest.email}</TableCell>
                  <TableCell>
                    {guest.photoPath && (
                      <Image
                        src={guest.photoPath}
                        alt="Guest"
                        width={50}
                        height={50}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {guest.passportPhotoPath && (
                      <Image
                        src={guest.passportPhotoPath}
                        alt="Passport"
                        width={50}
                        height={50}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={"outline"}
                      size="icon"
                      onClick={() => handleEdit(guest)}
                    >
                      <Pen size="16" />
                    </Button>
                    <Button
                      className="ml-3"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(guest.id)}
                    >
                      <Trash size="16" />
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
