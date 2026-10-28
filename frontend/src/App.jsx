
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [debouncedSearch, setDebouncedSearch] = useState('')


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchTerm])


  useEffect(() => {
    const controller = new AbortController()
    async function loadProducts() {
      setLoading(true)
      setError('')

      try {
        // const url =
        //   selectedCategory === 'all'
        //     ? '/api/products/'
        //     : `/api/products/?category=${selectedCategory}`
        const params = new URLSearchParams()
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory)
        }
        if (debouncedSearch.trim()) {
          params.append('search', debouncedSearch.trim())
        }
        if (sortOrder.trim()) {
          params.append('sort', sortOrder.trim())
        }
        const url = params.toString() ? `/api/products/?${params.toString()}` : '/api/products/'

        const response = await fetch(url, {
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        setProducts(data)

      } catch (err) {
        console.error(err)
        setError('Products not loaded ')

      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [selectedCategory, sortOrder, retryCount, debouncedSearch])

  // const filteredProducts =selectedCategory==='all'?products:products.filter(
  //   (products)=>products.category === selectedCategory
  // )

  // const filteredProducts = products.filter((product) => {
  //   const matchesCategory =
  //     selectedCategory === 'all' ||
  //     product.category === selectedCategory

  //   const matchesSearch = product.name
  //     .toLowerCase()
  //     .includes(searchTerm.trim().toLowerCase())

  //   return matchesCategory && matchesSearch
  // })
  const filteredProducts = products


  return (
    <>
      <header className="site-header">
        <h2>🐾 PetVersalAI</h2>
        <p>Everything your pet needs, in one place.</p>

        <nav className="site-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section id="home" className="hero">
          <h1>Welcome to PetVersalAI</h1>
          <p>Your pet's happy place!</p>
        </section>

        <section id="products" className="products-section">
          <h2>Our Products</h2>
          <p>Discover the best products for your pets.</p>
          <div className="category-filters">
            <button type='button' onClick={() => setSelectedCategory('all')} className={selectedCategory === 'all' ? 'active' : ''} aria-pressed={selectedCategory === 'all'}>All</button>
            <button type="button" onClick={() => setSelectedCategory('foods')} className={selectedCategory === 'foods' ? 'active' : ''} aria-pressed={selectedCategory === 'foods'}>Foods</button>
            <button type="button" onClick={() => setSelectedCategory('toys')} className={selectedCategory === 'toys' ? 'active' : ' '} aria-pressed={selectedCategory === 'toys '}>toys </button>
          </div>
          <div className="product-search">
            <input type="text" placeholder='Search products' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {
            !loading && !error && (
              <p className='product-count'>
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </p>
            )
          }

          {loading && <p className="Loading-state" role="state">  🐾 Loading pet products, please wait...</p>}

          {error && (<div className="error-state" role="alert">
            <h3>⚠️ Unable to load products</h3>
            <p>Please try again later.</p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              Try Again
            </button>
          </div>)}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="empty-state">
              <p>No Product Found</p>
              <p>Try another search or click Clear All Filters.</p>
            </div>
          )}

          <div className="sort-container">
            <label htmlFor="sort">Sort by Price: </label>

            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
          <button type="button" className="clear-filters-btn" onClick={() => {
            setSelectedCategory('all')
            setSearchTerm(' ')
            setSortOrder(' ')
          }}>Clear All filter</button>

          {!loading && !error && filteredProducts.length > 0 && (
            <ul className="product-list">
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <h3>{product.name}</h3>

                  <span className={
                    product.stock > 0 ? 'stock-badge in-stock'
                      : 'stock-badge out-of-stock'
                  }>
                    {product.stock > 0 ? 'In- stock' : 'out-of stock'}
                  </span>
                  <p>Category:{product.category}</p>
                  <p>Price:{product.price}</p>
                  <p>Stock:{product.stock}</p>
                </li>

              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  )
}

export default App
