import { NextRequest, NextResponse } from 'next/server';
import { Chatbot } from '@/lib/chatbot';

let chatbotInstance: Chatbot | null = null;

async function getChatbotInstance(): Promise<Chatbot> {
  if (!chatbotInstance) {
    chatbotInstance = new Chatbot();
    await chatbotInstance.initialize();
  }
  return chatbotInstance;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const chatbot = await getChatbotInstance();
    const response = await chatbot.chat(message);
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000; // Convert to seconds

    return NextResponse.json({
      response: `${response} (${responseTime.toFixed(2)}s)`,
      responseTime
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}