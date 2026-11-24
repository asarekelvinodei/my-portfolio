import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

const documents = {
  'My_CV.pdf': { title: 'Curriculum Vitae', downloadLabel: 'Download CV' },
  'GCTU_eGovernance_Thesis.pdf': { title: 'GCTU Thesis', downloadLabel: 'Download thesis' },
}

const params = new URLSearchParams(location.search)
const file = params.get('file') || 'My_CV.pdf'
const documentInfo = documents[file]
const title = params.get('title') || documentInfo?.title || 'Document'
const backTarget = params.get('back') || '#top'
const status = document.getElementById('status')
const pageCount = document.getElementById('page-count')
const pages = document.getElementById('pages')
const download = document.getElementById('download')

document.title = title
document.getElementById('title').textContent = title
document.getElementById('back').addEventListener('click', () => {
  if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) {
    history.back()
    return
  }
  location.href = backTarget.startsWith('#') ? `/${backTarget}` : backTarget.startsWith('/') ? backTarget : '/'
})

if (!documentInfo) {
  pageCount.textContent = 'Document unavailable'
  status.classList.add('error')
  status.textContent = 'This PDF is not available.'
  download.hidden = true
} else {
  const pdfUrl = `/${file}`
  download.href = pdfUrl
  download.download = file
  download.textContent = documentInfo.downloadLabel
  renderDocument(pdfUrl)
}

async function renderDocument(pdfUrl) {
  try {
    const pdf = await pdfjsLib.getDocument({ url: pdfUrl }).promise
    pageCount.textContent = `${pdf.numPages} ${pdf.numPages === 1 ? 'page' : 'pages'}`

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      status.textContent = `Rendering page ${pageNumber} of ${pdf.numPages}…`
      const page = await pdf.getPage(pageNumber)
      const baseViewport = page.getViewport({ scale: 1 })
      const pageWidth = Math.min(pages.clientWidth, 1000)
      const scale = Math.min(1.5, pageWidth / baseViewport.width)
      const outputScale = Math.min(window.devicePixelRatio || 1, 2)
      const viewport = page.getViewport({ scale: scale * outputScale })
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d', { alpha: false })

      if (!context) throw new Error('Canvas rendering is unavailable in this browser.')

      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      canvas.setAttribute('role', 'img')
      canvas.setAttribute('aria-label', `Page ${pageNumber} of ${pdf.numPages}`)

      const pageElement = document.createElement('article')
      pageElement.className = 'page'
      pageElement.setAttribute('aria-label', `Page ${pageNumber} of ${pdf.numPages}`)
      pageElement.append(canvas)
      pages.append(pageElement)

      await page.render({ canvasContext: context, viewport }).promise
    }

    status.hidden = true
  } catch (error) {
    status.classList.add('error')
    status.textContent = `Unable to display this PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
  }
}
