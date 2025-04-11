import bannerService from './banner.service';

export async function getBanners() {
  try {
    const banners = await bannerService.get();
    return banners;
  } catch (error) {
    return { error: 'Unable to fetch banners' };
  }
}
