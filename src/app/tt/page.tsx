"use server";

export default async function Page() {
  return (
    <div>
      <h1>Product Listing</h1>
      <p>Search query: </p>
      <p>Current page: </p>
      <p>Current page: {process.env.NODE_ENV}</p>
    </div>
  );
}
