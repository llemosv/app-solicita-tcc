export interface TaskMessageDTO {
  _id: string;
  id_task: string;
  id_author: {
    _id: string;
    nome: string;
    email: string;
    senha: string;
    fl_ativo: boolean;
    id_tipo_pessoa: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
