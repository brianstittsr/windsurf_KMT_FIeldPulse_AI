import { OpenAI } from 'openai';
import { Job, Customer, Estimate } from '@/types/fieldpulse';

export class OpenAIIntegration {
  private openai: OpenAI;
  private isConfigured: boolean = false;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
      this.isConfigured = true;
    } else {
      // Initialize with empty client - will be configured later
      this.openai = new OpenAI({ apiKey: 'placeholder' });
    }
  }

  configure(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    this.isConfigured = true;
  }

  async analyzeJob(job: Job): Promise<{
    insights: string;
    recommendations: string[];
    estimatedDuration: number;
    riskFactors: string[];
  }> {
    if (!this.isConfigured) {
      throw new Error('OpenAI integration not configured');
    }

    const prompt = `
Analyze this field service job and provide insights:

Job Details:
- Title: ${job.title}
- Description: ${job.description || 'No description provided'}
- Status: ${job.status}
- Priority: ${job.priority || 'Normal'}
- Location: ${job.location || 'Not specified'}

Please provide:
1. Key insights about this job
2. Recommendations for execution
3. Estimated duration in hours
4. Potential risk factors

Respond in JSON format with the following structure:
{
  "insights": "string",
  "recommendations": ["string array"],
  "estimatedDuration": number,
  "riskFactors": ["string array"]
}
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI job analysis error:', error);
      throw new Error('Failed to analyze job with OpenAI');
    }
  }

  async generateEstimate(jobDescription: string, customerInfo: Customer): Promise<{
    laborHours: number;
    materialCosts: number;
    totalEstimate: number;
    breakdown: Array<{ item: string; cost: number; description: string }>;
    confidence: number;
  }> {
    if (!this.isConfigured) {
      throw new Error('OpenAI integration not configured');
    }

    const prompt = `
Generate a detailed estimate for this field service job:

Job Description: ${jobDescription}
Customer Type: Residential
Customer Location: ${customerInfo.address || 'Not specified'}

Please provide a detailed cost estimate including:
1. Labor hours required
2. Material costs
3. Total estimate
4. Itemized breakdown
5. Confidence level (0-100%)

Respond in JSON format:
{
  "laborHours": number,
  "materialCosts": number,
  "totalEstimate": number,
  "breakdown": [{"item": "string", "cost": number, "description": "string"}],
  "confidence": number
}
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1200
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI estimate generation error:', error);
      throw new Error('Failed to generate estimate with OpenAI');
    }
  }

  async generateCustomerResponse(customerQuery: string, context: {
    customerHistory?: Job[];
    companyInfo?: string;
  }): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('OpenAI integration not configured');
    }

    const historyContext = context.customerHistory 
      ? `Customer History: ${context.customerHistory.map(job => `${job.title} (${job.status})`).join(', ')}`
      : '';

    const prompt = `
You are a helpful customer service assistant for a field service company. 
Respond to this customer query professionally and helpfully.

Customer Query: ${customerQuery}

${historyContext}

Company Info: ${context.companyInfo || 'Professional field service company'}

Provide a helpful, professional response that addresses the customer's needs.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response at this time.';
    } catch (error) {
      console.error('OpenAI customer response error:', error);
      throw new Error('Failed to generate customer response');
    }
  }

  async predictMaintenanceNeeds(equipmentData: {
    type: string;
    age: number;
    lastService: string;
    issues: string[];
  }): Promise<{
    riskLevel: 'low' | 'medium' | 'high';
    recommendedActions: string[];
    timeframe: string;
    reasoning: string;
  }> {
    if (!this.isConfigured) {
      throw new Error('OpenAI integration not configured');
    }

    const prompt = `
Analyze this equipment data and predict maintenance needs:

Equipment Type: ${equipmentData.type}
Age: ${equipmentData.age} years
Last Service: ${equipmentData.lastService}
Recent Issues: ${equipmentData.issues.join(', ')}

Provide maintenance predictions in JSON format:
{
  "riskLevel": "low|medium|high",
  "recommendedActions": ["string array"],
  "timeframe": "string",
  "reasoning": "string"
}
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI maintenance prediction error:', error);
      throw new Error('Failed to predict maintenance needs');
    }
  }

  async optimizeSchedule(jobs: Job[], technicians: Array<{
    id: string;
    name: string;
    skills: string[];
    location: string;
    availability: string[];
  }>): Promise<{
    optimizedSchedule: Array<{
      technicianId: string;
      jobId: string;
      scheduledTime: string;
      travelTime: number;
      reasoning: string;
    }>;
    efficiency: number;
    recommendations: string[];
  }> {
    if (!this.isConfigured) {
      throw new Error('OpenAI integration not configured');
    }

    const prompt = `
Optimize the schedule for these field service jobs and technicians:

Jobs: ${JSON.stringify(jobs.map(j => ({ id: j.id, title: j.title, priority: j.priority, location: j.location })))}

Technicians: ${JSON.stringify(technicians)}

Create an optimized schedule considering:
- Technician skills and job requirements
- Travel time between locations
- Job priorities
- Technician availability

Respond in JSON format:
{
  "optimizedSchedule": [{"technicianId": "string", "jobId": "string", "scheduledTime": "string", "travelTime": number, "reasoning": "string"}],
  "efficiency": number,
  "recommendations": ["string array"]
}
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI schedule optimization error:', error);
      throw new Error('Failed to optimize schedule');
    }
  }
}

// Singleton instance
export const openAIService = new OpenAIIntegration();
