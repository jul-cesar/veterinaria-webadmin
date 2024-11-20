"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical, Edit, Trash } from "lucide-react";
import EditServicioForm, { Servicio } from "./EditServicioForm";

export default function ServiciosList({
  initialServicios,
}: {
  initialServicios: Servicio[];
}) {
  const [servicios, setServicios] = useState(initialServicios);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);

  const handleEdit = (servicio: Servicio) => {
    setEditingServicio(servicio);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = Cookies.get("token"); // Obtiene el token desde las cookies
      if (!token) {
        throw new Error("No se encontró el token de autorización");
      }

      const res = await fetch(`http://localhost:4000/api/servicios/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Añade el token como Bearer en el header
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setServicios(servicios.filter((s) => s.id_servicio !== id));
      } else {
        console.error("Error al eliminar el servicio");
      }
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
    }
  };

  const handleUpdate = (updatedServicio: Servicio) => {
    setServicios(
      servicios.map((s) =>
        s.id_servicio === updatedServicio.id_servicio ? updatedServicio : s
      )
    );
    setEditingServicio(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {servicios.map((servicio) => (
        <Card key={servicio.id_servicio} className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {servicio.nombre}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleEdit(servicio)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600"
                    onClick={() => handleDelete(servicio.id_servicio)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </PopoverContent>
              </Popover>
            </CardTitle>
            <CardDescription>{servicio.descripcion}</CardDescription>
          </CardHeader>
          <CardContent>
            <img
              src={servicio.img}
              alt={servicio.nombre}
              className="w-full h-48 object-cover rounded-md"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>Precio: ${servicio.precio}</div>
            {servicio.duracion && <div>Duración: {servicio.duracion} min</div>}
          </CardFooter>
        </Card>
      ))}
      {editingServicio && (
        <EditServicioForm
          servicio={editingServicio}
          onUpdate={handleUpdate}
          onCancel={() => setEditingServicio(null)}
        />
      )}
    </div>
  );
}
