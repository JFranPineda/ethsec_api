import path from 'path'

const BILLINGS_HEADERS = ['ITEM', 'DESCRIPCIÓN', 'MODELO', 'CANT.', 'PRECIO UNIT.', 'TOTAL']
const COLUMNS_WIDTH = [30, 230, 70, 45, 75, 75]
const TABLE_PADDING = 5
const HEADER_IMAGE_PATH = path.join(__dirname, '../public/resources/ethical_logo.png')
const FOOTER_IMAGE_PATH = path.join(__dirname, '../public/resources/footer_image.png')
const IMAGE_LOGO_WIDTH = 131
const IMAGE_LOGO_HEIGHT = 35
const IMAGE_FOOTER_WIDTH = 270
const IMAGE_FOOTER_HEIGHT = 30
const TOP_MARGIN = 70
const LINE_HEIGHT_FORM = 13
const TOTAL_FORM_PADDING = 5

const getTextWidth = (text) => text.length * 5.5

const calculatePosX = (i) => {
  const x = COLUMNS_WIDTH.slice(0, i).reduce((acc, curr) => acc + curr + TABLE_PADDING, 30)
  return x
}

const billingPageProps = {
  posY: 0,
  pages: []
}

const getDocPages = () => {
  const pages = billingPageProps.pages
  return pages
}

const addNewPage = ({ page }) => {
  billingPageProps.pages.push(page)
}

const cleanDocPages = () => {
  billingPageProps.pages = []
}

const getPagesSize = () => {
  const pages = billingPageProps.pages
  const size = pages.length
  return size
}

const getPosY = () => billingPageProps.posY
const setPosY = (posY) => { billingPageProps.posY = posY }

const wrapText = (text, maxWidth) => {
  const lines = []
  const paragraphs = text.split('\n')

  paragraphs.forEach(paragraph => {
    const words = paragraph.split(' ')
    let currentLine = words[0] || ''

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width = getTextWidth(currentLine + ' ' + word)
      if (width < maxWidth) {
        currentLine = currentLine + ' ' + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
  })

  return lines
}

const printCellValue = ({ doc, index, value, posY }) => {
  const posX = calculatePosX(index)
  doc.text(value, posX, posY, { width: COLUMNS_WIDTH[index], align: 'left' })
}

const printTextValue = ({ doc, value, posY, posX = 30, width = 330 }) => {
  doc.text(value, posX, posY, { width, align: 'left' })
}

const printCenterTextValue = ({ doc, value, posY, posX = 30, width = 330 }) => {
  doc.text(value, posX, posY, { width, align: 'center' })
}

const writeBillingsHeaders = ({ doc }) => {
  let posY = getPosY()
  const lineHeight = LINE_HEIGHT_FORM
  const fillTitleColor = '#2F75B5'
  const borderColor = '#204F7A'
  const textTitleColor = '#FFFFFF'
  const boxHeight = lineHeight + TABLE_PADDING
  const posTextHeader = posY + TABLE_PADDING

  BILLINGS_HEADERS.forEach((header, i) => {
    const posX = calculatePosX(i)
    const boxWidth = COLUMNS_WIDTH[i] + TABLE_PADDING
    doc.save()
      .rect(posX - TABLE_PADDING, posY, boxWidth, boxHeight)
      .fillAndStroke(fillTitleColor, borderColor)
      .restore()

    doc.font('Helvetica-Bold').fontSize(11).fillColor(textTitleColor)
    printCellValue({ doc, index: i, value: header, posY: posTextHeader })
  })
  posY += 20
  setPosY(posY)
}

const checkBottomAndAddHeaders = ({ doc, additionalHeight = 0 }) => {
  const posY = getPosY()
  const pageHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom
  doc.font('Helvetica').fontSize(10)
  if (posY + additionalHeight > pageHeight) {
    createNewPage({ doc })
    writeBillingsHeaders({ doc })
  } else {
    setPosY(posY)
  }
}

const checkBottomAndAddPage = ({ doc, additionalHeight = 0 }) => {
  const posY = getPosY()
  const pageHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom - 1.89
  doc.font('Helvetica').fontSize(10)
  if (posY + additionalHeight > pageHeight) {
    createNewPage({ doc })
  }
}

const printFormData = ({ doc, title, values, posX, posY = getPosY(), boxWidth = 300 }) => {
  const boxPadding = 5
  const lineHeight = LINE_HEIGHT_FORM
  const boxRounded = 5
  const fillTitleColor = '#2F75B5'
  const fillFormColor = '#FFFFFF'
  const borderColor = '#204F7A'
  const textTitleColor = '#FFFFFF'
  const textFormColor = '#000000'
  let boxHeight = lineHeight + boxPadding

  doc.save()
    .roundedRect(posX - boxPadding, posY, boxWidth, boxHeight, boxRounded)
    .fillAndStroke(fillTitleColor, borderColor)
    .restore()

  posY = posY + boxPadding

  doc.font('Helvetica-Bold').fontSize(11).fillColor(textTitleColor)
  printCenterTextValue({ doc, value: title, posY, posX, width: boxWidth })

  posY = posY + lineHeight + boxPadding * 0.5
  boxHeight = values.length * lineHeight + boxPadding
  doc.save()
    .roundedRect(posX - boxPadding, posY, boxWidth, boxHeight, boxRounded)
    .fillAndStroke(fillFormColor, borderColor)
    .restore()

  doc.font('Helvetica').fontSize(10).fillColor(textFormColor)
  posY = posY + boxPadding
  values.forEach((value) => {
    printTextValue({ doc, value, posX, posY, width: boxWidth })
    posY += lineHeight
  })

  const maxPosY = Math.max(posY + boxPadding, getPosY())
  setPosY(maxPosY)
}

/* eslint-disable camelcase */
const generateClientForm = ({ doc, client, posY }) => {
  const { ruc, company_name, contact, address, city, telephone } = client
  const values = [
    `Cliente: ${company_name}`,
    `RUC: ${ruc}`,
    `Dirección: ${address}`,
    `Ciudad: ${city}`,
    `Contacto: ${contact}`,
    `Celular: ${telephone}`
  ]
  printFormData({ doc, title: 'CLIENTE', values, posX: 30, posY, boxWidth: 300 })
}

/* eslint-disable camelcase */
const generateSellerForm = ({ doc, seller, posY }) => {
  const { first_name, last_name, telephone, email } = seller
  const values = [
    'Razon Social: ETHICAL SECURITY SAC',
    'RUC: 20545038227',
    `Contacto: ${first_name} ${last_name}`,
    `Email: ${email}`,
    `Celular: ${telephone}`,
    ''
  ]
  printFormData({ doc, title: 'EMPRESA', values, posX: 350, posY, boxWidth: 200 })
}

const generateFinnancialInfo = ({ doc }) => {
  checkBottomAndAddPage({ doc, additionalHeight: 120 })
  let posY = getPosY()
  doc.font('Helvetica-Bold').fontSize(10)
  printTextValue({ doc, value: 'CONDICIONES COMERCIALES', posY })
  setPosY(posY + 20)
  const banbifAccount = {
    bank_name: 'Banco Interamericano de Finanzas – BanBif',
    usd_account: '008002633920',
    cci_usd: '038 302 208002633920 60',
    pen_account: '007000471824',
    cci_pen: '038 302 107000471824 65'
  }
  printBankInformation({ doc, data: banbifAccount })
  checkBottomAndAddPage({ doc, additionalHeight: 120 })

  const interbankAccount = {
    bank_name: 'Banco Interbank',
    usd_account: '2003003485541',
    cci_usd: '003 200 003003485541 38',
    pen_account: '2003003485534',
    cci_pen: '003 200 003003485534 33'
  }
  printBankInformation({ doc, data: interbankAccount })
  checkBottomAndAddPage({ doc, additionalHeight: 120 })
  posY = getPosY()
  doc.font('Helvetica-Bold').fontSize(10)
  const closingSentence = '¡Gracias por su confianza!'
  printTextValue({ doc, value: closingSentence, posY, width: 600 })
  setPosY(posY + 20)
}

const printBankInformation = ({ doc, data }) => {
  let posY = getPosY()
  const { bank_name, usd_account, cci_usd, pen_account, cci_pen } = data
  doc.font('Helvetica-Bold').fontSize(10)
  printTextValue({ doc, value: `Institución Financiera: ${bank_name}`, posY, width: 600 })
  posY += 20
  doc.font('Helvetica').fontSize(10)
  const values = [
    `Cuenta de Ahorro Empresarial (USD): ${usd_account}`,
    `Código de cuenta interbancario (CCI): ${cci_usd}`,
    `Cuenta Corriente (S/.): ${pen_account}`,
    `Código cuenta interbancario (S/.) (CCI): ${cci_pen}`
  ]
  values.forEach((value, i) => {
    printTextValue({ doc, value, posY, width: 600 })
    posY += 20
  })
  posY += 20
  setPosY(posY)
}

const generateBillingTop = ({ doc, client = {}, seller = {} }) => {
  const posX = 30
  const posY = getPosY()
  const lineWidth = doc.page.width - posX
  generateClientForm({ doc, client, posY })
  generateSellerForm({ doc, seller, posY })
  let currentY = getPosY()
  doc.moveTo(posX, currentY).lineTo(lineWidth, currentY).stroke()
  currentY += 20
  setPosY(currentY)
}

const writeBillingTitle = ({ doc, billing = {} }) => {
  let currentY = getPosY()
  const { billing_number = 0 } = billing
  const billingTitle = `COTIZACIÓN NRO. ${billing_number}`
  doc.font('Helvetica-Bold').fontSize(12).text(billingTitle, 0, currentY, { align: 'center' })
  currentY += 20

  const currentDate = new Date()
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(currentDate)
  const formattedDateText = `Emitido el: ${formattedDate.replace(' de ', ' de ')}`
  doc.font('Helvetica').fontSize(10).text(formattedDateText, 0, currentY, { align: 'center' })
  currentY += 20
  setPosY(currentY)
}

const generateNotes = ({ doc, notes = '', posY = getPosY() }) => {
  doc.font('Helvetica-Bold').fontSize(10)
  printTextValue({ doc, value: 'NOTAS', posY })
  posY += 20
  doc.font('Helvetica').fontSize(10)
  const notesLines = wrapText(notes, 330)
  notesLines.forEach((value, i) => {
    printTextValue({ doc, value, posY })
    posY += 15
  })
  const maxPosY = Math.max(posY, getPosY())
  setPosY(maxPosY)
}

const generateBillingAmounts = ({ doc, billing, posY = getPosY() }) => {
  const posX = 350
  const cellWidth = doc.page.width - posX - doc.page.margins.right
  doc.font('Helvetica').fontSize(10)
  const { before_taxes_amount, igv_amount, total_amount } = billing
  const values = [
    `SUBTOTAL: ${before_taxes_amount.toFixed(2)}`,
    `IGV: ${igv_amount.toFixed(2)}`,
    `TOTAL: ${total_amount.toFixed(2)}`
  ]
  values.forEach((value, i) => {
    printTextValue({ doc, value, posY, posX: posX + TOTAL_FORM_PADDING, width: cellWidth })
    posY += LINE_HEIGHT_FORM
    doc.moveTo(posX, posY).lineTo(posX + cellWidth, posY).stroke()
    posY += TOTAL_FORM_PADDING
  })
  const maxPosY = Math.max(posY, getPosY())
  setPosY(maxPosY)
}

const generateCommercialConditions = ({ doc, billing }) => {
  let posY = getPosY()
  doc.font('Helvetica-Bold').fontSize(10)
  printTextValue({ doc, value: 'CONDICIONES COMERCIALES', posY })
  posY += 20
  doc.font('Helvetica').fontSize(10)
  const { expiration_time, money_type = 'PEN' } = billing
  const values = [
    `Validez de la oferta: ${expiration_time} días`,
    'Tiempo de entrega: De 7 a 10 días hábiles luego de la OC',
    `Moneda: ${money_type === 'USD' ? 'Dólares Americanos' : 'Soles (PEN)'}`,
    'Forma de pago: 50% Adelanto y 50% saldo contra entrega'
  ]
  values.forEach((value, i) => {
    printTextValue({ doc, value, posY })
    posY += 20
  })
  const maxPosY = Math.max(posY, getPosY())
  setPosY(maxPosY)
}

const generateTableRow = ({ doc, product }) => {
  let posY = getPosY()
  const initialPosY = getPosY() + TABLE_PADDING
  const textCellColor = '#000000'

  doc.font('Helvetica').fontSize(10).fillColor(textCellColor)
  const { description = '', model = '', reserved_quantity = 0, unit_price = 0, total = 0, item = 1 } = product
  const columns = [
    item,
    description,
    model,
    reserved_quantity,
    unit_price.toFixed(2),
    total.toFixed(2)
  ]

  const posX = calculatePosX(0)
  const lineWidth = doc.page.width - posX
  columns.forEach((value, i) => {
    checkBottomAndAddHeaders({ doc, additionalHeight: 20 })
    if (i === 1) {
      const textLines = wrapText(value, COLUMNS_WIDTH[1])
      textLines.forEach((line, idx) => {
        printCellValue({ doc, index: 1, value: line, posY: posY + TABLE_PADDING })
        posY += idx === textLines.length - 1 ? 0 : 20
      })
    } else {
      const textLine = value.toString()
      printCellValue({ doc, index: i, value: textLine, posY: initialPosY })
    }
  })
  posY += 20
  doc.moveTo(posX, posY).lineTo(lineWidth, posY).stroke()
  setPosY(posY)
}

const writeNotesAndAmounts = ({ doc, billing }) => {
  let posY = getPosY()
  const { notes = '' } = billing
  generateNotes({ doc, notes, posY })
  generateBillingAmounts({ doc, billing, posY })
  posY = getPosY() + 20
  setPosY(posY)
}

const generateBillingBottom = ({ doc, billing = {} }) => {
  checkBottomAndAddPage({ doc, additionalHeight: 70 })
  writeNotesAndAmounts({ doc, billing })
  checkBottomAndAddPage({ doc, additionalHeight: 120 })
  generateCommercialConditions({ doc, billing })
  generateFinnancialInfo({ doc })
}

const generateProductsTable = ({ doc, billing }) => {
  const { products = [] } = billing
  products.forEach((product, i) => {
    product.item = i + 1
    generateTableRow({ doc, product })
  })
  const posY = getPosY() + 20
  setPosY(posY)
}

const addHeaderImage = ({ doc }) => {
  const imageWidth = IMAGE_LOGO_WIDTH
  const imageHeight = IMAGE_LOGO_HEIGHT
  const imageX = doc.page.width - doc.page.margins.right - imageWidth
  const imageY = doc.page.margins.top
  doc.image(HEADER_IMAGE_PATH, imageX, imageY, { width: imageWidth, height: imageHeight })
}

const addFooterImage = ({ doc }) => {
  const imageWidth = IMAGE_FOOTER_WIDTH
  const imageHeight = IMAGE_FOOTER_HEIGHT
  const imageX = doc.page.width - doc.page.margins.right - imageWidth
  const imageY = doc.page.height - doc.page.margins.bottom - imageHeight
  doc.image(FOOTER_IMAGE_PATH, imageX, imageY, { width: imageWidth, height: imageHeight })
}

const writePageNumber = ({ doc, pageIndex }) => {
  const textPageColor = '#2F75B5'
  const pageNumber = pageIndex + 1
  const totalPages = getPagesSize()
  const textHeight = 15
  const textBottomPos = doc.page.height - doc.page.margins.bottom - textHeight
  doc.fontSize(10).fillColor(textPageColor)
    .text(`Página ${pageNumber} de ${totalPages}`, 30, textBottomPos, {
      align: 'left',
      width: doc.page.width - 60
    })
}

const addDocPagination = ({ doc }) => {
  const pages = getDocPages()
  pages.forEach((_, index) => {
    doc.switchToPage(index)
    writePageNumber({ doc, pageIndex: index })
  })
  cleanDocPages()
}

const createNewPage = ({ doc }) => {
  addNewPage({ page: doc.page })
  doc.addPage()
  addHeaderImage({ doc })
  addFooterImage({ doc })
  const posY = TOP_MARGIN
  setPosY(posY)
}

export const generatePDF = ({ doc, client, billing, seller }) => {
  createNewPage({ doc })
  generateBillingTop({ doc, client, seller })
  writeBillingTitle({ doc, billing })
  writeBillingsHeaders({ doc })
  generateProductsTable({ doc, billing })
  generateBillingBottom({ doc, billing })
  addDocPagination({ doc })
}
