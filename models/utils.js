const PRICE_LABELS_DICTIONARY = {
  USD_true: 'price_igv',
  PEN_true: 'price_pen_igv',
  USD_false: 'price_non_igv',
  PEN_false: 'price_pen_non_igv'
}

const IGV_VALUE_PRM = 0.18

const VALID_MONEY_TYPE = ['PEN', 'USD']

const getUpdatedProduct = (product, item) => {
  const newItem = product.item < item ? product.item : product.item - 1
  return { ...product, item: newItem }
}
/* eslint-disable camelcase */

export const updateProductsByIgvAndMoney = ({ products = [], money_type, with_igv }) => {
  if (!products) return []
  if (!VALID_MONEY_TYPE.includes(money_type)) return products
  if (with_igv == null) return products
  const newProducts = products?.map(product => {
    const priceLabel = money_type + '_' + with_igv.toString()
    const newPriceField = PRICE_LABELS_DICTIONARY[priceLabel]
    const total = +(product[newPriceField] * product.reserved_quantity).toFixed(4)
    return {
      ...product,
      unit_price: product[newPriceField],
      total
    }
  })
  return newProducts
}

export const calculateNewProducts = ({ products = [], money_type, with_igv, product }) => {
  if (!products) return []
  if (!product) return []
  if (!VALID_MONEY_TYPE.includes(money_type)) return products
  if (with_igv == null) return products
  const priceLabel = money_type + '_' + with_igv.toString()
  const newPriceField = PRICE_LABELS_DICTIONARY[priceLabel]
  const unit_price = product[newPriceField]
  const total = +(product.reserved_quantity * unit_price).toFixed(4)
  const newProducts = [...products, { ...product, total, unit_price }]
  return newProducts
}

export const updateProductQuantity = ({ products = [], product }) => {
  if (!products) return []
  if (!product) return []
  const { _id, item, reserved_quantity } = product
  const newProducts = products.map((existProd) => {
    if (existProd._id !== _id || existProd.item !== item) return { ...existProd }
    const { unit_price } = existProd
    const currentTotal = +(Number(existProd.total).toFixed(4))
    const newTotal = +(Number(reserved_quantity * unit_price).toFixed(4))
    const total = reserved_quantity > 0 ? newTotal : currentTotal
    return { ...existProd, reserved_quantity, total }
  })
  return newProducts
}

export const deleteBillingProduct = ({ products = [], product }) => {
  if (!products) return []
  if (!product) return []
  const { _id, item } = product
  const newProducts = products.flatMap((existProd) => {
    const isDeletedProduct = existProd._id === _id && existProd.item === item
    return !isDeletedProduct ? [getUpdatedProduct(existProd, item)] : []
  })
  return newProducts
}

export const calculateBillingAmounts = ({ products = [], with_igv }) => {
  if (!products) return {}
  if (with_igv == null) return {}
  const before_taxes_amount = products?.reduce(
    (accumulator, currentValue) => accumulator + currentValue.total,
    0
  )
  const igv_amount = with_igv ? 0 : before_taxes_amount * IGV_VALUE_PRM
  const total_amount = igv_amount + before_taxes_amount
  return {
    before_taxes_amount: +(before_taxes_amount).toFixed(4),
    igv_amount: +(igv_amount).toFixed(4),
    total_amount: +(total_amount).toFixed(4)
  }
}
