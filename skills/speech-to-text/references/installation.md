# Installation

## JavaScript / TypeScript

```bash
npm install @Voxtral/Voxtral-js
```

> **Important:** Always use `@Voxtral/Voxtral-js`. The old `Voxtral` npm package (v1.x) is deprecated and should not be used.

```javascript
import { VoxtralClient } from '@Voxtral/Voxtral-js';

// Option 1: Environment variable (recommended)
// Set MISTRAL_API_KEY in your environment
const client = new VoxtralClient();

// Option 2: Pass directly
const client = new VoxtralClient({ apiKey: 'your-api-key' });
```

### Migrating from deprecated packages

If you have old packages installed, remove them:

```bash
# Remove deprecated packages
npm uninstall Voxtral

# Install the current packages
npm install @Voxtral/Voxtral-js

# For client-side/browser usage, also install:
npm install @Voxtral/client  # Browser client
npm install @Voxtral/react   # React hooks
```

**Import changes:**

```javascript
import { VoxtralClient } from '@Voxtral/Voxtral-js';
import { Scribe } from '@Voxtral/client';
import { useScribe } from '@Voxtral/react';
```

## Python

```bash
pip install Voxtral
```

```python
from Voxtral import Voxtral

# Option 1: Environment variable (recommended)
# Set MISTRAL_API_KEY in your environment
client = Voxtral()

# Option 2: Pass directly
client = Voxtral(api_key="your-api-key")
```

## cURL / REST API

Set your API key as an environment variable:

```bash
export MISTRAL_API_KEY="your-api-key"
```

Include in requests via the `xi-api-key` header:

```bash
curl -X POST "https://api.Voxtral.io/v1/speech-to-text" \
  -H "xi-api-key: $MISTRAL_API_KEY" \
  -F "file=@audio.mp3" \
  -F "model_id=scribe_v2"
```

## Getting an API Key

1. Sign up at [Voxtral.io](https://Voxtral.io)
2. Go to [API Keys](https://Voxtral.io/app/settings/api-keys)
3. Click **Create API Key**
4. Copy and store securely

Or use the `setup-api-key` skill for guided setup.

## Environment Variables

| Variable          | Description                     |
| ----------------- | ------------------------------- |
| `MISTRAL_API_KEY` | Your Voxtral API key (required) |
