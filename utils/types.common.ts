export type ImageFormatTypes = {
  name: string,
  hash: string,
  ext: string,
  mime: string,
  path: string | null,
  width: number,
  height: number,
  size: number,
  sizeInBytes: number,
  url: string
}
export type Project = {
  id: number,
  attributes: {
    name: string,
    description: string,
    blockchain: string,
    totalSupply: string,
    initialMarketCap: string,
    fullyDilutedMarketCap: string,
    launchPrice: string,
    tokenAddress: string,
    idoStarts: string,
    idoEnds: string,
    claimStarts: string,
    listing: string,
    createdAt: string,
    updatedAt: string,
    publishedAt: string,
    slug: string,
    totalRaise: string,
    allTimeHigh: string,
    oversubscribed: string,
    shortDescription: string,
    socialLinks: { [key: string]: string; } | null,
    totalLockedCATA: string,
    image: {
      data: {
        id: number,
        attributes: {
          name: string,
          alternativeText: string | null,
          caption: string | null,
          width: number,
          height: number,
          formats: {
            thumbnail: ImageFormatTypes,
            small: ImageFormatTypes,
            medium: ImageFormatTypes,
            large: ImageFormatTypes
          },
          hash: string,
          ext: string,
          mime: string,
          size: number,
          url: string,
          previewUrl: string | null,
          provider: string,
          provider_metadata: string | null,
          createdAt: string,
          updatedAt: string
        }
      }
    }
  }
}

export type ParticipateInformation = {
  id: number,
  attributes: {
    title: string,
    description: string,
    ordinalNumber: number,
    createdAt: string,
    updatedAt: string,
    publishedAt: string
  }
}
