import fs from 'fs';
import path from 'path';

export interface TemplateVariables {
  [key: string]: string;
}

export class TemplateService {
  private templatesPath: string;

  constructor() {
    this.templatesPath = path.join(process.cwd(), 'server/src/templates');
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
  getWelcomeEmailContent(fullName: string, language: string = 'es'): { subject: string; html: string } {
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
    language: string = 'es'
  ): { subject: string; html: string } {
    const variables = this.getCompanyInviteVariables(fullName, companyName, userRoles, acceptUrl, language);
    const html = this.renderTemplate('company-invite', variables);
    
    return {
      subject: variables.subject,
      html
    };
  }

  private getWelcomeEmailVariables(fullName: string, language: string): TemplateVariables {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
    
    if (language === 'es') {
      return {
        language: 'es',
        subject: '¡Bienvenido al Cuerpo de Banderas - Liceo de Costa Rica!',
        welcomeTitle: '¡Bienvenido al Cuerpo de Banderas!',
        platformDescription: 'Portal institucional del Liceo de Costa Rica',
        greeting: '¡Hola',
        fullName,
        welcomeMessage: '¡Gracias por unirte al portal institucional del Cuerpo de Banderas del Liceo de Costa Rica! Estamos emocionados de tenerte como parte de nuestra comunidad que honra 73 años de tradición desde 1951.',
        featuresTitle: 'Qué puedes hacer en nuestro portal',
        feature1Title: 'Historia Institucional',
        feature1Description: 'Explora nuestra rica historia y tradiciones desde 1951',
        feature2Title: 'Galería de Ceremonias',
        feature2Description: 'Revive los momentos más importantes de nuestras ceremonias',
        feature3Title: 'Jefaturas Históricas',
        feature3Description: 'Conoce a los líderes que han guiado nuestra organización',
        feature4Title: 'Escudos Ceremoniales',
        feature4Description: 'Descubre el simbolismo de nuestros escudos tradicionales',
        feature5Title: 'Comunidad CB',
        feature5Description: 'Conecta con otros miembros del Cuerpo de Banderas',
        gettingStartedTitle: 'Primeros Pasos',
        gettingStartedDescription: 'Explora nuestro portal para conocer más sobre la historia, tradiciones y ceremoniado del Cuerpo de Banderas del Liceo de Costa Rica.',
        setupUrl: `${frontendUrl}/`,
        ctaButton: 'Explorar Portal',
        supportMessage: '¿Necesitas ayuda para navegar el portal?',
        supportDetails: 'Consulta nuestra sección de ayuda o contacta al equipo administrativo si tienes alguna pregunta sobre el portal institucional.',
        footerText: 'Cuerpo de Banderas - Liceo de Costa Rica',
        footerSubtext: 'Honrando 73 años de tradición desde 1951 🇨🇷'
      };
    }

    return {
      language: 'en',
      subject: 'Welcome to Cuerpo de Banderas - Liceo de Costa Rica!',
      welcomeTitle: 'Welcome to Cuerpo de Banderas!',
      platformDescription: 'Institutional portal of Liceo de Costa Rica',
      greeting: 'Hello',
      fullName,
      welcomeMessage: 'Thank you for joining the institutional portal of Cuerpo de Banderas from Liceo de Costa Rica! We\'re excited to have you as part of our community that honors 73 years of tradition since 1951.',
      featuresTitle: 'What you can do on our portal',
      feature1Title: 'Institutional History',
      feature1Description: 'Explore our rich history and traditions since 1951',
      feature2Title: 'Ceremony Gallery',
      feature2Description: 'Relive the most important moments of our ceremonies',
      feature3Title: 'Historical Leadership',
      feature3Description: 'Meet the leaders who have guided our organization',
      feature4Title: 'Ceremonial Shields',
      feature4Description: 'Discover the symbolism of our traditional shields',
      feature5Title: 'CB Community',
      feature5Description: 'Connect with other members of the Flag Corps',
      gettingStartedTitle: 'Getting Started',
      gettingStartedDescription: 'Explore our portal to learn more about the history, traditions, and ceremonial aspects of the Cuerpo de Banderas from Liceo de Costa Rica.',
      setupUrl: `${frontendUrl}/`,
      ctaButton: 'Explore Portal',
      supportMessage: 'Need help navigating the portal?',
      supportDetails: 'Check our help section or contact the administrative team if you have any questions about the institutional portal.',
      footerText: 'Cuerpo de Banderas - Liceo de Costa Rica',
      footerSubtext: 'Honoring 73 years of tradition since 1951 🇨🇷'
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
        subject: `Invitación para unirte a ${companyName} en Cuerpo de Banderas`,
        inviteTitle: '¡Has sido invitado!',
        platformDescription: 'Portal institucional del Liceo de Costa Rica',
        greeting: '¡Hola',
        fullName,
        inviteMessage: `Has sido invitado a unirte a ${companyName} en el portal del Cuerpo de Banderas. Esta invitación te permitirá acceder a las secciones administrativas y de gestión del portal institucional.`,
        companyInfoTitle: 'Detalles de la Invitación',
        companyNameLabel: 'Organización',
        companyName,
        rolesLabel: userRoles.length > 1 ? 'Roles asignados' : 'Rol asignado',
        userRoles: rolesText,
        benefitsTitle: 'Lo que podrás hacer',
        benefit1: 'Gestionar contenido institucional del portal',
        benefit2: 'Acceder a herramientas administrativas',
        benefit3: 'Colaborar en la preservación de la historia',
        benefit4: 'Utilizar herramientas de gestión avanzadas',
        nextStepsTitle: 'Próximos Pasos',
        step1: 'Haz clic en "Aceptar Invitación" para confirmar',
        step2: 'Completa tu perfil si es necesario',
        step3: 'Comienza a colaborar con el equipo',
        acceptUrl,
        acceptButton: 'Aceptar Invitación',
        supportMessage: '¿Tienes preguntas sobre esta invitación?',
        supportDetails: 'Contacta al equipo administrativo o consulta nuestra documentación.',
        footerText: 'Cuerpo de Banderas - Liceo de Costa Rica',
        footerSubtext: 'Honrando 73 años de tradición desde 1951 🇨🇷'
      };
    }

    return {
      language: 'en',
      subject: `Invitation to join ${companyName} on Cuerpo de Banderas`,
      inviteTitle: 'You\'ve been invited!',
      platformDescription: 'Institutional portal of Liceo de Costa Rica',
      greeting: 'Hello',
      fullName,
      inviteMessage: `You have been invited to join ${companyName} on the Cuerpo de Banderas portal. This invitation will give you access to the administrative and management sections of the institutional portal.`,
      companyInfoTitle: 'Invitation Details',
      companyNameLabel: 'Organization',
      companyName,
      rolesLabel: userRoles.length > 1 ? 'Assigned roles' : 'Assigned role',
      userRoles: rolesText,
      benefitsTitle: 'What you\'ll be able to do',
      benefit1: 'Manage institutional portal content',
      benefit2: 'Access administrative tools',
      benefit3: 'Collaborate in preserving history',
      benefit4: 'Use advanced management tools',
      nextStepsTitle: 'Next Steps',
      step1: 'Click "Accept Invitation" to confirm',
      step2: 'Complete your profile if needed',
      step3: 'Start collaborating with the team',
      acceptUrl,
      acceptButton: 'Accept Invitation',
      supportMessage: 'Have questions about this invitation?',
      supportDetails: 'Contact the administrative team or check our documentation.',
      footerText: 'Cuerpo de Banderas - Liceo de Costa Rica',
      footerSubtext: 'Honoring 73 years of tradition since 1951 🇨🇷'
    };
  }
}