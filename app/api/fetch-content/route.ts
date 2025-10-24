import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Configure API route for Vercel
export const runtime = 'nodejs';
export const maxDuration = 30; // Max 30 seconds for Pro plan, 10 for Hobby

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    console.log('[fetch-content] Fetching URL:', url);

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      console.error('[fetch-content] Invalid URL:', url);
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    // Fetch the webpage with timeout (8 seconds to stay under Vercel's 10s limit)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    let response;
    try {
      // Use a real browser User-Agent to avoid being blocked
      response = await fetch(targetUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        signal: controller.signal,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('[fetch-content] Fetch error:', fetchError);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - the page took too long to load. Try a different article or wait a moment and try again.' },
          { status: 504 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch URL: ${fetchError.message}. The site may be blocking automated requests.` },
        { status: 500 }
      );
    }
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[fetch-content] HTTP error:', response.status, response.statusText);
      
      // Provide more helpful error messages based on status code
      let errorMessage = '';
      switch (response.status) {
        case 403:
          errorMessage = 'Access forbidden - the website is blocking automated requests. Try copying and pasting the text instead.';
          break;
        case 404:
          errorMessage = 'Page not found - please check the URL and try again.';
          break;
        case 429:
          errorMessage = 'Too many requests - please wait a moment and try again.';
          break;
        case 500:
        case 502:
        case 503:
          errorMessage = 'The website is experiencing issues. Please try again later.';
          break;
        default:
          errorMessage = `Failed to fetch URL: ${response.status} ${response.statusText}`;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Parse HTML with Cheerio (lighter than JSDOM, better for serverless)
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $(
      'script, style, noscript, iframe, nav, footer, header, button, ' +
      '.ad, .advertisement, aside, [role="banner"], [role="navigation"], ' +
      '[role="complementary"], .sidebar, .menu, .comments, form, ' +
      '.social-share, .newsletter, .subscribe'
    ).remove();

    // Try to find main content area
    const contentSelectors = [
      'article',
      'main',
      '[role="main"]',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.content',
      '.post',
      '.article'
    ];

    let contentElement = null;
    for (const selector of contentSelectors) {
      const el = $(selector);
      if (el.length > 0) {
        contentElement = el.first();
        break;
      }
    }

    // Fallback to body if no content area found
    if (!contentElement || contentElement.length === 0) {
      contentElement = $('body');
    }

    // Extract text with proper spacing
    let text = '';
    
    const extractText = (element: cheerio.Cheerio<any>) => {
      let result = '';
      
      element.contents().each((_, node) => {
        if (node.type === 'text') {
          const textContent = $(node).text().trim();
          if (textContent) {
            result += textContent + ' ';
          }
        } else if (node.type === 'tag') {
          const tagName = node.name;
          
          // Skip unwanted elements
          if (['script', 'style', 'nav', 'footer', 'header', 'button', 'iframe'].includes(tagName)) {
            return;
          }
          
          // Block elements should have line breaks
          const blockElements = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre', 'section', 'article'];
          
          if (blockElements.includes(tagName)) {
            const innerText = extractText($(node));
            if (innerText.trim()) {
              result += '\n\n' + innerText.trim() + '\n\n';
            }
          } else if (tagName === 'br') {
            result += '\n';
          } else {
            result += extractText($(node));
          }
        }
      });
      
      return result;
    };

    text = extractText(contentElement);
    
    // Clean up the text
    text = text
      .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
      .replace(/[ \t]+/g, ' ') // Normalize spaces
      .replace(/\n /g, '\n') // Remove spaces after newlines
      .replace(/ \n/g, '\n') // Remove spaces before newlines
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
      .replace(/(\d+)(min|hours?|days?|ago)/gi, '$1 $2') // Add space between numbers and time units
      .replace(/\b(Listen|Share|Follow|Subscribe|Sign in|Sign up)\b/gi, '') // Remove common UI text
      .replace(/^(--+|\.\.\.|…)+$/gm, '') // Remove lines with just dashes or ellipsis
      .replace(/Press enter or click to view image in full size/gi, '') // Remove image captions
      .replace(/\n{3,}/g, '\n\n') // Clean up again after removals
      .trim();

    // Get title
    const title = $('title').first().text() || 
                  $('h1').first().text() || 
                  '';

    if (!text || text.length < 50) {
      console.error('[fetch-content] Extracted text too short:', text.length);
      return NextResponse.json(
        { error: 'Could not extract meaningful content from the page' },
        { status: 500 }
      );
    }

    console.log('[fetch-content] Successfully extracted content:', text.length, 'characters');
    
    return NextResponse.json({
      text,
      title: title.trim(),
      url: targetUrl.toString(),
    });

  } catch (error: any) {
    console.error('[fetch-content] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

