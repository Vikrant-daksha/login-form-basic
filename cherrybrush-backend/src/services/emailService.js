import resend from "../config/resend.js";

export const sendOrderConfirmationEmail = async (email, orderData) => {
    if (!orderData || orderData.length === 0) return;

    const order = orderData[0];
    const itemsHtml = orderData.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br/>
        <small>${item.color || ""} ${item.size || ""} ${item.shape || ""}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${parseInt(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join("");

    const htmlContent = `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #059669; text-align: center;">Order Confirmed!</h2>
      <p>Hi <strong>${order.recipient}</strong>,</p>
      <p>Thank you for your order! Your payment for order <strong>#${order.order_id}</strong> was successful.</p>
      
      <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; font-size: 16px;">Delivery Address</h3>
        <p style="margin: 0; font-size: 14px; color: #666;">
          ${order.apartment}, ${order.address}<br/>
          ${order.area ? order.area + ", " : ""}${order.city}, ${order.state} - ${order.pincode}<br/>
          Phone: ${order.mobile}
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; font-size: 18px; font-weight: bold; padding: 10px 0;">
        Grand Total: ₹${parseFloat(order.total_amount).toLocaleString()}
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
        <p>Transaction ID: ${order.txn_id}</p>
        <p>This is an automated receipt. Thank you for shopping with Cherry Brush!</p>
      </div>
    </div>
  `;

    try {
        const data = await resend.emails.send({
            from: "onboarding@resend.dev", // Update this when you have a domain
            to: email,
            subject: `Order Confirmation #${order.order_id} - Cherry Brush`,
            html: htmlContent
        });
        return data;
    } catch (err) {
        console.error("Resend Email Error:", err);
        throw err;
    }
};
