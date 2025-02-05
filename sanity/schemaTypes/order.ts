export default {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
      { name: 'firstName', title: 'First Name', type: 'string' },
      { name: 'lastName', title: 'Last Name', type: 'string' },
      { name: 'email', title: 'Email Address', type: 'string' },
      { name: 'phone', title: 'Phone Number', type: 'string' },
      { name: 'address', title: 'Shipping Address', type: 'string' },
      { name: 'city', title: 'City', type: 'string' },
      { name: 'zip', title: 'ZIP Code', type: 'string' },
      { name: 'country', title: 'Country', type: 'string' },
      { name: 'paymentMethod', title: 'Payment Method', type: 'string', options: { list: ['Credit Card', 'PayPal', 'Cash on Delivery'] } }, 
      { name: 'total', title: 'Total Amount', type: 'number' },
      { name: 'products', title: 'Products', type: 'array', of: [{ type: 'reference', to: [{ type: 'products' }] }] }, 
      { name: 'status', title: 'Order Status', type: 'string', options: { list: ['Pending', 'Shipped', 'Delivered'] } },
      { name: 'trackingNumber', title: 'Tracking Number', type: 'string' }, 
      { name: 'carrier', title: 'Carrier', type: 'string' }, 
      {
        name: 'orderDate',
        title: 'Order Date',
        type: 'datetime',
        initialValue: () => new Date().toISOString(), // Automatically set the current date and time
      },
    ],
  };
  