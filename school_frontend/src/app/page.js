
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const API_BASE_URL = "http://localhost:8000";





export default function Home() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [ordering, setOrdering] = useState("full_name")
  
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [page, setPage] = useState(1);


  // punto 1
  const loadStudents = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/students/?page=${page}`);
    const data = await res.json();
    setStudents(data.results);
    setNextPage(data.next);
    setPrevPage(data.previous);
  }

  useEffect(() => {
    loadStudents(page);
  }, [page]);
  
  const orderingClickHandler = (button) => {
    if (button === 'name_button') {
      if (ordering === 'full_name') setOrdering('-full_name')
      else setOrdering('full_name')
    } else {
      if (ordering === 'code') setOrdering('-code')
      else setOrdering('code')
    }
  }


  useEffect(() => {
    loadStudents().then((data) => {
      setStudents(data);
    });
  }, [query, ordering]);


  const onSubmit = async (data) => {
    console.log("Submitting data: ", data);
    const response = await fetch(`${API_BASE_URL}/students/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
    )
    if (response.ok) {
      const newStudent = await response.json();
      loadStudents().then((data) => {
      setStudents(data);
    });
      // setStudents([newStudent,...students]);
      toast.success("Estudiante agregado con éxito");

    }
    else {
      const errorData = await response.json();
      console.error("Error adding student: ", errorData);

      let errorMessage = "";

      for(const key in errorData) {
        errorMessage += `${key}: ${errorData[key]}\n`;
      }

      toast.error("Error al agregar el estudiante", {
        description: errorMessage,
      });
    }
  }

  return (
    <Card className="w-96 mx-auto mt-4">
      <CardHeader>
        <CardTitle>Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button variant="outline" onClick={() => { orderingClickHandler("name_button") }}>
            {ordering === 'full_name' ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>
          <Button variant="outline" onClick={() => { orderingClickHandler("code_button") }}>
            {ordering === 'code' ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>
        </div>
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <div className="p-4 h-96 overflow-y-auto">
          <ul>
            {students.map((student) => (
              <li key={student.code} className="text-md font-medium my-2 flex flex-row justify-between" title={student.email}>
                <div>
                  {student.full_name}

                </div>
                <div>
                  {student.code}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <div>
          <Field className="mt-4">
            <FieldLabel htmlFor="full_name" >Nombre completo</FieldLabel>
            <Input id="full_name" placeholder="Ingresa el nombre" {...register("full_name", { required: true })}></Input>
          </Field>
          <Field className="mt-4">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" placeholder="Ingresa el email" {...register("email", { required: true })}></Input>
          </Field>
          <Field className="mt-4">
            <FieldLabel htmlFor="code">Código</FieldLabel>
            <Input id="code" placeholder="Ingresa el código" {...register("code", { required: true })}></Input>
          </Field>
          <Button className="my-2" onClick={handleSubmit(onSubmit)}>
            Agregar estudiante
          </Button>
        </div>


        {/* PAGINACIÓN */}
      <Pagination>
        <PaginationContent>

          {/* Página anterior */}
          <PaginationPrevious
            disabled={!prevPage}
            className={!prevPage ? "opacity-50 cursor-not-allowed" : ""}
            onClick={() => {
              if (prevPage) setPage(page - 1);
            }}
          />

          {/* Página siguiente */}
          <PaginationNext
            disabled={!nextPage}
            className={!nextPage ? "opacity-50 cursor-not-allowed" : ""}
            onClick={() => {
              if (nextPage) setPage(page + 1);
            }}
          />

        </PaginationContent>
      </Pagination>
      </CardContent>
    </Card>

  );
}
