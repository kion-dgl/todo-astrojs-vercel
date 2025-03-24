import type { APIRoute } from 'astro';
import { db, TodoItems } from 'astro:db';
import { eq } from 'astro:db';

// POST endpoint to add a new todo item
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    if (!body.text || typeof body.text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Todo text is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const newItem = await db.insert(TodoItems).values({
      text: body.text,
      completed: false
    }).returning();
    
    return new Response(
      JSON.stringify(newItem[0]),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error adding todo item:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to add todo item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE endpoint to mark a todo item as completed
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    if (!body.id || typeof body.id !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Todo id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const updatedItem = await db.update(TodoItems)
      .set({ completed: true })
      .where(eq(TodoItems.id, body.id))
      .returning();
    
    if (!updatedItem.length) {
      return new Response(
        JSON.stringify({ error: 'Todo item not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(updatedItem[0]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating todo item:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update todo item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}