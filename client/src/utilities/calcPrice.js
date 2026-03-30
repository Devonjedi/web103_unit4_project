export const BASE_PRICE = 25000

export const COLOR_PRICES = {
    white: 0,
    silver: 200,
    red: 500,
    blue: 500,
    yellow: 300,
    black: 1000,
}

export const WHEEL_PRICES = {
    standard: 0,
    'off-road': 1500,
    sport: 2000,
    luxury: 3000,
}

export const INTERIOR_PRICES = {
    cloth: 0,
    leather: 2500,
    suede: 4000,
}

export const ENGINE_PRICES = {
    v4: 0,
    v6: 3000,
    v8: 6000,
    electric: 10000,
}

export const calcTotalPrice = ({ exterior_color, wheel_type, interior, engine }) => {
    return (
        BASE_PRICE +
        (COLOR_PRICES[exterior_color] ?? 0) +
        (WHEEL_PRICES[wheel_type] ?? 0) +
        (INTERIOR_PRICES[interior] ?? 0) +
        (ENGINE_PRICES[engine] ?? 0)
    )
}

export const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

export const isInvalidCombo = ({ engine, wheel_type }) =>
    engine === 'electric' && wheel_type === 'off-road'
