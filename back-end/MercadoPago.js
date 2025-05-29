import { MercadoPagoConfig, Preference } from 'mercadopago';
import { config } from 'dotenv';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });
const preference = new Preference(client);

export { preference };
