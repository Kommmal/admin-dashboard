export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-17'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)
export const token = assertValue(
  process.env.SANITY_TOKEN,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)


function assertValue<T>(v: T | undefined, errorMessage: string): T | undefined {
  if (v === undefined) {
    console.warn(errorMessage); 
    return undefined; 
  }
  return v;
}

