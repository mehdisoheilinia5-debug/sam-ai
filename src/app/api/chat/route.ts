import { NextResponse } from 'next/server';
import { SAM_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: '⚠️ کلید OpenRouter تنظیم نشده.'
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-ultra:free',
        messages: [
          { role: 'system', content: SAM_SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.8,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        reply: `❌ خطا: ${data.error?.message || 'مشکل در ارتباط با OpenRouter'}`
      });
    }

    const reply = data.choices?.[0]?.message?.content || 'پاسخی دریافت نشد.';
    return NextResponse.json({ reply });

  } catch (error: any) {
    return NextResponse.json({
      reply: `❌ خطا: ${error.message || 'مشکل ناشناخته'}`
    });
  }
}