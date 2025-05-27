import { NextRequest, NextResponse } from 'next/server'
import formidable from 'formidable'
import fs from 'fs/promises'
import path from 'path'
import pdf from 'pdf-parse'
import mammoth from 'mammoth'
import sharp from 'sharp'
import { Readable } from 'stream'

// Disable bodyParser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
}

// Utility function to parse form data
const parseForm = (req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = new formidable.IncomingForm({
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    uploadDir: path.join(process.cwd(), 'public', 'uploads'),
    filename: (name, ext, part) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      return `${part.originalFilename.split('.')[0]}-${uniqueSuffix}${ext}`
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })
    })
  })
}

// Extract text from different file types
const extractText = async (filePath: string, fileType: string): Promise<string> => {
  try {
    const fileBuffer = await fs.readFile(filePath)

    switch (fileType) {
      case 'application/pdf':
        const pdfData = await pdf(fileBuffer)
        return pdfData.text

      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const { value } = await mammoth.extractRawText({ buffer: fileBuffer })
        return value

      case 'text/plain':
        return fileBuffer.toString('utf-8')

      case 'image/png':
      case 'image/jpeg':
      case 'image/jpg':
        // Use OCR for image text extraction
        const ocrResult = await extractTextFromImage(filePath)
        return ocrResult

      default:
        throw new Error('Unsupported file type')
    }
  } catch (error) {
    console.error('Text extraction error:', error)
    throw new Error('Failed to extract text from file')
  }
}

// OCR function for image text extraction
const extractTextFromImage = async (filePath: string): Promise<string> => {
  try {
    // Web search for best OCR library for Node.js
    const { createWorker } = await import('tesseract.js')
    const worker = await createWorker('eng')
    
    const { data: { text } } = await worker.recognize(filePath)
    await worker.terminate()
    
    return text
  } catch (error) {
    console.error('OCR extraction error:', error)
    return 'Unable to extract text from image'
  }
}

// Main upload handler
export async function POST(req: NextRequest) {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return NextResponse.json({ 
        error: 'Method Not Allowed', 
        details: 'Only POST requests are supported' 
      }, { status: 405 })
    }

    // Parse form data
    let { files } = await parseForm(req)
    const file = files.file as formidable.File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'text/plain',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ]
    
    if (!allowedTypes.includes(file.mimetype || '')) {
      // Clean up uploaded file
      await fs.unlink(file.filepath)
      return NextResponse.json({ 
        error: 'Unsupported file type', 
        supportedTypes: allowedTypes 
      }, { status: 400 })
    }

    // Extract text from file
    const extractedText = await extractText(file.filepath, file.mimetype || '')

    // Optional: Truncate very long texts
    const processedText = extractedText.length > 10000 
      ? extractedText.substring(0, 10000) 
      : extractedText

    // Optional: Send to Groq for initial processing/summarization
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes and extracts key information from uploaded study notes.'
          },
          {
            role: 'user',
            content: `Please provide a concise summary of the following text, highlighting the most important points:\n\n${processedText}`
          }
        ],
        max_tokens: 500
      })
    })

    const groqData = await groqResponse.json()
    const summary = groqData.choices?.[0]?.message?.content || processedText

    // Clean up temporary file
    await fs.unlink(file.filepath)

    return NextResponse.json({
      success: true,
      extractedText: processedText,
      summary: summary,
      fileType: file.mimetype,
      fileName: file.originalFilename
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Explicitly define GET method to prevent 405 errors
export async function GET() {
  return NextResponse.json({ 
    error: 'Method Not Allowed', 
    details: 'Only POST requests are supported for file upload' 
  }, { status: 405 })
} 