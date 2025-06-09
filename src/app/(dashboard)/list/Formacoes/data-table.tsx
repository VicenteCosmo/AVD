"use client"

import { Button } from "@/components/ui/button"
import * as React from "react"
import { useState, useEffect } from "react"
import 'react'
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

export type Course = {
  id: number
  course_name: string
  course_description: string
  course_init_date: string | null
  course_finish_date: string | null
  course_instructors: string
  course_requirements: string
  status: 'pending' | 'processing' | 'success' | 'failed'
}
function formatDate(dateString: string | null) {
  if (!dateString) return '—'
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}
export default function CoursesPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Dados e estado de loading
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  // Estado do modal e form
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    course: '',
    description: '',
    init_date: '',
    finish_date: '',
    instructors: '',
    requirements: ''
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])  

  // Colunas da tabela
  const columns = React.useMemo<ColumnDef<Course>[]>(() => [
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const statusMap: Record<string,string> = {
          pending: 'Pendente',
          processing: 'Em processamento',
          success: 'Concluído',
          failed: 'Falhou',
        }
        return statusMap[row.original.status] || row.original.status
      }
    },
    { accessorKey: 'course_name', header: 'Curso' },
    { accessorKey: 'course_description', header: 'Descrição' },
    {
      accessorKey: 'course_init_date',
      header: 'Início',
      cell: ({ row }) => formatDate(row.original.course_init_date)
    },
    {
      accessorKey: 'course_finish_date',
      header: 'Término',
      cell: ({ row }) => formatDate(row.original.course_finish_date)
    },
    { accessorKey: 'course_instructors', header: 'Instrutores' },
    { accessorKey: 'course_requirements', header: 'Requisitos' },
  ], [])

  // Busca inicial dos cursos
  useEffect(() => {
    fetch('http://localhost:8000/api/get_courses')
      .then(res => res.json())
      .then(json => setCourses(json.message || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // React Table
  const table = useReactTable({
    data: courses,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const resp = await fetch('http://localhost:8000/api/get_courses/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_name: formData.course,
          course_description: formData.description,
          course_init_date: formData.init_date,
          course_finish_date: formData.finish_date,
          course_instructors: formData.instructors,
          course_requirements: formData.requirements
        })
      })
      const body = await resp.json()
      if (!resp.ok) throw new Error(JSON.stringify(body))
      // Atualiza lista sem reload
      setCourses(prev => [body.message, ...prev])
      setIsDialogOpen(false)
      Swal.fire({ icon: 'success', title: 'Cadastrado com sucesso!' })
      setFormData({ course:'',description:'',init_date:'',finish_date:'',instructors:'',requirements:'' })
    } catch (err) {
      console.error(err)
      toast({ title:'Erro', description: String(err), variant:'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <p>Carregando...</p>

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
