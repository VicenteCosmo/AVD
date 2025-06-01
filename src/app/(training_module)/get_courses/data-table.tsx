"use client"

import { Button } from "@/components/ui/button"
import * as React from "react"
import 'react'
import { useState } from "react"
import Swal from 'sweetalert2'
import { useRouter } from "next/navigation"

import { Label } from '@/components/ui/label'
import { useToast } from "@/hooks/use-toast" 

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const [formData, setFormData] = useState({
    course: '',
    description: '',
    init_date: '',
    finish_date: '',
    instructors: '',
    requirements: ''
  })
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [ isDialogOpen, setIsDialogOpen ] = useState(false) 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:4000/trainings/insert_course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_name: formData.course,
          course_description: formData.description,
          course_init_date: formData.init_date,
          course_finish_date: formData.finish_date,
          course_instructors: formData.instructors.split(',').map(i => i.trim()),
          course_requirements: formData.requirements.split(',').map(r => r.trim())
        })
      })

      console.log(response)

      if(response.status == 500){
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Alguma coisa occorreu mal!",
                      footer: 'Certifique-se de que os dados estão correctos! '
                    });  
        
      }

      if(response.status === 201){

                  setIsDialogOpen(false)     
                  setTimeout(() => {
                    Swal.fire({
                    title: "Cadastrado com sucesso!",
                    icon: "success",
                    draggable: true
                  });

                  window.location.reload()

                  // router.refresh()
                  console.log(response)

                  }, 1000)
                  
          }

      // Reset form after successful submission
      setFormData({
        course: '',
        description: '',
        init_date: '',
        finish_date: '',
        instructors: '',
        requirements: ''
      })

    } catch (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
      router.refresh()
    }
  }
  

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
    }
  })



  return (
   <div>

     <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filtrar curso..."
          value={(table.getColumn("course_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("course_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Dialog open={isDialogOpen} >
      <DialogTrigger asChild>
       <button
            // onClick={() => setShowCreateForm(true)}
            // disabled={!selectedTable}
            onClick={() => setIsDialogOpen(true)}
            className="px-4 mr-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            + Novo Registro
          </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" >
        {/* <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader> */}
         <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Adicione um novo curso</h2>

      <div className="space-y-2">
        <Label htmlFor="course">Nome do curso</Label>
        <Input
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="init_date">Data de início</Label>
          <Input
            id="init_date"
            name="init_date"
            type="date"
            value={formData.init_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="finish_date">Data de término</Label>
          <Input
            id="finish_date"
            name="finish_date"
            type="date"
            value={formData.finish_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructors">Instructores</Label>
        <Input
          id="instructors"
          name="instructors"
          value={formData.instructors}
          onChange={handleChange}
          placeholder="John Doe, Jane Smith"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requisitos</Label>
        <Input
          id="requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          placeholder="Basic knowledge, Laptop, etc."
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating...' : 'Terminar'}
      </Button>
    </form>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsDialogOpen(false)
                router.refresh()
              }}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
        
      </DialogContent>

      
    </Dialog>

      </div>


    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Carregando...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

   </div> 
    
  )
}
