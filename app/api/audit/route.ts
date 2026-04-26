import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, goal, tones = [], maxTokens = 1000 } = await req.json();

    if (!text || !goal) {
      return NextResponse.json({ error: 'Text and goal are required' }, { status: 400 });
    }

    const apiKey = process.env.CEREBRAS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Cerebras API key not configured' }, { status: 500 });
    }

    const toneConstraint = tones.length > 0 ? `Target Tones: ${tones.join(', ')}` : '';
    
    const prompt = `You are an expert communication auditor. Analyze the following high-stakes message with the goal of: ${goal}. ${toneConstraint}
    
Message:
"${text}"

Provide a detailed audit including:
1. Tone (Aggression, Confidence, Sincerity).
2. Social Risk (Potential for misunderstanding).
3. Cultural Audit (Specifically for Tier 1 Western audiences).
4. Fixes (Tactful alternatives for risky words/phrases formatted cleanly).
5. Risk Count (Number of identified risks as an integer).

Return the result STRICTLY as a JSON object with the following keys:
{
  "tone": "string analysis",
  "socialRisk": "string analysis",
  "culturalAudit": "string analysis",
  "fixes": "string tactful fixes",
  "riskCount": 0
}

Do not include any markdown formatting, backticks, or extra text before or after the JSON structure.`;

    const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3.1-70b",
        messages: [
          { role: "system", content: "You are a specialized JSON-only output assistant." },
          { role: "user", content: prompt }
        ],
        max_completion_tokens: Math.min(Math.max(maxTokens, 100), 2000),
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cerebras API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    let resultText = data.choices?.[0]?.message?.content;
    
    if (!resultText) {
      throw new Error('No response content from Cerebras');
    }

    // Defensive JSON parsing in case the open source model wrapped it in markdown
    resultText = resultText.replace(/^```json/m, '').replace(/^```/m, '').trim();

    let result;
    try {
      result = JSON.parse(resultText);
    } catch (e) {
      console.error("Failed to parse JSON:", resultText);
      throw new Error("Failed to parse AI output as JSON.");
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in audit API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
