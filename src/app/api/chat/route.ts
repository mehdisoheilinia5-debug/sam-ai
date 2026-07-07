import { NextResponse } from 'next/server';
import { SAM_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        reply: '⚠️ کلید API تنظیم نشده. لطفاً DEEPSEEK_API_KEY رو تنظیم کن.'
      });
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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
        reply: `❌ خطای API: ${data.error?.message || 'مشکل در ارتباط با DeepSeek'}`
      });
    }

    const reply = data.choices?.[0]?.message?.content || 'متاسفانه پاسخی دریافت نشد.';
    return NextResponse.json({ reply });

  } catch (error: any) {
    return NextResponse.json({
      reply: `❌ خطای سرور: ${error.message || 'مشکل ناشناخته'}`
    });
  }
}