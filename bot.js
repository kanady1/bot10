import { userManager } from './userManagement.js';
import { config } from './config.js';

class TradingBot {
    constructor() {
        this.currentUser = null;
        document.addEventListener("DOMContentLoaded", () => {
            this.initializeElements();
            this.checkLogin();
            this.updateTradingModeText();
        });
    }

    initializeElements() {
        document.getElementById("settingsBtn")?.addEventListener("click", () => this.showSettingsModal());
        document.getElementById("addUserBtn")?.addEventListener("click", () => this.showAddUserModal());
        document.getElementById("toggleTradingModeBtn")?.addEventListener("click", () => this.toggleTradingMode());
    }

    checkLogin() {
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        } else {
            this.showLoginModal();
        }
    }

    showLoginModal() {
        if (document.querySelector('.modal-overlay')) return;

        const modalHtml = `
            <div class="modal-overlay">
                <div class="modal">
                    <h2>تسجيل الدخول</h2>
                    <form id="loginForm">
                        <label>اسم المستخدم:</label>
                        <input type="text" id="usernameInput" required>
                        <label>كلمة المرور:</label>
                        <input type="password" id="passwordInput" required>
                        <button type="submit" class="btn primary">تسجيل الدخول</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    handleLogin() {
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;
        const user = userManager.validateUser(username, password);

        if (user) {
            this.currentUser = user;
            localStorage.setItem("currentUser", JSON.stringify(user));
            document.querySelector('.modal-overlay').remove();
            alert("تم تسجيل الدخول بنجاح!");
        } else {
            alert("اسم المستخدم أو كلمة المرور غير صحيحة!");
        }
    }

    updateTradingModeText() {
        const tradingModeText = document.getElementById('tradingModeText');
        if (tradingModeText) {
            tradingModeText.textContent = `وضع التداول: ${config.tradingMode === 'real' ? 'حقيقي' : 'وهمي'}`;
        }
    }

    toggleTradingMode() {
        config.tradingMode = config.tradingMode === 'real' ? 'simulated' : 'real';
        localStorage.setItem('tradingMode', config.tradingMode);
        this.updateTradingModeText();
        alert(`تم تغيير وضع التداول إلى: ${config.tradingMode === 'real' ? 'حقيقي' : 'وهمي'}`);
    }
}

window.bot = new TradingBot();

