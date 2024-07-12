import { GeneralAPI as ApiService } from './APICall';
import { ProductInterface as Product, UserInterface as User, CartItemInterface as CartItem, OrderInterface as Order } from './interfaces';
const readlineModule = require('node:readline');
const readlineInterface = readlineModule.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const productApi = new ApiService<Product>('https://fakestoreapi.com/products');
const userApi = new ApiService<User>('https://fakestoreapi.com/users');

async function getProducts(): Promise<Product[]> {
  try {
    const products = await productApi.fetchAll();
    return products;
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

async function getUsers(): Promise<User[]> {
  try {
    const users = await userApi.fetchAll();
    return users;
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
}

async function createProduct(newProduct: Product): Promise<Product | null> {
  try {
    const product = await productApi.create(newProduct);
    return product;
  } catch (err) {
    console.error('Error adding product:', err);
    return null;
  }
}

async function modifyProduct(id: number, updatedProduct: Product): Promise<Product | null> {
  try {
    const product = await productApi.update(id, updatedProduct);
    return product;
  } catch (err) {
    console.error('Error updating product:', err);
    return null;
  }
}

async function removeProduct(id: number): Promise<boolean> {
  try {
    const success = await productApi.delete(id);
    return success;
  } catch (err) {
    console.error('Error deleting product:', err);
    return false;
  }
}

const shoppingCart: CartItem[] = [];

const addProductToCart = (product: Product, quantity: number) => {
  const existingCartItem = shoppingCart.find(item => item.product.id === product.id);
  if (existingCartItem) {
    existingCartItem.quantity += quantity;
  } else {
    shoppingCart.push({ product, quantity });
  }
  console.log(`${quantity} of ${product.title} added to cart.`);
};

const processCheckout = (): Order => {
  const totalAmount = shoppingCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const order: Order = { items: shoppingCart, total: totalAmount };
  return order;
};

const promptInput = (query: string): Promise<string> => {
  return new Promise(resolve => readlineInterface.question(query, resolve));
};

(async () => {
  const userOption = await promptInput(`Please select an option\n1: View All Users\n2: Add New Product\n3: Update Product\n4: Delete Product \n5: View All The Products\n`);
  switch (userOption) {
    case "1":
      const allUsers = await getUsers();
      console.log(allUsers);
      readlineInterface.close();
      break;
    case "2":
      const newProduct: Product = {
        id: 0,
        title: 'New Product',
        price: 29.99,
        description: 'A new product for testing',
        category: 'test-category',
        image: 'https://via.placeholder.com/150'
      };
      const addedNewProduct = await createProduct(newProduct);
      console.log('Product added:', addedNewProduct);
      readlineInterface.close();
      break;
    case "3":
      const updatedProduct: Product = {
        id: 0,
        title: 'Updated Product',
        price: 39.99,
        description: 'An updated product for testing',
        category: 'updated-category',
        image: 'https://via.placeholder.com/150'
      };
      const productToModify = await modifyProduct(1, updatedProduct);
      console.log('Product updated:', productToModify);
      readlineInterface.close();
      break;
    case "4":
      const deletionSuccess = await removeProduct(1);
      console.log(deletionSuccess ? 'Product deleted successfully.' : 'Error deleting product.');
      readlineInterface.close();
      break;
    case "5":
      const allProducts = await getProducts();
      console.log(allProducts);
      const selectedProductId = await promptInput('Enter product ID to add to cart: ');
      const selectedProduct = allProducts.find(p => p.id === parseInt(selectedProductId));
      if (selectedProduct) {
        const quantityToAdd = await promptInput('Enter quantity: ');
        addProductToCart(selectedProduct, parseInt(quantityToAdd));
        const checkoutAnswer = await promptInput('Do you want to checkout? (yes/no): ');
        if (checkoutAnswer.toLowerCase() === 'yes') {
          const orderDetails = processCheckout();
          console.log('Order processed:', orderDetails);
        }
      } else {
        console.log('Product not found.');
      }
      readlineInterface.close();
      break;
    default:
      console.log("Invalid Input");
      readlineInterface.close();
  }  
})();
