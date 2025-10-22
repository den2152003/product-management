// mqtt_frontend.js
// Logic này chạy trong trình duyệt (Frontend) sau khi Pug đã render HTML.

const mqttClient = (function () {
    // 1. Kiểm tra thư viện Paho đã load chưa
    if (typeof Paho === 'undefined' || !Paho.MQTT) {
        console.error('Paho MQTT library is not loaded. Make sure you included the script in PUG.');
        return {};
    }

    // 2. Cấu hình kết nối
    const clientId = 'web_client_' + Math.random().toString(16).substr(2, 8);
    const brokerHost = '42684cb82de64c2889b9699ce38e5c32.s1.eu.hivemq.cloud';
    const brokerPort = 8884; // Websocket SSL
    const client = new Paho.MQTT.Client(brokerHost, brokerPort, clientId);

    // Thông tin đăng nhập
    const userName = 'den215'; 
    const password = 'Nguyentandat2152003'; 
    
    // Topic của ESP32
    const DATA_TOPIC = 'esp8266/dht11'; 

    let messageCallback = (message) => {
        // Hàm xử lý tin nhắn mặc định, sẽ được gán lại bên dưới
    };

    // 3. Thiết lập Callbacks
    client.onConnectionLost = (responseObject) => {
        const statusElement = document.getElementById('mqtt-status');
        if (statusElement) {
            statusElement.textContent = 'Kết nối bị mất. Đang thử kết nối lại...';
            statusElement.classList.remove('text-green-600');
            statusElement.classList.add('text-red-600');
        }
        if (responseObject.errorCode !== 0) {
            console.log('Kết nối bị mất:', responseObject.errorMessage);
        }
        // Thử kết nối lại sau 3 giây
        setTimeout(connect, 3000); 
    };

    client.onMessageArrived = (message) => {
        messageCallback(message); 
    };

    function setMessageCallback(callback) {
        messageCallback = callback;
    }

    // 4. Hàm Kết nối
    function connect() {
        const statusElement = document.getElementById('mqtt-status');
        if (statusElement) {
            statusElement.textContent = 'Đang kết nối...';
            statusElement.classList.remove('text-red-600', 'text-green-600');
            statusElement.classList.add('text-yellow-600');
        }
        
        client.connect({
            useSSL: true,
            userName: userName,
            password: password,
            onSuccess: () => {
                console.log('✅ Kết nối thành công đến MQTT broker');
                if (statusElement) {
                    statusElement.textContent = 'Đã kết nối';
                    statusElement.classList.remove('text-yellow-600', 'text-red-600');
                    statusElement.classList.add('text-green-600');
                }
                subscribeToTopic(DATA_TOPIC); 
            },
            onFailure: (err) => {
                console.error('❌ Kết nối thất bại:', err.errorMessage);
                if (statusElement) {
                    statusElement.textContent = 'Kết nối thất bại';
                    statusElement.classList.remove('text-yellow-600', 'text-green-600');
                    statusElement.classList.add('text-red-600');
                }
            }
        });
    }
    
    // 5. Hàm Đăng ký Topic
    function subscribeToTopic(topic) {
        if (client.isConnected()) {
            client.subscribe(topic);
            console.log('Đã đăng ký vào topic:', topic);
        }
    }

    return { init: connect, setMessageCallback };
})();

// --- Logic Hiển thị Dữ liệu (Sử dụng ID từ PUG) ---
function handleSensorData(message) {
    try {
        const payload = JSON.parse(message.payloadString);
        // Giả sử dữ liệu gửi lên là JSON: {"temperature": 25.5, "humidity": 60.2}
        const { temperature, humidity } = payload; 
        
        // Cập nhật giao diện bằng các ID được tạo bởi Pug
        const tempElement = document.getElementById('temperature-value');
        const humElement = document.getElementById('humidity-value');
        
        if (tempElement) {
            tempElement.textContent = parseFloat(temperature).toFixed(1);
        }
        if (humElement) {
            humElement.textContent = parseFloat(humidity).toFixed(1);
        }

        console.log(`[Frontend] Data received: T=${temperature}, H=${humidity}`);

    } catch (e) {
        console.error("Lỗi parse JSON hoặc cập nhật DOM:", e);
    }
}

// Chạy ứng dụng khi trang web tải xong
window.onload = function() {
    // 1. Cài đặt hàm xử lý
    mqttClient.setMessageCallback(handleSensorData);
    
    // 2. Bắt đầu kết nối
    mqttClient.init(); 
};
