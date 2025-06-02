import axios from "axios";

async function getProductsMessage() {
  try {
    const response = await axios.get("http://localhost:8080/api/products");
    return response.data;
  } catch {
    return "Error fetching data";
  }
}

export default async function Home() {
  const message = await getProductsMessage();

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>APIからのメッセージ: {message}</p>
    </div>
  );
}
