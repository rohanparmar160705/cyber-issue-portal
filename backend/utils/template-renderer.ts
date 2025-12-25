import fs from "fs";
import path from "path";
import type { TemplateData } from "../models/email.model";

export class TemplateRenderer {
  private templateCache: Map<string, string> = new Map();

  /**
   * Renders a full HTML email by combining the base layout with a specific template fragment
   */
  render(templateName: string, data: TemplateData): string {
    // 1. Load the core responsive layout
    const baseHtml = this.loadTemplate("base-email");

    // 2. Load the specific content for this trigger (e.g., 'welcome')
    const contentHtml = this.loadTemplate(templateName);

    // 3. Inject data into the content fragment
    const renderedContent = this.replacePlaceholders(contentHtml, data);

    // 4. Inject everything into the base layout
    let finalHtml = this.replacePlaceholders(baseHtml, {
      ...data,
      EMAIL_BODY: renderedContent,
    });

    // 5. Handle Conditional Blocks (e.g., {{#if CTA_BUTTON}} ... {{/if}})
    if (!data.CTA_BUTTON) {
      // Remove the entire block if the condition is false
      finalHtml = finalHtml.replace(/{{#if CTA_BUTTON}}[\s\S]*?{{\/if}}/g, "");
    } else {
      // Just remove the tags but keep the content if true
      finalHtml = finalHtml
        .replace(/{{#if CTA_BUTTON}}/g, "")
        .replace(/{{\/if}}/g, "");
    }

    return finalHtml;
  }

  /**
   * Reads a template file from the disk or cache
   */
  private loadTemplate(name: string): string {
    if (this.templateCache.has(name)) {
      return this.templateCache.get(name)!;
    }

    const templatePath = path.join(
      process.cwd(),
      "backend",
      "templates",
      `${name}.html`
    );
    try {
      const html = fs.readFileSync(templatePath, "utf-8");
      this.templateCache.set(name, html);
      return html;
    } catch (error) {
      console.error(
        `[TemplateRenderer] Error loading template ${name}:`,
        error
      );
      return `Error: Template ${name} not found.`;
    }
  }

  /**
   * Simple string replacement for {{VARIABLE}} tags
   */
  private replacePlaceholders(html: string, data: Record<string, any>): string {
    let result = html;
    for (const [key, value] of Object.entries(data)) {
      const placeholder = new RegExp(`{{${key}}}`, "g");
      // Ensure we treat arrays or objects carefully, but mostly strings here
      const replacementValue =
        value === undefined || value === null ? "" : String(value);
      result = result.replace(placeholder, replacementValue);
    }
    return result;
  }
}

