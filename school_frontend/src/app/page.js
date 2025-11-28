
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";

import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";


const API_BASE_URL = "http://localhost:8000";

export default function Home() {
  const { register, handleSubmit } = useForm();
  const [open, setOpen] = useState(false);


  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [ordering, setOrdering] = useState("full_name");
  const [page, setPage] = useState(1);

  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  // ==========================
  //   CARGAR ESTUDIANTES
  // ==========================
  const loadStudents = async (pageNumber = page) => {
    try {
      const url = `${API_BASE_URL}/students/?page=${pageNumber}&search=${query}&ordering=${ordering}`;
      console.log("Fetching:", url);

      const res = await fetch(url);

      if (!res.ok) {
        console.error("Error cargando estudiantes:", res.status);
        return;
      }

      const data = await res.json();

      setStudents(data.results || []);
      setNextPage(data.next);
      setPrevPage(data.previous);
    } catch (error) {
      console.error("Error fetch:", error);
    }
  };

  useEffect(() => {
    loadStudents(page);
  }, [page]);


  useEffect(() => {
    setPage(1);
    loadStudents(1);
  }, [query, ordering]);

  // ==========================
  //   ORDENAMIENTO
  // ==========================
  const toggleOrdering = (field) => {
    if (ordering === field) {
      setOrdering(`-${field}`);
    } else {
      setOrdering(field);
    }
  };

  // ==========================
  //   AGREGAR ESTUDIANTE
  // ==========================
  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${API_BASE_URL}/students/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Error al agregar estudiante");
        return;
      }

      toast.success("Estudiante agregado");
      loadStudents(1);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================
  //   UI
  // ==========================
  return (
    <Card className="w-96 mx-auto mt-4">

      <CardHeader className="justify-center">
        <CardTitle>Students</CardTitle>
      </CardHeader>



      <CardContent>
        {/* Buscar - Orden */}
        <div className="flex gap-4">
          <Input
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <Button variant="outline" onClick={() => toggleOrdering("full_name")}>
            {ordering === "full_name" ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>

          <Button variant="outline" onClick={() => toggleOrdering("code")}>
            {ordering === "code" ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>
        </div>

        <hr className="my-3" />

        {/* Estudiantes */}
        <div className="p-4 h-96 overflow-y-auto">
          <ul>
            {students.map((s) => (
              <li
                key={s.code}
                className="flex justify-between my-2 text-md font-medium hover:bg-gray-100 p-2 rounded"
              >
                <Link href={`/students/${s.id}`} className="flex justify-between w-full">
                  <span>{s.full_name}</span>
                  <span>{s.code}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <hr className="my-3" />
        
        {/* Formulario */}
        <div className="flex justify-center w-max h-max mx-auto items-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="mt-2">Crear estudiante</Button>
            </DialogTrigger>    <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar estudiante</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Field>
                  <FieldLabel>Nombre completo</FieldLabel>
                  <Input {...register("full_name", { required: true })} />
                </Field>

                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input {...register("email", { required: true })} />
                </Field>

                <Field>
                  <FieldLabel>Código</FieldLabel>
                  <Input {...register("code", { required: true })} />
                </Field>
              </div>

              <DialogFooter>
                <Button onClick={handleSubmit(onSubmit)}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <hr className="my-3" />
        
        {/* Paginación */}
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              disabled={!prevPage}
              className={!prevPage ? "opacity-50 cursor-not-allowed" : ""}
              onClick={() => prevPage && setPage(page - 1)}
            />

            <PaginationNext
              disabled={!nextPage}
              className={!nextPage ? "opacity-50 cursor-not-allowed" : ""}
              onClick={() => nextPage && setPage(page + 1)}
            />
          </PaginationContent>
        </Pagination>

        <hr className="mt-3" />

      </CardContent>
    </Card>
  );
}
