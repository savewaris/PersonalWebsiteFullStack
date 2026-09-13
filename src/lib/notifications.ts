/**
 * Real-Time Notification Dispatcher
 * Dispatches instant notifications to Discord Webhook or email when a new message is received.
 */

interface MessagePayload {
  name: string;
  email: string;
  message: string;
  createdAt?: Date;
}

export async function dispatchMessageNotification(payload: MessagePayload): Promise<void> {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

  // 1. Discord Webhook Notification (Instant Mobile/Desktop Push Alert)
  if (discordWebhookUrl) {
    try {
      const discordPayload = {
        username: 'Portfolio Lead Alert',
        avatar_url: 'https://waris.dev/favicon.ico',
        embeds: [
          {
            title: '📩 New Message Received from Portfolio',
            color: 0x5e6ad2, // Accent indigo
            fields: [
              { name: '👤 Sender Name', value: payload.name, inline: true },
              { name: '✉️ Email Address', value: payload.email, inline: true },
              { name: '💬 Message Content', value: payload.message },
            ],
            footer: { text: 'Waris Portfolio • Instant Notification System' },
            timestamp: (payload.createdAt || new Date()).toISOString(),
          },
        ],
      };

      const res = await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload),
      });

      if (!res.ok) {
        console.warn('[NOTIFICATIONS] Discord webhook responded with status:', res.status);
      } else {
        console.log('[NOTIFICATIONS] Real-time Discord notification delivered successfully.');
      }
    } catch (err: any) {
      console.error('[NOTIFICATIONS] Error sending Discord webhook:', err?.message);
    }
  } else {
    // Graceful dev fallback
    console.log(
      `[NOTIFICATIONS] Message logged to DB from ${payload.name} (${payload.email}). (Tip: Add DISCORD_WEBHOOK_URL to .env to receive instant phone alerts)`
    );
  }
}
