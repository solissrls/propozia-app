import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { proposal } = req.body;

  const prompt = `
You are an Erasmus+ evaluator for KA122-ADU mobility projects.
Evaluate the proposal based on:
1. Relevance to Erasmus+ objectives
2. Suitability of target group
3. Alignment with organisation strategy
4. Erasmus+ priorities: inclusion, green, digital

Respond with:
- Strengths
- Weaknesses
- Suggestions
- Score (0–30)

Proposal:
"""${proposal}"""
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }]
    });

    const content = completion.choices[0].message.content || '';

    const feedback = content.split(/\n(?=- )/).map(line => {
      const [type, ...rest] = line.replace('- ', '').split(':');
      return {
        type: type.trim(),
        content: rest.join(':').trim()
      };
    });

    res.status(200).json({ feedback });
  } catch (err) {
    res.status(500).json({ error: 'Evaluation failed', details: err });
  }
}