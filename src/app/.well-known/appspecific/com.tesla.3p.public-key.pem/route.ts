export const GET = () => {
  return new Response(process.env.TESLA_PUBLIC_KEY, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
