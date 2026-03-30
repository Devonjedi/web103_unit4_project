import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCar, deleteCar } from '../services/CarsAPI'
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

const CarDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const data = await getCar(id)
                setCar(data)
            } catch (err) {
                setError('Failed to load car details.')
            } finally {
                setLoading(false)
            }
        }
        fetchCar()
    }, [id])

    const handleDelete = async () => {
        if (!confirm('Delete this car?')) return
        try {
            await deleteCar(id)
            navigate('/customcars')
        } catch (err) {
            alert('Failed to delete car.')
        }
    }

    if (loading) return <main><p style={{ padding: '2rem', color: 'white' }}>Loading...</p></main>
    if (error) return <main><p style={{ padding: '2rem', color: '#ff6b6b' }}>{error}</p></main>
    if (!car) return null

    const carColor = COLOR_HEX[car.exterior_color] || '#888'

    return (
        <main>
            <div style={{ padding: '2rem', maxWidth: 600 }}>
                <button onClick={() => navigate('/customcars')} style={{ marginBottom: '1rem' }}>
                    ← Back to All Cars
                </button>

                <h1>{car.name}</h1>

                {/* Visual preview */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    margin: '1.5rem 0',
                }}>
                    <div style={{
                        fontSize: '5rem',
                        filter: `drop-shadow(0 0 12px ${carColor})`,
                    }}>
                        {car.engine === 'electric' ? '⚡🚗' : '🚗'}
                    </div>
                    <div style={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: carColor,
                        border: '3px solid white',
                        boxShadow: `0 0 16px ${carColor}`,
                    }} />
                </div>

                <article>
                    <header>
                        <h2 style={{ color: '#f5c518' }}>{formatPrice(car.total_price)}</h2>
                    </header>

                    <p><strong>Exterior Color:</strong> {car.exterior_color.charAt(0).toUpperCase() + car.exterior_color.slice(1)}</p>
                    <p><strong>Wheels:</strong> {car.wheel_type.charAt(0).toUpperCase() + car.wheel_type.slice(1)}</p>
                    <p><strong>Interior:</strong> {car.interior.charAt(0).toUpperCase() + car.interior.slice(1)}</p>
                    <p><strong>Engine:</strong> {car.engine.toUpperCase()}</p>
                    <p style={{ color: 'gray', fontSize: '0.85rem' }}>
                        Created: {new Date(car.created_at).toLocaleDateString()}
                    </p>

                    <footer>
                        <button onClick={() => navigate(`/edit/${car.id}`)}>Edit</button>
                        <button
                            onClick={handleDelete}
                            style={{ background: 'var(--primary)' }}
                        >
                            Delete
                        </button>
                    </footer>
                </article>
            </div>
        </main>
    )
}

export default CarDetails
