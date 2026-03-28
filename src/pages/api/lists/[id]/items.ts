import { getListById, addItemToList, getListItems } from '../../../../db/db';

export const prerender = false;

export async function GET({ params }) {
  try {
    const { id } = params;
    const list = await getListById(id);

    if (!list) {
      return new Response(
        JSON.stringify({ error: 'List not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const items = await getListItems(id);

    return new Response(
      JSON.stringify({ success: true, items }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching items:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch items' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST({ params, request }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { url, title } = body;

    if (!url || url.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const list = await getListById(id);
    if (!list) {
      return new Response(
        JSON.stringify({ error: 'List not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const items = await getListItems(id);
    const displayOrder = items.length;

    const item = await addItemToList(id, url, title || '', displayOrder);

    return new Response(
      JSON.stringify({ success: true, item }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error adding item:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to add item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
