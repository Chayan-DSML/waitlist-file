# n8n Setup Guide

## 1. Import the Workflow
1. Open your n8n dashboard.
2. Click **Add Workflow** (or separate Import button).
3. Copy the content of [n8n_workflow.json](./n8n_workflow.json) and paste it into the editor (or use "Import from File").

## 2. Configure Google Sheets
1. Double-click the **Append to Contact Sheet** node.
2. Connect your Google Account (Credential).
3. Select your specialized "Responses" sheet.
4. Map the columns:
   - **Name**: `{{ $json.body.name }}`
   - **Email**: `{{ $json.body.email }}`
   - **Message**: `{{ $json.body.message }}`
   - **Timestamp**: `{{ $json.body.timestamp }}`
5. Repeat for the **Append to Waitlist Sheet** node.

## 3. Webhook URL (Important!)
1. Double-click the **Webhook** node.
2. You will see two URLs: **Test URL** and **Production URL**.
   - **Test URL**: `.../webhook-test/...` (Good for debugging, but you must keep the UI open).
   - **Production URL**: `.../webhook/...` (Use this for the live website).
3. **If your Production URL is different** from what is currently in `script.js`, you MUST update `script.js`:
   ```javascript
   // script.js - Line 5
   const N8N_WEBHOOK_URL = 'YOUR_NEW_PRODUCTION_URL';
   ```

## 4. CORS (Cross-Origin Resource Sharing)
The workflow includes a **Respond to Webhook** node. This is critical for the website to know the submission worked. 
- It sends `Access-Control-Allow-Origin: *` headers.
- This allows your website (or localhost) to receive the "Success" message without error.
