import PDFDocument from 'pdfkit';
import fs from 'fs';

/**
 * Generate PDF ticket for order
 * @param {Object} order - Order object from database
 * @param {Object} user - User object from database
 * @returns {Promise<Buffer>} - PDF buffer
 */
const generateTicket = (order, user) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];

            // Collect PDF chunks
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Header
            doc.fontSize(24)
                .fillColor('#2563eb')
                .text('CONEXA STORE', { align: 'center' })
                .moveDown(0.5);

            doc.fontSize(18)
                .fillColor('#333')
                .text('Ticket de Compra', { align: 'center' })
                .moveDown(1);

            // Order Info
            doc.fontSize(10)
                .fillColor('#666')
                .text(`Orden #${order._id.toString().slice(-8).toUpperCase()}`, { align: 'right' })
                .text(`Fecha: ${new Date(order.createdAt).toLocaleDateString('es-MX')}`, { align: 'right' })
                .moveDown(1);

            // Customer Info
            doc.fontSize(12)
                .fillColor('#333')
                .text('INFORMACIÓN DEL CLIENTE', { underline: true })
                .moveDown(0.5);

            doc.fontSize(10)
                .text(`Nombre: ${user.name}`)
                .text(`Email: ${user.email}`)
                .text(`Teléfono: ${user.phone || 'No proporcionado'}`)
                .moveDown(1);

            // Shipping Address
            doc.fontSize(12)
                .fillColor('#333')
                .text('DIRECCIÓN DE ENTREGA', { underline: true })
                .moveDown(0.5);

            const address = order.shippingAddress;
            doc.fontSize(10)
                .text(`${address.street} ${address.extNumber}${address.intNumber ? ', Int. ' + address.intNumber : ''}`)
                .text(`${address.colony}, ${address.city}`)
                .text(`${address.state}, C.P. ${address.zipCode}`)
                .text(address.country || 'México')
                .moveDown(1);

            // Products Table Header
            doc.fontSize(12)
                .fillColor('#333')
                .text('PRODUCTOS', { underline: true })
                .moveDown(0.5);

            // Table headers
            const tableTop = doc.y;
            const col1 = 50;
            const col2 = 300;
            const col3 = 380;
            const col4 = 450;

            doc.fontSize(10)
                .font('Helvetica-Bold')
                .text('Producto', col1, tableTop)
                .text('Cantidad', col2, tableTop, { width: 70, align: 'right' })
                .text('Precio', col3, tableTop, { width: 70, align: 'right' })
                .text('Total', col4, tableTop, { width: 90, align: 'right' });

            // Line under headers
            doc.moveTo(col1, tableTop + 15)
                .lineTo(540, tableTop + 15)
                .stroke();

            // Products
            let yPosition = tableTop + 25;
            doc.font('Helvetica');

            order.orderItems.forEach((item, index) => {
                if (yPosition > 700) {
                    doc.addPage();
                    yPosition = 50;
                }

                doc.fontSize(9)
                    .text(item.name, col1, yPosition, { width: 240 })
                    .text(item.qty.toString(), col2, yPosition, { width: 70, align: 'right' })
                    .text(`$${item.price.toFixed(2)}`, col3, yPosition, { width: 70, align: 'right' })
                    .text(`$${(item.qty * item.price).toFixed(2)}`, col4, yPosition, { width: 90, align: 'right' });

                yPosition += 20;
            });

            // Totals
            yPosition += 10;
            doc.moveTo(col3, yPosition)
                .lineTo(540, yPosition)
                .stroke();

            yPosition += 10;
            doc.fontSize(10)
                .text('Subtotal:', col3, yPosition)
                .text(`$${order.itemsPrice.toFixed(2)}`, col4, yPosition, { width: 90, align: 'right' });

            yPosition += 15;
            doc.text('Envío:', col3, yPosition)
                .text(`$${order.shippingPrice.toFixed(2)}`, col4, yPosition, { width: 90, align: 'right' });

            yPosition += 15;
            doc.text('IVA:', col3, yPosition)
                .text(`$${order.taxPrice.toFixed(2)}`, col4, yPosition, { width: 90, align: 'right' });

            yPosition += 20;
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .text('TOTAL:', col3, yPosition)
                .text(`$${order.totalPrice.toFixed(2)}`, col4, yPosition, { width: 90, align: 'right' });

            // Payment Method
            yPosition += 30;
            doc.fontSize(10)
                .font('Helvetica')
                .text(`Método de pago: ${order.paymentMethod === 'PayPal' ? '💳 PayPal' : '💵 Efectivo'}`, col1, yPosition);

            if (order.isPaid) {
                doc.fillColor('#16a34a')
                    .text('✓ PAGADO', col3, yPosition);
            } else {
                doc.fillColor('#ea580c')
                    .text('⚠ PAGO PENDIENTE', col3, yPosition);
            }

            // Footer
            doc.fontSize(8)
                .fillColor('#999')
                .text('Gracias por tu compra - Conexa Store', 50, 750, { align: 'center' })
                .text('Para cualquier duda, contáctanos a mongdongo@gmail.com', { align: 'center' });

            // Finalize PDF
            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};

export default generateTicket;
