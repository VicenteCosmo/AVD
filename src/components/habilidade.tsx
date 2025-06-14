import {useState} from "react";
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
export default function habilidade(){

return(
<div>

     <Dialog open={isDialogOpen} >
      <DialogTrigger asChild>
       <button

            onClick={() => setabrir(true)}
            className="px-4 mr-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            + Novo Registro
          </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" >

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

)
}