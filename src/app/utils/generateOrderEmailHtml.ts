export const generateOrderEmailHtml = ({
  userName,
  orderId,
  address,
  items,
  total,
  storeName,
  orderLink,
}: {
  userName: string;
  orderId: string;
  address: string;
  items: { title: string; quantity: number; price: number }[];
  total: number;
  storeName: string;
  orderLink: string;
}) => {
  const currentYear = new Date().getFullYear();

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td>${item.title}</td>
        <td>${item.quantity}</td>
        <td>৳${item.price.toFixed(2)}</td>
      </tr>`,
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Order Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 30px auto;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #0d6efd;
          color: #fff;
          padding: 20px 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
        }
        .order-summary {
          margin: 20px 0;
          border-collapse: collapse;
          width: 100%;
        }
        .order-summary th,
        .order-summary td {
          border-bottom: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        .footer {
          background-color: #f4f4f7;
          text-align: center;
          padding: 20px;
          font-size: 13px;
          color: #888;
        }
        .btn {
          display: inline-block;
          border: 1px solid #0d6efd;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Order!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>We’ve received your order <strong>#${orderId}</strong> and are currently processing it. Below is a summary of your order:</p>
  
          <table class="order-summary">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2"><strong>Total</strong></td>
                <td><strong>৳${total.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
  
          <p><strong>Shipping Address:</strong></p>
          <p>${address}</p>
  
          <a href="${orderLink}" class="btn">View Your Order</a>
  
          <p style="margin-top: 30px;">
            If you have any questions, feel free to reply to this email or contact
            our support team.
          </p>
          <p>Thanks again for shopping with us!</p>
          <p>— ${storeName} Team</p>
        </div>
        <div class="footer">
          &copy; ${currentYear} ${storeName}. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
};
