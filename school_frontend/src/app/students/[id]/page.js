"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "http://localhost:8000";

export default function StudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const res = await fetch(`${API_BASE_URL}/students/${id}/`);
      const data = await res.json();
      setStudent(data);
    };

    fetchStudent();
  }, [id]);

  if (!student) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <Card className="w-96 mx-auto mt-10">
      <CardHeader>
        <CardTitle>Detalle del estudiante</CardTitle>
      </CardHeader>

      <CardContent>
        <p><strong>Nombre:</strong> {student.full_name}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Código:</strong> {student.code}</p>
        <p><strong>Grupo:</strong> {student.group}</p>

        <Button 
          className="mt-4 w-full"
          onClick={() => window.history.back()}
        >
          Volver
        </Button>
      </CardContent>
    </Card>
  );
}
