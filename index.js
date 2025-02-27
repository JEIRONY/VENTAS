// Requerir librerías necesarias
const { WAConnection, MessageType, Mimetype } = require('@adiwajshing/baileys');
const axios = require('axios');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

// Crear una instancia de la conexión de WhatsApp
const sock = new WAConnection();
sock.version = [2, 2219, 6]; // Versión del protocolo de WhatsApp
sock.logger.level = 'warn'; // Nivel de logs

// Función para iniciar la conexión y escuchar los mensajes
async function startBot() {
    sock.on('qr', (qr) => {
        console.log('Escanea el siguiente QR: ', qr);
    });

    sock.on('open', () => {
        console.log('Conectado a WhatsApp');
    });

    // Escuchar los mensajes
    sock.on('message', async (msg) => {
        // Verificar si el mensaje está relacionado con plataformas de streaming
        if (msg.body.toLowerCase().includes('precio') || msg.body.toLowerCase().includes('netflix') || msg.body.toLowerCase().includes('hbo max') || msg.body.toLowerCase().includes('streaming')) {
            // Enviar mensaje con opciones de selección
            const options = {
                text: '¿Qué opción deseas seleccionar?',
                buttons: [
                    { buttonId: 'reportar_error', buttonText: { displayText: 'Reportar error' }, type: 1 },
                    { buttonId: 'comprar_streaming', buttonText: { displayText: 'Comprar plataforma de streaming' }, type: 1 }
                ],
                footer: 'Selecciona una opción',
                headerType: 1
            };
            await sock.sendMessage(msg.from, options);
        }
    });

    // Escuchar cuando se selecciona una opción
    sock.on('button', async (button) => {
        if (button.selectedButtonId === 'comprar_streaming') {
            // Enviar mensaje con los detalles para comprar plataforma de streaming
            const mensajeCompra = `
Hola, soy Jeison. Para la venta de plataformas de streaming, por favor dame los siguientes datos:
• Nombre y apellido
• Número de celular del comprador
• Tipo de cuenta
• Cantidad
• Para realizar el pedido debes de pagar primero para que la cuenta sea generada (Nequi: 3164407058 a nombre de Jeison Benavides)
• Una vez realizado el pago, por favor enviar el comprobante y la cuenta se generará a continuación.
            `;
            await sock.sendMessage(button.from, { text: mensajeCompra });
        }
    });

    // Procesar el comprobante de pago
    sock.on('message', async (msg) => {
        if (msg.body.toLowerCase().includes('comprobante de pago')) {
            // Lógica para escanear y verificar el comprobante de pago (Nequi)
            // Aquí puedes integrar tu propio sistema de verificación de pagos, por ejemplo, llamando a la API de Nequi

            const pagoVerificado = true; // Este valor debe ser verificado con la base de datos de Nequi

            if (pagoVerificado) {
                // Confirmar que el pago fue recibido y la cuenta está en proceso
                await sock.sendMessage(msg.from, {
                    text: 'Perfecto, el pago ha sido verificado. La cuenta está siendo creada, por favor espera entre 2 a 8 minutos.'
                });

                // Mensaje final para agregar el contacto
                await sock.sendMessage(msg.from, {
                    text: '¡Agregame a tus contactos! Subo algunas promociones que te pueden interesar.'
                });
            } else {
                // Si no se verifica el pago, enviar mensaje de error
                await sock.sendMessage(msg.from, {
                    text: 'No se ha recibido el pago, por favor revisa tu comprobante.'
                });
            }
        }
    });

    // Conectar a WhatsApp y gestionar la conexión
    await sock.connect();
}

// Iniciar el bot
startBot();
