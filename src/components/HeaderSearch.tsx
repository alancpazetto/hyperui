import { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/router'

import Link from 'next/link'

import { SearchResult } from '@/interface/search'

import { useClickOutside } from '@/services/hooks/useClickOutside'

function HeaderSearch() {
  const nextRouter = useRouter()
  const refDropdown = useRef(null)

  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [initialResults, setInitialResults] = useState<Array<SearchResult>>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<Array<SearchResult>>([])

  useEffect(() => {
    fetch('/api/search')
      .then((result) => result.json())
      .then((data) => {
        const sortedData = data.sort(function (
          resultA: SearchResult,
          resultB: SearchResult
        ) {
          return resultA.name.localeCompare(resultB.name)
        })

        setInitialResults(sortedData)
        setSearchResults(sortedData)
      })
  }, [])

  useEffect(() => {
    const filteredResults = initialResults.filter(function (
      initialResult: SearchResult
    ) {
      const { name: resultName } = initialResult

      return resultName.toLowerCase().includes(searchQuery.toLowerCase())
    })

    setSearchResults(filteredResults)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  useEffect(() => {
    setSearchQuery('')
    setShowDropdown(false)
  }, [nextRouter.asPath])

  useClickOutside(refDropdown, showDropdown, () => setShowDropdown(false))

  return (
    <div
      ref={refDropdown}
      className="hidden sm:relative sm:flex sm:h-16 sm:items-center"
    >
      <form role="search">
        <label htmlFor="SiteSearch" className="sr-only">
          Search
        </label>

        <input
          type="text"
          onInput={(e) => setSearchQuery(e.currentTarget.value)}
          onFocus={() => setShowDropdown(true)}
          value={searchQuery}
          placeholder="Search..."
          id="SiteSearch"
          className="rounded-md border-gray-200 text-sm"
        />

        <button tabIndex={-1} className="sr-only">
          Submit
        </button>
      </form>

      {showDropdown && (
        <div className="absolute right-0 top-14 z-50 w-64 rounded-lg border border-gray-100 bg-white shadow-lg">
          {!!searchResults.length ? (
            <ul className="max-h-64 space-y-1 overflow-auto p-2">
              {searchResults.map((searchResult: SearchResult) => (
                <li key={searchResult.id}>
                  <Link
                    href={`/components/${searchResult.category.slug}/${searchResult.slug}`}
                  >
                    <a className="flex items-center justify-between rounded-md px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:bg-gray-50">
                      <span>{searchResult.name}</span>

                      <span className="block rounded bg-black px-1.5 py-0.5 text-[10px] text-white">
                        {searchResult.category.title}
                      </span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              Uh-no! There are no results 😢
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default HeaderSearch
