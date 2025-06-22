// Simple API test file for Mama's Dumplings backend
// Run this after starting the server to test the API endpoints

const BASE_URL = 'http://localhost:3000/api';

// Test functions
async function testProductsAPI() {
    console.log('🧪 Testing Products API...\n');
    
    try {
        // Get all products
        const response = await fetch(`${BASE_URL}/products`);
        const data = await response.json();
        console.log('✅ Get all products:', data.success ? 'SUCCESS' : 'FAILED');
        console.log(`   Found ${data.count} products\n`);
        
        // Get product by ID
        const productResponse = await fetch(`${BASE_URL}/products/1`);
        const productData = await productResponse.json();
        console.log('✅ Get product by ID:', productData.success ? 'SUCCESS' : 'FAILED');
        console.log(`   Product: ${productData.data?.name}\n`);
        
        // Get products by category
        const categoryResponse = await fetch(`${BASE_URL}/products/category/Dumplings`);
        const categoryData = await categoryResponse.json();
        console.log('✅ Get products by category:', categoryData.success ? 'SUCCESS' : 'FAILED');
        console.log(`   Found ${categoryData.count} dumplings\n`);
        
    } catch (error) {
        console.error('❌ Products API test failed:', error.message);
    }
}

async function testOrdersAPI() {
    console.log('🧪 Testing Orders API...\n');
    
    try {
        // Create a new order
        const orderData = {
            customerInfo: {
                name: 'Test Customer',
                email: 'test@example.com',
                phone: '+49 123 456 789'
            },
            items: [
                {
                    productId: 1,
                    name: 'Pork & Cabbage Dumplings',
                    quantity: 2,
                    price: 12.99
                }
            ],
            totalAmount: 25.98,
            shippingAddress: {
                street: 'Teststraße 123',
                city: 'Berlin',
                postalCode: '10115',
                country: 'Germany'
            },
            paymentMethod: 'Credit Card'
        };
        
        const createResponse = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const createData = await createResponse.json();
        console.log('✅ Create order:', createData.success ? 'SUCCESS' : 'FAILED');
        console.log(`   Order ID: ${createData.data?.orderId}\n`);
        
        if (createData.success) {
            // Get order statistics
            const statsResponse = await fetch(`${BASE_URL}/orders/stats/overview`);
            const statsData = await statsResponse.json();
            console.log('✅ Get order statistics:', statsData.success ? 'SUCCESS' : 'FAILED');
            console.log(`   Total orders: ${statsData.data?.totalOrders}\n`);
        }
        
    } catch (error) {
        console.error('❌ Orders API test failed:', error.message);
    }
}

async function testUsersAPI() {
    console.log('🧪 Testing Users API...\n');
    
    try {
        // Register a new user
        const userData = {
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'testpassword123',
            phone: '+49 987 654 321'
        };
        
        const registerResponse = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const registerData = await registerResponse.json();
        console.log('✅ Register user:', registerData.success ? 'SUCCESS' : 'FAILED');
        console.log(`   User ID: ${registerData.data?.id}\n`);
        
    } catch (error) {
        console.error('❌ Users API test failed:', error.message);
    }
}

async function testAuthAPI() {
    console.log('🧪 Testing Auth API...\n');
    
    try {
        // Login user
        const loginData = {
            email: 'testuser@example.com',
            password: 'testpassword123'
        };
        
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const loginResult = await loginResponse.json();
        console.log('✅ Login user:', loginResult.success ? 'SUCCESS' : 'FAILED');
        
        if (loginResult.success) {
            console.log(`   Token received: ${loginResult.data?.token ? 'YES' : 'NO'}\n`);
            
            // Verify token
            const verifyResponse = await fetch(`${BASE_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${loginResult.data.token}`
                }
            });
            
            const verifyData = await verifyResponse.json();
            console.log('✅ Verify token:', verifyData.success ? 'SUCCESS' : 'FAILED');
            console.log(`   User: ${verifyData.data?.user?.name}\n`);
        }
        
    } catch (error) {
        console.error('❌ Auth API test failed:', error.message);
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting API Tests for Mama\'s Dumplings Backend\n');
    console.log('=' .repeat(50) + '\n');
    
    await testProductsAPI();
    await testOrdersAPI();
    await testUsersAPI();
    await testAuthAPI();
    
    console.log('=' .repeat(50));
    console.log('🎉 API Tests completed!');
    console.log('\n💡 To test manually:');
    console.log('   - Open your browser to http://localhost:3000');
    console.log('   - Use Postman or curl to test API endpoints');
    console.log('   - Check the server console for detailed logs');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    runAllTests().catch(console.error);
} else {
    // Browser environment
    console.log('🌐 Run this in Node.js environment to test the API');
    console.log('   node test-api.js');
} 