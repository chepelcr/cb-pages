import { TemplateService } from './TemplateService';

export class EmailService {
  private templateService: TemplateService;

  constructor() {
    this.templateService = new TemplateService();
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(
    email: string, 
    firstName?: string, 
    lastName?: string, 
    language: string = 'es'
  ): Promise<void> {
    try {
      const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';
      console.log(`📧 Sending welcome email to: ${email} (${language})`);

      const emailContent = this.templateService.getWelcomeEmailContent(fullName, language);

      // In development, just log the email content
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Welcome email prepared for: ${email}`);
        console.log(`📧 Subject: ${emailContent.subject}`);
        console.log(`📧 Content length: ${emailContent.html.length} characters`);
        return;
      }

      // TODO: In production, integrate with actual email service (AWS SES, SendGrid, etc.)
      console.log(`✅ Welcome email sent to: ${email}`);

    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error(`Failed to send welcome email: ${error}`);
    }
  }

  /**
   * Send company invitation email
   */
  async sendCompanyInviteEmail(
    email: string,
    fullName: string,
    companyName: string,
    userRoles: string[],
    acceptUrl: string,
    language: string = 'es'
  ): Promise<void> {
    try {
      console.log(`📧 Sending company invite email to: ${email} for ${companyName}`);

      const emailContent = this.templateService.getCompanyInviteEmailContent(
        fullName,
        companyName,
        userRoles,
        acceptUrl,
        language
      );

      // In development, just log the email content
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Company invite email prepared for: ${email}`);
        console.log(`📧 Subject: ${emailContent.subject}`);
        console.log(`📧 Content length: ${emailContent.html.length} characters`);
        return;
      }

      // TODO: In production, integrate with actual email service
      console.log(`✅ Company invite email sent to: ${email}`);

    } catch (error) {
      console.error('Error sending company invite email:', error);
      throw new Error(`Failed to send company invite email: ${error}`);
    }
  }
}