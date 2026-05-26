

export async function sendNotification(title, message, url) {
  const onesignalApiKey = process.env.ONE_SIGNAL_API_KEY;
  if (!onesignalApiKey) {
    throw new Error('ONE_SIGNAL_API_KEY is not set in environment variables');
  }
  await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${onesignalApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: 'ad5f7a13-d281-4104-be4a-2d14a6370d93',
      included_segments: ['Subscribed Users'],
      headings: { en: title },
      contents: { en: message },
      url,
    }),
  });
}
