// Mock email service for Milestone 7
export async function sendOrderConfirmationEmail(email: string, orderNumber: string, total: number) {
  console.log(`[EMAIL] Sending order confirmation to ${email} for order #${orderNumber} (Total: ${total})`);
  
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not found. Skipping real email send.");
    return { success: true, mock: true };
  }

  // Implementation with Resend would go here
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ ... });
  
  return { success: true };
}

export async function sendStatusUpdateEmail(email: string, orderNumber: string, status: string) {
  console.log(`[EMAIL] Sending status update to ${email}: Order #${orderNumber} is now ${status}`);
  return { success: true };
}
