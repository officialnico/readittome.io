import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';

// Force Node.js runtime for PDF processing
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Verify it's a PDF
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Convert file to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Extract text using unpdf
    const { text, totalPages } = await extractText(uint8Array, { mergePages: true });

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF' },
        { status: 500 }
      );
    }

    // Clean up the extracted text
    let cleanedText = text
      .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
      .replace(/[ \t]+/g, ' ') // Normalize spaces
      .replace(/\n /g, '\n') // Remove spaces after newlines
      .replace(/ \n/g, '\n') // Remove spaces before newlines
      .trim();

    return NextResponse.json({
      text: cleanedText,
      title: file.name.replace('.pdf', ''),
      pages: totalPages,
    });

  } catch (error: any) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process PDF' },
      { status: 500 }
    );
  }
}


