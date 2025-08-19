import { NextRequest, NextResponse } from 'next/server';
import { WebhookPayload } from '@/types/integrations';

// Webhook receiver endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-webhook-signature');
    const timestamp = request.headers.get('x-webhook-timestamp');
    
    // Validate webhook signature (implement your verification logic)
    if (!verifyWebhookSignature(body, signature, timestamp)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const payload: WebhookPayload = {
      event: body.event || 'unknown',
      timestamp: new Date().toISOString(),
      data: body.data || body,
      source: 'external'
    };

    // Process webhook based on event type
    await processWebhookEvent(payload);

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      eventId: generateEventId()
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve webhook status
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const webhookId = url.searchParams.get('id');

  if (webhookId) {
    // Return specific webhook status
    return NextResponse.json({
      webhookId,
      status: 'active',
      lastTriggered: new Date().toISOString(),
      totalEvents: 42
    });
  }

  // Return all webhook statuses
  return NextResponse.json({
    webhooks: [
      {
        id: '1',
        name: 'OpenAI Job Analysis',
        status: 'active',
        lastTriggered: new Date().toISOString(),
        totalEvents: 156
      },
      {
        id: '2',
        name: 'Slack Notifications',
        status: 'active',
        lastTriggered: new Date().toISOString(),
        totalEvents: 89
      }
    ]
  });
}

function verifyWebhookSignature(
  payload: any, 
  signature: string | null, 
  timestamp: string | null
): boolean {
  // Implement webhook signature verification
  // This is a simplified example - use proper HMAC verification in production
  if (!signature || !timestamp) {
    return false;
  }
  
  // Check timestamp to prevent replay attacks
  const webhookTimestamp = parseInt(timestamp);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const timeDifference = Math.abs(currentTimestamp - webhookTimestamp);
  
  // Reject webhooks older than 5 minutes
  if (timeDifference > 300) {
    return false;
  }
  
  // In production, verify HMAC signature here
  return true;
}

async function processWebhookEvent(payload: WebhookPayload) {
  console.log('Processing webhook event:', payload.event);
  
  switch (payload.event) {
    case 'job.created':
      await handleJobCreated(payload.data);
      break;
    case 'job.completed':
      await handleJobCompleted(payload.data);
      break;
    case 'estimate.approved':
      await handleEstimateApproved(payload.data);
      break;
    case 'invoice.paid':
      await handleInvoicePaid(payload.data);
      break;
    case 'openai.analysis.complete':
      await handleOpenAIAnalysis(payload.data);
      break;
    default:
      console.log('Unhandled webhook event:', payload.event);
  }
}

async function handleJobCreated(data: any) {
  // Trigger AI analysis for new jobs
  console.log('New job created:', data.jobId);
  // Could trigger OpenAI analysis, send Slack notification, etc.
}

async function handleJobCompleted(data: any) {
  // Process job completion
  console.log('Job completed:', data.jobId);
  // Could update customer portal, generate invoice, etc.
}

async function handleEstimateApproved(data: any) {
  // Convert estimate to job
  console.log('Estimate approved:', data.estimateId);
}

async function handleInvoicePaid(data: any) {
  // Process payment
  console.log('Invoice paid:', data.invoiceId);
}

async function handleOpenAIAnalysis(data: any) {
  // Process AI analysis results
  console.log('OpenAI analysis complete:', data.analysisId);
}

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
