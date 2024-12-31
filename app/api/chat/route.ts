import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  console.log('Received request to /api/chat');
  try {
    const body = await req.json();
    console.log('Request body:', body);

    const { message } = body;

    if (!message) {
      console.error('No message provided in request');
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('Sending message to OpenAI:', message);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for a women's safety app called SafeWalk. Provide concise, supportive responses." },
        { role: "user", content: message }
      ],
    });

    console.log('Received response from OpenAI:', completion);

    const response = completion.choices[0].message.content;

    if (!response) {
      console.error('No response content from OpenAI');
      throw new Error('No response from OpenAI');
    }

    console.log('Sending response:', { response });
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.log('Sending error response:', { error: errorMessage });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

