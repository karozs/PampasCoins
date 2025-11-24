const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function runTest() {
    try {
        console.log('🚀 Iniciando prueba de transacciones...');

        // 1. Registrar Vendedor
        const sellerData = {
            name: 'Vendedor Test',
            phone: '999999999',
            password: 'password123'
        };
        console.log('👤 Registrando vendedor...');
        let seller;
        try {
            const res = await axios.post(`${API_URL}/register`, sellerData);
            seller = res.data;
        } catch (e) {
            // Si ya existe, intentar login
            const res = await axios.post(`${API_URL}/login`, { phone: sellerData.phone, password: sellerData.password });
            seller = res.data;
        }
        console.log(`✅ Vendedor ID: ${seller.id}, Saldo: ${seller.balance}`);

        // 2. Registrar Comprador
        const buyerData = {
            name: 'Comprador Test',
            phone: '888888888',
            password: 'password123'
        };
        console.log('👤 Registrando comprador...');
        let buyer;
        try {
            const res = await axios.post(`${API_URL}/register`, buyerData);
            buyer = res.data;
        } catch (e) {
            const res = await axios.post(`${API_URL}/login`, { phone: buyerData.phone, password: buyerData.password });
            buyer = res.data;
        }
        console.log(`✅ Comprador ID: ${buyer.id}, Saldo: ${buyer.balance}`);

        // 3. Vendedor publica producto
        console.log('📦 Publicando producto...');
        const productData = {
            seller_id: seller.id,
            name: 'Producto Test',
            quantity: 1,
            price: 50,
            image_url: ''
        };
        const prodRes = await axios.post(`${API_URL}/products`, productData);
        const productId = prodRes.data.id;
        console.log(`✅ Producto creado ID: ${productId}`);

        // 4. Verificar que Comprador ve el producto (no es suyo)
        console.log('🔍 Verificando visibilidad...');
        const allProducts = await axios.get(`${API_URL}/products`);
        const product = allProducts.data.find(p => p.id === productId);

        if (product.seller_id === buyer.id) {
            console.error('❌ ERROR CRÍTICO: El producto aparece como propiedad del comprador!');
        } else {
            console.log('✅ Correcto: El producto pertenece al vendedor.');
        }

        // 5. Comprador compra producto
        console.log('💰 Realizando compra...');
        await axios.post(`${API_URL}/buy`, {
            buyer_id: buyer.id,
            product_id: productId
        });
        console.log('✅ Compra realizada.');

        // 6. Verificar saldos finales
        const updatedBuyer = await axios.get(`${API_URL}/users/${buyer.id}`);
        const updatedSeller = await axios.get(`${API_URL}/users/${seller.id}`);

        console.log(`📉 Saldo Comprador: ${updatedBuyer.data.balance} (Esperado: ${parseFloat(buyer.balance) - 50})`);
        console.log(`📈 Saldo Vendedor: ${updatedSeller.data.balance} (Esperado: ${parseFloat(seller.balance) + 50})`);

        if (parseFloat(updatedBuyer.data.balance) === parseFloat(buyer.balance) - 50) {
            console.log('✅ Saldo actualizado correctamente.');
        } else {
            console.error('❌ ERROR: Saldo no actualizado correctamente.');
        }

        // 7. Verificar Historial
        console.log('📜 Verificando historial...');
        const history = await axios.get(`${API_URL}/history/${buyer.id}`);
        const transaction = history.data.find(t => t.product_id === productId);

        if (transaction) {
            console.log('✅ Transacción registrada en historial.');
        } else {
            console.error('❌ ERROR: Transacción NO encontrada en historial.');
        }

    } catch (error) {
        console.error('❌ Error en la prueba:', error.response?.data || error.message);
    }
}

runTest();
