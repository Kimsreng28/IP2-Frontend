// app/api/hot-products/route.ts
import env from '../../../../envs/env';
export async function getBanners() {
  try {
    const res = await fetch(`${env.API_BASE_URL}/client/banner`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Error fetching banners from external API');
      return { error: 'Failed to fetch banners' };
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error(`${env.API_BASE_URL}/client/banner`);
    return { error: 'Server Error' };
  }
}
