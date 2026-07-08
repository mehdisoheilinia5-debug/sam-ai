import { NextResponse } from 'next/server';
import { SAM_SYSTEM_PROMPT } from '@/lib/prompts';

// ===== دریافت کلیدها از محیط =====
// کلیدها رو توی Render یا .env.local به این شکل بذار:
// OPENROUTER_API_KEYS=key1,key2,key3
const API_KEYS = process.env.OPENROUTER_API_KEYS
  ? process.env.OPENROUTER_API_KEYS.split(',').map(k => k.trim())
  : [];

// اگه کلیدها به صورت تکی هم تعریف شدن، ازشون استفاده کن (سازگاری با قبل)
if (API_KEYS.length === 0 && process.env.OPENROUTER_API_KEY) {
  API_KEYS.push(process.env.OPENROUTER_API_KEY);
}

let currentKeyIndex = 0;

// ===== تابع برای گرفتن کلید بعدی (Round-Robin) =====
function getNextKey(): string {
  if (API_KEYS.length === 0) {
    throw new Error('هیچ کلید API تعریف نشده است.');
  }
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

// ===== تابع برای ارسال درخواست با چندین کلید =====
async function callOpenRouterWithFallback(messages: any[]) {
  let lastError: any = null;

  // تمام کلیدها رو امتحان کن
  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = getNextKey(); // Round-Robin

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [
            { role: 'system', content: SAM_SYSTEM_PROMPT },
            ...messages,
          ],
          max_tokens: 1000,
          temperature: 0.8,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // اگه خطا به خاطر محدودیت یا اعتبار باشه، کلید بعدی رو امتحان کن
        if (response.status === 429 || response.status === 402 || response.status === 401) {
          console.warn(`❌ کلید ${apiKey.slice(0, 10)}... خطا: ${response.status} - تلاش با کلید بعدی`);
          continue; // برو سراغ کلید بعدی
        }
        // خطای دیگه رو برگردون
        return { error: data.error?.message || 'خطای ناشناخته' };
      }

      // موفقیت
      return { reply: data.choices?.[0]?.message?.content || 'پاسخی دریافت نشد.' };
    } catch (err: any) {
      lastError = err;
      console.warn(`❌ کلید ${apiKey.slice(0, 10)}... خطای شبکه: ${err.message}`);
    }
  }

  // اگه همه کلیدها شکست خوردن
  return { error: lastError?.message || 'همه کلیدها ناموفق بودند.' };
}

// ===== هندلر اصلی =====
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (API_KEYS.length === 0) {
      return NextResponse.json({
        reply: '⚠️ هیچ کلید OpenRouter تنظیم نشده. لطفاً OPENROUTER_API_KEYS رو تعریف کن.'
      });
    }

    const result = await callOpenRouterWithFallback(messages);

    if (result.error) {
      return NextResponse.json({
        reply: `❌ ${result.error}`
      });
    }

    return NextResponse.json({ reply: result.reply });

  } catch (error: any) {
    return NextResponse.json({
      reply: `❌ خطای سرور: ${error.message}`
    });
  }
}