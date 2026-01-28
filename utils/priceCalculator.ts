import type { HearingData } from "@/app/page";

export interface PriceBreakdown {
  basePrice: number;
  additionalPagesPrice: number;
  additionalPagesCount: number;
  blogFeaturesPrice: number;
  blogFeaturesCount: number;
  galleryFeaturesPrice: number;
  galleryFeaturesCount: number;
  subtotal: number;
  totalPageCount: number; // Total pages including topPage and contactForm
}

export function calculatePrice(data: HearingData): PriceBreakdown {
  // Base price: ¥50,000
  const basePrice = 50000;

  // Additional pages calculation (excluding topPage and contactForm)
  const additionalPagesCount =
    (data.pages.companyProfile ? 1 : 0) +
    (data.pages.serviceIntro ? 1 : 0) +
    (data.pages.productMenu ? 1 : 0) +
    (data.pages.facilityIntro ? 1 : 0) +
    (data.pages.pricing ? 1 : 0) +
    (data.pages.staffIntro ? 1 : 0) +
    (data.pages.access ? 1 : 0) +
    (data.pages.faq ? 1 : 0) +
    (data.pages.recruitment ? 1 : 0) +
    data.pages.other;
  const additionalPagesPrice = additionalPagesCount * 10000;

  // Total page count (including topPage and contactForm for display purposes)
  const totalPageCount =
    (data.pages.topPage ? 1 : 0) +
    (data.pages.contactForm ? 1 : 0) +
    additionalPagesCount;

  // Blog features calculation
  const blogFeaturesCount =
    (data.blogFeatures.news ? 1 : 0) +
    (data.blogFeatures.blog ? 1 : 0) +
    (data.blogFeatures.activityReport ? 1 : 0) +
    (data.blogFeatures.eventInfo ? 1 : 0) +
    data.blogFeatures.other;
  let blogFeaturesPrice = 0;
  if (blogFeaturesCount > 0) {
    blogFeaturesPrice = 20000 + (blogFeaturesCount - 1) * 10000;
  }

  // Gallery features calculation
  const galleryFeaturesCount =
    (data.galleryFeatures.portfolio ? 1 : 0) +
    (data.galleryFeatures.products ? 1 : 0) +
    (data.galleryFeatures.testimonials ? 1 : 0) +
    (data.galleryFeatures.staff ? 1 : 0) +
    (data.galleryFeatures.photoGallery ? 1 : 0) +
    data.galleryFeatures.other;
  let galleryFeaturesPrice = 0;
  if (galleryFeaturesCount > 0) {
    galleryFeaturesPrice = 20000 + (galleryFeaturesCount - 1) * 25000;
  }

  // Subtotal
  const subtotal = basePrice + additionalPagesPrice + blogFeaturesPrice + galleryFeaturesPrice;

  return {
    basePrice,
    additionalPagesPrice,
    additionalPagesCount,
    blogFeaturesPrice,
    blogFeaturesCount,
    galleryFeaturesPrice,
    galleryFeaturesCount,
    subtotal,
    totalPageCount,
  };
}
