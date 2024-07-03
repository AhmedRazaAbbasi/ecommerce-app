// main.ts
import { GenericApi } from './APICall';
import { Product, User } from './interfaces';
const readline = require('node:readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const productRepository = new GenericApi<Product>('https://fakestoreapi.com/products');
const userRepository = new GenericApi<User>('https://fakestoreapi.com/users');

async function fetchProducts() {
  try {
    const products = await productRepository.getAll();
    console.log('Products:', products);
  } catch (error) {
    console.error('Error in fetching products:', error);
  }
}

async function fetchUsers() {
  try {
    const users = await userRepository.getAll();
    console.log('Users:', users);
  } catch (error) {
    console.error('Error in fetching users:', error);
  }
}

async function addProduct(newProduct: Product) {
  try {
    const product = await productRepository.create(newProduct);
    console.log('Product added:', product);
  } catch (error) {
    console.error('Error in adding product:', error);
  }
}

async function updateProduct(id: number, updatedProduct: Product) {
  try {
    const product = await productRepository.update(id, updatedProduct);
    if (product) {
      console.log('Product updated:', product);
    } else {
      console.error('Product not found.');
    }
  } catch (error) {
    console.error('Error in updating product:', error);
  }
}

async function deleteProduct(id: number) {
  try {
    const success = await productRepository.delete(id);
    if (success) {
      console.log(`Product with ID ${id} deleted successfully.`);
    } else {
      console.error('Product not found.');
    }
  } catch (error) {
    console.error('Error  in deleting product:', error);
  }
}

(() => {
  rl.question(`Please select an option\n1: View all products\n2: View all users\n3: Add a product\n4: Update a product\n5: Delete a product\n`, async (option:string) => {
    switch (option) {
      case "1":
         console.log(await fetchProducts());
        break;
      case "2":
        console.log(await fetchUsers());
        break;
      case "3":
        const newProduct: Product = {
          id: 0,
          title: 'New Product',
          price: 29.99,
          description: 'A new product for testing',
          category: 'test-category',
          image: 'https://via.placeholder.com/150'
        };
        console.log(await addProduct(newProduct));
        console.log("A hard coded user has been added");
        break;
      case "4":
          const updatedProduct: Product = {
            id: 0,
            title: 'Updated Product',
            price: 39.99,
            description: 'An updated product for testing',
            category: 'updated-category',
            image: 'https://via.placeholder.com/150'
          };
          console.log(await updateProduct(1, updatedProduct));
        break;
      case "5":
        console.log(await deleteProduct(1));
        break;
      default:
        console.log("Invalid Input")
    }
    rl.close();
  });
})();
