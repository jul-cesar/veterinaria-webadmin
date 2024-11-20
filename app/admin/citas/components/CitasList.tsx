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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UserIcon, PawPrintIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

type CitaEstado = "programada" | "completada" | "cancelada";

type Cita = {
  id_cita: string;
  usuario: {
    id_usuario: string;
    email: string;
    nombre: string;
  };
  mascota: {
    id_mascota: string;
    nombre: string;
  };
  servicio: {
    id_servicio: string;
    nombre: string;
  };
  descripcion?: string;
  estado: CitaEstado;
  fecha_creacion: string;
};

export default function CitasList({ initialCitas }: { initialCitas: Cita[] }) {
  const { toast } = useToast();

  const [citas, setCitas] = useState<Cita[]>(initialCitas);

  const updateCitaEstado = async (id_cita: string, nuevoEstado: CitaEstado) => {
    try {
      const token = Cookies.get("token"); // Obtener el token desde las cookies
      if (!token) {
        throw new Error("No se encontró el token de autorización");
      }

      const res = await fetch(`http://localhost:4000/api/citas/${id_cita}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) {
        throw new Error("Failed to update cita");
      }

      setCitas((prevCitas) =>
        prevCitas.map((cita) =>
          cita.id_cita === id_cita ? { ...cita, estado: nuevoEstado } : cita
        )
      );

      toast({
        title: "Estado de cita actualizado",
        description: `La cita ha sido marcada como ${nuevoEstado}`,
      });
    } catch (error) {
      console.error("Error updating cita:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la cita",
        variant: "destructive",
      });
    }
  };

  if (citas.length < 1) {
    return <div>No hay citas en el momento.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {citas.map((cita) => (
        <Card key={cita.id_cita} className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Cita {cita.id_cita.slice(0, 8)}...
              <Badge
                variant={
                  cita.estado === "programada"
                    ? "default"
                    : cita.estado === "completada"
                    ? "secondary"
                    : "outline"
                }
              >
                {cita.estado}
              </Badge>
            </CardTitle>
            <CardDescription>
              <CalendarIcon className="inline-block mr-2" size={16} />
              {format(new Date(cita.fecha_creacion), "dd/MM/yyyy, hh:mm:ss a", {
                locale: es,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <UserIcon className="mr-2" size={16} />
                <span>
                  {cita.usuario.nombre} ({cita.usuario.email})
                </span>
              </div>
              <div className="flex items-center">
                <PawPrintIcon className="mr-2" size={16} />
                <span>{cita.mascota.nombre}</span>
              </div>
              <div>
                <strong>Servicio:</strong> {cita.servicio.nombre}
              </div>
              {cita.descripcion && (
                <div>
                  <strong>Descripción:</strong> {cita.descripcion}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
            <p className="text-sm text-muted-foreground">
              ID Cita: {cita.id_cita}
            </p>
            <div className="flex gap-2 mt-2">
              {cita.estado === "programada" && (
                <>
                  <Button
                    onClick={() => updateCitaEstado(cita.id_cita, "completada")}
                    variant="outline"
                    size="sm"
                  >
                    Marcar como completada
                  </Button>
                  <Button
                    onClick={() => updateCitaEstado(cita.id_cita, "cancelada")}
                    variant="outline"
                    size="sm"
                  >
                    Cancelar cita
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
