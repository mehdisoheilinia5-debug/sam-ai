import { NextResponse } from 'next/server';
import { SAM_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.DEEPSEEK_API_KEY) {
      const fakeReply = `🎭 [حالت شبیه‌سازی] این پاسخ از SAM AI هست. برای اتصال واقعی، کلید API رو توی فایل .env.local تنظیم کن.`;
      return NextResponse.json({ reply: fakeReply });
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: SAM_SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.8,
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'متاسفانه پاسخی دریافت نشد.';

    return NextResponse.json({ reply });

  } catch (error) {
    return NextResponse.json(
      { reply: 'خطایی در ارتباط با سرور رخ داد. دوباره تلاش کن.' },
      { status: 500 }
    );
  }
}
