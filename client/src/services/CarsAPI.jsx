const API_URL = '/api/cars'

export const getAllCars = async () => {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error('Failed to fetch cars')
    return res.json()
}

export const getCar = async (id) => {
    const res = await fetch(`${API_URL}/${id}`)
    if (!res.ok) throw new Error('Failed to fetch car')
    return res.json()
}

export const createCar = async (carData) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to create car')
    return data
}

export const updateCar = async (id, carData) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to update car')
    return data
}

export const deleteCar = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete car')
    return res.json()
}
