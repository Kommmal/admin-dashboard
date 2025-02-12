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
  "sk0oqDHOkPzGMtmmT4MkUYYX8cneeIkWCrEApdrM87eOkHHPlpQcTF4tV9M7oq2cwysN88QH6nMMao0C59UfqyHPbOu9teKcMxb65OypsPND8lszv0G7c1HQNQaATShS21GkpLvhCJM3VwO3C2BN4bSNRmLNBi5QgoE3ziSDNDdye255Fv7x",
  'Missing environment variable: SANITY_TOKEN'
)


function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage); // Stop execution if the variable is missing
  }
  return v;
}



