import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCar } from '../services/CarsAPI'
import {
    calcTotalPrice,
    formatPrice,
    isInvalidCombo,
    COLOR_PRICES,
    WHEEL_PRICES,
    INTERIOR_PRICES,
    ENGINE_PRICES,
} from '../utilities/calcPrice'
import '../App.css'

const COLOR_HEX = {
    white: '#f0f0f0',
    silver: '#c0c0c0',
    red: '#cc1111',
    blue: '#1155cc',
    yellow: '#f5c518',
    black: '#111111',
}

const defaultForm = {
    name: '',
    exterior_color: 'white',
    wheel_type: 'standard',
    interior: 'cloth',
    engine: 'v4',
}

const CreateCar = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState(defaultForm)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const totalPrice = calcTotalPrice(form)
    const carColor = COLOR_HEX[form.exterior_color] || '#f0f0f0'

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isInvalidCombo(form)) {
            setError('Electric engines are not compatible with off-road wheels.')
            return
        }
        try {
            setSubmitting(true)
            await createCar({ ...form, total_price: totalPrice })
            navigate('/customcars')
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main>
            <div style={{ padding: '2rem', flex: 1 }}>
                <h1>Customize Your Car</h1>

                {/* Visual car preview */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '1.5rem 0',
                    gap: '1rem',
                }}>
                    <div style={{
                        fontSize: '6rem',
                        filter: `drop-shadow(0 0 12px ${carColor})`,
                        transition: 'filter 0.3s',
                    }}>
                        {form.engine === 'electric' ? '⚡🚗' : '🚗'}
                    </div>
                    <div style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: carColor,
                        border: '3px solid white',
                        boxShadow: `0 0 16px ${carColor}`,
                        transition: 'background 0.3s',
                    }} />
                </div>

                <article>
                    <header>
                        <h2 style={{ color: 'white' }}>
                            Total Price: <span style={{ color: '#f5c518' }}>{formatPrice(totalPrice)}</span>
                        </h2>
                    </header>

                    {error && (
                        <p style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '1rem' }}>
                            ⚠️ {error}
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <label>
                            Car Name
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Thunder Beast"
                                required
                            />
                        </label>

                        <label>
                            Exterior Color (+{formatPrice(COLOR_PRICES[form.exterior_color])})
                            <select name="exterior_color" value={form.exterior_color} onChange={handleChange}>
                                <option value="white">White (+$0)</option>
                                <option value="silver">Silver (+$200)</option>
                                <option value="yellow">Yellow (+$300)</option>
                                <option value="red">Red (+$500)</option>
                                <option value="blue">Blue (+$500)</option>
                                <option value="black">Black (+$1,000)</option>
                            </select>
                        </label>

                        <label>
                            Wheels (+{formatPrice(WHEEL_PRICES[form.wheel_type])})
                            <select name="wheel_type" value={form.wheel_type} onChange={handleChange}>
                                <option value="standard">Standard (+$0)</option>
                                <option value="off-road">Off-Road (+$1,500)</option>
                                <option value="sport">Sport (+$2,000)</option>
                                <option value="luxury">Luxury (+$3,000)</option>
                            </select>
                        </label>

                        <label>
                            Interior (+{formatPrice(INTERIOR_PRICES[form.interior])})
                            <select name="interior" value={form.interior} onChange={handleChange}>
                                <option value="cloth">Cloth (+$0)</option>
                                <option value="leather">Leather (+$2,500)</option>
                                <option value="suede">Suede (+$4,000)</option>
                            </select>
                        </label>

                        <label>
                            Engine (+{formatPrice(ENGINE_PRICES[form.engine])})
                            <select name="engine" value={form.engine} onChange={handleChange}>
                                <option value="v4">V4 (+$0)</option>
                                <option value="v6">V6 (+$3,000)</option>
                                <option value="v8">V8 (+$6,000)</option>
                                <option value="electric">Electric (+$10,000)</option>
                            </select>
                        </label>

                        <footer>
                            <button type="submit" disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save My Car'}
                            </button>
                        </footer>
                    </form>
                </article>
            </div>
        </main>
    )
}

export default CreateCar
