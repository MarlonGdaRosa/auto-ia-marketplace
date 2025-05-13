
// API for car brand, model, year information
export interface VehicleBrand {
  id: string;
  nome: string;
}

export interface VehicleModel {
  id: string;
  nome: string;
}

export interface VehicleYear {
  id: string;
  nome: string;
}

export interface FipePrice {
  preco: string;
  combustivel: string;
  marca: string;
  modelo: string;
  anoModelo: number;
  codigoFipe?: string;
  mesReferencia?: string;
}

export interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
}

export interface IBGECity {
  id: number;
  nome: string;
}
