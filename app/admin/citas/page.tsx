import { cookies } from "next/headers";
import CitasList from "./components/CitasList";

export const dynamic = "force-dynamic";

async function getCitas() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value; // Obtiene el valor de la cookie 'token'

  if (!token) {
    throw new Error("No se encontró el token");
  }
  const res = await fetch("http://localhost:4000/api/citas", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Opcional, pero útil para claridad
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch citas");
  }
  return res.json();
}

export default async function CitasPage() {
  const citas = await getCitas();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Citas</h1>
      <CitasList initialCitas={citas} />
    </div>
  );
}
