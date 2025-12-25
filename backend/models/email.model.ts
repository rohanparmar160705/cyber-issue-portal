export interface EmailTemplate {
  subject: string;
  html: string;
}

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
}

export interface IssueEmailData {
  userName: string;
  issueType: string;
  issueTitle: string;
  issueDescription: string;
  issuePriority: string;
  issueStatus: string;
  issueId: number;
}

export interface ProfileUpdateData {
  userName: string;
  updatedFields: string[];
}

export interface TemplateData {
  EMAIL_TITLE: string;
  EMAIL_BODY?: string;
  CTA_BUTTON?: boolean;
  CTA_URL?: string;
  CTA_TEXT?: string;
  LOGO_URL: string;
  FOOTER_TEXT: string;
  [key: string]: any;
}

