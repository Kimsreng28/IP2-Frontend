import env from '../../../../envs/env';
// Static mock data
const mockData = [
  {
    id: 1,
    title: 'Enjoyed the electronic products',
    image: '/images/product/image.png',
    color: '#377dff',
    description: 'Experience sale-online like never before',
  },
  {
    id: 2,
    title: 'Discover the latest trends',
    image: '/images/product/image1.png',
    color: '#377dff',
    description: 'Shop the latest trends in fashion and electronics',
  },
  {
    id: 3,
    title: 'Grab the best deals',
    image: '/images/product/image2.png',
    color: '#377dff',
    description: 'Find the best deals on electronics and fashion',
  },
];

class BannerService {
  private readonly url = `${env.API_BASE_URL}/client/banner`;

  async get(): Promise<any> {
    try {
      return mockData;
      const res = await fetch(this.url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Error fetching banners from external API');
        throw new Error('Failed to fetch banners');
      }

      const data = await res.json();
      return data;
    } catch (error) {
      throw new Error('Server Error');
    }
  }
}

const bannerService = new BannerService();
export default bannerService;
