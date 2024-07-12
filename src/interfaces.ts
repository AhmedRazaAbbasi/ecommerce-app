export interface ProductInterface {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface UserInterface {
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
export interface CartItemInterface {
  product: ProductInterface;
  quantity: number;
}

export interface OrderInterface {
  items: CartItemInterface[];
  total: number;
}