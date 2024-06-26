const BILLINGS_HEADERS = ['ITEM', 'DESCRIPCIÓN', 'MODELO', 'CANT.', 'PRECIO UNIT.', 'TOTAL']
const COLUMNS_WIDTH = [30, 250, 75, 50, 75, 75]
const HEADER_IMAGE_PATH = './resources/ethical_logo.png'
const FOOTER_IMAGE_PATH = './resources/footer_image.png'
const IMAGE_LOGO_WIDTH = 131
const IMAGE_LOGO_HEIGHT = 35
const IMAGE_FOOTER_WIDTH = 310
const IMAGE_FOOTER_HEIGHT = 35
const TOP_MARGIN = 70
const LINE_HEIGHT_FORM = 13

const getTextWidth = (text) => text.length * 5.5

const calculatePosX = (i) => {
  const x = COLUMNS_WIDTH.slice(0, i).reduce((acc, curr) => acc + curr, 30)
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
  doc.font('Helvetica-Bold').fontSize(10)
  BILLINGS_HEADERS.forEach((header, i) => {
    printCellValue({ doc, index: i, value: header, posY })
  })
  doc.font('Helvetica').fontSize(10)
  posY += 30
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

const generateBillingTop = ({ doc, client = {}, seller = {} }) => {
  const posY = getPosY()
  generateClientForm({ doc, client, posY })
  generateSellerForm({ doc, seller, posY })
  let currentY = getPosY()
  doc.moveTo(30, currentY).lineTo(550, currentY).stroke()
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
  currentY += 30
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
  doc.font('Helvetica').fontSize(10)
  const { before_taxes_amount, igv_amount, total_amount } = billing
  const subTotalAmount = `SUBTOTAL: ${before_taxes_amount}`
  const igvAmount = `IGV: ${igv_amount}`
  const totalAmount = `TOTAL: ${total_amount}`
  const values = [subTotalAmount, igvAmount, totalAmount]
  values.forEach((value, i) => {
    printTextValue({ doc, value, posY, posX: 350, width: 200 })
    posY += 20
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
  const expirationValue = `Validez de la oferta: ${expiration_time} días`
  const deliveryTimeValue = 'Tiempo de entrega: De 7 a 10 días hábiles luego de la OC'
  const moneyTypeValue = `Moneda: ${money_type === 'USD' ? 'Dólares Americanos' : 'Soles (PEN)'}`
  const paymentFormValue = 'Forma de pago: 50% Adelanto y 50% saldo contra entrega'
  const values = [expirationValue, deliveryTimeValue, moneyTypeValue, paymentFormValue]
  values.forEach((value, i) => {
    printTextValue({ doc, value, posY })
    posY += 20
  })
  const maxPosY = Math.max(posY, getPosY())
  setPosY(maxPosY)
}

const generateTableRow = ({ doc, product }) => {
  let posY = getPosY()
  const initialPosY = getPosY()
  doc.font('Helvetica').fontSize(10)
  const { description = '', model = '', reserved_quantity = 0, unit_price = 0, total = 0, item = 1 } = product
  const columns = [
    item,
    description,
    model,
    reserved_quantity,
    unit_price.toFixed(2),
    total.toFixed(2)
  ]
  columns.forEach((value, i) => {
    if (i === 1) {
      const textLines = wrapText(value, COLUMNS_WIDTH[1])
      textLines.forEach((line, idx) => {
        checkBottomAndAddHeaders({ doc, additionalHeight: 20 })
        printCellValue({ doc, index: 1, value: line, posY })
        posY += idx === textLines.length - 1 ? 0 : 20
      })
    } else {
      const textLine = value.toString()
      printCellValue({ doc, index: i, value: textLine, posY: initialPosY })
    }
  })
  posY += 20
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
  doc.fontSize(10).fillColor(textPageColor)
    .text(`Página ${pageNumber} de ${totalPages}`, 30, doc.page.height - 50, {
      align: 'center',
      width: doc.page.width - 60
    })
}

const addDocPagination = ({ doc }) => {
  const pages = getDocPages()
  pages.forEach((page, index) => {
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
