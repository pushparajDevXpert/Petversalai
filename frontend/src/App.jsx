
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [selectedCategory, setSelectedCategory]=useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm,setSearchTerm]=useState('')


 
useEffect(() => {
  async function loadProducts() {
    setLoading(true)
    setError('')

    try {
      // const url =
      //   selectedCategory === 'all'
      //     ? '/api/products/'
      //     : `/api/products/?category=${selectedCategory}`
      const params= new URLSearchParams()
      if (selectedCategory!=='all'){
        params.append('category',selectedCategory)
      }
      if (searchTerm.trim()){
        params.append('search', searchTerm.trim())
      }
      const url=params.toString()? `/api/products/?${params.toString()}`:'/api/products/'

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data)

    } catch (err) {
      console.error(err)
      setError('Products load झाले नाहीत.')

    } finally {
      setLoading(false)
    }
  }

  loadProducts()
}, [selectedCategory,searchTerm])

  // const filteredProducts =selectedCategory==='all'?products:products.filter(
  //   (products)=>products.category === selectedCategory
  // )
 
const filteredProducts = products.filter((product) => {
  const matchesCategory =
    selectedCategory === 'all' ||
    product.category === selectedCategory

  const matchesSearch = product.name
    .toLowerCase()
    .includes(searchTerm.trim().toLowerCase())

  return matchesCategory && matchesSearch
})


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
            <button type='button'onClick={()=>setSelectedCategory('all')}className={selectedCategory === 'all' ? 'active' : ''} aria-pressed={selectedCategory === 'all'}>All</button> 
            <button type="button"onClick={()=>setSelectedCategory('foods')}className={selectedCategory === 'foods' ? 'active' : ''} aria-pressed={selectedCategory==='foods'}>Foods</button>
            <button type="button"onClick={()=>setSelectedCategory('toys')}className={selectedCategory==='toys'?'active':' '} aria-pressed={selectedCategory==='toys '}>toys </button>
          </div>
          <div className="product-search">
            <input type="text" placeholder='Search products'value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
          </div>

          {loading && <p>Loading products...</p>}

          {error && <p>{error}</p>}

          {!loading && !error && filteredProducts.length === 0 && (
            <p>No products available.</p>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <ul className="product-list">
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <h3>{product.name}</h3>

                  <span className={
                    product.stock>0 ?'stock-badge in-stock'
                    :'stock-badge out-of-stock'
                  }>
                    {product.stock>0?'In- stock':'out-of stock'}
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
