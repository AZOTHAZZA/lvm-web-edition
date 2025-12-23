/**
 * LVM_BRIDGE.js - v2.0.2
 * [PURE_LOGIC_MODE]: WASM依存を完全に排除し、JSコアを直接駆動する。
 */
class LvmBridge {
    constructor() {
        this.engineReady = false;
        this.config = { version: "2.0.2", mode: "JS-CORE" };
    }

    async init() {
        // --- 以前の32行目付近：ここからノイズを排除しました ---
        console.log("%c LVM_BRIDGE v2.0.2: INITIALIZING... ", "background: #000; color: #d4af37");
        
        // JSエンジンを即座に有効化し、不必要なエラー出力を回避
        this.engineReady = true;
        
        console.log("%c LVM_CORE: LOGOS_JS_ENGINE_READY ", "color: #00ff00");
        // --------------------------------------------------

        if (typeof updateSystemStatus === "function") {
            updateSystemStatus("READY");
        }
    }

    async sendMessage(userInput) {
        if (!this.engineReady) await this.init();
        console.log(`LVM_BRIDGE: SENDING > ${userInput}`);
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userInput })
            });
            const data = await response.json();
            return data.reply;
        } catch (e) {
            console.warn("LVM_BRIDGE: API_OFFLINE", e);
            return "LVM_ERROR: 外部知能（Gemini）との同期に失敗しました。";
        }
    }
}

const lvmBridge = new LvmBridge();
window.addEventListener('DOMContentLoaded', () => lvmBridge.init());