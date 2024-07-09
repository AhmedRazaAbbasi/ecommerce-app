export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
  }
  
  export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    name: {
      firstname: string;
      lastname: string;
    };
    address: {
      city: string;
      street: string;
      number: number;
      zipcode: string;
    };
    phone: string;
  }
  export interface CartItem {
    product: Product;
    quantity: number;
  }
  
  export interface Order {
    items: CartItem[];
    total: number;
  }