export function parseCors(domains: string | undefined): string | string[] | undefined {
  // If no domain is provided, return undefined
  if (!domains) {
    return undefined
  }

  // Parse the input type 'string', 'string_array' or 'invalid'
  const inputType = parseInputType(domains)

  // If the input type is a string, return it as is
  if (inputType === INPUT_TYPES.string) {
    return domains
  }

  // If the input type is a string array, parse it and return the array
  if (inputType === INPUT_TYPES.string_array) {
    const domainsArray = parseArray(domains)
    if (domainsArray === null || domainsArray.length === 0) {
      return undefined
    }

    return domainsArray
  }

  // If the input type is invalid, return undefined
  return undefined
}

const INPUT_TYPES = {
  string: 'string',
  string_array: 'string_array',
  invalid: 'invalid'
} as const

type InputTypes = typeof INPUT_TYPES[keyof typeof INPUT_TYPES]

// Parses if the input type is a string, an array of string, or something else
function parseInputType(input: string): InputTypes {
  if (typeof input !== 'string') {
    return INPUT_TYPES.invalid
  }

  const seemsArray = input.startsWith('[')

  // Determine if the input is a valid or invalid array
  if (seemsArray) {
    const content = parseArray(input)

    if (content === null || content.length === 0) {
      return INPUT_TYPES.invalid
    }

    return INPUT_TYPES.string_array
  }

  return INPUT_TYPES.string
}

// Takes a string representing an array and returns it as an array
function parseArray(input: string): string[] | null {
  const bracesExist = input.startsWith('[') && input.endsWith(']')

  // If the string doesn't includes leading and trailing braces isn't an array
  if (!bracesExist) {
    return null
  }

  const content = input
    .slice(1, -1) // Removes the braces [, ]
    .split(',') // Split the string by the commas
    .map(element => element.trim()) // Removes leading or trailing spaces or line characters

  const quotesFilteredContent = content.map((element: string) => {
    const quotes = ['\'', '""', '`'] // Possible quote characters
    const startsWithQuote = quotes.some(quote => element.startsWith(quote))
    const endsWithQuote = quotes.some(quote => element.endsWith(quote))

    // Quotation marks should be either both present or absent, either case return null to notate error
    if (startsWithQuote !== endsWithQuote) {
      return null
    }

    const sliceStart = startsWithQuote ? 1 : 0 // 1 if element starts with quotes
    const sliceEnd = endsWithQuote ? -1 : undefined // -1 if element ends with quotes

    // Removes quotation marks from the string if there's any
    return element.slice(sliceStart, sliceEnd)
  })

  // If some element is null all the parsing should be null
  const nullElementPresent = quotesFilteredContent.some(element => element === null)
  if (nullElementPresent) {
    return null
  }

  return quotesFilteredContent as string[]
}