import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCars, deleteCar } from '../services/CarsAPI'
import { formatPrice } from '../utilities/calcPrice'
import '../App.css'

const COLOR_HEX = {
    white: '#f0f0f0',
    silver: '#c0c0c0',
    red: '#cc1111',
    blue: '#1155cc',
    yellow: '#f5c518',
    black: '#111111',
}

const ViewCars = () => {
    const navigate = useNavigate()
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchCars()
    }, [])

    const fetchCars = async () => {
        try {
            const data = await getAllCars()
            setCars(data)
        } catch (err) {
            setError('Failed to load cars.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id, e) => {
        e.stopPropagation()
        if (!confirm('Delete this car?')) return
        try {
            await deleteCar(id)
            setCars(cars.filter(c => c.id !== id))
        } catch (err) {
            alert('Failed to delete car.')
        }
    }

    const handleEdit = (id, e) => {
        e.stopPropagation()
        navigate(`/edit/${id}`)
    }

    if (loading) return <main><p style={{ padding: '2rem', color: 'white' }}>Loading...</p></main>
    if (error) return <main><p style={{ padding: '2rem', color: '#ff6b6b' }}>{error}</p></main>

    return (
        <main>
            <div style={{ padding: '2rem', width: '100%' }}>
                <h1>My Custom Cars</h1>

                {cars.length === 0 ? (
                    <article>
                        <p>No custom cars yet. <a href="/" style={{ color: '#f5c518' }}>Build one!</a></p>
                    </article>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {cars.map(car => (
                            <article
                                key={car.id}
                                onClick={() => navigate(`/customcars/${car.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <header>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            background: COLOR_HEX[car.exterior_color] || '#888',
                                            border: '2px solid white',
                                            flexShrink: 0,
                                        }} />
                                        <h3 style={{ margin: 0 }}>{car.name}</h3>
                                    </div>
                                </header>

                                <p><strong>Color:</strong> {car.exterior_color}</p>
                                <p><strong>Wheels:</strong> {car.wheel_type}</p>
                                <p><strong>Interior:</strong> {car.interior}</p>
                                <p><strong>Engine:</strong> {car.engine}</p>
                                <p style={{ color: '#f5c518', fontWeight: 'bold' }}>
                                    {formatPrice(car.total_price)}
                                </p>

                                <footer>
                                    <button onClick={(e) => handleEdit(car.id, e)}>Edit</button>
                                    <button
                                        onClick={(e) => handleDelete(car.id, e)}
                                        style={{ background: 'var(--primary)' }}
                                    >
                                        Delete
                                    </button>
                                </footer>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

export default ViewCars
