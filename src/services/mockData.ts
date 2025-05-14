
import { Vehicle, Seller } from "@/types";

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    mileage: 50000,
    price: 85000,
    location: {
      city: "São Paulo",
      state: "SP",
      region: ""
    },
    transmission: "automatic",
    fuel: "flex",
    description: "Sedan em ótimo estado, ideal para a família.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1549399543-9c089e328fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    ],
    features: ["Ar condicionado", "Direção hidráulica", "Vidros elétricos"],
    status: "available",
    created_at: "2023-08-01T10:00:00.000Z",
    seller_id: "6d7ebcac-845a-49f2-a13c-72c8119230b9",
  },
  {
    id: "2",
    brand: "Honda",
    model: "Civic",
    year: 2022,
    mileage: 30000,
    price: 95000,
    location: {
      city: "Rio de Janeiro",
      state: "RJ",
      region: ""
    },
    transmission: "automatic",
    fuel: "flex",
    description: "Carro completo, com baixa quilometragem.",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228d88c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1549399543-9c089e328fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    ],
    features: ["Ar condicionado", "Direção elétrica", "Câmera de ré"],
    status: "available",
    created_at: "2023-08-05T14:30:00.000Z",
    seller_id: "3f0d0edf-b96c-4c7a-b297-85da5726dc5a",
  },
  {
    id: "3",
    brand: "Fiat",
    model: "Argo",
    year: 2021,
    mileage: 40000,
    price: 65000,
    location: {
      city: "Belo Horizonte",
      state: "MG",
      region: ""
    },
    transmission: "manual",
    fuel: "flex",
    description: "Hatchback compacto, ideal para o dia a dia.",
    images: [
      "https://images.unsplash.com/photo-1549399543-9c089e328fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    ],
    features: ["Ar condicionado", "Direção hidráulica", "Travas elétricas"],
    status: "available",
    created_at: "2023-08-10T09:00:00.000Z",
    seller_id: "2bf4d8e1-5a15-4cb4-9cc9-5f7c494da8a9",
  },
  {
    id: "4",
    brand: "Volkswagen",
    model: "Gol",
    year: 2019,
    mileage: 60000,
    price: 55000,
    location: {
      city: "Curitiba",
      state: "PR",
      region: ""
    },
    transmission: "manual",
    fuel: "flex",
    description: "Carro popular, econômico e confiável.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1605559424843-9e4c228d88c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    ],
    features: ["Ar condicionado", "Direção hidráulica", "Alarme"],
    status: "available",
    created_at: "2023-08-15T16:15:00.000Z",
    seller_id: "8d3e9f2a-6c5b-4a7d-8e9f-0a1b2c3d4e5f",
  },
  {
    id: "5",
    brand: "Hyundai",
    model: "HB20",
    year: 2023,
    mileage: 10000,
    price: 75000,
    location: {
      city: "Porto Alegre",
      state: "RS",
      region: ""
    },
    transmission: "automatic",
    fuel: "flex",
    description: "Hatchback moderno, com design atraente.",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228d88c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1549399543-9c089e328fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    ],
    features: ["Ar condicionado", "Direção elétrica", "Central multimídia"],
    status: "available",
    created_at: "2023-08-20T11:45:00.000Z",
    seller_id: "6d7ebcac-845a-49f2-a13c-72c8119230b9",
  },
];

export const mockSellers: Seller[] = [
  {
    id_seller: "6d7ebcac-845a-49f2-a13c-72c8119230b9",
    id: "6d7ebcac-845a-49f2-a13c-72c8119230b9",
    name: "João Silva",
    phone: "11987654321",
    city: "São Paulo",
    state: "SP",
    email: "joao.silva@example.com",
    created_at: "2023-06-10T10:30:00.000Z"
  },
  {
    id_seller: "3f0d0edf-b96c-4c7a-b297-85da5726dc5a",
    id: "3f0d0edf-b96c-4c7a-b297-85da5726dc5a",
    name: "Maria Oliveira",
    phone: "21976543210",
    city: "Rio de Janeiro",
    state: "RJ",
    email: "maria.oliveira@example.com",
    created_at: "2023-06-15T14:20:00.000Z"
  },
  {
    id_seller: "2bf4d8e1-5a15-4cb4-9cc9-5f7c494da8a9",
    id: "2bf4d8e1-5a15-4cb4-9cc9-5f7c494da8a9",
    name: "Carlos Pereira",
    phone: "31965432109",
    city: "Belo Horizonte",
    state: "MG",
    email: "carlos.pereira@example.com",
    created_at: "2023-06-20T09:15:00.000Z"
  },
  {
    id_seller: "8d3e9f2a-6c5b-4a7d-8e9f-0a1b2c3d4e5f",
    id: "8d3e9f2a-6c5b-4a7d-8e9f-0a1b2c3d4e5f",
    name: "Ana Costa",
    phone: "41954321098",
    city: "Curitiba",
    state: "PR",
    email: "ana.costa@example.com",
    created_at: "2023-06-25T16:45:00.000Z"
  }
];

export const mockFilterOptions = {
  brands: ["Toyota", "Honda", "Fiat", "Volkswagen", "Hyundai"],
  years: [2019, 2020, 2021, 2022, 2023],
  transmissions: ["manual", "automatic"],
  fuels: ["flex"],
  states: ["SP", "RJ", "MG", "PR", "RS"],
};

// Add the missing dashboardStats mock data
export const dashboardStats = {
  totalVehicles: 25,
  soldVehicles: 8,
  reservedVehicles: 3,
  totalProposals: 42,
  pendingProposals: 12,
  contactedProposals: 20,
  closedProposals: 10,
  topBrand: {
    name: "Toyota",
    count: 7
  },
  newProposals: 5
};
