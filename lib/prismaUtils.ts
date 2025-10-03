/**
 * Utility function to clean data for Prisma operations
 * Removes null values from optional fields to avoid type errors
 */
export function cleanPrismaData<T extends Record<string, any>>(data: T): T {
  const cleaned = { ...data };
  
  // List of optional fields that can be null but Prisma expects undefined
  const optionalFields = [
    'advisorId',
    'industry',
    'subIndustry',
    'description',
    'logoUrl',
    'websiteUrl',
    'email',
    'phone',
    'street',
    'suburb',
    'state',
    'postcode',
    'latitude',
    'longitude',
    'amountSeeking',
    'raisingReason',
    'properties',
    'image', // For user model
    'headshotUrl', // For advisor model
    'websiteUrl', // For advisor model
    'description', // For advisor model
    'specialties', // For advisor model
  ];

  // Remove null values for optional fields
  optionalFields.forEach(field => {
    if (cleaned[field] === null) {
      delete cleaned[field];
    }
  });

  return cleaned;
}

/**
 * Prepare company data for Prisma create/update operations
 */
export function prepareCompanyData(validatedData: any, additionalData: any = {}) {
  const companyData = {
    ...validatedData,
    ...additionalData,
    tags: JSON.stringify(validatedData.tags || []),
    photos: JSON.stringify(validatedData.photos || []),
    projectPhotos: JSON.stringify(validatedData.projectPhotos || []),
  };

  return cleanPrismaData(companyData);
}
