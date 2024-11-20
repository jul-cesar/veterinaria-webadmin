"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export type Servicio = {
  id_servicio: string;
  nombre: string;
  img: string;
  precio: number;
  descripcion?: string;
  duracion?: number;
  recomendaciones?: string;
};

type EditServicioFormProps = {
  servicio: Servicio;
  onUpdate: (updatedServicio: Servicio) => void;
  onCancel: () => void;
};

export default function EditServicioForm({
  servicio,
  onUpdate,
  onCancel,
}: EditServicioFormProps) {
  const [editedServicio, setEditedServicio] = useState(servicio);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedServicio((prev) => ({
      ...prev,
      [name]: Number.isInteger(value) ? value.toString() : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const res = await fetch(
        `http://localhost:4000/api/servicios/${servicio.id_servicio}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Añadir el token como Bearer
          },
          body: JSON.stringify({
            ...editedServicio,
            precio: editedServicio.precio.toString(),
          }),
        }
      );

      if (res.ok) {
        toast({
          title: "Servicio editado",
        });
        onUpdate(editedServicio);
      } else {
        console.error("Error al actualizar el servicio");
      }
    } catch (error) {
      console.error("Error al actualizar el servicio:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Servicio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                name="nombre"
                value={editedServicio.nombre}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precio" className="text-right">
                Precio
              </Label>
              <Input
                id="precio"
                name="precio"
                type="number"
                min={10000}
                value={editedServicio.precio}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duracion" className="text-right">
                Duración
              </Label>
              <Input
                id="duracion"
                name="duracion"
                type="number"
                value={editedServicio.duracion || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={editedServicio.descripcion || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
