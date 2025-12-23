/**
 * lvm_bridge.js - v2.5.1
 * 統合型LVM通信プロトコル：記憶層（LogosStorage）との完全同期版
 */

const LVM_BRIDGE = {
    version: "2.5.1",
    status: "INITIALIZING",

    /**
     * システム初期化：LogosStorageの存在を確認し、UIと接続する
     */
    init: function() {
        if (window.LogosStorage) {
            this.status = "READY";
            console.log(`LVM_BRIDGE: v${this.version} - CONNECTION_ESTABLISHED`);
            
            // UI側にREADYを通知
            if (window.sysLog) {
                window.sysLog(`SYSTEM_ONLINE: BRIDGE_v${this.version} READY`, "system");
            }
            
            // 視覚アセットの更新があれば実行
            if (window.updateVisualAssets) window.updateVisualAssets();
            return true;
        } else {
            // ここではエラーを出さず、bootSequenceによる再試行を待つ
            console.warn("LVM_BRIDGE: Waiting for LogosStorage core...");
            return false;
        }
    },

    /**
     * コマンド処理：ユーザー入力を解析し、LogosStorageを操作する
     */
    processCommand: function(input) {
        if (!window.LogosStorage) {
            if (window.sysLog) window.sysLog("ERROR: STORAGE_NOT_FOUND", "error");
            return;
        }

        const args = input.trim().toUpperCase().split(/\s+/);
        const cmd = args[0];

        try {
            if (cmd === "GENERATE") {
                if (args[1] === "CURRENCY" && args[2]) {
                    window.LogosStorage.registerAsset(args[2], { balance: "0" });
                    if (window.sysLog) window.sysLog(`SUCCESS: ${args[2]}_GENERATED`, "system");
                } else {
                    if (window.sysLog) window.sysLog("USAGE: GENERATE CURRENCY [SYM]", "error");
                }
            } else if (cmd === "MINT") {
                // 将来的な数理エンジン(LogosDecimal)との連携拡張用
                if (window.sysLog) window.sysLog(`INFO: MINT_PROTOCOL_READY_FOR_${args[1] || "NULL"}`, "system");
            } else {
                if (window.sysLog) window.sysLog(`UNKNOWN_COMMAND: ${cmd}`, "error");
            }
        } catch (e) {
            console.error("LVM_BRIDGE_EXECUTION_ERROR:", e);
            if (window.sysLog) window.sysLog("ERROR: COMMAND_EXECUTION_FAILED", "error");
        }
    }
};

/**
 * 起動待機イベントリスナー
 * 全てのスクリプトが読み込まれた後、Storageが準備できるまで再試行する
 */
(function() {
    let retryCount = 0;
    const maxRetries = 10;

    const bootstrap = () => {
        window.LVM_BRIDGE = LVM_BRIDGE;
        const success = LVM_BRIDGE.init();

        if (!success && retryCount < maxRetries) {
            retryCount++;
            // 0.2秒後に再試行
            setTimeout(bootstrap, 200);
        } else if (!success) {
            console.error("LVM_BRIDGE: Failed to connect to LogosStorage after maximum retries.");
        }
    };

    if (document.readyState === 'complete') {
        bootstrap();
    } else {
        window.addEventListener('load', bootstrap);
    }
})();