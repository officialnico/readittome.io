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
    const elementsToRemove = document.querySelectorAll(
      'script, style, noscript, iframe, nav, footer, header, button, ' +
      '.ad, .advertisement, aside, [role="banner"], [role="navigation"], ' +
      '[role="complementary"], .sidebar, .menu, .comments, form, ' +
      '.social-share, .newsletter, .subscribe'
    );
    elementsToRemove.forEach((el: Element) => el.remove());

    // Try to find main content area
    let contentElement = 
      document.querySelector('article') ||
      document.querySelector('main') ||
      document.querySelector('[role="main"]') ||
      document.querySelector('.content') ||
      document.querySelector('.post') ||
      document.querySelector('.article') ||
      document.body;

    // Helper function to extract text with proper spacing
    const extractTextWithSpacing = (element: Element): string => {
      let result = '';
      
      for (const node of Array.from(element.childNodes)) {
        if (node.nodeType === 3) { // Text node
          const text = node.textContent?.trim();
          if (text) {
            result += text + ' ';
          }
        } else if (node.nodeType === 1) { // Element node
          const el = node as Element;
          const tagName = el.tagName.toLowerCase();
          
          // Skip unwanted elements
          if (['script', 'style', 'nav', 'footer', 'header', 'button', 'iframe'].includes(tagName)) {
            continue;
          }
          
          // Block elements should have line breaks
          const blockElements = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre', 'section', 'article'];
          
          // Inline elements that should have spacing
          const inlineSpacingElements = ['span', 'a', 'strong', 'em', 'b', 'i', 'code'];
          
          if (blockElements.includes(tagName)) {
            const innerText = extractTextWithSpacing(el);
            if (innerText.trim()) {
              result += '\n\n' + innerText.trim() + '\n\n';
            }
          } else if (tagName === 'br') {
            result += '\n';
          } else if (inlineSpacingElements.includes(tagName)) {
            const innerText = extractTextWithSpacing(el);
            if (innerText.trim()) {
              result += innerText.trim() + ' ';
            }
          } else {
            result += extractTextWithSpacing(el);
          }
        }
      }
      
      return result;
    };

    // Extract text content with proper spacing
    let text = contentElement ? extractTextWithSpacing(contentElement) : '';
    
    // Clean up the text
    text = text
      .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
      .replace(/[ \t]+/g, ' ') // Normalize spaces
      .replace(/\n /g, '\n') // Remove spaces after newlines
      .replace(/ \n/g, '\n') // Remove spaces before newlines
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words (e.g., "PerspectiveBy" -> "Perspective By")
      .replace(/(\d+)(min|hours?|days?|ago)/gi, '$1 $2') // Add space between numbers and time units
      .replace(/\b(Listen|Share|Follow|Subscribe)\b/gi, '') // Remove common UI text
      .replace(/^(--+|\.\.\.|…)+$/gm, '') // Remove lines with just dashes or ellipsis
      .replace(/Press enter or click to view image in full size/gi, '') // Remove image captions
      .replace(/\n{3,}/g, '\n\n') // Clean up again after removals
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

