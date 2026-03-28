import { getAllLists } from '../../db/db';

export const prerender = false;

export async function GET() {
  try {
    const lists = await getAllLists();

    return new Response(
      JSON.stringify({ success: true, lists }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching lists:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch lists' }),
      { status: 500 }
    );
  }
}
