import { getListByCustomUrl, getListItems } from '../../../db/db';

export const prerender = false;

export async function GET({ params }) {
  try {
    const { customUrl } = params;
    const list = await getListByCustomUrl(customUrl);

    if (!list) {
      return new Response(
        JSON.stringify({ error: 'List not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!list.is_published) {
      return new Response(
        JSON.stringify({ error: 'List is not published' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const items = await getListItems(list.id);

    return new Response(
      JSON.stringify({ success: true, list, items }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching shared list:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch list' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
