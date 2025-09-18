import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export interface TemplateVariables {
  [key: string]: string;
}

export class TemplateService {
  private templatesPath: string;

  constructor() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    this.templatesPath = path.join(__dirname, '../templates');
  }

  /**
   * Load and render HTML template with variables
   */
  renderTemplate(templateName: string, variables: TemplateVariables): string {
    const templatePath = path.join(this.templatesPath, `${templateName}.html`);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template ${templateName} not found`);
    }

    let template = fs.readFileSync(templatePath, 'utf-8');
    
    // Replace all variables in the template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, value);
    });

    return template;
  }

  /**
   * Get welcome email content with template
   */
  getWelcomeEmailContent(fullName: string, language: string = 'en'): { subject: string; html: string } {
    const variables = this.getWelcomeEmailVariables(fullName, language);
    const html = this.renderTemplate('welcome-email', variables);
    
    return {
      subject: variables.subject,
      html
    };
  }

  /**
   * Get company invitation email content with template
   */
  getCompanyInviteEmailContent(
    fullName: string, 
    companyName: string, 
    userRoles: string[],
    acceptUrl: string,
    language: string = 'en'
  ): { subject: string; html: string } {
    const variables = this.getCompanyInviteVariables(fullName, companyName, userRoles, acceptUrl, language);
    const html = this.renderTemplate('company-invite', variables);
    
    return {
      subject: variables.subject,
      html
    };
  }

  private getWelcomeEmailVariables(fullName: string, language: string): TemplateVariables {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    if (language === 'es') {
      return {
        language: 'es',
        subject: '¡Bienvenido a JCampos Biller - Tu Solución de Facturación Inteligente!',
        welcomeTitle: '¡Bienvenido a JCampos Biller!',
        platformDescription: 'Tu plataforma inteligente de facturación y gestión empresarial',
        greeting: '¡Hola',
        fullName,
        welcomeMessage: '¡Gracias por unirte a JCampos Biller! Estamos emocionados de ayudarte a simplificar tu proceso de facturación y gestión empresarial con nuestra plataforma inteligente.',
        featuresTitle: 'Qué puedes hacer con JCampos Biller',
        feature1Title: 'Facturación Automática',
        feature1Description: 'Crea y envía facturas profesionales en minutos',
        feature2Title: 'Gestión de Clientes',
        feature2Description: 'Organiza y administra tu base de clientes fácilmente',
        feature3Title: 'Reportes Inteligentes',
        feature3Description: 'Obtén insights valiosos sobre tu negocio',
        feature4Title: 'Integración Fiscal',
        feature4Description: 'Cumple con las regulaciones fiscales automáticamente',
        feature5Title: 'Panel de Control',
        feature5Description: 'Monitorea todas tus operaciones desde un solo lugar',
        gettingStartedTitle: 'Primeros Pasos',
        gettingStartedDescription: 'Completa tu configuración inicial para comenzar a crear facturas profesionales. Nuestro asistente de configuración te guiará paso a paso.',
        setupUrl: `${frontendUrl}/es/setup`,
        ctaButton: 'Completar Configuración',
        supportMessage: '¿Necesitas ayuda para comenzar? ¡Estamos aquí para apoyarte!',
        supportDetails: 'Consulta nuestra documentación o contacta a nuestro equipo de soporte si tienes alguna pregunta.',
        footerText: 'JCampos Biller - Plataforma Inteligente de Facturación',
        footerSubtext: 'Construido con ❤️ para empresarios y profesionales'
      };
    }

    return {
      language: 'en',
      subject: 'Welcome to JCampos Biller - Your Smart Billing Solution!',
      welcomeTitle: 'Welcome to JCampos Biller!',
      platformDescription: 'Your intelligent billing and business management platform',
      greeting: 'Hello',
      fullName,
      welcomeMessage: 'Thank you for joining JCampos Biller! We\'re excited to help you streamline your billing process and business management with our intelligent platform.',
      featuresTitle: 'What you can do with JCampos Biller',
      feature1Title: 'Automated Billing',
      feature1Description: 'Create and send professional invoices in minutes',
      feature2Title: 'Client Management',
      feature2Description: 'Organize and manage your client base easily',
      feature3Title: 'Smart Reports',
      feature3Description: 'Get valuable insights about your business',
      feature4Title: 'Tax Integration',
      feature4Description: 'Comply with tax regulations automatically',
      feature5Title: 'Control Panel',
      feature5Description: 'Monitor all your operations from one place',
      gettingStartedTitle: 'Getting Started',
      gettingStartedDescription: 'Complete your initial setup to start creating professional invoices. Our setup wizard will guide you through each step.',
      setupUrl: `${frontendUrl}/en/setup`,
      ctaButton: 'Complete Setup',
      supportMessage: 'Need help getting started? We\'re here to support you!',
      supportDetails: 'Check our documentation or contact our support team if you have any questions.',
      footerText: 'JCampos Biller - Intelligent Billing Platform',
      footerSubtext: 'Built with ❤️ for entrepreneurs and professionals'
    };
  }

  private getCompanyInviteVariables(
    fullName: string, 
    companyName: string, 
    userRoles: string[],
    acceptUrl: string,
    language: string
  ): TemplateVariables {
    const rolesText = userRoles.join(', ');
    
    if (language === 'es') {
      return {
        language: 'es',
        subject: `Invitación para unirte a ${companyName} en JCampos Biller`,
        inviteTitle: '¡Has sido invitado!',
        platformDescription: 'Plataforma inteligente de facturación y gestión empresarial',
        greeting: '¡Hola',
        fullName,
        inviteMessage: `Has sido invitado a unirte a ${companyName} en JCampos Biller. Esta invitación te permitirá acceder a las herramientas de facturación y gestión empresarial de la empresa.`,
        companyInfoTitle: 'Detalles de la Invitación',
        companyNameLabel: 'Empresa',
        companyName,
        rolesLabel: userRoles.length > 1 ? 'Roles asignados' : 'Rol asignado',
        userRoles: rolesText,
        benefitsTitle: 'Lo que podrás hacer',
        benefit1: 'Crear y gestionar facturas profesionales',
        benefit2: 'Acceder a reportes y análisis empresariales',
        benefit3: 'Colaborar con tu equipo en tiempo real',
        benefit4: 'Utilizar herramientas de gestión avanzadas',
        nextStepsTitle: 'Próximos Pasos',
        step1: 'Haz clic en "Aceptar Invitación" para confirmar',
        step2: 'Completa tu perfil si es necesario',
        step3: 'Comienza a colaborar con tu equipo',
        acceptUrl,
        acceptButton: 'Aceptar Invitación',
        supportMessage: '¿Tienes preguntas sobre esta invitación?',
        supportDetails: 'Contacta a nuestro equipo de soporte o consulta nuestra documentación.',
        footerText: 'JCampos Biller - Plataforma Inteligente de Facturación',
        footerSubtext: 'Construido con ❤️ para empresarios y profesionales'
      };
    }

    return {
      language: 'en',
      subject: `Invitation to join ${companyName} on JCampos Biller`,
      inviteTitle: 'You\'ve been invited!',
      platformDescription: 'Intelligent billing and business management platform',
      greeting: 'Hello',
      fullName,
      inviteMessage: `You have been invited to join ${companyName} on JCampos Biller. This invitation will give you access to the company's billing and business management tools.`,
      companyInfoTitle: 'Invitation Details',
      companyNameLabel: 'Company',
      companyName,
      rolesLabel: userRoles.length > 1 ? 'Assigned roles' : 'Assigned role',
      userRoles: rolesText,
      benefitsTitle: 'What you\'ll be able to do',
      benefit1: 'Create and manage professional invoices',
      benefit2: 'Access business reports and analytics',
      benefit3: 'Collaborate with your team in real-time',
      benefit4: 'Use advanced management tools',
      nextStepsTitle: 'Next Steps',
      step1: 'Click "Accept Invitation" to confirm',
      step2: 'Complete your profile if needed',
      step3: 'Start collaborating with your team',
      acceptUrl,
      acceptButton: 'Accept Invitation',
      supportMessage: 'Have questions about this invitation?',
      supportDetails: 'Contact our support team or check our documentation.',
      footerText: 'JCampos Biller - Intelligent Billing Platform',
      footerSubtext: 'Built with ❤️ for entrepreneurs and professionals'
    };
  }
}