import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    // Fetch the webpage
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ReadItToMe/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 500 }
      );
    }

    const html = await response.text();

    // Parse HTML and extract text content
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Remove script, style, and other non-content elements
    const elementsToRemove = document.querySelectorAll('script, style, noscript, iframe, nav, footer, header');
    elementsToRemove.forEach(el => el.remove());

    // Try to find main content area
    let contentElement = 
      document.querySelector('article') ||
      document.querySelector('main') ||
      document.querySelector('[role="main"]') ||
      document.querySelector('.content') ||
      document.querySelector('.post') ||
      document.querySelector('.article') ||
      document.body;

    // Extract text content
    let text = contentElement?.textContent || '';
    
    // Clean up the text
    text = text
      .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with single space
      .replace(/\n\s*\n/g, '\n\n') // Preserve paragraph breaks
      .trim();

    // Get title
    const title = document.querySelector('title')?.textContent || 
                  document.querySelector('h1')?.textContent || 
                  '';

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract meaningful content from the page' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      text,
      title: title.trim(),
      url: targetUrl.toString(),
    });

  } catch (error: any) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

