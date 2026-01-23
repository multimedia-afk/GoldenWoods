# n8n Form Integration Guide - Goldenwoods School

This guide will help you connect the Goldenwoods School contact form to n8n for automated lead processing.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setting Up n8n Webhook](#setting-up-n8n-webhook)
4. [Configuring the Form](#configuring-the-form)
5. [Testing the Integration](#testing-the-integration)
6. [Example Workflows](#example-workflows)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The contact form on your landing page sends data to an n8n webhook when submitted. This allows you to:

- **Automatically send email notifications** to your admissions team
- **Store leads in a database** (Google Sheets, Airtable, etc.)
- **Send confirmation emails** to parents
- **Integrate with CRM systems** (HubSpot, Salesforce, etc.)
- **Send WhatsApp messages** via WhatsApp Business API
- **Create tasks** in project management tools

---

## Prerequisites

Before you begin, you'll need:

1. **n8n instance** - Either:
   - Self-hosted n8n server
   - n8n Cloud account (https://n8n.io)
   
2. **Access to your website files** to update the webhook URL

3. **Basic understanding** of n8n workflows (optional but helpful)

---

## Setting Up n8n Webhook

### Step 1: Create a New Workflow in n8n

1. Log in to your n8n instance
2. Click **"New Workflow"**
3. Name it: `Goldenwoods - Contact Form Handler`

### Step 2: Add a Webhook Trigger

1. Click the **"+"** button to add a node
2. Search for and select **"Webhook"**
3. Configure the webhook:
   - **HTTP Method**: `POST`
   - **Path**: `goldenwoods-inscripciones` (or your preferred path)
   - **Response Mode**: `Respond Immediately`
   - **Response Code**: `200`

4. Click **"Execute Node"** to activate the webhook
5. **Copy the Production URL** - it will look like:
   ```
   https://your-n8n-instance.com/webhook/goldenwoods-inscripciones
   ```

### Step 3: Configure Your Workflow

Here's a basic workflow structure:

```
Webhook → Email Notification → Google Sheets → Send Confirmation
```

#### Example: Send Email Notification

1. Add a **"Send Email"** node (Gmail, SMTP, etc.)
2. Configure:
   - **To**: `admissions@goldenwoods.edu.mx`
   - **Subject**: `Nueva Solicitud de Inscripción - {{ $json.nombre }}`
   - **Body**:
     ```
     Nueva solicitud de inscripción recibida:
     
     Nombre: {{ $json.nombre }}
     Email: {{ $json.email }}
     Teléfono: {{ $json.telefono }}
     Nivel de Interés: {{ $json.nivel }}
     Mensaje: {{ $json.mensaje }}
     
     Fecha: {{ $json.fecha }}
     Fuente: {{ $json.fuente }}
     ```

#### Example: Save to Google Sheets

1. Add a **"Google Sheets"** node
2. Configure:
   - **Operation**: `Append`
   - **Spreadsheet**: Select your spreadsheet
   - **Sheet**: `Leads`
   - **Columns**: Map the following fields:
     - `nombre` → Column A
     - `email` → Column B
     - `telefono` → Column C
     - `nivel` → Column D
     - `mensaje` → Column E
     - `fecha` → Column F

#### Example: Send Confirmation Email

1. Add another **"Send Email"** node
2. Configure:
   - **To**: `{{ $json.email }}`
   - **Subject**: `Gracias por tu interés en Goldenwoods School`
   - **Body**:
     ```
     Estimado/a {{ $json.nombre }},
     
     Gracias por tu interés en Goldenwoods School. Hemos recibido tu solicitud 
     de información sobre nuestro programa de {{ $json.nivel }}.
     
     Uno de nuestros asesores se pondrá en contacto contigo en las próximas 
     24-48 horas para brindarte más información.
     
     Si tienes alguna pregunta urgente, no dudes en contactarnos:
     WhatsApp: 777-518-4123
     Email: info@goldenwoods.edu.mx
     
     ¡Esperamos conocerte pronto!
     
     Atentamente,
     Equipo de Admisiones
     Goldenwoods School
     ```

### Step 4: Activate the Workflow

1. Click **"Save"** in the top right
2. Toggle the workflow to **"Active"**
3. Your webhook is now live!

---

## Configuring the Form

### Update the Webhook URL

1. Open `script.js` in your website files
2. Find the `CONFIG` object (around line 9):

```javascript
const CONFIG = {
    // Replace this with your actual n8n webhook URL
    webhookURL: 'https://your-n8n-instance.com/webhook/goldenwoods-inscripciones',
    // ...
};
```

3. Replace `'https://your-n8n-instance.com/webhook/goldenwoods-inscripciones'` with your actual webhook URL from Step 2

4. Save the file

5. Upload the updated `script.js` to your web server

---

## Data Format

The form sends the following JSON data to your webhook:

```json
{
  "nombre": "María García",
  "email": "maria.garcia@example.com",
  "telefono": "777-123-4567",
  "nivel": "primaria",
  "mensaje": "Me gustaría conocer más sobre el programa bilingüe",
  "fecha": "2026-01-21T17:30:00.000Z",
  "fuente": "Landing Page Goldenwoods"
}
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `nombre` | String | Full name of parent/guardian | "María García" |
| `email` | String | Email address (validated) | "maria@example.com" |
| `telefono` | String | Phone number | "777-123-4567" |
| `nivel` | String | Educational level of interest | "preescolar", "special-english", "primaria", "secundaria" |
| `mensaje` | String | Optional message | "Me gustaría más información" |
| `fecha` | String (ISO 8601) | Submission timestamp | "2026-01-21T17:30:00.000Z" |
| `fuente` | String | Source identifier | "Landing Page Goldenwoods" |

---

## Testing the Integration

### Test from the Website

1. Open your landing page in a browser
2. Scroll to the **"Inscripciones 2026"** section
3. Fill out the form with test data:
   - **Nombre**: Test User
   - **Email**: test@example.com
   - **Teléfono**: 777-000-0000
   - **Nivel**: Primaria
   - **Mensaje**: This is a test submission
4. Click **"Enviar Solicitud"**
5. You should see a success message

### Verify in n8n

1. Go to your n8n workflow
2. Click on the **Webhook** node
3. You should see the test data in the **"Output"** section
4. Check that all subsequent nodes executed successfully

### Check Your Integrations

- **Email**: Check if the notification email was received
- **Google Sheets**: Verify the row was added
- **Confirmation Email**: Check if the test email address received the confirmation

---

## Example Workflows

### Basic Workflow: Email Notification Only

```
┌─────────┐     ┌──────────────┐
│ Webhook │────▶│ Send Email   │
└─────────┘     └──────────────┘
```

### Intermediate Workflow: Email + Database

```
┌─────────┐     ┌──────────────┐     ┌───────────────┐
│ Webhook │────▶│ Send Email   │────▶│ Google Sheets │
└─────────┘     └──────────────┘     └───────────────┘
```

### Advanced Workflow: Full Automation

```
┌─────────┐     ┌──────────────┐     ┌───────────────┐
│ Webhook │────▶│ Send Email   │────▶│ Google Sheets │
└─────────┘     │ (Admin)      │     └───────────────┘
                └──────────────┘              │
                                              ▼
                ┌──────────────┐     ┌───────────────┐
                │ WhatsApp     │◀────│ Send Email    │
                │ Notification │     │ (Confirmation)│
                └──────────────┘     └───────────────┘
```

### Example: WhatsApp Notification

If you have WhatsApp Business API:

1. Add **"HTTP Request"** node or **"WhatsApp"** node
2. Configure to send a message:
   ```
   Hola {{ $json.nombre }}, gracias por tu interés en Goldenwoods School. 
   Nos pondremos en contacto contigo pronto.
   ```

---

## Advanced Features

### Add Lead Scoring

Use an **"IF"** node to prioritize leads:

```javascript
// High priority if interested in Secundaria
{{ $json.nivel === 'secundaria' }}
```

### Send to CRM

Add a **"HubSpot"**, **"Salesforce"**, or **"Pipedrive"** node to create contacts automatically.

### Slack Notifications

Add a **"Slack"** node to notify your team instantly:

```
New lead from {{ $json.nombre }}
Level: {{ $json.nivel }}
Email: {{ $json.email }}
```

### Auto-Responder with Calendar Link

Include a Calendly or scheduling link in the confirmation email:

```
Agenda una llamada con nosotros: https://calendly.com/goldenwoods/consulta
```

---

## Troubleshooting

### Form Shows Error Message

**Problem**: "Hubo un error al enviar el formulario"

**Solutions**:
1. Check that the webhook URL in `script.js` is correct
2. Verify the n8n workflow is **Active**
3. Check browser console for errors (F12 → Console)
4. Ensure there are no CORS issues (n8n should allow cross-origin requests)

### Webhook Not Receiving Data

**Problem**: n8n workflow doesn't show any executions

**Solutions**:
1. Verify the webhook is in **"Production"** mode
2. Check that the workflow is **Active**
3. Test the webhook directly using a tool like Postman:
   ```bash
   curl -X POST https://your-n8n-instance.com/webhook/goldenwoods-inscripciones \
     -H "Content-Type: application/json" \
     -d '{
       "nombre": "Test",
       "email": "test@example.com",
       "telefono": "777-000-0000",
       "nivel": "primaria",
       "mensaje": "Test",
       "fecha": "2026-01-21T17:30:00.000Z",
       "fuente": "Manual Test"
     }'
   ```

### Email Not Sending

**Problem**: Workflow executes but email doesn't arrive

**Solutions**:
1. Check email credentials in n8n
2. Verify the email address is correct
3. Check spam folder
4. Review n8n execution logs for errors

### Google Sheets Not Updating

**Problem**: Data not appearing in spreadsheet

**Solutions**:
1. Verify Google Sheets authentication in n8n
2. Check that the spreadsheet ID is correct
3. Ensure the sheet name matches exactly
4. Verify column mappings are correct

---

## Security Best Practices

1. **Use HTTPS**: Always use HTTPS for your webhook URL
2. **Validate Data**: Add validation nodes in n8n to check data format
3. **Rate Limiting**: Consider adding rate limiting to prevent spam
4. **Authentication**: For sensitive workflows, add webhook authentication
5. **Monitor**: Set up error notifications to catch issues quickly

---

## Support

### n8n Documentation
- Official Docs: https://docs.n8n.io
- Webhook Node: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/

### Goldenwoods Support
- Email: tech@goldenwoods.edu.mx
- WhatsApp: 777-518-4123

---

## Changelog

### Version 1.0 (2026-01-21)
- Initial setup guide
- Basic workflow examples
- Troubleshooting section

---

**Last Updated**: January 21, 2026  
**Maintained by**: Goldenwoods IT Team
