import { generateCustomUrl, isCustomUrlAvailable, createList, getListById, updateList, deleteList, publishList, addItemToList, getListItems } from '../../db/db';

export const prerender = false;

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { title, description, customUrl } = body;

    if (!title || title.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let url = customUrl?.trim() || generateCustomUrl();
    
    // Check if custom URL is available
    const available = await isCustomUrlAvailable(url);
    if (!available) {
      return new Response(
        JSON.stringify({ error: 'URL is already taken' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const list = await createList(title, description || '', url);

    return new Response(
      JSON.stringify({ success: true, list }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating list:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create list' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
