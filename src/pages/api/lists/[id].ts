import { getListById, updateList, deleteList, publishList, addItemToList, updateListItem, deleteListItem, getListItems } from '../../../db/db';

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
      JSON.stringify({ success: true, list, items }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching list:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch list' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT({ params, request }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, action } = body;

    let list = await getListById(id);
    if (!list) {
      return new Response(
        JSON.stringify({ error: 'List not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'publish') {
      list = await publishList(id);
    } else if (title || description) {
      list = await updateList(id, title || list.title, description || list.description);
    }

    return new Response(
      JSON.stringify({ success: true, list }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating list:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to update list' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE({ params }) {
  try {
    const { id } = params;
    const list = await getListById(id);

    if (!list) {
      return new Response(
        JSON.stringify({ error: 'List not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await deleteList(id);

    return new Response(
      JSON.stringify({ success: true, message: 'List deleted' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting list:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to delete list' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
