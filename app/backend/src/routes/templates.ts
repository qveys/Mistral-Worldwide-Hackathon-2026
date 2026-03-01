import { Router } from 'express';
import { createRequire } from 'module';
import { z } from 'zod';

const require = createRequire(import.meta.url);

const etudiant = require('../templates/etudiant.json');
const freelance = require('../templates/freelance.json');
const productLaunch = require('../templates/product-launch.json');

const router = Router();

const TemplateTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.number(),
  dependencies: z.array(z.string()),
});

const TemplateSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  examples: z.array(z.string()),
  defaultTasks: z.array(TemplateTaskSchema),
});

const templates = [etudiant, freelance, productLaunch].map((t) =>
  TemplateSchema.parse(t)
);
const templateSummaries = templates.map(({ slug, title, description, icon, examples }) => ({
  slug,
  title,
  description,
  icon,
  examples,
}));

// GET / - list all templates (summary only, no defaultTasks)
router.get('/', (_req, res) => {
  res.json(templateSummaries);
});

// GET /:slug - get full template by slug
router.get('/:slug', (req, res) => {
  const template = templates.find((t) => t.slug === req.params['slug']);
  if (!template) {
    res.status(404).json({ error: 'Template not found' });
    return;
  }
  res.json(template);
});

export default router;
