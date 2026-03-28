import { updateListItem, deleteListItem } from '../../../../../db/db';

export const prerender = false;

export async function PUT({ params, request }) {
  try {
    const { id, itemId } = params;
    const body = await request.json();
    const { url, title } = body;

    if (!url || url.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const item = await updateListItem(itemId, url, title || '');

    return new Response(
      JSON.stringify({ success: true, item }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating item:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to update item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE({ params }) {
  try {
    const { id, itemId } = params;
    await deleteListItem(itemId);

    return new Response(
      JSON.stringify({ success: true, message: 'Item deleted' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting item:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to delete item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
