
import { Vehicle, Seller, Proposal, DashboardStats } from "@/types";

// Mock vehicles
export const vehicles: Vehicle[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    price: 120000,
    mileage: 15000,
    transmission: "automatic",
    fuel: "flex",
    location: {
      state: "SP",
      city: "São Paulo",
      region: "Zona Sul"
    },
    features: ["Ar condicionado", "Direção hidráulica", "Vidros elétricos", "Travas elétricas", "Airbag", "ABS"],
    description: "Toyota Corolla 2022 em excelente estado. Único dono, revisões em dia na concessionária. Veículo econômico e confortável, ideal para família.",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1000",
    ],
    status: "available",
    createdAt: "2023-04-15T10:30:00Z",
    updatedAt: "2023-04-15T10:30:00Z",
    sellerId: "1"
  },
  {
    id: "2",
    brand: "Honda",
    model: "Civic",
    year: 2021,
    price: 115000,
    mileage: 25000,
    transmission: "automatic",
    fuel: "flex",
    location: {
      state: "SP",
      city: "Campinas",
      region: "Centro"
    },
    features: ["Ar condicionado", "Direção elétrica", "Vidros elétricos", "Travas elétricas", "Airbag", "ABS", "Câmera de ré"],
    description: "Honda Civic 2021 em ótimo estado de conservação. Completo, com câmera de ré e central multimídia. Documentação em dia.",
    images: [
      "https://images.unsplash.com/photo-1590080962330-747c6aba8035?auto=format&fit=crop&q=80&w=1000",
    ],
    status: "available",
    createdAt: "2023-05-20T14:45:00Z",
    updatedAt: "2023-05-20T14:45:00Z",
    sellerId: "2"
  },
  {
    id: "3",
    brand: "Volkswagen",
    model: "Gol",
    year: 2020,
    price: 62000,
    mileage: 45000,
    transmission: "manual",
    fuel: "flex",
    location: {
      state: "RJ",
      city: "Rio de Janeiro",
      region: "Zona Norte"
    },
    features: ["Ar condicionado", "Direção hidráulica", "Vidros elétricos", "Travas elétricas"],
    description: "Volkswagen Gol 2020 econômico e em excelente estado. Carro ideal para o dia a dia na cidade. Manutenção em dia e pneus novos.",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1000",
    ],
    status: "available",
    createdAt: "2023-06-05T09:15:00Z",
    updatedAt: "2023-06-05T09:15:00Z",
    sellerId: "3"
  },
  {
    id: "4",
    brand: "Fiat",
    model: "Strada",
    year: 2021,
    price: 85000,
    mileage: 30000,
    transmission: "manual",
    fuel: "flex",
    location: {
      state: "MG",
      city: "Belo Horizonte",
      region: "Centro"
    },
    features: ["Ar condicionado", "Direção hidráulica", "Vidros elétricos", "Travas elétricas", "Airbag", "ABS"],
    description: "Fiat Strada 2021 em perfeito estado. Veículo ideal para trabalho e lazer. Capacidade de carga excelente e muito conforto.",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000",
    ],
    status: "available",
    createdAt: "2023-03-12T11:20:00Z",
    updatedAt: "2023-03-12T11:20:00Z",
    sellerId: "4"
  },
  {
    id: "5",
    brand: "Chevrolet",
    model: "Onix",
    year: 2021,
    price: 72000,
    mileage: 22000,
    transmission: "manual",
    fuel: "flex",
    location: {
      state: "SP",
      city: "São Paulo",
      region: "Zona Oeste"
    },
    features: ["Ar condicionado", "Direção elétrica", "Vidros elétricos", "Travas elétricas", "Airbag", "ABS", "Central multimídia"],
    description: "Chevrolet Onix 2021 completo, com central multimídia e conectividade com smartphone. Carro econômico e confortável para uso urbano.",
    images: [
      "https://images.unsplash.com/photo-1590080962330-747c6aba8035?auto=format&fit=crop&q=80&w=1000",
    ],
    status: "sold",
    createdAt: "2023-02-28T15:40:00Z",
    updatedAt: "2023-07-10T09:30:00Z",
    sellerId: "1"
  },
  {
    id: "6",
    brand: "Hyundai",
    model: "HB20",
    year: 2022,
    price: 75000,
    mileage: 18000,
    transmission: "automatic",
    fuel: "flex",
    location: {
      state: "RJ",
      city: "Niterói",
      region: "Centro"
    },
    features: ["Ar condicionado", "Direção elétrica", "Vidros elétricos", "Travas elétricas", "Airbag", "ABS", "Câmera de ré"],
    description: "Hyundai HB20 2022 automático, completo e com baixa quilometragem. Carro em excelente estado, econômico e com ótimo custo-benefício.",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1000",
    ],
    status: "reserved",
    createdAt: "2023-04-02T13:15:00Z",
    updatedAt: "2023-08-15T16:20:00Z",
    sellerId: "2"
  }
];

// Mock sellers
export const sellers: Seller[] = [
  {
    id: "1",
    name: "Carlos Oliveira",
    phone: "11999887766",
    city: "São Paulo",
    state: "SP",
    email: "carlos@example.com",
    createdAt: "2023-01-15T10:00:00Z"
  },
  {
    id: "2",
    name: "Ana Silva",
    phone: "21999887755",
    city: "Rio de Janeiro",
    state: "RJ",
    email: "ana@example.com",
    createdAt: "2023-02-20T14:30:00Z"
  },
  {
    id: "3",
    name: "Roberto Santos",
    phone: "31999887744",
    city: "Belo Horizonte",
    state: "MG",
    email: "roberto@example.com",
    createdAt: "2023-03-10T09:45:00Z"
  },
  {
    id: "4",
    name: "Fernanda Lima",
    phone: "19999887733",
    city: "Campinas",
    state: "SP",
    email: "fernanda@example.com",
    createdAt: "2023-04-05T11:20:00Z"
  }
];

// Mock proposals
export const proposals: Proposal[] = [
  {
    id: "1",
    vehicleId: "1",
    vehicleInfo: {
      brand: "Toyota",
      model: "Corolla",
      year: 2022
    },
    name: "João da Silva",
    email: "joao@example.com",
    phone: "11987654321",
    message: "Olá, tenho interesse no Toyota Corolla 2022. Gostaria de agendar uma visita para ver o veículo.",
    status: "pending",
    createdAt: "2023-08-10T14:30:00Z"
  },
  {
    id: "2",
    vehicleId: "2",
    vehicleInfo: {
      brand: "Honda",
      model: "Civic",
      year: 2021
    },
    name: "Maria Souza",
    email: "maria@example.com",
    phone: "21987654321",
    message: "Olá, gostaria de saber se o preço do Honda Civic 2021 é negociável. Tenho interesse.",
    status: "contacted",
    createdAt: "2023-08-12T10:15:00Z"
  },
  {
    id: "3",
    vehicleId: "3",
    vehicleInfo: {
      brand: "Volkswagen",
      model: "Gol",
      year: 2020
    },
    name: "Pedro Santos",
    email: "pedro@example.com",
    phone: "31987654321",
    message: "Tenho interesse no Volkswagen Gol 2020. O carro está com todas as revisões em dia?",
    status: "pending",
    createdAt: "2023-08-15T16:45:00Z"
  },
  {
    id: "4",
    vehicleId: "4",
    vehicleInfo: {
      brand: "Fiat",
      model: "Strada",
      year: 2021
    },
    name: "Luciana Ferreira",
    email: "luciana@example.com",
    phone: "11987654322",
    message: "Olá, gostaria de fazer uma proposta para o Fiat Strada 2021. Vocês aceitam financiamento?",
    status: "closed",
    createdAt: "2023-08-18T09:30:00Z"
  }
];

// Mock dashboard stats
export const dashboardStats: DashboardStats = {
  totalVehicles: vehicles.length,
  totalSold: vehicles.filter(v => v.status === "sold").length,
  topBrand: {
    name: "Toyota",
    count: 2
  },
  newProposals: proposals.filter(p => p.status === "pending").length
};

// Get vehicles with filtering
export const getVehicles = (filters?: any) => {
  let filteredVehicles = [...vehicles];

  if (filters) {
    if (filters.brand) {
      filteredVehicles = filteredVehicles.filter(v => v.brand === filters.brand);
    }
    
    if (filters.model) {
      filteredVehicles = filteredVehicles.filter(v => v.model.toLowerCase().includes(filters.model.toLowerCase()));
    }
    
    if (filters.state) {
      filteredVehicles = filteredVehicles.filter(v => v.location.state === filters.state);
    }
    
    if (filters.city) {
      filteredVehicles = filteredVehicles.filter(v => v.location.city === filters.city);
    }
    
    if (filters.region) {
      filteredVehicles = filteredVehicles.filter(v => v.location.region === filters.region);
    }
    
    if (filters.minPrice !== undefined) {
      filteredVehicles = filteredVehicles.filter(v => v.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      filteredVehicles = filteredVehicles.filter(v => v.price <= filters.maxPrice);
    }
    
    if (filters.minYear !== undefined) {
      filteredVehicles = filteredVehicles.filter(v => v.year >= filters.minYear);
    }
    
    if (filters.maxYear !== undefined) {
      filteredVehicles = filteredVehicles.filter(v => v.year <= filters.maxYear);
    }
    
    if (filters.transmission) {
      filteredVehicles = filteredVehicles.filter(v => v.transmission === filters.transmission);
    }
    
    if (filters.fuel && filters.fuel.length > 0) {
      filteredVehicles = filteredVehicles.filter(v => filters.fuel.includes(v.fuel));
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredVehicles = filteredVehicles.filter(v => 
        v.brand.toLowerCase().includes(searchTerm) || 
        v.model.toLowerCase().includes(searchTerm)
      );
    }
  }

  return filteredVehicles;
};

// Get vehicle by ID
export const getVehicleById = (id: string) => {
  return vehicles.find(v => v.id === id);
};

// Get seller by ID
export const getSellerById = (id: string) => {
  return sellers.find(s => s.id === id);
};
