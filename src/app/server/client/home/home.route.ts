import homeService from './home.service';

export async function getBanners() {
  try {
    const banners = await homeService.getBanners();
    return banners;
  } catch (error) {
    return { error: 'Unable to fetch banners' };
  }
}


export async function getNewArrivals(params:{ page?: number} ) {
  try {
    const newArrivals = await homeService.getNewArrivals(params);
    return newArrivals;
  } catch (error) {
    return { error: 'Unable to fetch new arrivals' };
  }
}

export async function updateFavoriteStatus(id: number) {
  try {
    const result = await homeService.updateFavoriteStatus(id);
    return result;
  } catch (error) {
    return { error: 'Unable to update favorite status' };
  }
}

const homeClientApi = {
  getBanners,
  getNewArrivals,
  updateFavoriteStatus,
};

export default homeClientApi;