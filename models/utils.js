const PRICE_LABELS_DICTIONARY = {
  USD_true: 'price_igv',
  PEN_true: 'price_pen_igv',
  USD_false: 'price_non_igv',
  PEN_false: 'price_pen_non_igv'
}

const VALID_MONEY_TYPE = ['PEN', 'USD']

/* eslint-disable camelcase */

export const updateProductsByIgvAndMoney = ({ products = [], money_type, with_igv }) => {
  if (!VALID_MONEY_TYPE.includes(money_type)) return products
  if (with_igv == null) return products
  if (!products) return []
  const newProducts = products?.map(product => {
    const priceLabel = money_type + '_' + with_igv.toString()
    const newPriceField = PRICE_LABELS_DICTIONARY[priceLabel]
    const total = (product[newPriceField] * product.reserved_quantity).toFixed(4)
    return {
      ...product,
      unit_price: product[newPriceField],
      total
    }
  })
  return newProducts
}

export const calculateNewProducts = ({ products = [], money_type, with_igv, product }) => {
  if (!VALID_MONEY_TYPE.includes(money_type)) return products
  if (with_igv == null) return products
  if (!products) return []
  if (!product) return []
  const priceLabel = money_type + '_' + with_igv.toString()
  const newPriceField = PRICE_LABELS_DICTIONARY[priceLabel]
  const unit_price = product[newPriceField]
  const total = product.reserved_quantity * unit_price
  const newProducts = [...products, { ...product, total, unit_price }]
  return newProducts
}
