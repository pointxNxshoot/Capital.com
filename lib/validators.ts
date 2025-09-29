import { z } from 'zod'

// Additional Section schema for listing details
export const additionalSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(2000).optional(),
  imageUrls: z.array(z.string().min(1)).max(10), // Allow relative paths
  fileUrls: z.array(z.string().min(1)).max(10), // Allow relative paths
  deck: z.object({
    type: z.enum(["pdf", "link"]).nullable(),
    url: z.string().nullable(),
  }).nullable(),
  tags: z.array(z.string().min(1).max(24)).max(8),
  order: z.number().int().min(0),
  visibility: z.enum(["public", "requestAccess"]).default("public"),
});

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100),
  sector: z.string().min(1, 'Sector is required'),
  industry: z.string().optional(),
  subIndustry: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  street: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().default('Australia'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  tags: z.array(z.string().min(1).max(50)).max(50).default([]),
  amountSeeking: z.string().optional(),
  raisingReason: z.string().optional(),
  properties: z.string().optional(),
  photos: z.array(z.string().min(1)).max(20).default([]),
  projectPhotos: z.array(z.string().min(1)).max(20).default([]),
  additionalSections: z.array(additionalSectionSchema).max(10).default([]),
  advisorId: z.string().optional().nullable(),
  createdBy: z.string().optional(),
})

export const advisorSchema = z.object({
  firmName: z.string().min(1, 'Firm name is required'),
  teamLead: z.string().min(1, 'Team lead name is required'),
  headshotUrl: z.string().optional().or(z.literal('')),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  street: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().default('Australia'),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  specialties: z.array(z.string()).default([]),
})

export const searchSchema = z.object({
  q: z.string().optional(),
  sector: z.string().optional(),
  state: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sort: z.enum(['relevance', 'name', 'views']).default('relevance'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})

export type CompanyInput = z.infer<typeof companySchema>
export type AdvisorInput = z.infer<typeof advisorSchema>
export type SearchParams = z.infer<typeof searchSchema>

// Combined form schema for the listing form
export const listingFormSchema = z.object({
  // Company fields
  name: z.string().min(1, 'Company name is required').max(100),
  sector: z.string().min(1, 'Sector is required'),
  industry: z.string().optional(),
  subIndustry: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  street: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().default('Australia'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  tags: z.array(z.string()).default([]),
  amountSeeking: z.string().optional(),
  raisingReason: z.string().optional(),
  properties: z.string().optional(),
  photos: z.array(z.string()).default([]),
  projectPhotos: z.array(z.string()).default([]),
  additionalSections: z.array(additionalSectionSchema).default([]),
  advisorId: z.string().optional().nullable(),
  
  // Advisor fields (optional)
  firmName: z.string().optional(),
  teamLead: z.string().optional(),
  headshotUrl: z.string().optional().or(z.literal('')),
  advisorEmail: z.string().email().optional().or(z.literal('')),
  advisorPhone: z.string().optional(),
  advisorStreet: z.string().optional(),
  advisorSuburb: z.string().optional(),
  advisorState: z.string().optional(),
  advisorPostcode: z.string().optional(),
  advisorCountry: z.string().default('Australia'),
  advisorWebsiteUrl: z.string().url().optional().or(z.literal('')),
  advisorDescription: z.string().optional(),
  specialties: z.array(z.string()).default([]),
})

export type ListingFormInput = z.infer<typeof listingFormSchema>

// Listing schemas for the new listings API
export const photoUrl = z.string().min(1).trim(); // Allow relative paths

export const listingSchema = z.object({
  title: z.string().min(1, "Title is required").max(140),
  description: z.string().max(10_000).optional().default(""),
  price: z.number().int().nonnegative().optional(),
  address: z.string().min(1, "Address is required"),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  images: z.array(photoUrl).default([]),
  additionalSections: z.array(additionalSectionSchema).max(10).default([]),
  companyId: z.string().optional(), // if linking to a company
});

export const listingUpdateSchema = listingSchema.partial().refine(
  (val) => Object.keys(val).length > 0,
  { message: "No fields to update" }
);

export type AdditionalSection = z.infer<typeof additionalSectionSchema>
export type ListingInput = z.infer<typeof listingSchema>
export type ListingUpdateInput = z.infer<typeof listingUpdateSchema>
