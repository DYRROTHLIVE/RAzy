#!/bin/bash
set -e

echo "=== RAzy Android Native Standalone APK & AAB Compilation Pipeline ==="

ANDROID_JAR="/opt/android-sdk/platforms/android-30/android.jar"
R8_JAR="/opt/android-sdk/r8.jar"
BUNDLETOOL_JAR="/opt/android-sdk/bundletool.jar"
KEYSTORE="/opt/android-sdk/razy-release.keystore"
KEY_ALIAS="razy"
KEY_PASS="razy123"

PUBLIC_DOWNLOADS="/app/applet/public/downloads"
mkdir -p "$PUBLIC_DOWNLOADS"

echo ">> 0. Ensuring latest production web build..."
npm run build

WORK_DIR="/tmp/razy-android-build"
rm -rf "$WORK_DIR"
mkdir -p "$WORK_DIR/src/com/razy/launcher"
mkdir -p "$WORK_DIR/res/values"
mkdir -p "$WORK_DIR/res/drawable"
mkdir -p "$WORK_DIR/res/mipmap-mdpi"
mkdir -p "$WORK_DIR/res/mipmap-hdpi"
mkdir -p "$WORK_DIR/res/mipmap-xhdpi"
mkdir -p "$WORK_DIR/res/mipmap-xxhdpi"
mkdir -p "$WORK_DIR/res/mipmap-xxxhdpi"
mkdir -p "$WORK_DIR/assets/www"
mkdir -p "$WORK_DIR/bin"
mkdir -p "$WORK_DIR/dex"

echo ">> 1. Copying complete production web assets into APK assets/www (Zero AI Studio Branding, Offline Native)..."
cp -r /app/applet/dist/* "$WORK_DIR/assets/www/"
# Remove nested downloads and user screenshot assets from APK to keep size lean
rm -rf "$WORK_DIR/assets/www/downloads"
rm -rf "$WORK_DIR/assets/www/assets/aistudio"

echo ">> 2. Creating AndroidManifest.xml..."
cat << 'EOF' > "$WORK_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.razy.launcher"
    android:versionCode="10002"
    android:versionName="1.0.2">

    <uses-sdk
        android:minSdkVersion="23"
        android:targetSdkVersion="33" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <uses-feature
        android:name="android.hardware.touchscreen"
        android:required="false" />
    <uses-feature
        android:name="android.software.leanback"
        android:required="false" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@drawable/ic_launcher"
        android:supportsRtl="true"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true"
        android:theme="@style/AppTheme">

        <activity
            android:name="com.razy.launcher.MainActivity"
            android:configChanges="orientation|screenSize|screenLayout|smallestScreenSize|keyboardHidden|keyboard"
            android:exported="true"
            android:hardwareAccelerated="true"
            android:launchMode="singleTask"
            android:screenOrientation="sensorLandscape">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="razy" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

echo ">> 3. Generating Android Resources & Icons..."
cat << 'EOF' > "$WORK_DIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">RAzy Launcher</string>
</resources>
EOF

cat << 'EOF' > "$WORK_DIR/res/values/styles.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.NoTitleBar.Fullscreen">
        <item name="android:windowBackground">@android:color/black</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
    </style>
</resources>
EOF

cp /app/applet/public/icons/icon-192.png "$WORK_DIR/res/drawable/ic_launcher.png"
cp /app/applet/public/icons/icon-192.png "$WORK_DIR/res/mipmap-mdpi/ic_launcher.png"
cp /app/applet/public/icons/icon-192.png "$WORK_DIR/res/mipmap-hdpi/ic_launcher.png"
cp /app/applet/public/icons/icon-192.png "$WORK_DIR/res/mipmap-xhdpi/ic_launcher.png"
cp /app/applet/public/icons/icon-512.png "$WORK_DIR/res/mipmap-xxhdpi/ic_launcher.png"
cp /app/applet/public/icons/icon-512.png "$WORK_DIR/res/mipmap-xxxhdpi/ic_launcher.png"

echo ">> 4. Generating LocalAssetServer.java (Eliminates AI Studio proxy and 403 errors)..."
cat << 'EOF' > "$WORK_DIR/src/com/razy/launcher/LocalAssetServer.java"
package com.razy.launcher;

import android.content.res.AssetManager;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URLDecoder;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class LocalAssetServer {
    private final AssetManager assetManager;
    private ServerSocket serverSocket;
    private final ExecutorService executor = Executors.newCachedThreadPool();
    private volatile boolean isRunning = false;
    private int port = 8765;

    public LocalAssetServer(AssetManager assetManager) {
        this.assetManager = assetManager;
    }

    public int start() {
        try {
            try {
                serverSocket = new ServerSocket(port, 50, InetAddress.getByName("127.0.0.1"));
            } catch (Exception e) {
                serverSocket = new ServerSocket(0, 50, InetAddress.getByName("127.0.0.1"));
            }
            this.port = serverSocket.getLocalPort();
            this.isRunning = true;

            new Thread(new Runnable() {
                @Override
                public void run() {
                    while (isRunning) {
                        try {
                            Socket client = serverSocket.accept();
                            executor.submit(new ClientHandler(client));
                        } catch (Exception e) {
                            if (!isRunning) break;
                        }
                    }
                }
            }, "RAzy-AssetServer").start();

            return this.port;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    public void stop() {
        isRunning = false;
        try {
            if (serverSocket != null) {
                serverSocket.close();
            }
        } catch (Exception ignored) {}
        executor.shutdownNow();
    }

    private class ClientHandler implements Runnable {
        private final Socket socket;

        ClientHandler(Socket socket) {
            this.socket = socket;
        }

        @Override
        public void run() {
            try {
                InputStream in = socket.getInputStream();
                OutputStream out = socket.getOutputStream();

                ByteArrayOutputStream headerBuf = new ByteArrayOutputStream();
                int b;
                while ((b = in.read()) != -1) {
                    headerBuf.write(b);
                    if (b == '\n') break;
                }
                String requestLine = new String(headerBuf.toByteArray(), "UTF-8").trim();
                if (requestLine.isEmpty()) {
                    socket.close();
                    return;
                }

                String[] parts = requestLine.split("\\s+");
                if (parts.length < 2) {
                    socket.close();
                    return;
                }

                String rawPath = parts[1];
                int qIdx = rawPath.indexOf('?');
                if (qIdx != -1) rawPath = rawPath.substring(0, qIdx);
                int hIdx = rawPath.indexOf('#');
                if (hIdx != -1) rawPath = rawPath.substring(0, hIdx);

                String path = URLDecoder.decode(rawPath, "UTF-8");
                if (path.startsWith("/")) path = path.substring(1);
                if (path.isEmpty()) path = "index.html";

                path = path.replace("\\", "/");
                while (path.contains("../")) path = path.replace("../", "");

                InputStream assetStream = null;
                try {
                    assetStream = assetManager.open("www/" + path);
                } catch (FileNotFoundException fnf) {
                    if (!path.contains(".")) {
                        try {
                            assetStream = assetManager.open("www/index.html");
                            path = "index.html";
                        } catch (Exception ignored) {}
                    }
                }

                if (assetStream == null) {
                    String notFound = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
                    out.write(notFound.getBytes("UTF-8"));
                    out.flush();
                    socket.close();
                    return;
                }

                ByteArrayOutputStream dataBuf = new ByteArrayOutputStream();
                byte[] buffer = new byte[16384];
                int read;
                while ((read = assetStream.read(buffer)) != -1) {
                    dataBuf.write(buffer, 0, read);
                }
                assetStream.close();
                byte[] data = dataBuf.toByteArray();

                String mime = getMimeType(path);
                String headers = "HTTP/1.1 200 OK\r\n" +
                        "Content-Type: " + mime + "\r\n" +
                        "Content-Length: " + data.length + "\r\n" +
                        "Access-Control-Allow-Origin: *\r\n" +
                        "Cache-Control: public, max-age=3600\r\n" +
                        "Connection: close\r\n\r\n";

                out.write(headers.getBytes("UTF-8"));
                out.write(data);
                out.flush();
                socket.close();
            } catch (Exception ignored) {
                try { socket.close(); } catch (Exception ignored2) {}
            }
        }

        private String getMimeType(String path) {
            String lower = path.toLowerCase();
            if (lower.endsWith(".html")) return "text/html; charset=utf-8";
            if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "application/javascript; charset=utf-8";
            if (lower.endsWith(".css")) return "text/css; charset=utf-8";
            if (lower.endsWith(".json")) return "application/json; charset=utf-8";
            if (lower.endsWith(".png")) return "image/png";
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
            if (lower.endsWith(".webp")) return "image/webp";
            if (lower.endsWith(".svg")) return "image/svg+xml";
            if (lower.endsWith(".ico")) return "image/x-icon";
            if (lower.endsWith(".mp3")) return "audio/mpeg";
            if (lower.endsWith(".wav")) return "audio/wav";
            if (lower.endsWith(".ogg")) return "audio/ogg";
            if (lower.endsWith(".glb")) return "model/gltf-binary";
            if (lower.endsWith(".gltf")) return "model/gltf+json";
            if (lower.endsWith(".bin")) return "application/octet-stream";
            if (lower.endsWith(".woff2")) return "font/woff2";
            if (lower.endsWith(".woff")) return "font/woff";
            if (lower.endsWith(".ttf")) return "font/ttf";
            return "application/octet-stream";
        }
    }
}
EOF

echo ">> 5. Generating MainActivity.java..."
cat << 'EOF' > "$WORK_DIR/src/com/razy/launcher/MainActivity.java"
package com.razy.launcher;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

public class MainActivity extends Activity {
    private LocalAssetServer mServer;
    private WebView mWebView;
    private FrameLayout mContainer;
    private int mPort = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Force Fullscreen Landscape Mode
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);

        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        window.addFlags(WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);
        window.setStatusBarColor(Color.BLACK);
        window.setNavigationBarColor(Color.BLACK);

        mContainer = new FrameLayout(this);
        mContainer.setBackgroundColor(Color.BLACK);
        setContentView(mContainer);

        // 2. Start Embedded Local Asset Server (No AI Studio branding, No 403 errors, 100% offline)
        mServer = new LocalAssetServer(getAssets());
        mPort = mServer.start();

        // 3. Initialize WebView
        mWebView = new WebView(this);
        mWebView.setLayoutParams(new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));
        mWebView.setBackgroundColor(Color.BLACK);
        mWebView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        configureWebSettings(mWebView.getSettings());
        configureWebClients(mWebView);

        mContainer.addView(mWebView);
        applyImmersiveMode();

        // 4. Load from Local Server or direct asset fallback
        if (mPort > 0) {
            mWebView.loadUrl("http://127.0.0.1:" + mPort + "/index.html");
        } else {
            mWebView.loadUrl("file:///android_asset/www/index.html");
        }
    }

    private void configureWebSettings(WebSettings settings) {
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
    }

    private void configureWebClients(WebView webView) {
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        request.grant(request.getResources());
                    }
                });
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url != null && (url.startsWith("http://127.0.0.1") || url.startsWith("file:///"))) {
                    return false;
                }
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                } catch (Exception ignored) {}
                return true;
            }
        });
    }

    private void applyImmersiveMode() {
        View decorView = getWindow().getDecorView();
        int uiOptions = View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN;
        decorView.setSystemUiVisibility(uiOptions);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            applyImmersiveMode();
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (mWebView != null && mWebView.canGoBack()) {
                mWebView.goBack();
                return true;
            }
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onPause() {
        if (mWebView != null) {
            mWebView.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mWebView != null) {
            mWebView.onResume();
        }
        applyImmersiveMode();
    }

    @Override
    protected void onDestroy() {
        if (mServer != null) {
            mServer.stop();
        }
        if (mWebView != null) {
            mWebView.destroy();
        }
        super.onDestroy();
    }
}
EOF

echo ">> 6. Compiling Java Sources..."
javac -encoding UTF-8 \
      -cp "$ANDROID_JAR" \
      -d "$WORK_DIR/bin" \
      "$WORK_DIR/src/com/razy/launcher/LocalAssetServer.java" \
      "$WORK_DIR/src/com/razy/launcher/MainActivity.java"

echo ">> 7. Running D8 to create classes.dex..."
CLASS_FILES=$(find "$WORK_DIR/bin" -name "*.class")
java -cp "$R8_JAR" com.android.tools.r8.D8 \
     --lib "$ANDROID_JAR" \
     --release \
     --output "$WORK_DIR/dex" \
     $CLASS_FILES

test -f "$WORK_DIR/dex/classes.dex" || { echo "D8 dexing failed!"; exit 1; }

echo ">> 8. Packaging APK Resources with AAPT..."
aapt package -f -m \
     -J "$WORK_DIR/src" \
     -M "$WORK_DIR/AndroidManifest.xml" \
     -S "$WORK_DIR/res" \
     -A "$WORK_DIR/assets" \
     -I "$ANDROID_JAR" \
     -F "$WORK_DIR/unaligned.apk"

echo ">> 9. Adding classes.dex to APK..."
cd "$WORK_DIR/dex"
zip -u "$WORK_DIR/unaligned.apk" classes.dex
cd - > /dev/null

echo ">> 10. Aligning APK with zipalign..."
zipalign -f -p 4 "$WORK_DIR/unaligned.apk" "$WORK_DIR/aligned.apk"

echo ">> 11. Signing APK with apksigner (v1, v2, v3)..."
apksigner sign \
     --ks "$KEYSTORE" \
     --ks-pass "pass:$KEY_PASS" \
     --ks-key-alias "$KEY_ALIAS" \
     --out "$PUBLIC_DOWNLOADS/razy-launcher.apk" \
     "$WORK_DIR/aligned.apk"

echo ">> 12. Verifying APK signature..."
apksigner verify -v "$PUBLIC_DOWNLOADS/razy-launcher.apk"

echo ">> 13. Compiling AAB (Android App Bundle)..."
mkdir -p "$WORK_DIR/compiled_res"
aapt2 compile --dir "$WORK_DIR/res" -o "$WORK_DIR/compiled_res/res.zip"

aapt2 link --proto-format \
      -o "$WORK_DIR/base_proto.apk" \
      -I "$ANDROID_JAR" \
      --manifest "$WORK_DIR/AndroidManifest.xml" \
      "$WORK_DIR/compiled_res/res.zip" \
      --auto-add-overlay

mkdir -p "$WORK_DIR/bundle_module/manifest"
mkdir -p "$WORK_DIR/bundle_module/dex"
mkdir -p "$WORK_DIR/bundle_module/res"
mkdir -p "$WORK_DIR/bundle_module/root"
mkdir -p "$WORK_DIR/bundle_module/assets"

unzip -q -o "$WORK_DIR/base_proto.apk" -d "$WORK_DIR/proto_extracted"
cp "$WORK_DIR/proto_extracted/AndroidManifest.xml" "$WORK_DIR/bundle_module/manifest/"
if [ -f "$WORK_DIR/proto_extracted/resources.pb" ]; then
    cp "$WORK_DIR/proto_extracted/resources.pb" "$WORK_DIR/bundle_module/"
fi
if [ -d "$WORK_DIR/proto_extracted/res" ]; then
    cp -r "$WORK_DIR/proto_extracted/res" "$WORK_DIR/bundle_module/"
fi
cp "$WORK_DIR/dex/classes.dex" "$WORK_DIR/bundle_module/dex/"
cp -r "$WORK_DIR/assets"/* "$WORK_DIR/bundle_module/assets/"

cd "$WORK_DIR/bundle_module"
zip -q -r "$WORK_DIR/base.zip" *
cd - > /dev/null

echo ">> 14. Building AAB with Bundletool..."
java -jar "$BUNDLETOOL_JAR" build-bundle \
     --modules="$WORK_DIR/base.zip" \
     --output="$WORK_DIR/razy-launcher-unsigned.aab"

echo ">> 15. Signing AAB with jarsigner..."
jarsigner -keystore "$KEYSTORE" \
          -storepass "$KEY_PASS" \
          "$WORK_DIR/razy-launcher-unsigned.aab" \
          "$KEY_ALIAS"

mv "$WORK_DIR/razy-launcher-unsigned.aab" "$PUBLIC_DOWNLOADS/razy-launcher.aab"

echo ">> 16. Validating AAB bundle..."
java -jar "$BUNDLETOOL_JAR" validate --bundle="$PUBLIC_DOWNLOADS/razy-launcher.aab"

echo "=== STANDALONE ANDROID BUILD SUCCESSFUL ==="
ls -lh "$PUBLIC_DOWNLOADS/razy-launcher.apk" "$PUBLIC_DOWNLOADS/razy-launcher.aab"
