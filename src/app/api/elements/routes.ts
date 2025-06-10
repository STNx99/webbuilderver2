export async function POST(req : Request, res : Response, { params} : {params : Promise<{id: string}>}) {
  const { id } = await params;
  // Here you would typically handle the request to create a new element
  // For example, you might parse the request body and save the new element to a database
  return new Response(JSON.stringify({ message: `Element with ID ${id} created` }), { status: 201 });
}

export async function DELETE(req : Request, res : Response, { params} : {params : Promise<{id: string}>}) {
  const { id } = await params;
  // Here you would typically handle the request to delete an element
  // For example, you might remove the element from a database
  return new Response(JSON.stringify({ message: `Element with ID ${id} deleted` }), { status: 200 });
}