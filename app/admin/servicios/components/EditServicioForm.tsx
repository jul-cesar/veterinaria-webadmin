"use client";

import React, { useState } from "react";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedServicio((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/servicios/${servicio.id_servicio}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedServicio),
        }
      );
      if (res.ok) {
        onUpdate(editedServicio);
      } else {
        console.error("Error updating service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
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
