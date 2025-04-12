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

const mockDataNewArrivals = [
  {
    id: 1,
    title: 'Skullcandy - Crusher anc 2 wireless headphones',
    image: '/images/product/image.png',
    is_favorite: false,
    is_new: true,
    description: 'Description for New Arrival 1',
    price: 29.99,
    stars: 4.5,
    created_at: '2023-10-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Beats Studio Pro',
    image: '/images/product/image1.png',
    is_favorite: false,
    is_new: true,
    description: 'Description for New Arrival 2',
    price: 49.99,
    stars: 4.0,
    created_at: '2023-10-02T00:00:00Z',
  },
  {
    id: 3,
    title: 'Sony - WH-CH720N Wireless Noise Canceling',
    image: '/images/product/image2.png',
    is_favorite: false,
    is_new: true,
    description: 'Description for New Arrival 3',
    price: 19.99,
    stars: 5.0,
    created_at: '2023-10-03T00:00:00Z',
  },
];

const mockDataBestSellers = [
  {
    id: 1,
    title: 'Skullcandy - Crusher anc 2 wireless headphones',
    image: '/images/product/image3.png',
    is_favorite: false,
    is_hot: true,
    description: 'Description for New Arrival 1',
    price: 29.99,
    stars: 4.5,
    created_at: '2023-10-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Sony',
    image: '/images/product/image4.png',
    is_favorite: false,
    is_hot: true,
    description: 'Description for New Arrival 1',
    price: 29.99,
    stars: 4.5,
    created_at: '2023-10-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Beats Studio Pro',
    image: '/images/product/image1.png',
    is_favorite: false,
    is_hot: true,
    description: 'Description for New Arrival 2',
    price: 49.99,
    stars: 4.0,
    created_at: '2023-10-02T00:00:00Z',
  },
  {
    id: 3,
    title: 'Sony - WH-CH720N Wireless Noise Canceling',
    image: '/images/product/image2.png',
    is_favorite: false,
    is_hot: true,
    description: 'Description for New Arrival 3',
    price: 19.99,
    stars: 5.0,
    created_at: '2023-10-03T00:00:00Z',
  },
  {
    id: 4,
    title: 'Skullcandy - Crusher anc 2 wireless headphones',
    image: '/images/product/image.png',
    is_favorite: false,
    is_new: true,
    description: 'Description for New Arrival 1',
    price: 29.99,
    stars: 4.5,
    created_at: '2023-10-01T00:00:00Z',
  },
  {
    id: 5,
    title: 'Skullcandy - Crusher anc 2 wireless headphones',
    image: '/images/product/image3.png',
    is_favorite: false,
    is_hot: true,
    description: 'Description for New Arrival 1',
    price: 29.99,
    stars: 4.5,
    created_at: '2023-10-01T00:00:00Z',
  },
  {
    id: 6,
    title: 'Sony',
    image: '/images/product/image4.png',
    is_favorite: false,
    is_hot: true,
    description: 'Description for New Arrival 1',
    price: 29.99,
    stars: 4.5,
    created_at: '2023-10-01T00:00:00Z',
  },
]
class HomeService {
  private readonly url = `${env.API_BASE_URL}/client/banner`;

  async getBanners(): Promise<any> {
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

  async getNewArrivals(params?: {
    page?: number;
  }): Promise<any> {
    try {
      // Uncomment this for testing mock data
      return mockDataNewArrivals;

      // Construct query string from valid params
      const queryParams = new URLSearchParams();
      // if (params) {
      //   Object.entries(params).forEach(([key, value]) => {
      //     if (value !== undefined) {
      //       queryParams.append(key, String(value));
      //     }
      //   });
      // }

      const url = `${process.env.API_URL}/new-arrivals?${queryParams.toString()}`;

      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Error fetching new arrivals from external API');
        throw new Error('Failed to fetch new arrivals');
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Server error:', error);
      throw new Error('Server Error');
    }
  }

  async getBestSellers(): Promise<any> {
    try {
      // Uncomment this for testing mock data
      return mockDataBestSellers;

      const url = `${process.env.API_URL}/best-seller}`;

      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Error fetching Best Sellers from external API');
        throw new Error('Failed to fetch  Best Sellers');
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Server error:', error);
      throw new Error('Server Error');
    }
  }

  async updateFavoriteStatus(id: number): Promise<any> {
    try {
      console.log('Toggling favorite status for ID:', id);
      const res = await fetch(`${process.env.API_URL}/new-arrivals/${id}/favorite`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Failed to toggle favorite');
        throw new Error('Failed to toggle favorite');
      }

      return await res.json();
    } catch (error) {
      throw new Error('Server Error');
    }
  }
}

const homeService = new HomeService();
export default homeService;
