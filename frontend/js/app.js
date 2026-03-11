const API_URL = 'http://localhost:3000/api';

// Variáveis de Controle para Edição
let editingCustomerCpf = null;
let editingDeviceSerial = null;
let editingOSId = null;

// --- NAVEGAÇÃO E MENU ---
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('shifted');
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active de todos
        navItems.forEach(nav => nav.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        // Adiciona active no clicado
        item.classList.add('active');
        const target = item.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
        
        loadData(target); // Carrega os dados da aba
    });
});

// Exibir/Ocultar Formulários e resetar modo de edição
function toggleForm(formId) {
    const form = document.getElementById(formId);
    form.classList.toggle('active');
    
    // Se estiver abrindo o formulário pelo botão "Novo", limpa o form e destrava os campos
    if (form.classList.contains('active')) {
        form.reset();
        
        if (formId === 'form-cliente') {
            editingCustomerCpf = null;
            document.getElementById('cli-cpf').disabled = false;
        } else if (formId === 'form-dispositivo') {
            editingDeviceSerial = null;
            document.getElementById('dev-serial').disabled = false;
        } else if (formId === 'form-os') {
            editingOSId = null;
            document.getElementById('os-cpf').disabled = false;
            document.getElementById('os-serial').disabled = false;
            document.getElementById('os-data').disabled = false;
        }
    }
}

// --- MÁSCARAS ---
document.addEventListener('input', (e) => {
    if (e.target.id.includes('cpf')) {
        let v = e.target.value.replace(/\D/g, "");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        e.target.value = v;
    }
    if (e.target.id.includes('tel')) {
        let v = e.target.value.replace(/\D/g, "");
        v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
        v = v.replace(/(\d)(\d{4})$/, "$1-$2");
        e.target.value = v;
    }
});

// --- VALIDAÇÃO ---
function validateData(data) {
    for (let key in data) {
        if (!data[key] || data[key].trim() === '') {
            alert('Por favor, preencha todos os campos corretamente.');
            return false;
        }
    }
    return true;
}

// --- CARREGAR DADOS DAS ABAS ---
function loadData(page) {
    if (page === 'clientes') fetchClientes();
    if (page === 'dispositivos') fetchDispositivos();
    if (page === 'os') fetchOS();
    if (page === 'home') loadDashboard();
}

// --- CLIENTES ---
async function fetchClientes() {
    const res = await fetch($`{API_URL}`/customers);
    const data = await res.json();
    const tbody = document.querySelector('#table-clientes tbody');
    tbody.innerHTML = '';
    data.forEach(cli => {
        tbody.innerHTML += `
            <tr>
                <td>${cli.cpf}</td><td>${cli.name}</td><td>${cli.phone}</td><td>${cli.email}</td>
                <td>
                    <button class="btn-edit" onclick="editCustomer('${cli.cpf}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-danger" onclick="deleteCustomer('${cli.cpf}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    });
}

async function editCustomer(cpf) {
    const res = await fetch($`{API_URL}`/customers);
    const data = await res.json();
    const cliente = data.find(c => c.cpf === cpf);

    if (cliente) {
        document.getElementById('cli-cpf').value = cliente.cpf;
        document.getElementById('cli-nome').value = cliente.name;
        document.getElementById('cli-tel').value = cliente.phone;
        document.getElementById('cli-email').value = cliente.email;

        document.getElementById('cli-cpf').disabled = true;
        editingCustomerCpf = cpf; 
        
        const form = document.getElementById('form-cliente');
        if (!form.classList.contains('active')) form.classList.add('active');
        window.scrollTo(0, 0); 
    }
}

async function saveCustomer(e) {
    e.preventDefault();
    const cpf = document.getElementById('cli-cpf').value;
    const name = document.getElementById('cli-nome').value;
    const phone = document.getElementById('cli-tel').value;
    const email = document.getElementById('cli-email').value;

    if(!validateData({cpf, name, phone, email})) return;

    const method = editingCustomerCpf ? 'PUT' : 'POST';
    const url = editingCustomerCpf ? `${API_URL}/customers/${editingCustomerCpf}` : `${API_URL}/customers`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, name, phone, email })
        });

        if(response.ok) {
            alert(editingCustomerCpf ? 'Cliente atualizado!' : 'Cliente salvo!');
            document.getElementById('form-cliente').reset();
            document.getElementById('cli-cpf').disabled = false;
            editingCustomerCpf = null; 
            document.getElementById('form-cliente').classList.remove('active');
            fetchClientes();
        } else {
            alert('Erro ao salvar os dados do cliente.');
        }
    } catch (error) {
        alert('Erro de conexão com o servidor.');
    }
}

async function deleteCustomer(cpf) {
    if(confirm('Tem certeza? Isso apagará os dispositivos e OS vinculadas!')) {
        await fetch(`${API_URL}`/customers/`${cpf}`, { method: 'DELETE' });
        fetchClientes();
    }
}

// --- DISPOSITIVOS ---
async function fetchDispositivos() {
    const res = await fetch(`${API_URL}`/devices);
    const data = await res.json();
    const tbody = document.querySelector('#table-dispositivos tbody');
    tbody.innerHTML = '';
    data.forEach(dev => {
        tbody.innerHTML += `
            <tr>
                <td>${dev.serial_number}</td><td>${dev.customer_cpf}</td><td>${dev.type}</td>
                <td>
                    <button class="btn-edit" onclick="editDevice('${dev.serial_number}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-danger" onclick="deleteEntity('devices', '${dev.serial_number}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    });
}

async function editDevice(serial) {
    const res = await fetch(`${API_URL}/devices`);
    const data = await res.json();
    const device = data.find(d => d.serial_number === serial);

    if (device) {
        document.getElementById('dev-serial').value = device.serial_number;
        document.getElementById('dev-cpf').value = device.customer_cpf;
        document.getElementById('dev-tipo').value = device.type;

        document.getElementById('dev-serial').disabled = true; 
        editingDeviceSerial = serial;
        
        const form = document.getElementById('form-dispositivo');
        if (!form.classList.contains('active')) form.classList.add('active');
        window.scrollTo(0, 0);
    }
}

async function saveDevice(e) {
    e.preventDefault(); 
    const customer_cpf = document.getElementById('dev-cpf').value;
    const type = document.getElementById('dev-tipo').value;
    const serial_number = document.getElementById('dev-serial').value;

    if(!validateData({customer_cpf, type, serial_number})) return;

    const method = editingDeviceSerial ? 'PUT' : 'POST';
    const url = editingDeviceSerial ? `${API_URL}/devices/${editingDeviceSerial}` : `${API_URL}/devices`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serial_number, customer_cpf, type })
        });

        if (response.ok) {
            alert(editingDeviceSerial ? 'Dispositivo atualizado!' : 'Dispositivo salvo!');
            document.getElementById('form-dispositivo').reset();
            document.getElementById('dev-serial').disabled = false; 
            editingDeviceSerial = null; 
            document.getElementById('form-dispositivo').classList.remove('active'); 
            fetchDispositivos();
        } else {
            alert('Erro ao salvar o dispositivo. Verifique os dados.');
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão com o servidor.');
    }
}

// --- ORDENS DE SERVIÇO ---
async function fetchOS() {
    const res = await fetch(`${API_URL}/service-orders`);
    const data = await res.json();
    const tbody = document.querySelector('#table-os tbody');
    tbody.innerHTML = '';
    data.forEach(os => {
        const dataAbertura = new Date(os.opening_date).toLocaleDateString('pt-BR');
        tbody.innerHTML += `
            <tr>
                <td>${os.id}</td><td>${os.customer_cpf}</td><td>${os.device_serial}</td>
                <td>${os.technician}</td><td>${dataAbertura}</td><td>${os.status}</td>
                <td>
                    <button class="btn-edit" onclick="editOS(${os.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-danger" onclick="deleteEntity('service-orders', ${os.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    });
}

async function editOS(id) {
    const res = await fetch(`${API_URL}/service-orders`);
    const data = await res.json();
    const os = data.find(o => o.id === id);

    if (os) {
        document.getElementById('os-cpf').value = os.customer_cpf;
        document.getElementById('os-serial').value = os.device_serial;
        document.getElementById('os-tecnico').value = os.technician;
        document.getElementById('os-status').value = os.status; 

        const dataObj = new Date(os.opening_date);
        const dataFormatada = dataObj.toISOString().split('T')[0];
        document.getElementById('os-data').value = dataFormatada;

        document.getElementById('os-cpf').disabled = true;
        document.getElementById('os-serial').disabled = true;
        document.getElementById('os-data').disabled = true;
        
        editingOSId = id;
        
        const form = document.getElementById('form-os');
        if (!form.classList.contains('active')) form.classList.add('active');
        window.scrollTo(0, 0);
    }
}

async function saveOS(e) {
    e.preventDefault(); 
    const customer_cpf = document.getElementById('os-cpf').value;
    const device_serial = document.getElementById('os-serial').value;
    const technician = document.getElementById('os-tecnico').value;
    const opening_date = document.getElementById('os-data').value;
    const status = document.getElementById('os-status').value; 

    if(!validateData({customer_cpf, device_serial, technician, opening_date})) return;

    const method = editingOSId ? 'PUT' : 'POST';
    const url = editingOSId ? `${API_URL}/service-orders/${editingOSId}` : `${API_URL}/service-orders`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer_cpf, device_serial, technician, opening_date, status })
        });

        if (response.ok) {
            alert(editingOSId ? 'Ordem de Serviço atualizada!' : 'Ordem de Serviço salva!');
            document.getElementById('form-os').reset();
            
            document.getElementById('os-cpf').disabled = false;
            document.getElementById('os-serial').disabled = false;
            document.getElementById('os-data').disabled = false;
            
            editingOSId = null;
            document.getElementById('form-os').classList.remove('active'); 
            fetchOS();
            loadDashboard(); 
        } else {
            alert('Erro ao salvar a O.S. Verifique os dados.');
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão com o servidor.');
    }
}

// --- FUNÇÃO GENÉRICA DE DELETE ---
async function deleteEntity(route, id) {
    if(confirm('Tem certeza que deseja deletar?')) {
        await fetch(`${API_URL}/${route}/${id}`, { method: 'DELETE' });
        if(route === 'devices') fetchDispositivos();
        if(route === 'service-orders') {
            fetchOS();
            loadDashboard();
        }
    }
}

// --- DASHBOARD (HOME) ---
async function loadDashboard() {
    const res = await fetch(`${API_URL}/service-orders`);
    const data = await res.json();
    
    document.getElementById('count-todo').innerText = data.filter(os => os.status === 'A Realizar').length;
    document.getElementById('count-progress').innerText = data.filter(os => os.status === 'Em Andamento').length;
    document.getElementById('count-done').innerText = data.filter(os => os.status === 'Finalizada').length;
}

// Inicia na Home
loadDashboard();