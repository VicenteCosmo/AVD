"use client"

import * as React from "react"
import { useState, useEffect,useContext } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger  } from "@/components/ui/dialog";
import { AuthContext } from "@/app/context/AuthContext"
import { DialogContent, DialogDescription } from "@radix-ui/react-dialog"
export type CourseUser = {
  id: number
  courses: string
  description: string
  init_date: string | null
  finish_date: string | null
  instructors: string
  requirements: string
  status: string
  is_enrolled: boolean
}

function formatDate(dateString: string | null) {
  if (!dateString) return '—'
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function EmployeeCoursesPage() {
  const [cursoseleciodado, setCursoselcionado]=useState<CourseUser | null>(null)
  const {accessToken, userId, userName} = useContext(AuthContext);
  const [courses, setCourses] = useState<CourseUser[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [abrir, setabrir]=useState(false);
  const [mostrar, setmostrar]=useState(false);
  const [enrollingId, setEnrollingId] = useState<number | null>(null)
  const { toast } = useToast()
  
  useEffect(() => {
    fetch('https://new-avd.onrender.com/trainings/get_courses')
      .then(res => res.json())
      .then(json => {
        setCourses(json.message || [])
        console.log(courses)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [courses])

  const handleEnroll = async (id: number) => {
    setEnrollingId(id)
    const accessToken= localStorage.getItem('access_token')
    try {
      const res = await fetch(`https://backend-django-2-7qpl.onrender.com/api/courses/enroll/${id}/`, { method: 'POST' , headers:{
        'Authorization':`Bearer ${accessToken}`,
        'Content-Type':'application/json',
      }})
      if (!res.ok) throw new Error('Falha na inscrição')
      setCourses(prev => prev.map(c => c.id === id ? { ...c, is_enrolled: true } : c))
      toast({ title: 'Sucesso', description: 'Inscrito com sucesso!', variant: 'default' })
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro', description: 'Não foi possível inscrever.', variant: 'destructive' })
    } finally {
      setEnrollingId(null)
    }
  }

  if (loading) return <p>Carregando cursos...</p>

  // const filtered = courses.filter(c => c.course_name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cursos Disponíveis</h1>
      <Input
        placeholder="Buscar curso..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-4 max-w-sm"
      />
      <button onClick={()=> setmostrar(true)}>Adiconar Habilidade</button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Curso</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Término</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Inscrição</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map(course => (
            <TableRow key={course.id}>
              <TableCell  onClick={()=> {setCursoselcionado(course) 
                setabrir(true)}} className="cursor-pointer underline">{course.courses}</TableCell>
              <TableCell>{formatDate(course.init_date)}</TableCell>
              <TableCell>{formatDate(course.finish_date)}</TableCell>
              <TableCell>{course.description}</TableCell>
              <TableCell>
                {course.is_enrolled ? (
                  <span className="text-green-600">Inscrito</span>
                ) : (
                  <Button
                    size="sm"
                    disabled={enrollingId === course.id}
                    onClick={() => handleEnroll(course.id)}
                  >
                    {enrollingId === course.id ? 'Inscrevendo...' : 'Inscrever-se'}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    <Dialog open={abrir} onOpenChange={setabrir}>
      <DialogTrigger asChild> 
          <DialogContent>
          <DialogHeader>
          
          </DialogHeader>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96 space-y-4">
          <DialogTitle>{cursoseleciodado?.courses}</DialogTitle>
          <DialogDescription>{cursoseleciodado?.description}</DialogDescription>
            <p><strong>Instrutor:</strong>{cursoseleciodado?.instructors}</p>
            <p><strong>Requisitos:</strong>{cursoseleciodado?.requirements}</p>
            <p>{}</p>
            <p>{}</p>
            </div>
            
          </div>
        </DialogContent>
      </DialogTrigger>
        
    </Dialog>
    </div>
  )
}
