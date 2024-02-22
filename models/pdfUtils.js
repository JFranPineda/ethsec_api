const BILLINGS_HEADERS = ['ITEM', 'DESCRIPCIÓN', 'MODELO', 'CANT.', 'PRECIO UNIT.', 'TOTAL']

const COLUMNS_WIDTH = [30, 300, 50, 50, 50, 75]

const getTextWidth = (text) => {
  return text.length * 5.5
}

const calculatePosX = (i) => {
  const x = COLUMNS_WIDTH.slice(0, i).reduce((acc, curr) => acc + curr, 30)
  return x
}

const billingPageProps = {
  posY: 0
}

export const getPosY = () => {
  return billingPageProps.posY
}

export const setPosY = (posY) => {
  billingPageProps.posY = posY
}

const wrapText = (text, width) => {
  const words = text.split(' ')
  const lines = []
  let currentLine = ''
  words.forEach(word => {
    const potentialLine = currentLine.length === 0 ? word : `${currentLine} ${word}`
    if (getTextWidth(potentialLine) <= width) {
      currentLine = potentialLine
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  })
  if (currentLine.length > 0) {
    lines.push(currentLine)
  }
  return lines
}

const printCellValue = ({ doc, index, value, posY, posX = calculatePosX(index) }) => {
  doc.text(value, posX, posY, { width: COLUMNS_WIDTH[index], align: 'left' })
}

const printTextValue = ({ doc, value, posY, posX = 30, width = 330 }) => {
  doc.text(value, posX, posY, { width, align: 'left' })
}

const getWrappedLines = ({ value, colPos = 0 }) => {
  const wrappedLines = wrapText(value, COLUMNS_WIDTH[colPos])
  return wrappedLines
}

const writeBillingsHeaders = ({ doc, posY }) => {
  doc.font('Helvetica-Bold').fontSize(10)
  BILLINGS_HEADERS.forEach((header, i) => {
    printCellValue({ doc, index: i, value: header, posY })
  })
  doc.font('Helvetica').fontSize(10)
  posY += 30
  setPosY(posY)
}

const checkAndAddPage = ({ doc, posY, additionalHeight = 0 }) => {
  const pageHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom
  doc.font('Helvetica').fontSize(10)
  if (posY + additionalHeight > pageHeight) {
    doc.addPage()
    writeBillingsHeaders({ doc, posY: 50 })
  } else {
    setPosY(posY)
  }
}

const checkBottomAndAddPage = ({ doc, posY, additionalHeight = 0 }) => {
  const pageHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom - 1.89
  doc.font('Helvetica').fontSize(10)
  if (posY + additionalHeight > pageHeight) {
    doc.addPage()
    posY = 50
    setPosY(posY)
  }
}

/* eslint-disable camelcase */
const generateClientForm = ({ doc, client, posY }) => {
  doc.font('Helvetica-Bold').fontSize(12)
  printTextValue({ doc, value: 'CLIENTE', posY })
  posY += 20
  doc.font('Helvetica').fontSize(10)
  const { ruc, company_name, contact, address, city, telephone } = client
  const companyValue = `Cliente: ${company_name}`
  const rucValue = `RUC: ${ruc}`
  const addressValue = `Dirección: ${address}`
  const cityValue = `Ciudad: ${city}`
  const contactValue = `Contacto: ${contact}`
  const telephoneValue = `Celular: ${telephone}`
  const values = [
    companyValue,
    rucValue,
    addressValue,
    cityValue,
    contactValue,
    telephoneValue
  ]
  values.forEach((value, i) => {
    printTextValue({ doc, value, posY })
    posY += 20
  })
  const maxPosY = Math.max(posY, getPosY())
  setPosY(maxPosY)
}

/* eslint-disable camelcase */
const generateSellerForm = ({ doc, seller, posY }) => {
  doc.font('Helvetica-Bold').fontSize(12)
  printTextValue({ doc, value: 'EMPRESA', posY, posX: 350, width: 200 })
  posY += 20
  doc.font('Helvetica').fontSize(10)
  const { first_name, last_name, telephone, email } = seller
  const companyValue = 'Razon Social: ETHICAL SECURITY SAC'
  const rucValue = 'RUC: 20545038227'
  const contactValue = `Contacto: ${first_name} ${last_name}`
  const emailValue = `Email: ${email}`
  const telephoneValue = `Celular: ${telephone}`
  const values = [
    companyValue,
    rucValue,
    contactValue,
    emailValue,
    telephoneValue
  ]
  values.forEach((value, i) => {
    printTextValue({ doc, value, posY, posX: 350, width: 200 })
    posY += 20
  })
  const maxPosY = Math.max(posY, getPosY())
  setPosY(maxPosY)
}

export const generateBillingTop = ({ doc, client = {}, seller = {} }) => {
  let currentY = getPosY()
  generateClientForm({ doc, client, posY: currentY })
  generateSellerForm({ doc, seller, posY: currentY })
  currentY = getPosY() + 20
  setPosY(currentY)
}

const generateNotes = ({ doc, notes = '', posY }) => {
  doc.font('Helvetica-Bold').fontSize(12)
  printTextValue({ doc, value: 'NOTAS', posY })
  posY += 20
  doc.font('Helvetica').fontSize(10)
  const notesLines = wrapText(notes, 330)
  notesLines.forEach((value, i) => {
    printTextValue({ doc, value, posY })
    posY += 20
  })
  const maxPosY = Math.max(posY, getPosY())
  setPosY(maxPosY)
}

const generateBillingAmounts = ({ doc, billing, posY }) => {
  doc.font('Helvetica').fontSize(10)
  const { before_taxes_amount, igv_amount, total_amount } = billing
  const subTotalAmount = `SUBTOTAL: ${before_taxes_amount}`
  const igvAmount = `IGV: ${igv_amount}`
  const totalAmount = `TOTAL: ${total_amount}`
  const values = [
    subTotalAmount,
    igvAmount,
    totalAmount
  ]
  values.forEach((value, i) => {
    printTextValue({ doc, value, posY, posX: 350, width: 200 })
    posY += 20
  })
  const maxPosY = Math.max(posY, getPosY())
  setPosY(maxPosY)
}

const generateCommercialConditions = ({ doc, billing, posY }) => {
  doc.font('Helvetica-Bold').fontSize(12)
  printTextValue({ doc, value: 'CONDICIONES COMERCIALES', posY })
  posY += 20
  doc.font('Helvetica').fontSize(10)
  const { expiration_time, money_type = 'PEN' } = billing
  const expirationValue = `Validez de la oferta: ${expiration_time} días`
  const deliveryTimeValue = 'Tiempo de entrega: 01 día después de colocada la orden'
  const instalationTime = 'Tiempo de instalación: No incluye'
  const paymentFormValue = 'Forma de pago: CONTADO'
  const moneyType = money_type === 'PEN' ? 'soles peruanos' : 'dólares americanos'
  const priceLabel = `Precio: Expresado en ${moneyType}`
  const values = [
    expirationValue,
    deliveryTimeValue,
    instalationTime,
    paymentFormValue,
    priceLabel
  ]
  values.forEach((value, i) => {
    printTextValue({ doc, value, posY, width: 400 })
    posY += 20
  })
  setPosY(posY)
}

const printBankInformation = ({ doc, data, posY }) => {
  const { bank_name, usd_account, cci_usd, pen_account, cci_pen } = data
  doc.font('Helvetica-Bold').fontSize(11)
  printTextValue({ doc, value: `Institución Financiera: ${bank_name}`, posY, width: 600 })
  posY += 20
  doc.font('Helvetica').fontSize(10)
  const usdAccount = `Cuenta de Ahorro Empresarial (USD): ${usd_account}`
  const cciUsdAccount = `Código de cuenta interbancario (CCI): ${cci_usd}`
  const penAccount = `Cuenta Corriente (S/.): ${pen_account}`
  const cciPenAccount = `Código cuenta interbancario (S/.) (CCI): ${cci_pen}`
  const values = [
    usdAccount,
    cciUsdAccount,
    penAccount,
    cciPenAccount
  ]
  values.forEach((value, i) => {
    printTextValue({ doc, value, posY, width: 600 })
    posY += 20
  })
  posY += 20
  setPosY(posY)
}

const generateFinnancialInfo = ({ doc, posY }) => {
  checkBottomAndAddPage({ doc, posY, additionalHeight: 120 })
  posY = getPosY()
  doc.font('Helvetica-Bold').fontSize(12)
  printTextValue({ doc, value: 'CONDICIONES COMERCIALES', posY })
  posY += 20
  const banbifAccount = {
    bank_name: 'Banco Interamericano de Finanzas – BanBif',
    usd_account: '008002633920',
    cci_usd: '038 302 208002633920 60',
    pen_account: '007000471824',
    cci_pen: '038 302 107000471824 65'
  }
  printBankInformation({ doc, data: banbifAccount, posY })
  posY = getPosY()
  checkBottomAndAddPage({ doc, posY, additionalHeight: 120 })
  posY = getPosY()

  const interbankAccount = {
    bank_name: 'Banco Interbank',
    usd_account: '2003003485541',
    cci_usd: '003 200 003003485541 38',
    pen_account: '2003003485534',
    cci_pen: '003 200 003003485534 33'
  }
  posY = getPosY()
  printBankInformation({ doc, data: interbankAccount, posY })
  checkBottomAndAddPage({ doc, posY, additionalHeight: 120 })
  posY = getPosY()
  doc.font('Helvetica-Bold').fontSize(12)
  const closingSentence = '¡Gracias por su confianza!'
  printTextValue({ doc, value: closingSentence, posY, width: 600 })
}

export const generateBillingBottom = ({ doc, billing = {} }) => {
  let currentY = getPosY()
  checkBottomAndAddPage({ doc, posY: currentY, additionalHeight: 70 })
  currentY = getPosY()
  const { notes } = billing
  generateNotes({ doc, notes, posY: currentY })
  generateBillingAmounts({ doc, billing, posY: currentY })
  currentY = getPosY() + 20
  setPosY(currentY)
  checkBottomAndAddPage({ doc, posY: currentY, additionalHeight: 120 })
  currentY = getPosY()
  generateCommercialConditions({ doc, billing, posY: currentY })
  currentY = getPosY() + 20
  setPosY(currentY)
  generateFinnancialInfo({ doc, posY: currentY })
}

export const generateProductsBillingTable = ({ doc, products }) => {
  const lineHeight = 20
  let currentY = getPosY()
  // TODO: Fix when headers + firstRow > pageHeight
  writeBillingsHeaders({ doc, posY: currentY })
  currentY = getPosY()
  products.forEach(product => {
    const values = [
      product.item.toString(),
      '',
      product.model,
      product.reserved_quantity.toString(),
      product.unit_price.toFixed(2),
      product.total.toFixed(2)
    ]
    const descriptionLines = getWrappedLines({ value: product.description, colPos: 1 })
    const linesDown = Math.max(descriptionLines.length, 1)
    const additionalHeight = linesDown * lineHeight
    checkAndAddPage({ doc, posY: currentY, additionalHeight })
    currentY = getPosY()

    values.forEach((value, i) => {
      if (i !== 1) {
        printCellValue({ doc, index: i, value, posY: currentY })
      } else {
        descriptionLines.forEach((line, index) => {
          const newPosY = currentY + index * lineHeight
          printCellValue({ doc, index: i, value: line, posY: newPosY })
        })
      }
    })
    currentY += lineHeight * linesDown
  })
  currentY += 20
  setPosY(currentY)
}
