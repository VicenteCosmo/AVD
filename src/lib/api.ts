

export const fetchAssiduidade = async (page: number) => {
    const response = await fetch(`/api/assiduidade?page=${page}`);
    const data = await response.json();
    return data;
  };
  
  export const deleteAssiduidade = async (id: number) => {
    const response = await fetch(`/api/assiduidade/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao excluir o registro");
    }
  };
  