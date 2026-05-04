export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  isBestseller?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Vestido Satinado Rosa",
    price: 189.99,
    category: "Vestidos",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    description: "Elegante vestido de satén con corte asimétrico, perfecto para ocasiones especiales.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Rosa", "Champagne"],
    isNew: true,
  },
  {
    id: 2,
    name: "Blazer Oversize Perla",
    price: 245.00,
    category: "Chaquetas",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop",
    description: "Blazer oversize en tono perla con solapas anchas y acabado premium.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Perla", "Blanco roto"],
    isBestseller: true,
  },
  {
    id: 3,
    name: "Falda Midi Plisada",
    price: 129.99,
    category: "Faldas",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop",
    description: "Falda midi plisada con cintura elástica y movimiento fluido.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Rosa pastel", "Lavanda"],
  },
  {
    id: 4,
    name: "Blusa de Seda Floral",
    price: 159.00,
    category: "Blusas",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop",
    description: "Blusa de seda con estampado floral delicado y mangas abullonadas.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Floral rosa", "Floral lila"],
    isNew: true,
  },
  {
    id: 5,
    name: "Pantalón Palazzo Elegante",
    price: 175.00,
    category: "Pantalones",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    description: "Pantalón palazzo de tiro alto con caída impecable y tela premium.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Nude", "Rosa antiguo"],
    isBestseller: true,
  },
  {
    id: 6,
    name: "Top Crop Encaje",
    price: 89.99,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&h=500&fit=crop",
    description: "Top crop de encaje con detalles florales y forro suave.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Rosa", "Blanco"],
  },
  {
    id: 7,
    name: "Vestido Cocktail Dorado",
    price: 320.00,
    category: "Vestidos",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop",
    description: "Vestido cocktail con detalles dorados y silueta ceñida al cuerpo.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Dorado rosa", "Champagne"],
    isNew: true,
  },
  {
    id: 8,
    name: "Abrigo Teddy Rosa",
    price: 289.00,
    category: "Chaquetas",
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=500&fit=crop",
    description: "Abrigo teddy súper suave en tono rosa empolvado con bolsillos laterales.",
    sizes: ["S", "M", "L"],
    colors: ["Rosa empolvado", "Crema"],
  },
];

export const categories = ["Todos", "Vestidos", "Blusas", "Faldas", "Pantalones", "Chaquetas", "Tops"];
