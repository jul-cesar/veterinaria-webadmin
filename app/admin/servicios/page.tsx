import ServiciosList from "./components/ServiciosList";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function getServicios() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value; // Obtiene el valor de la cookie 'token'

  if (!token) {
    throw new Error("No se encontró el token");
  }

  const res = await fetch("http://localhost:4000/api/servicios", {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Opcional, pero útil para claridad
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener los servicios");
  }

  return res.json();
}

export default async function Page() {
  const servicios = await getServicios();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Servicios</h1>
      <ServiciosList initialServicios={servicios} />
    </div>
  );
}
