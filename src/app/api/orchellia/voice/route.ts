import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_openai_api_key_here')) {
      return NextResponse.json(
        {
          error: 'OPENAI_API_KEY_REQUIRED',
          message:
            'Please add your OPENAI_API_KEY in .env.local to activate real-time Sol voice audio synthesis.',
        },
        { status: 401 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const cleanText = text.slice(0, 2048);

    let mp3Buffer: ArrayBuffer;

    try {
      // 1. First attempt with user-requested "sol" voice
      const response = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'sol' as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
        input: cleanText,
        speed: 0.95, // Serene, deliberate editorial pacing
      });
      mp3Buffer = await response.arrayBuffer();
    } catch (solError: unknown) {
      // If "sol" is restricted to Realtime/Advanced voice API on the user's tier,
      // gracefully fallback to "shimmer" (warm, serene, high-fashion female voice)
      console.warn('Sol voice fallback to shimmer:', solError);
      const fallbackResponse = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'shimmer',
        input: cleanText,
        speed: 0.95,
      });
      mp3Buffer = await fallbackResponse.arrayBuffer();
    }

    return new NextResponse(mp3Buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: unknown) {
    console.error('Orchellia Voice API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Voice synthesis failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
